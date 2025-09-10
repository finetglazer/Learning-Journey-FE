import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { ModalType } from "components/OpinionCollector/OpinionCollectorHook";
import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import { handleError } from "core/helpers/handle-error";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import saveAs from "file-saver";
import { isEmpty, isEqual } from "lodash";
import {
  FileModelExtend,
  ListOpinionFilter,
  OpinionCollector,
} from "models/OpinionCollector";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { finalize } from "rxjs";
import { fieldService } from "./field-service";
import { OpinionCollectorListFilter } from "models/OpinionCollectorList/OpinionCollectorListFilter";
import appMessageService from "../common-services/app-message-service";

interface OpinionCollectorDetailService {
  setLoadingModal: Dispatch<SetStateAction<boolean>>;
  setModalState: Dispatch<SetStateAction<ModalType>>;
  dispatchOpinionCollectorModel: Dispatch<GeneralAction<OpinionCollector>>;
}

interface OpinionCollectorFeedbackService {
  handleLoadList: (
    filterParam?: OpinionCollectorListFilter,
    isOverrideFilter?: boolean
  ) => void;
  setModalState: Dispatch<SetStateAction<ModalType>>;
  dispatchOpinionCollectorModel: Dispatch<GeneralAction<OpinionCollector>>;
  opinionCollectorModel: OpinionCollector;
  handleCloseModal: () => void;
}

export const opinionCollectorModalService = {
  /**
   * react hook for control opinion collector detail modal
   * @param: setModalState: Dispatch<SetStateAction<ModalType>>
   * @param: setLoadingModal: Dispatch<SetStateAction<boolean>>
   * @param: dispatchOpinionCollectorModel: Dispatch<GeneralAction<OpinionCollector>>
   * @return: { handleOpenDetailOpinionTicket }
   * */
  useDetailModal({
    setModalState,
    setLoadingModal,
    dispatchOpinionCollectorModel,
  }: OpinionCollectorDetailService) {
    const handleOpenDetailOpinionTicket = useCallback(
      (idOpinion: string) => {
        setModalState(ModalType.DETAILS);
        setLoadingModal(true);

        opinionCollectorRepository
          .getDetailOpinionTicket(idOpinion)
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
      [dispatchOpinionCollectorModel, setLoadingModal, setModalState]
    );

    return {
      handleOpenDetailOpinionTicket,
    };
  },

  /**
   * react hook for control opinion collector feedback modal
   * @param: handleLoadList: (filterParam?: OpinionCollectorListFilter, isOverrideFilter?: boolean) => void
   * @param: setModalState: Dispatch<SetStateAction<ModalType>>
   * @param: dispatchOpinionCollectorModel: Dispatch<GeneralAction<OpinionCollector>>
   * @param: opinionCollectorModel: OpinionCollector
   * @param: handleCloseModal: () => void
   * @return: { isSendingForm, handleOpenFeedbackOpinionModal, handleSendFeedbackOpinionTicket, handleChangeSingleField, handleChangeSelectField, }
   * */
  useFeedbackModal({
    handleLoadList,
    dispatchOpinionCollectorModel,
    opinionCollectorModel,
    handleCloseModal,
    setModalState,
  }: OpinionCollectorFeedbackService) {
    const [isSendingForm, setSendingForm] = useState<boolean>(false);
    const { notifyToast } = appMessageService.useCRUDMessage();
    const loadListRef =
      useRef<
        (filterParam?: ListOpinionFilter, isOverrideFilter?: boolean) => void
      >(handleLoadList);

    const {
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeAllField,
    } = fieldService.useField(
      opinionCollectorModel,
      dispatchOpinionCollectorModel
    );

    const handleSendFeedbackOpinionTicket = () => {
      setSendingForm(true);
      const body = {
        opinionId:
          opinionCollectorModel?.id || opinionCollectorModel?.opinion?.id,
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

    return {
      isSendingForm,
      handleOpenFeedbackOpinionModal,
      handleSendFeedbackOpinionTicket,
      handleChangeSingleField,
      handleChangeSelectField,
    };
  },

  handleDownloadFileAttached(file?: FileModelExtend) {
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
  },
};
