import { Message } from "components/Comment/Comment.model";

export interface CommentModel {
  datas: Message[];
  isDelete: boolean;
}
