/* eslint-disable import/no-unresolved */
import {
  FileModel,
  UploadFileProps,
} from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Observable } from "rxjs";

export interface UploadProps extends Omit<UploadFileProps, "uploadFile"> {
  uploadFile?: (files: File[] | Blob[]) => Observable<FileModel[]>;
  maxFileSize?: number;
  maxTotalSize?: number;
  updateList?: (files: FileModel[]) => void;
  onUploadError?: (error: any) => void;
}

export const MB = 1000000;

export const MAX_FILE_SIZE = 25;

export const MAX_TOTAL_SIZE = 100;

export const MAXIMUM_SIZE = 999999999999999;

export const TYPE_DEFAULT = "dragAndDrop";

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
