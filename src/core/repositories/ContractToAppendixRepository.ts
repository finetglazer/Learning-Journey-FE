import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { ContractToAppendixModel } from "models/ContractAnnex";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const ACCEPTANCE_BASE_API = "/purchasing/contract";
const GET_CONTRACT_APPENDIX = "/getContractToAppendix";

export class ContractToAppendix extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${ACCEPTANCE_BASE_API}`;
  }

  public getList = (
    filter: ModelFilter
  ): Observable<ListResult<ContractToAppendixModel>> => {
    return this.http.post(GET_CONTRACT_APPENDIX, filter);
  };
}

export const contractToAppendix = new ContractToAppendix();
