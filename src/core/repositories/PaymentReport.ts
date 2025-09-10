import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { PaymentReportAuthorityFilter } from "models/PaymentReport/PaymentReportFilter";
import { PaymentReportAuthorityModel } from "models/PaymentReport/PaymentReportModel";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const PAYMENT_BASE_API = "/report/payment/approvedUser";

export class PaymentReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${PAYMENT_BASE_API}`;
  }

  public getAll = (
    filter?: PaymentReportAuthorityFilter
  ): Observable<ListResult<PaymentReportAuthorityModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: filter?.createDateRange,
      updateDateRange: filter?.approvalDate,
      updateUser: filter?.approversValue?.map(
        (approver: { email: string }) => approver.email
      ),
    };
    return this.http.post(nameof(this.getAll), requestBody);
  };

  public export = (filter?: PaymentReportAuthorityFilter) => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      createdDateRange: filter?.createDateRange,
      updateDateRange: filter?.approvalDate,
      updateUser: filter?.approversId,
      regionId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return this.http.post<ArrayBuffer>(nameof(this.export), requestBody, {
      responseType: "arraybuffer",
    });
  };
}

export const paymentReportRepository = new PaymentReportRepository();
