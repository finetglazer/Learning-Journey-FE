/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { HandleLoadList } from "core/models/Filter/Filter";
import { costLineRepository } from "core/repositories/CostLineRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import { CostLine } from "models/CostLine";
import { CostLineFilter } from "models/CostLine/CostLineFilter";
import React, { createContext, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";

export interface ModalType {
  type: "CREATE" | "UPDATE" | "DETAIL" | "DELETE" | "NONE";
  id?: string;
}

const ACTIONS = ["CREATE", "UPDATE", "DELETE", "DETAIL"];
export interface CostLineMaster {
  modelFilter: CostLineFilter;
  list: CostLine[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<CostLineFilter>>;
  countFilter: number;
  handleLoadList: HandleLoadList<CostLineFilter>;
  handleResetList: () => void;
  rowSelection: TableRowSelection<CostLine>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  onRowClicked: (record: CostLine) => void;
  modal: ModalType;
  setModalType: React.Dispatch<SetStateAction<ModalType>>;
  loadingDetail: boolean;
  detailModel: CostLine;
  deleteCostLine: () => void;
  notifyToast: any;
}

export const DEFAULT_MODAL_TYPE: ModalType = { type: "NONE", id: undefined };

export const CostLineMasterContext = createContext<CostLineMaster>({
  modelFilter: new CostLineFilter(),
  list: [],
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  countFilter: 0,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  canBulkAction: false,
  onRowClicked: null,
  modal: DEFAULT_MODAL_TYPE,
  setModalType: null,
  loadingDetail: false,
  detailModel: null,
  deleteCostLine: null,
  notifyToast: null,
});

export function useCostLineMasterHooks() {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>({
    type: "NONE",
    id: undefined,
  });
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailModel, setDetailModel] = useState<CostLine | null>(null);

  const { notifyToast } = appMessageService.useCRUDMessage();

  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CostLineFilter,
      {
        ...new CostLineFilter(),
        pageIndex: 1,
        pageSize: 10,
        isTransferValue: {
          id: 2,
          name: translate("CL.all_txt"),
          code: "ALL",
        },
        isBudgetOverrunsValue: {
          id: 2,
          name: translate("CL.all_txt"),
        },
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CostLineFilter = React.useMemo(() => {
    return {
      ...new CostLineFilter(),
      pageIndex: 1,
      pageSize: 10,
      isTransferValue: {
        id: 2,
        name: translate("CL.all_txt"),
      },
      isBudgetOverrunsValue: {
        id: 2,
        name: translate("CL.all_txt"),
      },
      search: modelFilter?.search,
    };
  }, [modelFilter?.search, translate]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<CostLine, CostLineFilter>(
      costLineRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<CostLine>("checkbox", [], true);

  const onRowClicked = (record: CostLine) => {
    setModalType({ type: "DETAIL", id: record.id });
  };

  // Get cost line detail
  const getCostLineDetail = (id: string) => {
    setLoadingDetail(true);
    costLineRepository
      .detail(id)
      .pipe(finalize(() => setLoadingDetail(false)))
      .subscribe({
        next: (response) => {
          if (isEqual(response?.status, 200)) {
            setDetailModel(response?.data);
          }
        },
        error: (error: AxiosError) => {
          console.log("Could not fetch cost line detail with error ", error);
        },
      });
  };

  // Delete cost line
  const deleteCostLine = () => {
    setLoadingDetail(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    costLineRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingDetail(false)))
      .subscribe({
        next: (response) => {
          if (isEqual(response?.status, 200)) {
            setModalType(DEFAULT_MODAL_TYPE);
            setSelectedRowKeys([]);
            handleLoadList();
            notifyToast({
              message: translate("CL.cost_line_delete_succeed_message", {
                total: ids.length,
              }),
              placement: "topRight",
            });
          }
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setModalType(DEFAULT_MODAL_TYPE);
        },
      });
  };

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  React.useEffect(() => {
    if (!isEmpty(modalType.id) && isEqual(modalType.type, "DETAIL")) {
      getCostLineDetail(modalType.id);
    }
  }, [modalType]);

  return {
    // context value:
    dispatchFilter,
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    handleResetList,
    handleLoadList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    onRowClicked,
    modal: modalType,
    setModalType,
    loadingDetail,
    detailModel,
    deleteCostLine,
    notifyToast,

    // non-context value:
    translate,
  };
}
