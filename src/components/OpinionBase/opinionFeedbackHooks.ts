import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import { detailService } from "core/services/page-services/detail-service";
import { opinionCollectorModalService } from "core/services/page-services/opinion-collector-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import { OpinionCollector } from "models/OpinionCollector";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { finalize } from "rxjs";

export const useOpinionFeedbackHooks = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("opinionResponseId");

  return {
    hasFeedBack: !isEmpty(id),
    id,
  };
};

export const useFeedbackOpinionHooks = () => {
  const [translate] = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const { id } = useOpinionFeedbackHooks();

  const handleCloseModal = () => {
    setIsOpen(false);
    document.getElementById(opinionCollectorModel?.topicId)?.click();
  };

  const {
    model: opinionCollectorModel,
    dispatch: dispatchOpinionCollectorModel,
  } = detailService.useModel<OpinionCollector>(OpinionCollector);

  useEffect(() => {
    if (!isEmpty(id)) {
      opinionCollectorRepository
        .getDetailOpinionTicket(id)
        .pipe(finalize(() => setLoadingModal(false)))
        .subscribe({
          next: (response) => {
            dispatchOpinionCollectorModel({
              type: GeneralActionEnum.SET,
              payload: response?.opinion,
            });
          },
          error: () => {
            dispatchOpinionCollectorModel({
              type: GeneralActionEnum.SET,
              payload: {},
            });
          },
        });
    }
  }, [dispatchOpinionCollectorModel, id, isOpen]);

  const {
    isSendingForm,
    handleOpenFeedbackOpinionModal,
    handleSendFeedbackOpinionTicket,
    handleChangeSingleField,
    handleChangeSelectField,
  } = opinionCollectorModalService.useFeedbackModal({
    handleLoadList: undefined,
    setModalState: handleCloseModal,
    dispatchOpinionCollectorModel,
    opinionCollectorModel,
    handleCloseModal: handleCloseModal,
  });

  return {
    translate,
    isOpen,
    isLoadingModal,
    handleCloseModal: handleCloseModal,
    isSendingForm,
    handleOpenFeedbackOpinionModal,
    handleSendFeedbackOpinionTicket,
    handleChangeSingleField,
    handleChangeSelectField,
    opinionCollectorModel,
    setIsOpen,
    handleDownloadFileAttached:
      opinionCollectorModalService.handleDownloadFileAttached,
  };
};
