import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { listFeedbackOpinionStatusEnum } from "config/const";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import {
  ConfigField,
  FieldValue,
  GeneralActionEnum,
} from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import saveAs from "file-saver";
import type { TFunction } from "i18next";
import { isEmpty, isEqual } from "lodash";
import {
  FileModelExtend,
  ListOpinionFilter,
  OpinionCollector,
} from "models/OpinionCollector";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { RootState } from "rtk";
import { useAppSelector } from "rtk/useRedux";
import { finalize } from "rxjs";
import { DATE_FORMAT } from "./Components/CollectOpinionModal/CollectOpinionModal";
import { opinionCollectorRepository } from "./OpinionCollectorRepository";

export enum ModalType {
  COLLECT_OPINION,
  FEEDBACK_OPINION,
  DETAILS,
  CLOSE,
}

export interface OpinionCollectorContextType {
  opinionCollectorData: OpinionCollector[];
  totalOpinionCollector?: number;
  opinionCollectorLoading?: boolean;
  modalState?: ModalType;
  opinionCollectorModel: OpinionCollector;
  translate?: TFunction<"translation", undefined>;
  isSendingForm?: boolean;
  isLoadingModal?: boolean;
  setModalState?: Dispatch<SetStateAction<ModalType>>;
  handleOpenCollectOpinionModal?: () => void;
  handleOpenFeedbackOpinionModal?: (selectedOpinion: OpinionCollector) => void;
  handleOpenDetailOpinionTicket?: (record: OpinionCollector) => void;
  handleCloseModal?: () => void;
  handleSendOpinionCollectorTicket?: () => void;
  handleSendFeedbackOpinionTicket?: () => void;
  handleDownloadFileAttached?: (file?: FileModelExtend) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeMultipleSelectField?: (
    config: ConfigField
  ) => (values: Model[]) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeBoolField?: (config: ConfigField) => (value: boolean) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
}

export interface OpinionCollectorHookProperties {
  topicType: number;
  topicId: string;
  opinionType?: string;
  opinionId?: string;
  processAfterFeedbackSubmission?: () => void;
}

export const getTagStatus = (status?: Model | number) => {
  const statusItem = listFeedbackOpinionStatusEnum.find((item) =>
    isEqual(item.id, status)
  );

  return statusItem?.code || "DEFAULT";
};

export const formatDateTimeToVietnamTimezone = (date?: Dayjs | string) => {
  if (!date) {
    return null;
  }

  return dayjs(date).add(7, "hour").format(DATE_FORMAT[0]);
};

export const OpinionCollectorContext =
  createContext<OpinionCollectorContextType>({
    opinionCollectorData: [],
    opinionCollectorModel: new OpinionCollector(),
  });

export const useOpinionCollectorHook = ({
  topicType,
  topicId,
  opinionType,
  opinionId,
  processAfterFeedbackSubmission,
}: OpinionCollectorHookProperties) => {
  const [translate] = useTranslation();

  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const currentUser = useAppSelector(
    (state: RootState) => state?.profile?.account
  );

  const {
    list: opinionCollectorData,
    count: totalOpinionCollector,
    loadingList: opinionCollectorLoading,
    handleLoadList,
  } = listService.useList<OpinionCollector, ListOpinionFilter>(
    (filter) =>
      opinionCollectorRepository.getList({ ...filter, topicType, topicId }),
    {},
    undefined,
    () => ({})
  );

  const {
    model: opinionCollectorModel,
    dispatch: dispatchOpinionCollectorModel,
  } = detailService.useModel<OpinionCollector>(OpinionCollector);

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeAllField,
  } = fieldService.useField(
    opinionCollectorModel,
    dispatchOpinionCollectorModel
  );

  const loadListRef =
    useRef<
      (filterParam?: ListOpinionFilter, isOverrideFilter?: boolean) => void
    >(handleLoadList);

  const [modalState, setModalState] = useState<ModalType>(ModalType.CLOSE);
  const [isSendingForm, setSendingForm] = useState<boolean>(false);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const canOpenFeedbackModal = useCallback(
    (record: OpinionCollector): boolean => {
      if (
        !isEqual(record?.responseStatus, -1) &&
        isEqual(currentUser.email, record?.responseByDetail?.email)
      ) {
        return true;
      }

      return false;
    },
    [currentUser]
  );

  const handleOpenCollectOpinionModal = () =>
    setModalState(ModalType.COLLECT_OPINION);

  const handleOpenFeedbackOpinionModal = useCallback(
    (selectedOpinion: OpinionCollector) => {
      dispatchOpinionCollectorModel({
        type: GeneralActionEnum.SET,
        payload: selectedOpinion,
      });
      setModalState(ModalType.FEEDBACK_OPINION);
    },
    [dispatchOpinionCollectorModel, setModalState]
  );

  const handleOpenDetailOpinionTicket = useCallback(
    (record: OpinionCollector) => {
      setModalState(ModalType.DETAILS);
      setLoadingModal(true);

      opinionCollectorRepository
        .getDetailOpinionTicket(record.id)
        .pipe(finalize(() => setLoadingModal(false)))
        .subscribe({
          next: (response) => {
            dispatchOpinionCollectorModel({
              type: GeneralActionEnum.SET,
              payload: {
                opinion: response?.opinion,
                opinionResponses: response?.opinionResponses,
              },
            });
          },
          error: () => {
            dispatchOpinionCollectorModel({
              type: GeneralActionEnum.SET,
              payload: {},
            });
          },
        });
    },
    [setModalState, setLoadingModal, dispatchOpinionCollectorModel]
  );

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
      state: { ...(history.location.state as Record<string, unknown>) },
    });
  };

  const handleSendOpinionCollectorTicket = () => {
    setSendingForm(true);

    const body = {
      title: opinionCollectorModel?.title,
      responseBys: opinionCollectorModel?.responseBysId,
      responseDueDate: opinionCollectorModel?.responseDueDate
        ? dayjs(opinionCollectorModel.responseDueDate).toDate().toISOString()
        : undefined,
      isRequired: opinionCollectorModel?.isRequired ? true : false,
      topicId,
      topicType,
    };

    opinionCollectorRepository
      .createOpinionCollector(body)
      .pipe(finalize(() => setSendingForm(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          loadListRef.current();
          if (processAfterFeedbackSubmission) {
            processAfterFeedbackSubmission();
          }
        },
        error: (error: AxiosError) => {
          handleError({
            model: opinionCollectorModel,
            error,
            handleChangeAllField,
          });
        },
      });
  };

  const handleSendFeedbackOpinionTicket = () => {
    setSendingForm(true);

    const body = {
      opinionId: opinionCollectorModel?.id,
      status: opinionCollectorModel?.statusId,
      responseContent: opinionCollectorModel?.responseContent,
      opinionResponseAttachments:
        opinionCollectorModel?.opinionResponseAttachments,
    };

    opinionCollectorRepository
      .feedbackOpinionTicket(body)
      .pipe(finalize(() => setSendingForm(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          loadListRef.current();
          if (processAfterFeedbackSubmission) {
            processAfterFeedbackSubmission();
          }
        },
        error: (error: AxiosError) => {
          if (
            error?.response?.status === 404 &&
            !isEmpty(error?.response?.data?.message)
          ) {
            notifyToast({
              type: "error",
              message: error?.response?.data?.message,
            });
          }

          handleError({
            model: opinionCollectorModel,
            error,
            handleChangeAllField,
          });
        },
      });
  };

  const handleDownloadFileAttached = (file?: FileModelExtend) => {
    if (!file) return;

    opinionCollectorRepository.downloadFile(file.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], { type: file?.contentType });

        if (isEqual(file?.contentType, "application/pdf")) {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, "_blank");
        } else {
          saveAs(blob, file.name);
        }
      },
    });
  };

  useEffect(() => {
    loadListRef.current();
  }, [topicType, topicId]);

  useEffect(() => {
    if (
      opinionType &&
      opinionId &&
      !opinionCollectorLoading &&
      opinionCollectorData.length > 0
    ) {
      const selectedOpinion = opinionCollectorData.find((opinion) =>
        isEqual(opinion?.id, opinionId)
      );
      if (selectedOpinion) {
        if (opinionType === "0") {
          if (canOpenFeedbackModal(selectedOpinion)) {
            handleOpenFeedbackOpinionModal(selectedOpinion);
          } else {
            const params = new URLSearchParams(history.location.search);
            params.delete("opinionType");
            params.delete("opinionId");
            history.replace({
              pathname: history.location.pathname,
              search: params.toString(),
              state: { ...(history.location.state as Record<string, unknown>) },
            });
          }
        } else if (opinionType === "1") {
          handleOpenDetailOpinionTicket(selectedOpinion);
        }
      }
    }
  }, [
    opinionType,
    opinionId,
    history,
    opinionCollectorData,
    opinionCollectorLoading,
    handleOpenDetailOpinionTicket,
    handleOpenFeedbackOpinionModal,
    canOpenFeedbackModal,
  ]);

  return {
    translate,
    modalState,
    opinionCollectorData,
    totalOpinionCollector,
    opinionCollectorLoading,
    opinionCollectorModel,
    isSendingForm,
    isLoadingModal,
    setModalState,
    handleOpenCollectOpinionModal,
    handleOpenFeedbackOpinionModal,
    handleOpenDetailOpinionTicket,
    handleCloseModal,
    handleSendOpinionCollectorTicket,
    handleSendFeedbackOpinionTicket,
    handleDownloadFileAttached,
    handleChangeSingleField,
    handleChangeMultipleSelectField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeSelectField,
    loadListRef,
  };
};
