import { useContext, useState } from "react";
import { finalize } from "rxjs";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";

import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  ClarificationRequestModel,
  DocumentClarificationType,
} from "models/PurchasingPlan";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { handleError } from "core/helpers/handle-error";

export const useClarifyBiddingDocumentsTableHook = () => {
  const {
    translate,
    model: modelMaster,
    clarificationHistorySupplier,
    getClarificationHistorySupplierList,
    handleInitialPlan,
  } = useContext(PurchasingPlanBiddingDetailHookContext);

  const clarificationHistoryList =
    modelMaster?.profileEvaluation?.clarificationHistory || [];

  const [
    selectedClarificationHistoryDetail,
    setSelectedClarificationHistoryDetail,
  ] = useState(null);
  const [clarificationHistoryDetailData, setClarificationHistoryDetailData] =
    useState(null);
  const [
    isOpenAddClarificationRequestModal,
    setIsOpenAddClarificationRequestModal,
  ] = useState(false);

  const [
    isLoadingAddClarificationRequest,
    setIsLoadingAddClarificationRequest,
  ] = useState(false);

  // Hồ sơ mời thầu
  const bidDocumentList =
    clarificationHistoryList?.find(
      (item) => item.type === DocumentClarificationType.BiddingDocument
    )?.clarificationRequests || [];

  const bidDocumentListBySupplier = !isEmpty(clarificationHistorySupplier)
    ? bidDocumentList?.filter(
        (item) => item?.supplier?.id === clarificationHistorySupplier?.id
      )
    : bidDocumentList;

  // Hồ sơ dự thầu
  const bidProposalList =
    clarificationHistoryList?.find(
      (item) => item.type === DocumentClarificationType.BidSubmission
    )?.clarificationRequests || [];

  const bidProposalListBySupplier = !isEmpty(clarificationHistorySupplier)
    ? bidProposalList?.filter(
        (item) => item?.supplier?.id === clarificationHistorySupplier?.id
      )
    : bidProposalList;

  const {
    model: modelClarificationRequest,
    dispatch: dispatchClarificationRequest,
  } = detailService.useModel<ClarificationRequestModel>(
    ClarificationRequestModel
  );

  const {
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeListField,
  } = fieldService.useField(
    modelClarificationRequest,
    dispatchClarificationRequest
  );

  const handleViewClarificationHistoryDetail = (
    clarificationHistoryRecord: ClarificationRequestModel,
    isClarifyBidProposal?: boolean
  ) => {
    if (isEmpty(clarificationHistoryRecord)) return;
    setSelectedClarificationHistoryDetail(clarificationHistoryRecord);
    const detailData = {
      drawerTitle: !isClarifyBidProposal
        ? translate("PL.details_of_bidding_document_clarification")
        : translate("PL.details_of_bid_proposal_clarification"),
      contentTitle: clarificationHistoryRecord?.title,
      classification: clarificationHistoryRecord?.classification,

      dataList: {
        classificationData: [
          {
            label: translate("PL.clarification_content"),
            value: clarificationHistoryRecord?.content,
          },
          {
            label: translate("PL.clarification_submission_date"),
            value: formatDate(
              clarificationHistoryRecord?.createdDate,
              STANDARD_DATE_FORMAT_SLASH
            ),
          },
          {
            label: translate("PL.clarification_file"),
            fileList: clarificationHistoryRecord?.attachments,
          },
          ...(!isClarifyBidProposal
            ? []
            : [
                {
                  label: translate("PL.clarification_submission_person"),
                  value: clarificationHistoryRecord?.user?.name,
                },
              ]),
        ],
        responseData: [
          {
            label: translate("PL.response_content"),
            value: clarificationHistoryRecord?.response?.content,
          },
          {
            label: translate("PL.response_submission_date"),
            value: formatDate(
              clarificationHistoryRecord?.response?.createdDate,
              STANDARD_DATE_FORMAT_SLASH
            ),
          },
          {
            label: translate("PL.response_file"),
            fileList: clarificationHistoryRecord?.response?.attachments,
          },
          ...(isClarifyBidProposal
            ? []
            : [
                {
                  label: translate("PL.txt_review_summary_responder"),
                  value: clarificationHistoryRecord?.response?.createUser,
                },
              ]),
        ],
      },
    };

    setClarificationHistoryDetailData(detailData);
  };

  const handleCloseDrawer = () => {
    setSelectedClarificationHistoryDetail(null);
    setClarificationHistoryDetailData(null);
  };

  const handleOpenClarificationRequestModal = () => {
    setIsOpenAddClarificationRequestModal(true);
  };

  const handleAddClarificationRequest = () => {
    const bodyData = {
      type: DocumentClarificationType.BidSubmission,
      quotationRequestId: modelMaster?.profileEvaluation?.quotationRequestId,
      supplierId: clarificationHistorySupplier?.id,
      classification: modelClarificationRequest?.clarificationRequestTypeId,
      title: modelClarificationRequest?.title,
      content: modelClarificationRequest?.content,
      attachments: modelClarificationRequest?.attachments,
    };

    setIsLoadingAddClarificationRequest(true);

    purchasingPlanRepository
      .addClarificationRequest(bodyData)
      .pipe(
        finalize(() => {
          setIsLoadingAddClarificationRequest(false);
        })
      )
      .subscribe({
        next: () => {
          handleCloseClarificationRequestModal();
          handleInitialPlan();
        },
        error: (error: AxiosError) => {
          handleError<ClarificationRequestModel>({
            model: modelClarificationRequest,
            error,
            handleChangeAllField,
          });
        },
      });
  };

  const handleCloseClarificationRequestModal = () => {
    setIsOpenAddClarificationRequestModal(false);
    handleChangeAllField({});
  };

  return {
    translate,
    modelMaster,
    modelClarificationRequest,
    selectedClarificationHistoryDetail,
    bidDocumentList,
    bidProposalList,
    bidDocumentListBySupplier,
    bidProposalListBySupplier,
    clarificationHistoryDetailData,
    isOpenAddClarificationRequestModal,
    isLoadingAddClarificationRequest,
    clarificationHistorySupplier,
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeListField,
    handleViewClarificationHistoryDetail,
    handleCloseDrawer,
    handleOpenClarificationRequestModal,
    handleAddClarificationRequest,
    handleCloseClarificationRequestModal,
    getClarificationHistorySupplierList,
  };
};
