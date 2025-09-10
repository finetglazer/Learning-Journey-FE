import { TableRowSelection } from "antd/lib/table/interface";
import { ModalType } from "components/OpinionCollector/OpinionCollectorHook";
import { listTypeEnumStatusResponse } from "config/const";
import { APP_OVERVIEW } from "config/route-const";
import { numberConstants } from "core/config/consts";
import { detailService } from "core/services/page-services/detail-service";
import { listService } from "core/services/page-services/list-service";
import { opinionCollectorModalService } from "core/services/page-services/opinion-collector-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, GeneralActionEnum } from "core/services/service-types";
import { isEqual } from "lodash";
import { OpinionCollector } from "models/OpinionCollector";
import { OpinionFeedback } from "models/OpinionCollectorList/OpinionCollectorList";
import { OpinionCollectorListFilter } from "models/OpinionCollectorList/OpinionCollectorListFilter";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { profileRepository } from "../ProfileRepository";

type StatusResponse = (typeof listTypeEnumStatusResponse)[number];

export interface OpinitionCollectorList {
  modelFilter: OpinionCollectorListFilter;
  list: OpinionFeedback[];
  count: number;
  modalState?: ModalType;
  loadingModal: boolean;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<OpinionCollectorListFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: OpinionCollectorListFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<OpinionFeedback>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  getTagStatus: (status?: number) => StatusResponse;
  handleOpenFeedbackOpinionModal: (opinionFeedback: OpinionFeedback) => void;
  handleOpenDetailOpinionTicket: (idOpinion: string) => void;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

export const OpinitionCollectorListContext =
  createContext<OpinitionCollectorList>({
    modelFilter: new OpinionCollectorListFilter(),
    list: [],
    count: numberConstants.ZERO,
    loadingModal: false,
    loadingList: false,
    dispatchFilter: null,
    countFilter: numberConstants.ZERO,
    handleLoadList: null,
    handleResetList: null,
    rowSelection: null,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    getTagStatus: null,
    handleOpenFeedbackOpinionModal: null,
    handleOpenDetailOpinionTicket: null,
  });

const useOpinitionCollectorListHook = () => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const breadcrumbs = useMemo(
    () => [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.btn_opinion_list"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      OpinionCollectorListFilter,
      {
        ...new OpinionCollectorListFilter(),
        opinionTypeValue: {
          id: numberConstants.ZERO,
          name: translate("OC.txt_all"),
        },
        pageIndex: numberConstants.ONE,
        pageSize: numberConstants.TEN,
      },
      ["search"]
    );

  const baseFilter = useMemo(() => {
    return {
      ...new OpinionCollectorListFilter(),
      opinionTypeValue: {
        id: numberConstants.ZERO,
        name: translate("OC.txt_all"),
      },
      pageIndex: numberConstants.ONE,
      search: modelFilter?.search,
    };
  }, [modelFilter?.search, translate]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<OpinionFeedback, OpinionCollectorListFilter>(
      profileRepository.getOpinionList,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  useEffect(() => {
    handleLoadList();
  }, []);

  const getTagStatus = useCallback((status?: number) => {
    const statusItem = listTypeEnumStatusResponse.find((item) =>
      isEqual(item.id, status)
    );

    return statusItem || listTypeEnumStatusResponse[numberConstants.ZERO];
  }, []);

  const [modalState, setModalState] = useState<ModalType>(ModalType.CLOSE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const {
    model: opinionCollectorModel,
    dispatch: dispatchOpinionCollectorModel,
  } = detailService.useModel<OpinionCollector>(OpinionCollector);

  const history = useHistory();

  const handleCloseModal = () => {
    setModalState(ModalType.CLOSE);
    dispatchOpinionCollectorModel({
      type: GeneralActionEnum.SET,
      payload: {},
    });

    const params = new URLSearchParams(history.location.search);
    params.delete("opinionType");
    params.delete("opinionId");
    history.replace({
      pathname: history.location.pathname,
      search: params.toString(),
    });
  };

  const { handleOpenDetailOpinionTicket } =
    opinionCollectorModalService.useDetailModal({
      setModalState,
      setLoadingModal,
      dispatchOpinionCollectorModel,
    });

  const {
    isSendingForm,
    handleSendFeedbackOpinionTicket,
    handleChangeSingleField,
    handleChangeSelectField,
    handleOpenFeedbackOpinionModal,
  } = opinionCollectorModalService.useFeedbackModal({
    handleLoadList,
    setModalState,
    dispatchOpinionCollectorModel,
    opinionCollectorModel,
    handleCloseModal,
  });

  return {
    list,
    countFilter,
    translate,
    loading,
    breadcrumbs,
    modelFilter,
    count,
    modalState,
    loadingList,
    isLoadingModal,
    opinionCollectorModel,
    dispatchFilter,
    handleResetList,
    handleLoadList,
    getTagStatus,
    handleOpenDetailOpinionTicket,
    handleCloseModal,
    handleDownloadFileAttached:
      opinionCollectorModalService.handleDownloadFileAttached,
    isSendingForm,
    handleSendFeedbackOpinionTicket,
    handleOpenFeedbackOpinionModal,
    handleChangeSingleField,
    handleChangeSelectField,
    setLoading,
  };
};

export default useOpinitionCollectorListHook;
