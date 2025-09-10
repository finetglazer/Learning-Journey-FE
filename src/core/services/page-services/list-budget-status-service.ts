import { DEFAULT_PAGE_SIZE_OPTION, SLASH } from "core/config/consts";
import { addNumbers } from "core/helpers/number";
import { statusBudgetRepository } from "core/repositories/StatusBudgetRepository";
import { webService } from "core/services/common-services/web-service";
import {
  FilterAction,
  FilterActionEnum,
  ListAction,
  ListActionType,
  ListState,
} from "core/services/service-types";
import { isEqual } from "lodash";
import {
  BudgetOverViewStatusFilter,
  CostCenterIdsModel,
} from "models/BudgetStatus/";
import {
  BudgetDetailsModel,
  BudgetOverViewStatusResponseModel,
  CostAllocation,
  PaymentCreateModel,
  PaymentDetailModel,
  PaymentModel,
  SHOPPING_PURPOSES,
  TYPE_OF_PAYMENT_DETAIL_TYPE,
  TYPE_OF_PAYMENT_TYPE,
} from "models/Payment";
import { ProposalCreateModel } from "models/Proposal";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import {
  Dispatch,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { finalize, Observable } from "rxjs";
import { filterService } from "./filter-service";
import { tableService } from "./table-service";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";

function listReducer<T>(state: ListState<T>, action: ListAction<T>) {
  switch (action.type) {
    case ListActionType.SET:
      return { ...action.payload };
    default:
      return state;
  }
}

const ZERO = 0;
const BASE_PAGE = {
  pageIndex: 1,
  pageSize: DEFAULT_PAGE_SIZE_OPTION[ZERO],
};

type BudgetStatusOverview = {
  purposeOfPurchase: PaymentModel;
  costAllocation?: CostAllocation[];
  ids?: string[];
  rate?: number;
  isProposal?: boolean;
  proposalId?: string;
};

export const listBudgetStatusService = {
  /**
   * react hook for control list/count data budget status from server
   * @param: getList: (filter: TFilter) => Observable<T[]>
   * @param: baseFilter?: TFilter
   * @param: dispatchFilter?: Dispatch<FilterAction<TFilter>>
   * @param: getCurrentFilter?: () => TFilter
   * @param: initData?: ListState<BudgetDetailsModel>
   * @return: { list, count, loadingList, setLoadingList, handleResetList, handleLoadList, isOverBudget }
   * */
  useList<T extends Model, TFilter extends ModelFilter>(
    getList: (filter: TFilter) => Observable<T>,
    baseFilter?: TFilter,
    dispatchFilter?: Dispatch<FilterAction<TFilter>>,
    getCurrentFilter?: () => TFilter,
    initData?: ListState<BudgetDetailsModel>
  ) {
    const [{ list, count }, dispatch] = useReducer<
      Reducer<ListState<BudgetDetailsModel>, ListAction<BudgetDetailsModel>>
    >(listReducer, initData ? initData : { list: [], count: ZERO });

    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [isOverBudget, setIsOverBudget] = useState<boolean>(false);
    const [subscription] = webService.useSubscription();

    const handleLoadList = useCallback(
      (filterParam?: TFilter, isOverrideFilter?: boolean) => {
        const currentFilter = getCurrentFilter();
        let filterValue: TFilter;
        if (isOverrideFilter) {
          filterValue = filterParam;
        } else {
          filterValue = filterParam
            ? { ...currentFilter, ...filterParam }
            : currentFilter;
        }
        setLoadingList(true);
        subscription.add(
          getList(filterValue)
            .pipe(finalize(() => setLoadingList(false)))
            .subscribe({
              next: (list: T) => {
                if (list?.isOverBudget) {
                  setIsOverBudget(true);
                } else {
                  setIsOverBudget(false);
                }

                dispatch({
                  type: ListActionType.SET,
                  payload: {
                    list: list?.projectStatus?.items ?? [],
                    count: list?.projectStatus?.totalRecords,
                  },
                });
              },

              error: () => {
                dispatch({
                  type: ListActionType.SET,
                  payload: {
                    list: [],
                    count: null,
                  },
                });
              },
            })
        );
      },
      [getList, subscription, getCurrentFilter]
    );

    const handleResetList = useCallback(() => {
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: {
          ...baseFilter,
        },
      });
      handleLoadList(
        {
          ...baseFilter,
        },
        true
      );
    }, [baseFilter, dispatchFilter, handleLoadList]);

    return {
      list,
      count,
      loadingList,
      setLoadingList,
      handleResetList,
      handleLoadList,
      isOverBudget,
    };
  },

  /**
   * react hook for control budget status overview modal
   * @param: costAllocation: PaymentModel
   * @param: purposeOfPurchase: CostAllocation[]
   * @return: { list, count, translate, modelFilter, isOverBudget, isShowReallocateAmount, handlePagination, handleCloseModal }
   * */
  useBudgetStatusOverview({
    rate,
    ids,
    costAllocation,
    purposeOfPurchase,
    isProposal,
    proposalId,
  }: BudgetStatusOverview) {
    const { t } = useTranslation();
    const location = useLocation();
    const { model: proposalModel } = useContext<ProposalCreateModel>(
      ProposalCreateHookContext
    );
    const { model: paymentCreateModel } = useContext<PaymentCreateModel>(
      PaymentCreateHookContext
    );
    const { model: paymentDetailModel } = useContext<PaymentDetailModel>(
      PaymentDetailHookContext
    );
    const requestAmount = (preTaxAmount = ZERO, taxAmount = ZERO) =>
      rate
        ? addNumbers((preTaxAmount + taxAmount) * rate)
        : addNumbers(preTaxAmount + taxAmount);

    const requestAmountProposal = (
      contingencyAmount = ZERO,
      estimateAmount = ZERO,
      originalTotalAmount = ZERO
    ) => {
      if (proposalModel.isAdjust) {
        return rate
          ? addNumbers(
              (contingencyAmount + estimateAmount - originalTotalAmount) * rate
            )
          : addNumbers(
              contingencyAmount + estimateAmount - originalTotalAmount
            );
      } else {
        return rate
          ? addNumbers((contingencyAmount + estimateAmount) * rate)
          : addNumbers(contingencyAmount + estimateAmount);
      }
    };

    const baseFilter = useMemo(() => {
      const modelFilterBudgetOverViewBase = new BudgetOverViewStatusFilter();
      const isProject = isEqual(
        purposeOfPurchase?.id,
        SHOPPING_PURPOSES.ACCORDING_PROJECT
      );
      modelFilterBudgetOverViewBase.costCenterIds = costAllocation?.map(
        (item) => {
          return {
            businessBranchId: item.businessBranchId?.id || null,
            businessUnitId: item.businessUnitId?.id || null,
            businessDepartmentId: item.businessDepartmentId?.id || null,
            requestAmount: isProposal
              ? requestAmountProposal(
                  item?.contingencyAmount,
                  item?.estimateAmount,
                  item?.originalTotalAmount
                )
              : requestAmount(item?.preTaxAmount, item?.taxAmount),
            budgetId: item.projectId?.id || null,
            isProject,
            costLineId: item.costLineId?.id || null,
          } as CostCenterIdsModel;
        }
      );

      modelFilterBudgetOverViewBase.isProject = isProject;
      modelFilterBudgetOverViewBase.isAfterBudgetCalc = Boolean(
        proposalModel?.status ||
          paymentCreateModel?.status ||
          paymentDetailModel?.paymentDetailInfomation?.status
      );
      modelFilterBudgetOverViewBase.budgetCalcDate =
        proposalModel.approvalSubmissionDate;
      modelFilterBudgetOverViewBase.createdUserId = proposalModel?.user?.id;
      modelFilterBudgetOverViewBase.proposalId = proposalId;
      return {
        ...modelFilterBudgetOverViewBase,
        ...BASE_PAGE,
        ids,
      };
    }, [costAllocation, purposeOfPurchase]);

    const { modelFilter, dispatchFilter, getModelFilter } =
      filterService.useModelFilter(BudgetOverViewStatusFilter, baseFilter);

    const { list, count, handleLoadList, isOverBudget } =
      listBudgetStatusService.useList<
        BudgetOverViewStatusResponseModel,
        BudgetOverViewStatusFilter
      >(
        statusBudgetRepository.getBudgetOverViewStatus,
        baseFilter,
        dispatchFilter,
        getModelFilter
      );

    const { handlePagination } = tableService.useTable(
      modelFilter,
      dispatchFilter,
      handleLoadList
    );

    useEffect(() => {
      handleLoadList(baseFilter);
      dispatchFilter({ type: FilterActionEnum.SET, payload: baseFilter });
    }, []);

    const handleCloseModal = () => {
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: {},
      });
    };

    const listUrl = (path: string) => {
      const parts = path.split(SLASH);
      const valuePath = "/" + parts[3];
      const url: string[] = [
        TYPE_OF_PAYMENT_TYPE.PAYMENT,
        TYPE_OF_PAYMENT_DETAIL_TYPE.PAYMENT,
      ];
      return url.includes(valuePath);
    };

    const isShowReallocateAmount = listUrl(location.pathname);

    return {
      list,
      count,
      translate: t,
      modelFilter,
      isOverBudget,
      isShowReallocateAmount,
      handleCloseModal,
      handlePagination,
    };
  },
};
