import { DocumentGroup } from "models/DocumentGroup";
import { State } from "../Components/constant";

export class AcceptanceFileModel {
  public id: string;
  public code: string;
  public name: string;
  public status?: number;
  public documentGroups: DocumentGroup[];
  public mode: State["mode"];
}

export enum TopicType {
  RECEIVING_GOODS = 15,
  ACCEPTANCE = 19,
}

export enum StatusAcceptanceFile {
  DRAFT = 0,
  CANCEL = 1,
  WAITING_FOR_APPROVAL = 2,
  APPROVED = 3,
  DECLINED = 4,
  RETURNED = 5,
}
