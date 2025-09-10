import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { CollapseItem } from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "../../ContractTerminationDetail/ContractTerminationDetailHook";
import AssetInfoView from "./AssetInfoView/AssetInfoView";
import AttachmentsModal from "./AttachmentsView/AttachmentsModal";
import AttachmentsView from "./AttachmentsView/AttachmentsView";
import "./ContractTerminationInfoView.scss";
import GenerationInfoView from "./GenerationInfoView/GenerationInfoView";
import PolicyInfoView from "./PolicyInfoView/PolicyInfoView";

enum InformationSectionKey {
  GENERATION_INFORMATION = "GENERATION_INFORMATION",
  PAYMENT_SPREED = "PAYMENT_SPREED",
  ASSET_FORMATION_VALUE = "ASSET_FORMATION_VALUE",
}

const ContractTerminationInfoView = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached } = useContext(
    ContractTerminationDetailHookContext
  );
  const [showAttachementsModal, setShowAttachmentsModal] =
    useState<boolean>(false);

  const handleToggleAttachmentsModal = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setShowAttachmentsModal(!showAttachementsModal);
    },
    [showAttachementsModal]
  );

  const renderAttachmentShowmore = () => {
    if (model?.attachments?.length <= 0) {
      return <></>;
    }

    return (
      <div className="btn-more" onClick={handleToggleAttachmentsModal}>
        {translate("contractTermination.show_more")}
      </div>
    );
  };

  const itemsCollapse = useMemo<CollapseItem[]>(
    () => [
      {
        key: InformationSectionKey.GENERATION_INFORMATION,
        label: translate("contractTermination.attachment_title"),
        extra: renderAttachmentShowmore(),
        children: (
          <div className={classNames("p-t--3xs")}>
            <AttachmentsView />
          </div>
        ),
      },
      {
        key: InformationSectionKey.PAYMENT_SPREED,
        label: translate("contractTermination.policy_title"),
        children: <PolicyInfoView />,
      },
      {
        key: InformationSectionKey.ASSET_FORMATION_VALUE,
        label: translate(
          "contractTermination.contract_amout_and_payment_title"
        ),
        children: <AssetInfoView />,
      },
    ],
    [handleToggleAttachmentsModal, translate, model?.attachments]
  );

  return (
    <div className={"contract-termination-view collapse--title_custom"}>
      <div className="px-3 pb-3">
        <div></div>
      </div>
      <div className="px-3">
        <GenerationInfoView />
      </div>
      <AdvancedCollapseView items={itemsCollapse} />
      <div className="px-3 pb-3">
        <Comments
          isNewLayoutVersion
          topicType={TOPIC_TYPE.CONTRACT_LIQUIDATION}
          topicId={model?.id}
        />
      </div>

      <AttachmentsModal
        isOpen={showAttachementsModal}
        handleClose={() => setShowAttachmentsModal(false)}
        attachments={model?.attachments || []}
        handleDownloadFileAttached={handleDownloadFileAttached}
      />
    </div>
  );
};

export default ContractTerminationInfoView;
