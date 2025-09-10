import { type CollapseProps } from "antd";
import GenerationInfo from "./Components/GenerationInfo/GenerationInfo";
import { useCallback, useContext, useMemo, useState } from "react";
import { InformationSectionKey } from "models/PurchasingPlan";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { AdvancedCollapseView } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { isEmpty } from "lodash";
import { TopicType } from "core/models/History";
import styles from "./GenerationInfoTab.module.scss";
import PlanServicesInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import { useTranslation } from "react-i18next";
import BidderInformation from "../../../PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/BidderInformation";
import AttachmentsView from "./Components/AttachmentInfo/AttachmentsView";
import AttachmentsModal from "../../../../ContractTerminationPage/ContractTerminationView/ContractTerminationInfoView/AttachmentsView/AttachmentsModal";
import classNames from "classnames";
import BidderInformationTableChildBidding from "../../../PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/Components/BidderInformationTableChildBidding/BidderInformationTableChildBidding";

const GenerationInfoTabView = () => {
  const [t] = useTranslation();
  const currentContext = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const { translate = t, model, handleChangeListField } = currentContext;
  const [showAttachementsModal, setShowAttachmentsModal] =
    useState<boolean>(false);
  const handleToggleAttachmentsModal = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setShowAttachmentsModal(!showAttachementsModal);
    },
    [showAttachementsModal]
  );

  const renderAttachmentShowMore = useCallback(() => {
    if (model?.attachments?.length <= 8) {
      return <></>;
    }

    return (
      <div
        className={classNames(styles["btn-more"])}
        onClick={handleToggleAttachmentsModal}
      >
        {translate("contractTermination.show_more")}
      </div>
    );
  }, [handleToggleAttachmentsModal, model?.attachments?.length, translate]);

  const collapseItems: CollapseProps["items"] = useMemo(
    () => [
      {
        key: InformationSectionKey.PLAN_SERVICES_INFORMATION,
        label: (
          <div className="fw-bold">
            {translate("PL.purchasing_plan_goods_services")}
          </div>
        ),
        children: (
          <PlanServicesInformation
            contextValue={currentContext}
            isView={true}
          />
        ),
      },
      {
        key: InformationSectionKey.INVITATION_BIDDING,
        label: (
          <div className="fw-bold">
            {translate("PL.competitive_offer.title.information")}
          </div>
        ),
        children: (
          <BidderInformationTableChildBidding
            contextValue={currentContext}
            isDetail={true}
            isBidderInformation={false}
            handleChangeSingleField={currentContext?.handleChangeSingleField}
          />
        ),
      },
      {
        key: InformationSectionKey.ATTACHMENT,
        extra: renderAttachmentShowMore(),
        label: (
          <div className="fw-bold">{translate("CM.txt_attachment_files")}</div>
        ),
        children: <AttachmentsView context={currentContext} />,
      },
    ],
    [currentContext, renderAttachmentShowMore, translate]
  );

  return (
    <>
      <GenerationInfo contextValue={currentContext} />
      <AdvancedCollapseView
        items={collapseItems}
        defaultActiveKey={[
          InformationSectionKey.ATTACHMENT,
          InformationSectionKey.INVITATION_BIDDING,
          InformationSectionKey.PLAN_SERVICES_INFORMATION,
          InformationSectionKey.SUPPLIER_INFORMATION,
        ]}
      />
      <div className={styles["comment-container"]}>
        {!isEmpty(model?.id) && (
          <Comments
            isNewLayoutVersion
            topicType={TopicType.PurchasingPlanCompetitiveOffer}
            topicId={model?.id}
          />
        )}
      </div>
      <AttachmentsModal
        isOpen={showAttachementsModal}
        handleClose={() => setShowAttachmentsModal(false)}
        attachments={model?.attachments || []}
        handleDownloadFileAttached={currentContext?.handleDownloadFileAttached}
      />
    </>
  );
};

export default GenerationInfoTabView;
