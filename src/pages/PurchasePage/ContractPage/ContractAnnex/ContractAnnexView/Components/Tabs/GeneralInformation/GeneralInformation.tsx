import { Tooltip } from "antd";
import { AdvancedCollapseView } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isEmpty, isNil } from "lodash";
import GoodsService from "pages/PurchasePage/ContractPage/ContractAnnex/Components/GoodsService/GoodsService";
import { Terms } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/Terms";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContractAnnexViewContext } from "../../../context";
import { AnnexInformation } from "./Components/AnnexInformation";
import { AttachmentsModal } from "./Components/AttachmentsView/AttachmentsModal";
import { AttachmentsView } from "./Components/AttachmentsView/AttachmentsView";
import { DeliveryInformation } from "./Components/DeliveryInformation";
import { ServicesInformation } from "./Components/ServicesInformation";
import styles from "./GeneralInformation.module.scss";

enum CollapseKey {
  Grounds = "Grounds",
  GoodsServicesChange = "GoodsServicesChange",
  Delivery = "ReceiverInformation",
  Attachment = "Attachment",
}

export const GeneralInformation = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached } = useContractAnnexViewContext();
  const [isShowAttachmentModal, setShowAttachmentModal] =
    useState<boolean>(false);

  const makeCollapseTitle = useCallback(
    (type: CollapseKey, haveWarning?: boolean) => {
      let key = "";
      switch (type) {
        case CollapseKey.Grounds:
          key = "CA.txt_grounds";
          break;
        case CollapseKey.GoodsServicesChange:
          key = "CA.txt_goods_services_change_information";
          break;
        case CollapseKey.Delivery:
          key = "CA.txt_delivery_information";
          break;
        case CollapseKey.Attachment:
          key = "CM.txt_attachment_files";
          break;
        default:
          key = null;
          break;
      }

      return (
        <div className={styles["collapse-title"]}>
          {translate(key)}
          {haveWarning ? (
            <Tooltip title={translate("CA.txt_adjusted")} placement="topLeft">
              <div className={styles["size-24"]}>
                <WarningCircleIcon />
              </div>
            </Tooltip>
          ) : null}
        </div>
      );
    },
    [translate]
  );

  const toggleAttachmentModel = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setShowAttachmentModal(!isShowAttachmentModal);
    },
    [isShowAttachmentModal]
  );

  const items = useMemo(
    () => [
      // Attachments
      {
        key: CollapseKey.Attachment,
        label: makeCollapseTitle(
          CollapseKey.Attachment,
          model?.isAdjustedAttachment
        ),
        extra: isEmpty(model?.attachments) ? null : (
          <div
            className={styles["btn-see-more"]}
            onClick={toggleAttachmentModel}
          >
            {translate("CM.txt_show_more")}
          </div>
        ),
        children: (
          <AttachmentsView
            files={model?.attachments}
            handleDownloadFileAttached={handleDownloadFileAttached}
          />
        ),
      },
      // Grounds
      {
        key: CollapseKey.Grounds,
        label: makeCollapseTitle(CollapseKey.Grounds),
        children: <Terms data={model?.relatedSlipInfos} />,
      },
      // Goods Services
      // Delivery information
      {
        key: CollapseKey.Delivery,
        label: makeCollapseTitle(
          CollapseKey.Delivery,
          model?.isAdjustedReceiveInfo
        ),
        children: <DeliveryInformation />,
      },
      {
        key: CollapseKey.GoodsServicesChange,
        label: makeCollapseTitle(
          CollapseKey.GoodsServicesChange,
          model?.isAdjustedGoodsItem
        ),
        children: <GoodsService model={model} isEdit={false} />,
      },
      // Comments
    ],
    [
      handleDownloadFileAttached,
      makeCollapseTitle,
      model,
      toggleAttachmentModel,
      translate,
    ]
  );

  return (
    <div className={styles["general-information__wrapper"]}>
      <AnnexInformation />
      <ServicesInformation />
      <AdvancedCollapseView isFullView items={items} />

      {isNil(model?.id) ? null : (
        <>
          <Comments
            isNewLayoutVersion
            topicId={model?.id}
            topicType={TopicType.ContractAnnex}
          />
        </>
      )}
      <AttachmentsModal
        visible={isShowAttachmentModal}
        files={model?.attachments}
        handleClose={() => setShowAttachmentModal(false)}
        handleDownloadFileAttached={handleDownloadFileAttached}
      />
    </div>
  );
};
