import { ModelFilter } from "react-3layer-common";

export class RequestFormConfigurationFilter extends ModelFilter {
  public id?: string;
  public purchaseRequestId?: string;
  public purchaseOrderId?: string;
  public bidingDocumentId?: string;
  public fileId?: string;
  public formType?: string;
}
