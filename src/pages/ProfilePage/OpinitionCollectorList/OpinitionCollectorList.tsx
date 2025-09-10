import { LayoutMaster, LoadingCM, PageHeader } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import DetailsOpinionModal from "components/OpinionCollector/Components/DetailsOpinionModal/DetailsOpinionModal";
import FeedbackOpinionModal from "components/OpinionCollector/Components/FeedbackOpinionModal/FeedbackOpinionModal";
import { ModalType } from "components/OpinionCollector/OpinionCollectorHook";
import { isEqual } from "lodash";
import OpinitionCollectorListAction from "./Components/OpinitionCollectorListAction";
import OpinitionCollectorListTable from "./Components/OpinitionCollectorListTable";
import "./OpinitionCollectorList.scss";
import useOpinitionCollectorListHook, {
  OpinitionCollectorListContext,
} from "./OpinitionCollectorListHook";

const OpinitionCollectorList = () => {
  const { breadcrumbs, ...contextValue } = useOpinitionCollectorListHook();

  const {
    modalState,
    isLoadingModal,
    opinionCollectorModel,
    translate,
    loading,
    handleDownloadFileAttached,
    handleCloseModal,
    isSendingForm,
    handleSendFeedbackOpinionTicket,
    handleChangeSingleField,
    handleChangeSelectField,
  } = contextValue;

  const propsDetailModal = {
    isOpen: isEqual(modalState, ModalType.DETAILS),
    isLoadingModal: isLoadingModal,
    opinionCollectorModel: opinionCollectorModel,
    translate: translate,
    handleDownloadFileAttached: handleDownloadFileAttached,
    handleCloseModal: handleCloseModal,
  };

  const propsFeedbackModal = {
    isOpen: isEqual(modalState, ModalType.FEEDBACK_OPINION),
    isLoadingModal: isLoadingModal,
    opinionCollectorModel: opinionCollectorModel,
    translate: translate,
    isSendingForm: isSendingForm,
    handleDownloadFileAttached: handleDownloadFileAttached,
    handleSendFeedbackOpinionTicket: handleSendFeedbackOpinionTicket,
    handleChangeSingleField: handleChangeSingleField,
    handleChangeSelectField: handleChangeSelectField,
    handleCloseModal: handleCloseModal,
  };

  return (
    <>
      <div className="page-content-create page-content page-opinion-collector-list">
        <PageHeader
          title={contextValue.translate("CM.btn_opinion_list")}
          breadcrumbs={breadcrumbs}
          className="page-header"
        />

        <OpinitionCollectorListContext.Provider value={contextValue}>
          <LayoutMaster>
            <OpinitionCollectorListAction />
            <LayoutMasterContent>
              <OpinitionCollectorListTable />
            </LayoutMasterContent>
          </LayoutMaster>
          {propsFeedbackModal.isOpen && (
            <FeedbackOpinionModal {...propsFeedbackModal} />
          )}
          {propsDetailModal.isOpen && (
            <DetailsOpinionModal {...propsDetailModal} />
          )}
        </OpinitionCollectorListContext.Provider>

        {loading && <LoadingCM />}
      </div>
    </>
  );
};

export default OpinitionCollectorList;
