import { AdvancedCollapseView } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isEmpty, isNil } from "lodash";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContractPrincipleAppendixViewContext } from "../../../context";
import { AnnexInformation } from "./Components/AnnexInformation";
import { AttachmentsModal } from "./Components/AttachmentsView/AttachmentsModal";
import { AttachmentsView } from "./Components/AttachmentsView/AttachmentsView";
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
  const { model, handleDownloadFileAttached } =
    useContractPrincipleAppendixViewContext();
  const [isShowAttachmentModal, setShowAttachmentModal] =
    useState<boolean>(false);

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
        label: translate("CM.txt_attachment_files"),
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
    ],
    [handleDownloadFileAttached, model, toggleAttachmentModel, translate]
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
            topicType={TopicType.ContractPrincipleAppendix}
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
