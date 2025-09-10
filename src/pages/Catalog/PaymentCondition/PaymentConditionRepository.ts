import { isBoolean, isEqual, isUndefined } from "lodash";
import { Model, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

import { ListResult } from "core/services/service-types";

import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";

import ConfigStore from "core/config/ConfigStore";
import { trimStringFieldObject } from "core/helpers/json";
import {
  PaymentCondition,
  PaymentConditionCode,
  PaymentConditionCodeFilter,
  PaymentConditionFilter,
} from "models/PaymentCondition";

const PAYMENT_CONDITION_API = "/master/api/PaymentCondition";

class PaymentConditionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${PAYMENT_CONDITION_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => Number(item.id));
  };

  public getAll = (
    filter: PaymentConditionFilter
  ): Observable<ListResult<PaymentCondition>> => {
    const statuses = this.getListIds(filter?.statusValue);

    const requestBody = {
      // code: filter?.codeValue?.code,
      codes: filter?.codesId,
      name: filter?.name?.trim(),
      description: filter?.description?.trim(),
      status: statuses,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  public getListCode = (
    filter?: PaymentConditionCodeFilter
  ): Observable<PaymentConditionCode[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.post(nameof(this.getAll), requestBody).pipe(
      map((response) => {
        return response?.data?.items?.map((item: PaymentConditionCode) => ({
          ...item,
          id: item?.code,
          name: item?.code,
        }));
      })
    );
  };

  public getDetail = (id: string): Observable<PaymentCondition> => {
    return this.http
      .get(`/${id}`)
      .pipe(Repository.responseMapToModel<PaymentCondition>(PaymentCondition));
  };

  public create = (model: PaymentCondition): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http.post("", requestBody);
  };

  public update = (model: PaymentCondition): Observable<Model> => {
    const requestBody = {
      id: model?.id,
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http.put(`/${model?.id}`, requestBody);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };
}

const paymentConditionRepository = new PaymentConditionRepository();

export default paymentConditionRepository;
