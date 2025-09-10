import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import { isBoolean, isEmpty, isEqual, isNil, isUndefined } from "lodash";
import CommonFilter from "models/CommonFilter";
import { SpecializedBank } from "models/SpecializedBank/SpecializedBank";
import { SpecializedBankFilter } from "models/SpecializedBank/SpecializedBankFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const SPECIALIZED_BANKS_API = "/master/businessUnit";

class SpecializedBankRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${SPECIALIZED_BANKS_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => item.id);
  };

  private getStringDay = (value?: Dayjs) => {
    if (isUndefined(value)) return undefined;
    const VIETNAMESE_TIME_ZONE_OFFSET = 7;
    return dayjs(value)
      .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
      .toDate()
      .toISOString();
  };

  // getAll
  public getAll = (
    filter: SpecializedBankFilter
  ): Observable<ListResult<SpecializedBank>> => {
    let type = this.getListIds(
      filter?.typeValue?.map((item: CommonFilter) => ({ id: Number(item.id) }))
    );

    if (isNil(type) || isEmpty(type)) {
      type = undefined;
    }
    const startDateFrom = this.getStringDay(filter?.startDate?.greaterEqual);
    const startDateTo = this.getStringDay(filter?.startDate?.lessEqual);
    const endDateFrom = this.getStringDay(filter?.endDate?.greaterEqual);
    const endDateTo = this.getStringDay(filter?.endDate?.lessEqual);
    const status = this.getListIds(filter?.statusValue)?.map((item: unknown) =>
      Number(item)
    );

    const requestBody = {
      code: filter?.code?.contain,
      name: filter?.name?.contain,
      type,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      status,
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

  public create = (model: SpecializedBank): Observable<Model> => {
    let type = Number(model?.typeId?.id);
    if (isNaN(type)) {
      type = undefined;
    }
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code || "",
      name: model?.name || "",
      type,
      startDate: this.getStringDay(model?.startDateValue),
      endDate: this.getStringDay(model?.endDateValue),
    };

    return this.http.post("", requestBody);
  };

  public update = (model: SpecializedBank): Observable<Model> => {
    let type = Number(model?.typeId?.id);
    if (isNaN(type)) {
      type = undefined;
    }
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code || "",
      name: model?.name || "",
      type,
      startDate: this.getStringDay(model?.startDateValue),
      endDate: this.getStringDay(model?.endDateValue),
    };

    return this.http.put(`/${model?.id}`, requestBody);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<SpecializedBank> => {
    return this.http
      .get(`/${id}`)
      .pipe(Repository.responseMapToModel<SpecializedBank>(SpecializedBank));
  };
}

const specializedBankRepository = new SpecializedBankRepository();

export default specializedBankRepository;
