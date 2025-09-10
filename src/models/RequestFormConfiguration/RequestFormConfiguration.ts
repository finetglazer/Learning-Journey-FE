import { Attachment } from "models/Attachment";
import { FileTemplate } from "models/FileTemplate";
import { PurchaseRequest } from "models/PurchaseRequest/PurchaseRequest";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { Model } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export class InfoAttachmentAndCreatorSign extends Model {
  public fileBlob?: Blob;

  public fileName?: string;

  public creatorSignAttachment?: RequestFormConfigurationContent;

  public fileTemplate?: FileTemplate;
}
export class RequestFormConfiguration extends Model {
  public id?: number;

  public purchaseRequestId?: number;

  public purchaseOrderId?: number;

  public bidingDocumentId?: number;

  public dynamicTemplate?: FileTemplate;

  public formConfigurationStep?: number = 0;

  public attachment?: Attachment;

  public formType?: number = 1;

  public file?: FileModel;

  public elementHeight?: number;

  public elementWidth?: number;

  public purchaseRequest?: PurchaseRequest;

  public signatureConfigurations?: RequestFormConfigurationContent[] = [];
}
