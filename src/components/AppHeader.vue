<template lang="pug">
header.header
  h1 Документы
  .header__extra
    el-button( circle )
      IconBookmark
    el-button
      IconPlus
      .text Новый тип
    el-button
      IconPlus
      .text Новый документ
</template>
<script setup lang="ts">
import IconBookmark from "@/components/icons/IconBookmark.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
</script>

<style lang="scss" scoped>
.header {
  height: 55px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 33px 30px;

  :deep(.el-button) {
    border: 1px solid #d3d8df;
    border-radius: 50px;
    font-size: 12px;
    line-height: 108%;
    color: #000000;

    .text {
      margin-left: 10px;
    }

    span {
      font-weight: 500;
    }
  }
}
</style>
