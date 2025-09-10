import { type CollapseProps } from "antd";
import { useCallback, useContext, useMemo, useState } from "react";
import { InformationSectionKey } from "models/PurchasingPlan";
import { AdvancedCollapseView } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { isEmpty } from "lodash";
import { TopicType } from "core/models/History";
import styles from "./GenerationInfoTab.module.scss";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { PurchasingPlanBiddingDetailHookContext } from "../../../PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import AttachmentsModal from "pages/PurchasePage/ContractTerminationPage/ContractTerminationView/ContractTerminationInfoView/AttachmentsView/AttachmentsModal";
import AttachmentsView from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/GenerationInfoTab/Components/AttachmentInfo/AttachmentsView";
import BidderInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/BidderInformation";
import PlanServicesInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import GenerationInfo from "../../../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/GenerationInfoTab/Components/GenerationInfo/GenerationInfo";
import BidderInformationTableChildBidding from "../../../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/Components/BidderInformationTableChildBidding/BidderInformationTableChildBidding";

const PurchasePlanBiddingGenerationInfoTabView = () => {
  const [translate] = useTranslation();
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
  const { model, handleChangeListField } = currentContext;
  const [showAttachementsModal, setShowAttachmentsModal] =
    useState<boolean>(false);
  const handleToggleAttachmentsModal = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setShowAttachmentsModal(!showAttachementsModal);
    },
    [showAttachementsModal]
  );

  const renderAttachmentShowMore = () => {
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
  };
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
            {translate("PL.bidding.title.information")}
          </div>
        ),
        children: (
          <BidderInformationTableChildBidding
            contextValue={currentContext}
            isDetail={true}
            isBidderInformation={true}
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
    <div>
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
    </div>
  );
};

export default PurchasePlanBiddingGenerationInfoTabView;
