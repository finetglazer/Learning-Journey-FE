import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { numberConstants, STANDARD_DATE_FORMAT_US } from "core/config/consts";
import { httpConfig } from "core/config/http";
import {
  ConfigurationUnitImport,
  ConfigurationUnitImportType,
} from "core/models/ConfigurationUnitImport/ConfigurationUnitImport";
import dayjs from "dayjs";
import { Repository } from "react-3layer-common";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Observable } from "rxjs";

const API_UPLOAD_ATTACHED_FILE = "/master/importUnitArea";

export const NAME_AREA_CONFIG_EXPORT = "Rnd_Temp_Export_Cau hinh dien tich";
export const NAME_AREA_CONFIG_TEMPLATE = "Rnd_Temp_Import_Cau hinh dien tich";
export const NAME_PERSONNEL_CONFIG_EXPORT =
  "Rnd_Temp_Export_Cau hinh so luong nhan su";
export const NAME_PERSONNEL_CONFIG_TEMPLATE =
  "Rnd_Temp_Import_Cau hinh so luong nhan su";

class ConfigurationUnitRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_UPLOAD_ATTACHED_FILE}`;
  }

  private splitDate(value: string) {
    const isValidDate = dayjs(value, STANDARD_DATE_FORMAT_US).isValid();
    const date = isValidDate ? value : dayjs();

    return {
      month: dayjs(date).month() + numberConstants.ONE,
      year: dayjs(date).year(),
    };
  }

  public import = (data: ConfigurationUnitImport) => {
    const { month, year } = this.splitDate(data?.date);
    const formData: FormData = new FormData();
    formData.append("month", month.toString());
    formData.append("year", year.toString());
    formData.append("templateType", data?.templateType.toString());
    data?.file.forEach((file) => formData.append("file", file));

    return this.http
      .post<FileModel[]>("/import", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe();
  };

  public exportFile = (data: {
    date: string;
    templateType: ConfigurationUnitImportType;
  }): Observable<AxiosResponse<ArrayBuffer>> => {
    const { month, year } = this.splitDate(data?.date);
    const params = {
      month,
      year,
      templateType: data?.templateType,
    };
    return this.http.get("/export", {
      responseType: "arraybuffer",
      params,
    });
  };

  public downloadTemplate = (
    templateType: ConfigurationUnitImportType
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get("/download", {
      responseType: "arraybuffer",
      params: {
        templateType,
      },
    });
  };
}

export const configurationUnitRepository = new ConfigurationUnitRepository();
