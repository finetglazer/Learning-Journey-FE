import { DocumentGroup } from "models/DocumentGroup";

export type State = {
  mode?: "CLONE" | "VIEW" | "EDIT" | "CREATE";
};

export class AnnexFileModel {
  public id: string;
  public code: string;
  public name: string;
  public status?: number;
  public documentGroups: DocumentGroup[];
  public mode: State["mode"];
  public errors: any;
}

export enum TopicType {
  RECEIVING_GOODS = 15,
  ACCEPTANCE = 19,
}

export enum StatusAnnexFile {
  DRAFT = 0,
  CANCEL = 1,
  WAITING_FOR_APPROVAL = 2,
  APPROVED = 3,
  DECLINED = 4,
  RETURNED = 5,
}
