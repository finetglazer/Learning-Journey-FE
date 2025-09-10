import { Project } from "models/Project/Project";
import { Model } from "react-3layer-common";

export class FileInfo extends Model {
  public id?: string;
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
  public projectId?: string;
  public totalAmountC2?: number;
}

export class BudgetPlanTemplate extends Model {
  public fileInfo?: FileInfo;
}

export class RequestAttachment extends Model {
  public name?: string;
  public contentType?: string;
  public size?: number;
  public path?: string;
  public systemFileId?: string | number;
}

export class BudgetSettlement extends Model {
  public id?: string;
  public isDetail = false;
  public budgetSettlementType?: { id: number; name: string };
  public requestAttachments?: RequestAttachment[];
  public budgetIds?: Project[];
  public name?: string;
  public status?: number;
  public isReturn?: boolean;
  public code?: string;
  public type?: number;
}
