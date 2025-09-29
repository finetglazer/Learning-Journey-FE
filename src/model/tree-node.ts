export interface TreeNode {
    id: string;
    level: number;
    parentGroupId?: string; 
    type?: "group-root" | "group-node";
    prefix?: JSX.Element;
    label?: string;
    children?: TreeNode[];
};