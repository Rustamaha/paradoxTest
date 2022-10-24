<template lang="pug">
.tree-node
  el-input(
    :input-style="inputStyle"
    v-model="filterText"
    placeholder="Поиск"
    :prefix-icon="IconSearch"
  )
    template( #append )
      el-button( 
        link
        @click="clear"
      )
        IconClose
  el-tree.tree-node__tree(
    ref="treeRef"
    :data="data"
    :filter-node-method="filterNode"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    draggable
    :props="defaultProps"
    node-key="id"
    :default-expand-all="false"
    :expand-on-click-node="false"
    :indent="16"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
  )
    template( #default="{ node, data }" )
      .tree-node__node( :class="customNodeClass(node)" )
        .tree-node__node-content
          el-button.tree-node__btn-expand(
            :class="{ 'tree-node__btn-expand--open': node.expanded }"
            v-if="node.data.isCategory"
            circle
            @click="nodeExpand(node)"
          )
            IconArrow
          .tree-node__node-label( :class="{ 'tree-node__node-label--category': node.data.isCategory }" ) {{ node.label }}
          .tree-node__node-colors
            .color(
              v-for="color in node.data.colors"
              :key="color"
              :style="{ backgroundColor: color }"
            )
          .tree-node__node-spec( v-if="node.data.specLabel" ) {{ node.data.specLabel }}
          .tree-node__node-extra( v-if="node.data.extraLabel" ) {{ node.data.extraLabel }}
        .tree-node__actions( v-if="node.label" )
          el-button( circle )
            IconEdit
          el-button(
            circle
            @click="remove(node, data)"
          )
            IconDelete
          el-button( 
            circle
            @mousedown="mouseDown"
          )
            IconDrag
</template>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";

import IconDelete from "./icons/IconDelete.vue";
import IconDrag from "./icons/IconDrag.vue";
import IconEdit from "./icons/IconEdit.vue";
import IconArrow from "./icons/IconArrow.vue";
import IconSearch from "./icons/IconSearch.vue";
import IconClose from "./icons/IconClose.vue";

import { data as docs } from "../helpers/common";

import { DropType } from "../types/common";
import type { Tree } from "../types/common";
import type { Ref } from "vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";
import type { ElTree } from "element-plus";

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const data: Ref<Array<Tree>> = ref(docs);
const draggedNodeId: Ref<number | null> = ref(null);
const droppedNodeId: Ref<number | null> = ref(null);
const targetNodeId: Ref<number | null> = ref(null);
const canDrag = ref(false);

const defaultProps = {
  children: "children",
  label: "label",
};

const clear = () => (filterText.value = "");

const inputStyle = computed(() => {
  if (filterText.value.length) {
    return {
      fontStyle: "normal",
      color: "#000000",
    };
  }
  return {
    fontStyle: "italic",
    fontSize: "15px",
    color: "#8e9cbb",
  };
});

const delimitIdx = computed(() => data.value.findIndex((v) => !v.label));

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const allowDrag = (draggingNode: Node) => {
  droppedNodeId.value = draggingNode.id;
  return canDrag.value;
};

const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) =>
  (!draggingNode.data.isCategory &&
    !dropNode.data.isCategory &&
    !draggingNode.data.simple &&
    (type === DropType.Prev || type === DropType.Next)) ||
  (!draggingNode.data.isCategory &&
    !draggingNode.data.simple &&
    dropNode.data.isCategory &&
    type === DropType.Inner) ||
  (draggingNode.data.isCategory &&
    dropNode.data.isCategory &&
    (type === DropType.Prev || type === DropType.Next)) ||
  (draggingNode.data.simple &&
    dropNode.data.simple &&
    (type === DropType.Prev || type === DropType.Next));

const mouseDown = () => {
  canDrag.value = true;
};

const customNodeClass = (node: Node) => {
  const classes = [];
  if (!node.parent.data.isCategory) {
    classes.push("tree-node__node--fixed-width");
  }
  if (!node.data.isCategory) {
    classes.push("tree-node__node--child");
  }
  if (node.data.isCategory) {
    classes.push("tree-node__node");
  }
  if (node.id === draggedNodeId.value) {
    classes.push("tree-node__node--drag");
  }
  if (node.id === targetNodeId.value) {
    classes.push("tree-node__node--target");
  }
  if (
    !node.label.length &&
    (delimitIdx.value === 0 || delimitIdx.value === data.value.length - 1)
  ) {
    return "tree-node__node--no-delimiter";
  }
  if (!node.label.length) {
    return "tree-node__node--delimiter";
  }
  return classes;
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return `${data.label}${data.specLabel}${data.extraLabel}`
    .toLowerCase()
    .includes(value.toLowerCase());
};

const nodeExpand = (node: Node) => {
  if (treeRef.value) {
    Object.keys(treeRef.value.store.nodesMap).forEach((k) => {
      if (treeRef.value && node.id === treeRef.value.store.nodesMap[k].id) {
        treeRef.value.store.nodesMap[k].expanded =
          !treeRef.value.store.nodesMap[k].expanded;
      }
    });
  }
};

const handleDragLeave = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  targetNodeId.value = dropNode.id;
};

const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  draggedNodeId.value = draggingNode.id;
};

const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  ev: DragEvents
) => {
  canDrag.value = false;
  draggedNodeId.value = null;
  droppedNodeId.value = null;
  targetNodeId.value = null;
};

const remove = (node: Node, tree: Tree) => {
  const parent = node.parent;
  const children: Array<Tree> = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === tree.id);
  children.splice(index, 1);
};
</script>
<style lang="scss" scoped>
%text {
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 108%;
}

.tree-node {
  :deep(.el-input) {
    width: 564px;
    border: none;
    border-bottom: 1px solid #bfc9e0;
    margin-left: 30px;

    .el-input__wrapper {
      box-shadow: none;
      padding: 0;
    }

    .el-input-group__append {
      background-color: #ffffff;
      border: none;
      box-shadow: none;
      padding: 0 5px 0 0;
    }
  }

  &__tree {
    margin: 19px 30px 0 30px;

    :deep(.el-tree-node) {
      .el-tree-node__content {
        height: auto;

        i {
          display: none;
        }

        &:hover {
          background-color: #ffffff;
        }

        .el-tree-node__label {
          cursor: auto;
        }
      }
    }
  }

  &__node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1160px;
    height: 48px;
    background: #ffffff;
    border: 1px solid #dfe4ef;
    padding: 0 16px;
    margin-top: -1px;

    &:last-child {
      border-top: 1px solid #dfe4ef;
    }

    &--child {
      width: 1144px;
      height: 35px;
    }

    &--fixed-width {
      width: 1160px;
    }

    &--drag {
      opacity: 0.4;
    }

    &--delimiter {
      width: 1160px;
      height: 14px;
      margin-top: 0;
      border: none !important;
    }

    &--no-delimiter {
      display: none;
    }

    &--target {
      border-bottom: 5px solid #0066ff;
    }

    :deep(.el-button) {
      width: 22px;
      height: 22px;
    }
  }

  &__node-label {
    @extend %text;
    font-size: 13px;

    &--category {
      font-weight: 500;
      font-size: 15px;
    }
  }

  &__node-colors {
    display: flex;
    gap: 6px;

    .color {
      width: 8px;
      height: 8px;
      border-radius: 4px;
    }
  }
  &__node-spec {
    @extend %text;
    color: #ff238d;
  }

  &__node-extra {
    @extend %text;
    color: #8e9cbb;
    overflow: hidden;
    max-width: 650px;
  }

  &__node-content {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__btn-expand {
    transform: rotate(0);

    &--open {
      transform: rotate(180deg);
    }
  }

  &__actions {
    display: flex;
    gap: 20px;
    :deep(.el-button) {
      width: 25px;
      height: 25px;
      border-color: #ffffff;
    }
  }

  :deep(.el-tree__empty-block) {
    &:after {
      content: "Нет данных";
      position: absolute;
    }

    span {
      display: none;
    }
  }
}
</style>
