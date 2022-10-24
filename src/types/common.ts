export interface Tree {
  id: number;
  label: string;
  extraLabel?: string;
  isCategory?: boolean;
  specLabel?: string;
  simple?: boolean;
  colors?: Array<string>;
  children?: Array<Tree>;
}

export enum DropType {
  Prev = "prev",
  Next = "next",
  Inner = "inner",
}
