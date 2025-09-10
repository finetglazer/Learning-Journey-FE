import { isArray, isBoolean, isEqual, isUndefined } from "lodash";
import { Model, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

import { ListResult } from "core/services/service-types";

import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";

import ConfigStore from "core/config/ConfigStore";
import { trimStringFieldObject } from "core/helpers/json";
import {
  ManufacturerCategories,
  ManufacturerCategoriesCode,
  ManufacturerCategoriesCodeFilter,
  ManufacturerCategoriesFilter,
} from "models/ManufacturerCategories";

const MANUFACTURER_CATEGORIES_API = "/master/manufacturers";

class ManufacturerCategoriesRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${MANUFACTURER_CATEGORIES_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => Number(item.id));
  };

  public getAll = (
    filter: ManufacturerCategoriesFilter
  ): Observable<ListResult<ManufacturerCategories>> => {
    const statuses = this.getListIds(filter?.statusValue);

    const requestBody = {
      codes: isArray(filter?.codesValue)
        ? filter?.codesValue?.map((value) => value?.code)
        : undefined,
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
    filter?: ManufacturerCategoriesCodeFilter
  ): Observable<ManufacturerCategoriesCode[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.post(nameof(this.getAll), requestBody).pipe(
      map((response) => {
        return response?.data?.items?.map(
          (item: ManufacturerCategoriesCode) => ({
            ...item,
            id: item?.code,
            name: item?.code,
          })
        );
      })
    );
  };

  public getDetail = (id: string): Observable<ManufacturerCategories> => {
    return this.http
      .get(`/${id}`)
      .pipe(
        Repository.responseMapToModel<ManufacturerCategories>(
          ManufacturerCategories
        )
      );
  };

  public create = (model: ManufacturerCategories): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim(),
      name: model?.name?.trim(),
      description: model?.description,
    };

    return this.http.post("", requestBody);
  };

  public update = (model: ManufacturerCategories): Observable<Model> => {
    const requestBody = {
      id: model?.id,
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim(),
      name: model?.name?.trim(),
      description: model?.description,
    };

    return this.http.put(`/${model?.id}`, requestBody);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };
}

const manufacturerCategoriesRepository = new ManufacturerCategoriesRepository();

export default manufacturerCategoriesRepository;
