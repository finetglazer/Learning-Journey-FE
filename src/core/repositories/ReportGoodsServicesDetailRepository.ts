import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { OrderContractDetailModel } from "models/OrderContract/OrderContract";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { GoodService } from "../../models/Proposal/GoodService";

export const API_GET_REPORT_CONTRACT_DEBT_DETAIL =
  "/purchasing/report/goodsServices/detail";
export const API_EXPORT_REPORT_CONTRACT_DEBT_DETAIL =
  "report/purchasing/report/goodsServices/detail/export";
export const API_GET_ALL_GOODS_SERVICES = "/master/goodsServices/getAll";

export class ReportGoodsServicesDetailRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getDropdownGoodsServices = (
    filter: ModelFilter
  ): Observable<GoodService[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .post(API_GET_ALL_GOODS_SERVICES, params)
      .pipe(map((response) => response?.data?.items));
  };

  public getDetail = (
    filter?: ModelFilter
  ): Observable<OrderContractDetailModel> => {
    return this.http.post(API_GET_REPORT_CONTRACT_DEBT_DETAIL, filter);
  };

  public export = (filter: ModelFilter): any => {
    return this.http.post(API_EXPORT_REPORT_CONTRACT_DEBT_DETAIL, filter, {
      responseType: "arraybuffer",
    });
  };
}

export const reportGoodsServicesDetailRepository =
  new ReportGoodsServicesDetailRepository();
