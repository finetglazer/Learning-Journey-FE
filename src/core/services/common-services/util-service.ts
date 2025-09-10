import { AxiosError } from "axios";
import { Menu } from "config/config-type";
import React, { RefObject } from "react";
import { Model } from "react-3layer-common";
import {
  AnyObj,
  Permission,
  Position,
  TreeNode,
  ValidateStatus,
} from "../service-types";
import dayjs, { Dayjs } from "dayjs";
import {
  BUDGET_MENU_CODE,
  CODE_DASHBOARD,
  PAYMENT_MENU_CODE,
  PURCHASE_PLAN_MENU_CODE,
  READ_ACTION,
} from "core/config/consts";

export const utilService = {
  useClickOutside(
    ref: RefObject<HTMLElement>,
    callback: () => void,
    exceptNode?: string[]
  ) {
    const handleClickOutside = React.useCallback(
      (event: MouseEvent) => {
        let canInvokeCallback = ref?.current?.contains(
          event.target as HTMLElement
        );
        const targetClassName = (event.target as HTMLElement).className;

        if (exceptNode && exceptNode.length > 0) {
          exceptNode.forEach((value: string) => {
            const nodeFromId = document.getElementById(value);
            const nodeFromClass = document.getElementsByClassName(value)[0];
            const node = nodeFromId || nodeFromClass || false;
            canInvokeCallback ||= node
              ? node.contains(event.target as HTMLElement)
              : false;
          });
        }
        if (
          ref?.current &&
          !canInvokeCallback &&
          !targetClassName.includes("ant-tooltip-inner")
        ) {
          if (typeof callback === "function") {
            callback();
          }
        }
      },
      [callback, exceptNode, ref]
    );

    React.useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return function cleanup() {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);
  },

  buildTree<T extends Model>(
    listItem: T[],
    parent?: TreeNode<T>,
    keyNodes?: number[],
    tree?: TreeNode<T>[]
  ): [TreeNode<T>[], number[]] {
    tree = typeof tree !== "undefined" ? tree : [];
    parent = typeof parent !== "undefined" ? parent : new TreeNode();
    keyNodes = typeof keyNodes !== "undefined" ? keyNodes : [];
    const children = listItem
      .filter((child) => {
        return child.parentId === parent.key;
      })
      .map((currentItem) => new TreeNode(currentItem));

    if (children && children.length) {
      if (parent.key === null) {
        tree = children;
      } else {
        parent.children = children;
        keyNodes.push(parent.key);
      }
      children.forEach((child) => {
        this.buildTree(listItem, child, keyNodes);
      });
    }

    return [tree, keyNodes];
  },

  setDisabledNode<T extends Model>(nodeId: number, tree: TreeNode<T>[]) {
    const filteredNode = tree.filter(
      (currentNode) => currentNode.key === nodeId
    )[0];
    if (filteredNode) {
      const index = tree.indexOf(filteredNode);
      tree[index].disabled = true;
      if (filteredNode.children && filteredNode.children.length > 0) {
        filteredNode.children.forEach((currentChildren) => {
          this.setDisabledNode(currentChildren.key, filteredNode.children);
        });
      }
    } else {
      tree.forEach((currentTree) => {
        if (currentTree.children && currentTree.children.length > 0) {
          this.setDisabledNode(nodeId, currentTree.children);
        }
      });
    }
  },

  setOnlySelectLeaf<T extends Model>(tree: TreeNode<T>[]) {
    if (tree && tree.length) {
      tree.forEach((currentNode) => {
        if (currentNode.item.hasChildren) {
          currentNode.disabled = true;
          this.setOnlySelectLeaf(currentNode.children);
        } else {
          currentNode.disabled = false;
        }
      });
    }
  },

  searchTreeNode(element: TreeNode<Model>, key: number): TreeNode<Model> {
    if (element.key === key) {
      return element;
    } else if (element.children != null) {
      let i;
      let result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchTreeNode(element.children[i], key);
      }
      return result;
    }
    return null;
  },

  searchTree(
    treeNodes: TreeNode<Model>[],
    listKeys: number[]
  ): TreeNode<Model>[] {
    const nodes: TreeNode<Model>[] = [];

    treeNodes.forEach((currentTree) => {
      listKeys.forEach((currentKey) => {
        const node = this.searchTreeNode(currentTree, currentKey);
        if (node) nodes.push(node);
      });
    });
    return nodes;
  },

  toDayjsDate(date: string): Dayjs {
    return dayjs(date);
  },

  isEmpty(obj: AnyObj) {
    if (obj) {
      for (const key in obj) {
        if (
          obj[key] === 0 ||
          obj[key] === false ||
          (Object.prototype.hasOwnProperty.call(obj, key) && obj[key])
        )
          return false;
      }
    }
    return true;
  },

  limitWord(input: string, max: number) {
    if (input?.length > max) {
      input = input.slice(0, max);
      const output: string = input + "...";
      return output;
    }
    return input;
  },

  uniqueArray<T>(array: T[], uniqueField = "id") {
    return array.reduce((acc, current: T) => {
      const x = acc.find(
        (item) => item[uniqueField] === current[uniqueField as keyof T]
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  },

  getValidateStatus(model: Model, field: string): ValidateStatus {
    const getStatus = (
      source: Record<string, string>,
      status: ValidateStatus
    ): ValidateStatus => {
      if (
        typeof source === "object" &&
        source !== null &&
        Object.prototype.hasOwnProperty.call(source, field) &&
        typeof source[field] === "string" &&
        source[field] !== ""
      ) {
        return status;
      }
      return null;
    };

    return (
      getStatus(model?.errors, ValidateStatus.error) ||
      getStatus(model?.warnings, ValidateStatus.warning)
    );
  },

  getValidateMessage(model: Model, field: string): string {
    const getMessage = (
      source: Record<string, string>,
      field: string
    ): string => {
      if (
        typeof source === "object" &&
        source !== null &&
        Object.prototype.hasOwnProperty.call(source, field) &&
        typeof source[field] === "string" &&
        source[field] !== ""
      ) {
        return source[field];
      }
      return null;
    };

    return (
      getMessage(model?.errors, field) || getMessage(model?.warnings, field)
    );
  },

  getValidateObj(
    model: Model,
    field: string
  ): { validateStatus: ValidateStatus; message: string } {
    const getValidation = (
      source: Record<string, string>,
      status: ValidateStatus
    ): { validateStatus: ValidateStatus; message: string } => {
      if (
        typeof source === "object" &&
        source !== null &&
        Object.prototype.hasOwnProperty.call(source, field) &&
        typeof source[field] === "string" &&
        source[field] !== ""
      ) {
        return {
          validateStatus: status,
          message: source[field],
        };
      }
      return null;
    };

    return (
      getValidation(model?.errors, ValidateStatus.error) ||
      getValidation(model?.warnings, ValidateStatus.warning)
    );
  },

  checkVisibleMenu(
    ...urls: string[]
  ): (object: Record<string, number>) => boolean {
    return (object: Record<string, number>) => {
      let display = false;
      if (urls.length > 0) {
        urls.forEach((item) => {
          if (Object.prototype.hasOwnProperty.call(object, item))
            display = true;
        });
      }
      return display;
    };
  },

  // mapTreeMenu(tree: Menu[], mapper: Record<string, number>) {
  //   if (tree && tree.length > 0) {
  //     tree.forEach((item: Menu) => {
  //       const { link, children } = item;
  //       const regex = new RegExp("\\:\\w+");
  //       const modifiedLink = link.replace(regex, "*");
  //       item.show = false;

  //       if (children && children.length > 0) {
  //         const isShow = this.mapTreeMenu(children, mapper);
  //         item.show = isShow;
  //       } else {
  //         if (Object.prototype.hasOwnProperty.call(mapper, modifiedLink)) {
  //           item.show = true;
  //         } else {
  //           item.show = false;
  //         }
  //       }
  //     });
  //     return tree.filter((current) => current.show)[0] ? true : false;
  //   }
  // },

  isAlwaysVisible(code: string): boolean {
    return code === CODE_DASHBOARD || code === "NONE_PERMISSION";
  },

  hasPermission(code: string, permissions: Permission[]): boolean {
    if (!code) return false;

    return permissions.some((current) => {
      return (
        (current?.key === code && current?.value === READ_ACTION) ||
        (code === PURCHASE_PLAN_MENU_CODE &&
          current?.key?.includes(PURCHASE_PLAN_MENU_CODE) &&
          current?.value === READ_ACTION) ||
        (code === BUDGET_MENU_CODE &&
          current?.key?.includes(BUDGET_MENU_CODE) &&
          current?.value === READ_ACTION) ||
        (code === PAYMENT_MENU_CODE &&
          current?.key?.includes(PAYMENT_MENU_CODE) &&
          current?.value === READ_ACTION)
      );
    });
  },

  mapTreeMenu(tree: Menu[], permissions: Permission[]): boolean {
    if (!tree || tree.length === 0) return false;

    tree.forEach((item: Menu) => {
      const { children, code } = item;

      if (this.isAlwaysVisible(code)) {
        item.show = true;
      } else if (children && children.length > 0) {
        item.show = this.mapTreeMenu(children, permissions);
      } else {
        item.show = this.hasPermission(code, permissions);
      }
    });

    return tree.some((current) => current.show);
  },

  convertPathString(
    path: string,
    obj: { [x: string]: unknown } = {},
    value: string
  ): { [x: string]: unknown } {
    path = path.replace(/\[(\w+)\]/g, ".$1");
    const listPath = path.split(".");
    const lastIndex = listPath.length > 0 ? listPath.length - 1 : 0;

    let current = obj;
    for (let i = 0; i < listPath.length; i++) {
      const key = listPath[i];

      if (i === lastIndex) {
        current[key] = value;
      } else {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key] as { [x: string]: unknown };
      }
    }

    return obj;
  },

  isStringNumber(stringValue: string) {
    const regex = new RegExp("^-?\\d*\\.?\\d*$");
    return typeof stringValue === "string" && stringValue.match(regex);
  },

  downloadURI(uri: string, name = "fileDownloaded") {
    const link = document.createElement("a");
    link.setAttribute("download", name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  countValuedField(obj: AnyObj, exceptField: string[] = []): number {
    let count = 0;
    obj &&
      Object.keys(obj).forEach((key: string) => {
        if (
          !key.includes("Value") &&
          !this.isEmpty(obj[key]) &&
          !exceptField.includes(key)
        ) {
          count = count + 1;
        }
      });
    return count;
  },

  async cacheImages(srcArray: string[]) {
    if (srcArray && srcArray.length > 0) {
      const promises = srcArray.map((src: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            resolve(null);
          };
          img.onerror = () => {
            reject();
          };
        });
      });
      await Promise.all(promises);
    }
    return;
  },

  getGeneralError(error: AxiosError) {
    let messageError = "";
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.generalErrors &&
      error.response.data.generalErrors.length > 0
    ) {
      messageError = (error.response?.data?.generalErrors as string[]).join(
        ", "
      );
    }
    return messageError;
  },

  getMovePosition(
    x: number,
    y: number,
    dragX: number,
    dragY: number,
    width: number,
    height: number,
    pageWidth: number,
    pageHeight: number
  ): Position {
    const newPositionTop = y + dragY;
    const newPositionLeft = x + dragX;
    const newPositionRight = newPositionLeft + width;
    const newPositionBottom = newPositionTop + height;

    const top =
      newPositionTop < 0
        ? 0
        : newPositionBottom > pageHeight
        ? pageHeight - height
        : newPositionTop;
    const left =
      newPositionLeft < 0
        ? 0
        : newPositionRight > pageWidth
        ? pageWidth - width
        : newPositionLeft;

    return {
      top,
      left,
    };
  },
};
