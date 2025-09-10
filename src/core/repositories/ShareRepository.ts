/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Observable } from "rxjs";
export const API_DOWNLOAD_FILE = "share/file/download";
export const API_UPLOAD_PUBLIC_FILE = "share/file/public/upload";
export const API_DOWNLOAD_PUBLIC_FILE = "share/file/public/download";
export class ShareRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public downloadFile = (Id?: string, Path?: string): Observable<any> => {
    return this.http.get<ArrayBuffer>("", {
      baseURL: new URL(
        API_DOWNLOAD_FILE,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
      responseType: "arraybuffer",
      params: {
        Id,
        Path,
      },
    });
  };

  public downloadPublicFile = (Id?: string, Path?: string): Observable<any> => {
    return this.http.get<ArrayBuffer>("", {
      baseURL: new URL(
        API_DOWNLOAD_PUBLIC_FILE,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
      responseType: "arraybuffer",
      params: {
        Id,
        Path,
      },
    });
  };

  public uploadPublicFile = (file: File | Blob): Observable<FileModel> => {
    const formData: FormData = new FormData();
    formData.append("File", file);
    return this.http
      .post<FileModel>(API_UPLOAD_PUBLIC_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(Repository.responseDataMapper<FileModel>());
  };
}

export const shareRepository = new ShareRepository();
