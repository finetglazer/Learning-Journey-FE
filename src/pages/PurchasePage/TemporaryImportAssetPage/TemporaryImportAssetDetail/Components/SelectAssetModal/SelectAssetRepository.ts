import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { isEmpty } from "lodash";
import { ProjectFilter } from "models/Project/ProjectFilter";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { Item } from "./SelectAssetHook";

const API_ASSET_PREFIX = "purchasing/tempReceipt/GetAssetByContract";
export class AssetRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getAll = (
    filter: SelectAsset
  ): Observable<ListResult<SelectAsset>> => {
    const goodsIds = filter?.goodsIds?.map((item: Item) => item?.id);
    const receiveIds = filter?.receiveIds?.map((item: Item) => item?.id);

    const idIgnores = isEmpty(filter?.idIgnores) ? undefined : filter.idIgnores;

    const requestBody: ProjectFilter = {
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
      assetCode: filter.search,
      goodsIds: isEmpty(goodsIds) ? undefined : goodsIds,
      receiveIds: isEmpty(receiveIds) ? undefined : receiveIds,
      idIgnores,
    };

    return this.http.post(
      `${API_ASSET_PREFIX}/${filter.contractId}`,
      requestBody
    );
  };

  public getSelected = (
    body: string[],
    contractId: string
  ): Observable<AxiosResponse> => {
    return this.http.post(`${API_ASSET_PREFIX}/${contractId}`, {
      ids: body,
      pageSize: body.length,
    });
  };
}

export const assetRepository = new AssetRepository();
