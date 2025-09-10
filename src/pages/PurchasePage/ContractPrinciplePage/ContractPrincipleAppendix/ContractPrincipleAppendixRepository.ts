import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import { isUndefined } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ContractAnnex, ContractAnnexFilter } from "models/ContractAnnex";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const API_CONTRACT_PRINCIPLE_APPENDIX = "/purchasing/principleContractAppendix";
export class ContractPrincipleAppendixRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_CONTRACT_PRINCIPLE_APPENDIX}`;
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  public getAll = (
    filter?: ContractAnnexFilter
  ): Observable<ListResult<ContractAnnex>> => {
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;
    const appendixDateFrom =
      getISOStringDate(filter?.appendixDate?.greaterEqual) || undefined;
    const appendixDateTo =
      getISOStringDate(filter?.appendixDate?.lessEqual) || undefined;

    const requestBody = {
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      contractAppendixClassification: numberConstants.ONE,

      statuses: this.getListIds(filter?.statusesId),
      code: filter?.code,
      name: filter?.name,
      appendixNo: filter?.appendixNo?.trim() || undefined,
      contractCode: filter?.contractCode,
      contractNo: filter?.contractNo,
      contractName: filter?.contractName,
      contractTypeIds: filter?.contractTypeValue?.map(
        (item: CommonFilter) => item?.id
      ),
      supplierIds: filter?.suppliersValue?.map((item: CommonFilter) => item.id),
      createdUserIds: filter?.createdUsersValue?.map(
        (item: CommonFilter) => item?.id
      ),
      createdOrganizationIds: filter?.createdOrganizationsValue?.map(
        (item: CommonFilter) => item?.id
      ),
      managers: filter?.managersValue?.map((item: CommonFilter) => item?.email),
      adjustmentType: filter?.adjustmentTypeValue?.id,
      organizationIds: filter?.organizationsValue?.map(
        (item: CommonFilter) => item?.id
      ),
      createdDate:
        isUndefined(createdDateFrom) && isUndefined(createdDateTo)
          ? undefined
          : {
              from: createdDateFrom,
              to: createdDateTo,
            },
      appendixDate:
        isUndefined(appendixDateFrom) && isUndefined(appendixDateTo)
          ? undefined
          : {
              from: appendixDateFrom,
              to: appendixDateTo,
            },
    };

    return this.http.post(nameof(this.getAll), requestBody);
  };
}

export const contractPrincipleAppendixRepository =
  new ContractPrincipleAppendixRepository();
