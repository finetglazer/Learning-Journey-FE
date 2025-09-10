import { useDebounceFn } from "ahooks";
import { ArgsProps } from "antd/lib/notification";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { type TFunction } from "i18next";
import {
  IPurchaseRequest,
  PurchaseRequestWaitingForPlanFilterModel,
} from "models/PurchasingPlan";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEBOUNCE_TIME_300 } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { purchasingPlanRepository } from "../../PurchasingPlanRepository";

export interface PurchaseRequestWaitingForPlanContextType {
  translate?: TFunction<"translation", undefined>;
  paymentRequestList?: IPurchaseRequest[];
  totalRequest?: number;
  loadingList?: boolean;
  modelFilter?: PurchaseRequestWaitingForPlanFilterModel;
  countFilter?: number;
  isOpenCreateModal?: boolean;
  purchaseRequest?: IPurchaseRequest;
  setOpenCreateModal?: Dispatch<SetStateAction<boolean>>;
  setPurchaseRequest?: Dispatch<SetStateAction<IPurchaseRequest>>;
  onSearchingPaymentRequest?: (search: string) => void;
  handleOpenModal?: (purchaseRequest?: IPurchaseRequest) => void;
  handleCloseModal?: () => void;
  handleResetList?: () => void;
  handleLoadList?: (
    filterParam?: PurchaseRequestWaitingForPlanFilterModel,
    isOverrideFilter?: boolean
  ) => void;
  dispatchFilter?: Dispatch<
    FilterAction<PurchaseRequestWaitingForPlanFilterModel>
  >;
  notifyToast?: (argsProps?: ArgsProps) => void;
}

export const PurchaseRequestWaitingForPlanContext =
  createContext<PurchaseRequestWaitingForPlanContextType>({});

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const usePurchaseRequestWaitingForPlanHook = () => {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PurchaseRequestWaitingForPlanFilterModel,
      {
        ...new PurchaseRequestWaitingForPlanFilterModel(),
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search", "tabKey"]
    );

  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [purchaseRequest, setPurchaseRequest] = useState<IPurchaseRequest>();

  const baseFilter = useMemo(() => {
    return {
      ...new PurchaseRequestWaitingForPlanFilterModel(),
      pageIndex: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const {
    list: paymentRequestList,
    count: totalRequest,
    loadingList,
    handleResetList,
    handleLoadList,
  } = listService.useList<
    IPurchaseRequest,
    PurchaseRequestWaitingForPlanFilterModel
  >(
    purchasingPlanRepository.getPaymentRequestWaitingForPlanList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { run: onSearchingPaymentRequest } = useDebounceFn(
    (search: string) => {
      const payload = {
        search: search,
        pageIndex: DEFAULT_PAGE,
      };

      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload,
      });
      handleLoadList({ ...payload });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleOpenModal = (purchaseRequest?: IPurchaseRequest) => {
    setOpenCreateModal(true);
    if (purchaseRequest) setPurchaseRequest(purchaseRequest);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setPurchaseRequest(undefined);
  };

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
    translate,
    paymentRequestList,
    totalRequest,
    loadingList,
    modelFilter,
    countFilter,
    isOpenCreateModal,
    purchaseRequest,
    setOpenCreateModal,
    setPurchaseRequest,
    handleOpenModal,
    handleCloseModal,
    handleResetList,
    handleLoadList,
    dispatchFilter,
    onSearchingPaymentRequest,
    notifyToast,
  };
};
