import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export interface PositionType {
  id?: string;
  code?: string;
  name?: string;
}

export interface ResponderDetail extends Model {
  id?: string;
  name?: string;
  email?: string;
  position?: PositionType;
  positionName?: string;
}

export interface RequesterDetail extends Model {
  id?: string;
  name?: string;
  email?: string;
  position?: PositionType;
  positionName?: string;
}

export interface FileModelExtend extends FileModel {
  systemFileId?: string;
  contentType?: string;
}

export interface OpinionResponse {
  opinionId?: string;
  status?: Model;
  responseContent?: string;
  opinionResponseAttachments?: FileModelExtend[];
  createdDate?: Dayjs;
  createUser?: string;
  createUserFullName?: string;
}

export class OpinionCollector extends Model implements OpinionResponse {
  id?: string;
  code?: string;
  title?: string;
  responseByDetail?: ResponderDetail;
  responseDueDate?: Dayjs | string;
  responseStatus?: number;
  responseStatusText?: string;
  isRequired?: boolean;
  topicId?: string;
  topicType?: number;
  createUserId?: string;
  createUserDetail?: RequesterDetail;
  createdDate?: Dayjs;
  opinionResponse?: OpinionResponse;
  responseBys?: UserModel[];
  responseBysId?: UserModel[];
  opinion?: OpinionCollector;
  opinionResponses?: OpinionResponse[];
  canResponse?: boolean;
}

export interface UserModel extends Model {
  id?: string;
  name?: string;
  email?: string;
}
