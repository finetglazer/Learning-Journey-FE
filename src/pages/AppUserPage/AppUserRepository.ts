import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Observable } from "rxjs";
export const API_UPLOAD_AVATAR_FILE = "share/file/uploadAvatar";
export const API_APP_USER_PREFIX = "/auth/user";
export const API_DOWNLOAD_FILE = "share/file/download";
export const API_APP_ROLE_PREFIX = "auth/role";

export class AppUserRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_APP_USER_PREFIX}`;
  }

  // get
  public detail = (id: string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (id: string): Observable<any> => {
    return this.http.delete(`/${id}`);
  };

  public createAppUser = (data: any): Observable<any> => {
    return this.http.post("addUser", data);
  };

  public updateAppUser = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public updateSignature = (data: any): Observable<any> => {
    return this.http.put(`signature/${data?.id}`, data, {
      params: {
        id: data?.id,
      },
    });
  };

  public getSigningToken = (refreshToken: string): Observable<any> => {
    return this.http.get<any>("signingToken", {
      params: {
        refreshToken,
      },
    });
  };

  public saveAppUser = (data: any): Observable<any> => {
    return data?.id ? this.updateAppUser(data) : this.createAppUser(data);
  };

  public changePassword = (data: any): Observable<any> => {
    return this.http.post("changePassword", data);
  };

  public changeStatus = (data: any): Observable<any> => {
    return this.http.post("changeStatus", data);
  };

  public uploadAvatar = (file: File | Blob): Observable<FileModel> => {
    const formData: FormData = new FormData();
    formData.append("File", file);
    return this.http
      .post<FileModel>(API_UPLOAD_AVATAR_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: ConfigStore.getInstance().get("baseApiUrl"),
      })
      .pipe(Repository.responseDataMapper<FileModel>());
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>("", {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
      baseURL: new URL(
        API_DOWNLOAD_FILE,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public updateRole = (data: any): Observable<any> => {
    return this.http.post("updateRoleByUser", data);
  };

  // get
  public getRoleByUser = (id: string): Observable<any> => {
    const endpoint = `/getRoleByUser/${id}`;
    return this.http.get(endpoint, {
      baseURL: new URL(
        API_APP_ROLE_PREFIX,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };
}

export const appUserRepository = new AppUserRepository();
