/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

export const API_SYSTEM_CONFIGURATION_PREFIX = "/master/systemConfig";

export class SystemConfigurationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SYSTEM_CONFIGURATION_PREFIX}`;
  }
  // get
  public detail = (): Observable<any> => {
    const endpoint = `/getSystemConfig`;
    return this.http.post(endpoint, {});
  };

  // delete
  public delete = (id: string): Observable<any> => {
    return this.http.delete(`/${id}`);
  };

  public createSystemConfiguration = (data: any): Observable<any> => {
    return this.http.post("", data);
  };
}

export const systemConfigurationRepository =
  new SystemConfigurationRepository();
