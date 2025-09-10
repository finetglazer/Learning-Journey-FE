import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual, isUndefined } from "lodash";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { ContractClassificationFilter } from "models/ContractClassification/ContractClassificationFilter";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const CONTRACT_CLASSIFICATION_API = "/master/contractType";

class ContractClassificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${CONTRACT_CLASSIFICATION_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => item.id);
  };

  private covertDataToNumber(value: unknown) {
    const valueNumber = Number(value);
    return isNaN(valueNumber) ? undefined : valueNumber;
  }

  private covertDataToBoolean(isActive: unknown) {
    return isBoolean(isActive)
      ? isActive
      : isEqual(isActive, numberConstants.ONE);
  }

  public getAll = (
    filter: ContractClassificationFilter
  ): Observable<ListResult<ContractClassification>> => {
    const statuses = this.getListIds(filter?.statusesValue)?.map(
      (item: unknown) => Number(item)
    );

    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim(),
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      description: filter?.description?.trim(),
      name: filter?.name?.trim(),
      maxOverpaymentAmountFrom: this.covertDataToNumber(
        filter?.maxOverpaymentAmountFrom?.equal
      ),
      maxOverpaymentAmountTo: this.covertDataToNumber(
        filter?.maxOverpaymentAmountTo?.equal
      ),
      maxOverpaymentPercentageFrom: this.covertDataToNumber(
        filter?.maxOverpaymentPercentageFrom?.equal
      ),
      maxOverpaymentPercentageTo: this.covertDataToNumber(
        filter?.maxOverpaymentPercentageTo?.equal
      ),
      statuses,
      codes: filter?.codesValue?.map(
        (item: ContractClassification) => item?.code
      ),
    } as ContractClassificationFilter;

    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  public getDetail = (id: string): Observable<ContractClassification> => {
    return this.http
      .get(`/${id}`)
      .pipe(
        Repository.responseMapToModel<ContractClassification>(
          ContractClassification
        )
      );
  };

  // getCodeContractClassification
  public getCodeContractClassification = (
    filter: ModelFilter
  ): Observable<ContractClassification[]> => {
    const params = {
      search: filter?.code?.trim(),
    };

    return this.http
      .get("", { params })
      .pipe(Repository.responseDataMapper<ContractClassification[]>());
  };

  public create = (model: ContractClassification): Observable<Model> => {
    const requestBody = {
      code: model?.code?.trim(),
      name: model?.name?.trim(),
      description: model?.description,
      maxOverpaymentAmount: model?.maxOverpaymentAmount,
      maxOverpaymentPercentage: model?.maxOverpaymentPercentage,
      isActive: this.covertDataToBoolean(model?.isActive),
    };
    return this.http.post("", requestBody);
  };

  public update = (model: ContractClassification): Observable<Model> => {
    const requestBody = {
      code: model?.code?.trim(),
      name: model?.name?.trim(),
      description: model?.description,
      maxOverpaymentAmount: model?.maxOverpaymentAmount,
      maxOverpaymentPercentage: model?.maxOverpaymentPercentage,
      isActive: this.covertDataToBoolean(model?.isActive),
    };
    return this.http.put(`/${model?.id}`, requestBody);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };
}

export const contractClassificationRepository =
  new ContractClassificationRepository();
