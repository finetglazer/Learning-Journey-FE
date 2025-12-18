import { Model } from "react-3layer-common";

export class CreatePostModel extends Model {
    title: string;
    content: string;
    tags: string[];

    constructor() {
        super();
        this.title = "";
        this.content = "";
        this.tags = [];
    }
}
