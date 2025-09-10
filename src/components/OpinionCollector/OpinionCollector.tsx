import { PlusIcon } from "assets/icons";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import { isEmpty, isEqual } from "lodash";
import { useCallback, useMemo } from "react";
import { Button } from "react-components-design-system";
import CollectOpinionModal from "./Components/CollectOpinionModal/CollectOpinionModal";
import DetailsOpinionModal from "./Components/DetailsOpinionModal/DetailsOpinionModal";
import FeedbackOpinionModal from "./Components/FeedbackOpinionModal/FeedbackOpinionModal";
import OpinionCollectorTable from "./Components/OpinionCollectorTable/OpinionCollectorTable";
import "./OpinionCollector.scss";
import {
  ModalType,
  OpinionCollectorContext,
  OpinionCollectorHookProperties,
  useOpinionCollectorHook,
} from "./OpinionCollectorHook";
import classNames from "classnames";

const PLUS_ICON_SIZE = 16;

export type OpinionCollectorProperties = OpinionCollectorHookProperties & {
  isPage?: boolean;
  isNewLayoutVersion?: boolean;
  disabledButtonOpinion?: boolean;
  hideCollectOpinionTitle?: boolean;
  classNameCollapseView?: string;
};

const OpinionCollector = ({
  topicType,
  topicId,
  opinionType,
  opinionId,
  isPage,
  disabledButtonOpinion,
  hideCollectOpinionTitle = false,
  isNewLayoutVersion = false,
  processAfterFeedbackSubmission,
  classNameCollapseView = "",
}: OpinionCollectorProperties) => {
  const { loadListRef, ...contextProps } = useOpinionCollectorHook({
    topicType,
    topicId,
    opinionType,
    opinionId,
    processAfterFeedbackSubmission,
  });

  const { id } = useOpinionFeedbackHooks();

  const {
    modalState,
    opinionCollectorData,
    translate,
    handleOpenCollectOpinionModal,
  } = contextProps;

  const renderOpinionCollectorSection = useCallback(
    () => (
      <div className="tab_section">
        <div className="section_title">
          {isEqual(hideCollectOpinionTitle, false)
            ? !isNewLayoutVersion && (
                <span>{translate("OC.collect_opinion")}</span>
              )
            : null}

          {!isEmpty(opinionCollectorData) && isEmpty(id) && (
            <Button
              type="secondary"
              className="collect_opinion_button"
              icon={
                <img
                  src={PlusIcon}
                  alt="add-icon"
                  width={PLUS_ICON_SIZE}
                  height={PLUS_ICON_SIZE}
                />
              }
              iconPlace="left"
              disabled={disabledButtonOpinion}
              onClick={handleOpenCollectOpinionModal}
            >
              {translate("OC.add_opinion")}
            </Button>
          )}
        </div>

        <div className="section_body">
          <OpinionCollectorTable
            isPage={isPage}
            disabledButtonOpinion={disabledButtonOpinion}
          />
        </div>
      </div>
    ),
    [
      disabledButtonOpinion,
      handleOpenCollectOpinionModal,
      hideCollectOpinionTitle,
      id,
      isNewLayoutVersion,
      isPage,
      opinionCollectorData,
      translate,
    ]
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: "1",
        label: translate("OC.collect_opinion"),
        children: renderOpinionCollectorSection(),
      },
    ],
    [renderOpinionCollectorSection, translate]
  );

  const detailModalProps = useMemo(
    () => ({
      isOpen: isEqual(contextProps.modalState, ModalType.DETAILS),
      isLoadingModal: contextProps.isLoadingModal,
      opinionCollectorModel: contextProps.opinionCollectorModel,
      translate: contextProps.translate,
      handleDownloadFileAttached: contextProps.handleDownloadFileAttached,
      handleCloseModal: contextProps.handleCloseModal,
    }),
    [contextProps]
  );

  const feedbackModalProps = useMemo(
    () => ({
      isOpen: isEqual(modalState, ModalType.FEEDBACK_OPINION),
      isLoadingModal: contextProps.isLoadingModal,
      opinionCollectorModel: contextProps.opinionCollectorModel,
      translate: contextProps.translate,
      isSendingForm: contextProps.isSendingForm,
      handleDownloadFileAttached: contextProps.handleDownloadFileAttached,
      handleSendFeedbackOpinionTicket:
        contextProps.handleSendFeedbackOpinionTicket,
      handleChangeSingleField: contextProps.handleChangeSingleField,
      handleChangeSelectField: contextProps.handleChangeSelectField,
      handleCloseModal: contextProps.handleCloseModal,
    }),
    [contextProps, modalState]
  );

  return (
    <OpinionCollectorContext.Provider value={contextProps}>
      {isNewLayoutVersion ? (
        <AdvancedCollapseView
          items={itemsCollapse}
          showAll
          isFullView
          className={classNames(
            "opinion_advanced_collapse",
            classNameCollapseView
          )}
        />
      ) : (
        renderOpinionCollectorSection()
      )}

      {isEqual(modalState, ModalType.COLLECT_OPINION) && (
        <CollectOpinionModal />
      )}
      {feedbackModalProps.isOpen && (
        <FeedbackOpinionModal {...feedbackModalProps} />
      )}
      {detailModalProps.isOpen && <DetailsOpinionModal {...detailModalProps} />}
      <button
        className="d-none"
        id={topicId}
        onClick={() => loadListRef?.current()}
      />
    </OpinionCollectorContext.Provider>
  );
};

export default OpinionCollector;
