import { Model } from "react-3layer-common";

export class CreatePostModel extends Model {
    title: string;
    content: any;
    tags: string[];
    files: (File | {
        fileId?: number;
        name: string;
        url: string;
        size: number;
        type: string;
        isAdded?: boolean;
    })[];
    filesToRemove: number[];

    constructor() {
        super();
        this.title = "";
        this.content = "";
        this.tags = [];
        this.files = [];
        this.filesToRemove = [];
    }
}
