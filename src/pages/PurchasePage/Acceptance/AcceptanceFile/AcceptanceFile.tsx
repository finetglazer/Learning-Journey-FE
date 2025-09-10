import CollapseView from "components/Collapse/CollapseView";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import { DocumentGroup } from "models/Proposal";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useMemo } from "react";
import { ModalConfirm } from "react-components-design-system";
import styles from "./AcceptanceFile.module.scss";
import {
  AcceptanceFileContext,
  useAcceptanceFile,
} from "./AcceptanceFileHooks";
import { AddFileButton } from "./Components/AddFileButton";
import { AddModel } from "./Components/AddModal";
import { EmptyState } from "./Components/EmptyState";
import { FileTable } from "./Components/FileTable";
import { AcceptanceFileModel, TopicType } from "./types";

interface AcceptanceFileProps {
  topicType: TopicType;
  title?: string;
  data?: AcceptanceFileModel;
  modalTitle?: string;
  isView?: boolean;
  onChange?: (data: DocumentGroup[]) => void;
}

const KEY = "acceptance-file";

export const AcceptanceFile = ({
  topicType,
  title,
  data,
  modalTitle,
  isView,
  onChange,
}: AcceptanceFileProps) => {
  const { translate, modalType, deleteMultipleRow, ...contextValue } =
    useAcceptanceFile(topicType, data, onChange);

  const contextReceipt = useReceivingGoodsDetailContext();
  const { model: modelReceived } = contextReceipt;

  const isViewMode = isEqual(contextValue?.model?.mode, "VIEW");
  const isEditMode = isEqual(contextValue?.model?.mode, "EDIT");

  const shouldShowAddButton = useMemo(() => {
    if (isView && isEqual(topicType, TopicType.RECEIVING_GOODS)) {
      return false;
    }

    const { status, mode } = contextValue.model || {};

    const GOODS_STATUS = [numberConstants.TWO, numberConstants.ZERO];

    const ACCEPTANCE_STATUS = [numberConstants.ZERO, numberConstants.THREE];

    const arrayStatus = isEqual(topicType, TopicType.ACCEPTANCE)
      ? ACCEPTANCE_STATUS
      : GOODS_STATUS;

    const isWaitingOrApproved = arrayStatus.includes(status);

    const isCreateMode = mode === "CREATE";

    const isAdditionalCondition = isEqual(
      modelReceived?.status,
      numberConstants.TWO
    );

    return (
      ((isWaitingOrApproved || isAdditionalCondition) &&
        (isViewMode || isEditMode)) ||
      isCreateMode
    );
  }, [
    isView,
    contextValue.model,
    topicType,
    modelReceived?.status,
    isViewMode,
    isEditMode,
  ]);

  const makeContent = () => {
    return (
      <>
        {isEmpty(contextValue?.model?.documentGroups) && !isViewMode ? (
          <EmptyState />
        ) : (
          <div className={styles["file-attachment__wrapper"]}>
            {shouldShowAddButton && (
              <div className={styles["mb-12px"]}>
                <AddFileButton onClick={contextValue.addNewRow} />
              </div>
            )}
            {/* Table */}
            <FileTable contextValue={contextReceipt} />
          </div>
        )}
      </>
    );
  };

  return (
    <AcceptanceFileContext.Provider value={contextValue}>
      {/* Content */}
      <CollapseView
        items={[
          {
            key: KEY,
            label: title || translate("AC.txt_signed_acceptance_file"),
            children: makeContent(),
          },
        ]}
        defaultActiveKey={[KEY]}
        isShowTopDivider={false}
      />
      {/* Delete Modal */}
      {isEqual(modalType, "DELETE") ? (
        <ModalConfirm
          open
          title={translate("AC.title_delete_x_record")}
          content={translate("AC.msg_delete_confirm")}
          titleButtonApply={translate("CM.btn_confirm")}
          titleButtonCancel={translate("CM.btn_close")}
          handleCancel={() => contextValue.setModalType("NONE")}
          handleSave={deleteMultipleRow}
        />
      ) : null}
      {isEqual(modalType, "ADD") ? <AddModel modalTitle={modalTitle} /> : null}
    </AcceptanceFileContext.Provider>
  );
};
