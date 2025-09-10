import { Repository } from "react-3layer-common";
import { httpConfig } from "core/config/http";
import ConfigStore from "core/config/ConfigStore";
import { map, Observable } from "rxjs";
import { ReportTemplate, ReportTemplateFilter } from "models/ReportTemplate";
import nameof from "ts-nameof.macro";
import { ContentHtml } from "models/Proposal";
import { CurrencyFilter } from "models/Currency";
import { trimStringFieldObject } from "core/helpers/json";

const REPORT_TEMPLATE_API = "/report/reportTemplate";

class ReportTemplateRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${REPORT_TEMPLATE_API}`;
  }

  public getAll = (data?: CurrencyFilter): Observable<any> => {
    const requestBody = {
      ...data,
    };
    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };
  public detail = (id: string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };
  public create = (formData: any): Observable<any> => {
    return this.http
      .post("", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(Repository.responseDataMapper<ReportTemplate[]>());
  };
  public update = (id: string, formData: any): Observable<any> => {
    return this.http.put(`/${id}`, formData);
  };
  public saveReport = (data: ReportTemplate): Observable<any> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("code", data.code);
    data.file && formData.append("file", data.file);
    data?.path && formData.append("path", data.path);
    formData.append("status", data.status ? "1" : "0");
    return data.id ? this.update(data.id, formData) : this.create(formData);
  };
  public getDropdown = (data?: ReportTemplateFilter): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), { params: data })
      .pipe(Repository.responseDataMapper<ReportTemplate[]>());
  };
  public getByIds = (data: string): Observable<ContentHtml[]> => {
    const body = {
      ids: [data],
    };
    return this.http
      .post<ContentHtml[]>(nameof(this.getByIds), body)
      .pipe(map((response) => response.data));
  };
  public downloadTemplate = (id: string): Observable<any> => {
    return this.http.post<ArrayBuffer>(
      nameof(this.downloadTemplate),
      { id },
      {
        responseType: "arraybuffer" as "json",
      }
    );
  };
}

export const reportTemplateRepository = new ReportTemplateRepository();
