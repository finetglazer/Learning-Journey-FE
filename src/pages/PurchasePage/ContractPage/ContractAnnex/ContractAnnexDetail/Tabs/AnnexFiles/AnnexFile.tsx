import { AdvancedCollapseView } from "components";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import { DocumentGroup } from "models/Proposal";
import { useMemo } from "react";
import { ModalConfirm } from "react-components-design-system";
import styles from "./AnnexFile.module.scss";
import { AnnexFileContext, useAnnexFileHooks } from "./AnnexFileHooks";
import { AddFileButton } from "./Components/AddFileButton";
import { AddModel } from "./Components/AddModal";
import { EmptyState } from "./Components/EmptyState";
import { FileTable } from "./Components/FileTable";
import { AnnexFileModel } from "./types";

interface AnnexFileProps {
  data?: AnnexFileModel;
  onChange?: (data: DocumentGroup[]) => void;
}

const KEY = "contract-annex-file";

export const AnnexFile = ({ data, onChange }: AnnexFileProps) => {
  const { translate, modalType, deleteMultipleRow, ...contextValue } =
    useAnnexFileHooks(data, onChange);

  const isViewMode = useMemo(() => isEqual(data?.mode, "VIEW"), [data?.mode]);

  const shouldShowAddButton = useMemo(() => {
    // always show button in create/edit and view when status is 2

    if (isViewMode) {
      return isEqual(numberConstants.TWO, data?.status);
    }

    return isEqual(data?.mode, "CREATE") || isEqual(data?.mode, "EDIT");
  }, [data?.mode, data?.status, isViewMode]);

  const makeContent = () => {
    return (
      <>
        {isEmpty(contextValue?.model?.documentGroups) && !isViewMode ? (
          <EmptyState />
        ) : (
          <div className={styles["file-attachment__wrapper"]}>
            {shouldShowAddButton ? (
              <div className={styles["mb-12px"]}>
                <AddFileButton onClick={contextValue.addNewRow} />
              </div>
            ) : null}
            {/* Table */}
            <FileTable />
          </div>
        )}
      </>
    );
  };

  return (
    <AnnexFileContext.Provider value={contextValue}>
      {/* Content */}
      <AdvancedCollapseView
        isFullView
        items={[
          {
            key: KEY,
            label: translate("CA.txt_file_singed"),
            children: makeContent(),
          },
        ]}
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
      {isEqual(modalType, "ADD") ? (
        <AddModel modalTitle={translate("CA.txt_add_new_file")} />
      ) : null}
    </AnnexFileContext.Provider>
  );
};
