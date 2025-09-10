import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { isArray } from "lodash";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex/ContractAnnex";
import {
  SelectAdjustableGoodsServicesFilterByContract,
  SelectAdjustableGoodsServicesFilterByProposal,
} from "models/ContractAnnex/ContractAnnexFilter";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

export const CONTRACT_ANNEX_BASE_API = "/purchasing/contractAppendix";
export const DRAWER_CONTRACT_BASE_API = "/drawer/contract";
export const DRAWER_PROPOSAL_BASE_API = "/drawer/proposal";

export class ContractAnnexRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${CONTRACT_ANNEX_BASE_API}`;
  }

  public getContract = (
    body: SelectAdjustableGoodsServicesFilterByContract
  ): Observable<ListResult<SelectAdjustableGoodsServicesModel>> => {
    return this.http.post(DRAWER_CONTRACT_BASE_API, body).pipe(
      map((response: ListResult<SelectAdjustableGoodsServicesModel>) => {
        const items = response?.data?.items;
        if (isArray(items)) {
          return {
            data: {
              items: items.map((item) => {
                const { goodsContractInfos, ...rest } = item;
                return {
                  ...rest,
                  goodsInfos: goodsContractInfos,
                };
              }),
              pageIndex: (response?.data as any)?.pageIndex,
              totalRecords: response.data?.totalRecords,
            },
          };
        }
        return response;
      })
    );
  };

  public getProposal = (
    body: SelectAdjustableGoodsServicesFilterByProposal
  ): Observable<ListResult<SelectAdjustableGoodsServicesModel>> => {
    return this.http.post(DRAWER_PROPOSAL_BASE_API, body).pipe(
      map((response: ListResult<SelectAdjustableGoodsServicesModel>) => {
        const items = response?.data?.items;
        if (isArray(items)) {
          return {
            data: {
              items: items.map((item) => {
                const { goodsProposalInfos, ...rest } = item;
                return {
                  ...rest,
                  goodsInfos: goodsProposalInfos,
                };
              }),
              pageIndex: (response?.data as any)?.pageIndex,
              totalRecords: response.data?.totalRecords,
            },
          };
        }
        return response;
      })
    );
  };
}

export const contractAnnexRepository = new ContractAnnexRepository();
