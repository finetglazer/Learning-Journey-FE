import { Model } from "react-3layer-common";
import { DataNode } from "antd/lib/tree";

export class TreeNode<T extends Model> implements DataNode {
  public title: string;
  public key: number;
  public item: Model;
  public children: TreeNode<T>[];
  public disabled: boolean;

  constructor(value?: T) {
    if (value) {
      this.key = value.id;
      this.item = { ...value };
      this.children = [];
      this.title = value.name;
      this.disabled = value.disabled;
    } else {
      this.title = "";
      this.key = null;
      this.children = [];
      this.item = {};
      this.disabled = false;
    }
  }
}
