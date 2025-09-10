import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import {
  BudgetOverViewStatusFilter,
  BudgetOverViewStatusResponseModel,
} from "models/Payment";
import { API_GET_OVERVIEW_BUDGET_STATUS } from "pages/PaymentPage/PaymentRepository";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

export class StatusBudgetRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // Get budget status overview
  public getBudgetOverViewStatus = (
    filter: BudgetOverViewStatusFilter
  ): Observable<BudgetOverViewStatusResponseModel> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      costCenterIds: filter?.costCenterIds,
      isProject: filter?.isProject,
      ids: filter?.ids,
      isAfterBudgetCalc: filter?.isAfterBudgetCalc,
      budgetCalcDate: filter?.budgetCalcDate,
      createdUserId: filter?.createdUserId,
      proposalId: filter?.proposalId,
    };
    return this.http
      .post<BudgetOverViewStatusResponseModel>(
        API_GET_OVERVIEW_BUDGET_STATUS,
        body
      )
      .pipe(Repository.responseDataMapper<BudgetOverViewStatusResponseModel>());
  };
}

export const statusBudgetRepository = new StatusBudgetRepository();
