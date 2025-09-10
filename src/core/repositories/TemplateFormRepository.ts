/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { SignedFormTypeRequirement } from "models/SignedFormTypeRequirement";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

class TemplateFormRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getTypeRequirement = (
    templateType: string
  ): Observable<SignedFormTypeRequirement> => {
    return this.http.get<SignedFormTypeRequirement>(
      `/template/form/signatureRequirement`,
      {
        params: {
          templateType,
        },
      }
    );
  };

  public getFile = (Id: string): Observable<any> => {
    return this.http.get<any>(`/share/file/download`, {
      responseType: "arraybuffer" as "json",
      params: {
        Id,
      },
      baseURL: ConfigStore.getInstance().get("baseApiUrl"),
    });
  };

  public uploadFile = (
    file: File | Blob,
    fileName?: string,
    creatorSignAttachment?: RequestFormConfigurationContent
  ): Observable<any> => {
    const formData: FormData = new FormData();
    formData.append("file", file, fileName);
    formData.append("Page", `${creatorSignAttachment?.page || 0}`);
    formData.append(
      "XCoordinate",
      `${Math.trunc(creatorSignAttachment?.xCoordinate || 0)}`
    );
    formData.append(
      "YCoordinate",
      `${Math.trunc(creatorSignAttachment?.yCoordinate || 0)}`
    );
    formData.append("Height", `${creatorSignAttachment?.height || 0}`);
    formData.append("Width", `${creatorSignAttachment?.width || 0}`);
    formData.append(
      "PreviewDisplay",
      `${creatorSignAttachment?.previewDisplay}`
    );
    return this.http.post<any>(`/template/form/saveTemplate`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };
}

export const templateFormRepository = new TemplateFormRepository();
