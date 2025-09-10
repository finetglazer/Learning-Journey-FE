import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { ProposalAvailableFilter } from "models/Proposal/ProposalFilter";
import { EntitySelection, PurchaseProposal } from "models/PurchaseRequest";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";

interface ProposalModalHooksProps {
  addedProposal: string;
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: PurchaseProposal) => void;
  entitySelection?: EntitySelection;
}

export interface ProposalModal {
  list: PurchaseProposal[];
  modelFilter: ProposalAvailableFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<ProposalAvailableFilter>>;
  handleLoadList: (filterParams?: ProposalAvailableFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<PurchaseProposal>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
}

export const ProposalModalContext = createContext<ProposalModal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
});

export const useProposalModalHooks = ({
  setModal,
  callback,
  addedProposal,
  entitySelection = EntitySelection.YCMS,
}: ProposalModalHooksProps) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const baseFilter: ProposalAvailableFilter = useMemo(() => {
    return {
      ...new ProposalAvailableFilter(),
      pageIndex: 1,
      pageSize: 10,
      entitySelection,
    };
  }, [entitySelection]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ProposalAvailableFilter, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<PurchaseProposal, ProposalAvailableFilter>(
      purchaseRequestRepository.proposalAvailable,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<PurchaseProposal>("radio", [], false, "auto");

  useEffect(() => {
    if (addedProposal) {
      setSelectedRowKeys([addedProposal]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedProposal]);

  const onSave = () => {
    setLoading(true);
    purchaseRequestRepository
      .detailProposalAvailable(selectedRowKeys?.[0].toString(), entitySelection)
      .pipe(
        finalize(() => {
          setLoading(false);
        })
      )
      .subscribe({
        next: (response: PurchaseProposal) => {
          if (response) {
            if (callback) callback(response);
            onCancel();
          }
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new ProposalAvailableFilter(),
      },
    });
    setTimeout(() => {
      setModal(false);
    }, 100);
  };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
  }, [baseFilter, handleLoadList]);

  return {
    dispatchFilter,
    modelFilter,
    list,
    loadingList,
    handleLoadList,
    handleResetList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    count,
    translate,
    onSave,
    onCancel,
    loading,
  };
};
