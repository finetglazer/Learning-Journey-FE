import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { Model, ModelFilter } from "react-3layer-common";

export class Message extends Model {
  id?: string;
  content?: string;
  topicId?: string;
  tagIds?: string[];
  userTags?: UserModel[];
  commentAttachments: FileAttachments[];
  topicType?: number;
  createdDate?: Dayjs;
  createUserId?: string;
  creator?: Creator;
  constructor(data?: Message) {
    super();
    if (data) {
      this.id = data.id;
      this.topicId = data.topicId;
      this.creatorId = data.createUserId;
      this.createdDate = dayjs(data.createdDate).add(7, "hour");
      this.content = `${data.content || ""} `;
      this.creator = data.creator
        ? {
            id: data.creator.id,
            name: data.creator.name,
            email: data.creator.email,
          }
        : undefined;

      this.commentAttachments = data.commentAttachments || [];
      this.userTags = data.userTags;
      this.tagIds = data.tagIds || [];
    }
  }
}

export class MessageFilter extends ModelFilter {}

export class Creator extends Model {
  id?: string;
  name?: string;
  email?: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
}

export interface FileAttachments {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

export interface ErrorHandlerProps<T extends Model> {
  model: T;
  error: AxiosError;
  handleChangeAllField?: (data: T) => void;
}
