export interface TreeNode {
    id: string;
    level: number;
    prefix?: JSX.Element;
    label?: string;
    children?: TreeNode[];
};