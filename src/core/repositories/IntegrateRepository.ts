import { PaymentIntegrateECM } from "components/IntegrateECM/IntegrateECM";
import { PaymentIntegrateERP } from "components/IntegrateERP/IntegrateERP";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

const API_GET_LIST_INTEGRATION = "/payment/request";
const API_PUSH_INTEGRATION_ERP = `/integration-msb/payment/send-to-erp${
  ConfigStore.getInstance().get("isStaging") == "true" ? "-stg" : ""
}`;
const API_PUSH_INTEGRATE_ECM = `/integration-msb/upload-document-to-ecm${
  ConfigStore.getInstance().get("isStaging") == "true" ? "-stg" : ""
}`;
const API_UPDATE_STATUS_ERP = "/integration-msb/payment/status-erp";

export class IntegrateRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // Get List ERP
  public getListERP = (
    paymentRequestId: string
  ): Observable<PaymentIntegrateERP[]> => {
    return this.http
      .get(`${API_GET_LIST_INTEGRATION}/${paymentRequestId}/erpInformation`)
      .pipe(map((response) => response?.data));
  };

  // Get List ECM
  public getListECM = (
    paymentRequestId: string
  ): Observable<PaymentIntegrateECM[]> => {
    return this.http
      .get(`${API_GET_LIST_INTEGRATION}/${paymentRequestId}/ecmInformation`)
      .pipe(map((response) => response?.data));
  };

  // Push Integrate ERP
  public pushIntegrateERP = (param: {
    paymentRequestId: string;
    userEmail: string;
    tokenLogin: string;
  }): Observable<string> => {
    return this.http
      .post(API_PUSH_INTEGRATION_ERP, param)
      .pipe(map((response) => response?.data));
  };

  // Push Integrate ECM
  public pushIntegrateECM = (param: {
    paymentRequestId: string;
    userEmail: string;
    tokenLogin: string;
  }): Observable<string> => {
    return this.http
      .post(API_PUSH_INTEGRATE_ECM, param)
      .pipe(map((response) => response?.data));
  };

  public updateStatusERP = (
    paymentRequestId: string
  ): Observable<PaymentIntegrateECM[]> => {
    return this.http
      .get(`${API_UPDATE_STATUS_ERP}/${paymentRequestId}`)
      .pipe(map((response) => response?.data));
  };
}

export const integrateRepository = new IntegrateRepository();
