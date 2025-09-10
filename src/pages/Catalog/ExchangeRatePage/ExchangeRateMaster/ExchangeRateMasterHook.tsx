import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  GeneralAction,
  GeneralActionEnum,
  KeyType,
} from "core/services/service-types";
import { ExchangeRate } from "models/ExchangeRate";
import { ExchangeRateFilter } from "models/ExchangeRate/ExchangeRateFilter";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { exchangeRateRepository } from "../ExchangeRateRepository";
import { detailService } from "core/services/page-services/detail-service";
import { AxiosError } from "axios";
import { finalize } from "rxjs";
import { Key, TableRowSelection } from "antd/lib/table/interface";
import { authorizationService } from "core/services/common-services/authorization-service";
import { getDateToVietnam } from "core/helpers/date-time";
import { MENU_CODE } from "config/const";

export interface ExchangeRateMasterContextModel {
  // for context content master
  modelFilter: ExchangeRateFilter;
  list: ExchangeRate[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<ExchangeRateFilter>>;
  countFilter: number;

  rowSelection: TableRowSelection<ExchangeRate>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[] | Key[]>>;

  handleLoadList: (filterParam?: ExchangeRateFilter) => void;
  handleResetList: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyToast: any;
  //for context content in detail modal
  detailModel: ExchangeRate;
  dispatchDetailModel: React.Dispatch<GeneralAction<ExchangeRate>>;
  isOpenModal: boolean;
  isOpenPreviewModal: boolean;
  handleOpenModal: (id?: string, type?: "detail" | "preview") => void;
  handleCloseModal: (type: "detail" | "preview") => void;
  //for delete content
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: ExchangeRate) => void;
  deleteType: "Single" | "Bulk";
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  handleBulkDelete: () => void;
  validAction: (action: string) => boolean;
}
export const ExchangeRateMasterContext =
  createContext<ExchangeRateMasterContextModel>({
    // for context content master
    modelFilter: new ExchangeRateFilter(),
    list: [],
    count: 0,
    loadingList: false,
    dispatchFilter: null,
    countFilter: 0,
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    handleLoadList: null,
    handleResetList: null,
    notifyToast: null,
    //for context content in detail modal
    detailModel: new ExchangeRate(),
    dispatchDetailModel: null,
    isOpenModal: false,
    isOpenPreviewModal: false,
    handleOpenModal: null,
    handleCloseModal: null,
    //for delete content
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    deleteType: null,
    handleCloseModalDelete: null,
    handleDelete: null,
    handleBulkDelete: null,
    validAction: null,
  });

export function useExchangeRateMasterHooks() {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_RATEOFEXCHANGE
  );

  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ExchangeRateFilter,
      {
        ...new ExchangeRateFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: ExchangeRateFilter = React.useMemo(() => {
    return {
      ...new ExchangeRateFilter(),
      pageIndex: 1,
      pageSize: 10,

      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  } = listService.useList<ExchangeRate, ExchangeRateFilter>(
    exchangeRateRepository.getAll,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  // for context content value detail

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<ExchangeRate>(ExchangeRate);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

  const handleOpenModal = useCallback(
    (id?: string, type?: "preview" | "detail") => {
      if (id) {
        exchangeRateRepository.detail(id).subscribe((res: ExchangeRate) => {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...res?.data,
              exchangeRateDate: res?.data?.exchangeRateDate,
            },
          });
        });
      } else {
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: {
            ...new ExchangeRate(),
            isActive: true,
          },
        });
      }

      if (!isOpenModal && type === "detail") {
        setIsOpenModal(true);
      }
      if (!isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(true);
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );

  const handleCloseModal = useCallback(
    (type: "preview" | "detail") => {
      if (isOpenModal && type === "detail") {
        setIsOpenModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new ExchangeRate() },
        });
      }

      if (isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new ExchangeRate() },
        });
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );

  // for modal Delete
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const [deleteType, setDeleteType] = React.useState<"Bulk" | "Single">(
    "Single"
  );

  const handleOpenModalDelete = useCallback(
    (model?: ExchangeRate) => {
      if (!isOpenModalDelete) {
        setIsOpenModalDelete(true);
        if (model?.id) {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: model,
          });
          setDeleteType("Single");
        } else {
          setDeleteType("Bulk");
        }
      }
    },
    [dispatchDetailModel, isOpenModalDelete]
  );

  const handleCloseModalDelete = useCallback(() => {
    if (isOpenModalDelete) {
      setIsOpenModalDelete(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new ExchangeRate() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ExchangeRate>("checkbox", [], true);

  const handleDelete = () => {
    setLoadingList(true);
    exchangeRateRepository
      .delete([...[], detailModel?.id])
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  const handleBulkDelete = () => {
    setLoadingList(true);
    const ids = selectedRowKeys?.map((item) => item?.toString());
    exchangeRateRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  return {
    // context value:
    // context for value content in master
    dispatchFilter,
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleResetList,
    handleLoadList,
    notifyToast,
    validAction,
    //for context content in detail modal
    detailModel,
    dispatchDetailModel,
    isOpenModal,
    isOpenPreviewModal,
    handleOpenModal,
    handleCloseModal,
    // for delete content
    isOpenModalDelete,
    handleOpenModalDelete,
    deleteType,
    handleCloseModalDelete,
    handleDelete,
    handleBulkDelete,
    // non-context value:
    translate,
  };
}
