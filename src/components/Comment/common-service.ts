import React, { RefObject } from "react";
import { Subscription } from "rxjs";
import { Model } from "react-3layer-common";
import dayjs, { Dayjs } from "dayjs";
import { TreeNode } from "./TreeNode";

export const CommonService = {
  useSubscription() {
    const subscription = React.useRef<Subscription>(new Subscription()).current;
    React.useEffect(
      function () {
        return function cleanup() {
          subscription.unsubscribe();
        };
      },
      [subscription]
    );
    return [subscription];
  },

  useClickOutside(ref: RefObject<HTMLElement>, callback: () => void) {
    const handleClickOutside = React.useCallback(
      (event: MouseEvent) => {
        if (ref?.current && !ref?.current?.contains(event.target as Node)) {
          callback();
        }
      },
      [callback, ref]
    );

    React.useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return function cleanup() {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [callback, handleClickOutside, ref]);
  },

  useClickOutsideMultiple(
    refFirst: RefObject<HTMLElement>,
    ref: RefObject<HTMLElement>,
    callback: () => void
  ) {
    const handleClickOutside = React.useCallback(
      (event: MouseEvent) => {
        if (
          refFirst?.current &&
          !refFirst?.current?.contains(event.target as Node)
        ) {
          if (ref.current) {
            if (!ref.current.contains(event.target as Node)) {
              callback();
            }
          } else {
            callback();
          }
        }
      },
      [callback, ref, refFirst]
    );

    React.useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return function cleanup() {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [callback, handleClickOutside, ref]);
  },

  toDayjsDate(date: string): Dayjs {
    return dayjs(date);
  },

  isEmpty(obj: Record<string, unknown>) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  },

  limitWord(input: string, max: number): string {
    if (input?.length > max) {
      input = input.slice(0, max);
      const output: string = input + "...";
      return output;
    }
    return input;
  },

  useStateCallback<T>(initialState: T) {
    const [state, setState] = React.useState<T>(initialState);

    const cbRef = React.useRef<((state: T) => void) | null>(null);

    const setStateCallback = React.useCallback(
      (state: T, cb: (state: T) => void) => {
        cbRef.current = cb;
        setState(state);
      },
      []
    );

    React.useEffect(() => {
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null;
      }
    }, [state]);

    return [state, setStateCallback] as const;
  },

  uniqueArray<T extends { id: number }>(array: T[]): T[] {
    return array.reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as T[]);
  },

  arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  },

  buildTree<T extends Model>(
    listItem: T[],
    parent?: TreeNode<T>,
    keyNodes?: number[],
    tree?: TreeNode<T>[]
  ): [TreeNode<T>[], number[]] {
    tree = tree ?? [];
    parent = parent ?? new TreeNode<T>();
    keyNodes = keyNodes ?? [];

    const children = listItem
      .filter((child) => {
        return child.parentId === parent.key;
      })
      .map((currentItem) => new TreeNode<T>(currentItem));

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

  listToTree<T extends Model & { children: T[] }>(list: T[]): T[] {
    const map: Record<number, number> = {};
    let node;
    const roots: T[] = [];

    for (let i = 0; i < list.length; i++) {
      map[list[i].id] = i;
      list[i].children = [];
    }

    for (let i = 0; i < list.length; i++) {
      node = list[i];
      if (node.parentId !== null) {
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },

  setDisabledNode<T extends Model>(nodeId: number, tree: TreeNode<T>[]) {
    const filteredNode = tree.find((currentNode) => currentNode.key === nodeId);
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
};
