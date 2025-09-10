import { isEmpty, isEqual, isUndefined, lte } from "lodash";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { DocumentTypeDetail } from "./DocumentTypeDetail/DocumentTypeDetail";
import {
  DocumentTypeContext,
  ConfirmModalType,
  useDocumentTypeMasterHook,
} from "./DocumentTypeMasterHooks";
import { DocumentTypeAction } from "./Components/DocumentTypeAction";
import { DocumentTypeTable } from "./Components/DocumentTypeTable";
import { DocumentTypeView } from "./DocumentTypeView/DocumentTypeView";

export const DocumentTypeMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useDocumentTypeMasterHook();
  const { validAction } = contextValue;
  const isEmptyData = () => {
    if (isEmpty(contextValue?.modelFilter?.search)) {
      return (
        isEmpty(contextValue?.list) &&
        lte(contextValue?.countFilter, numberConstants.ZERO)
      );
    }

    return false;
  };

  const handleAddNew = () =>
    contextValue.setModalType({ type: ConfirmModalType.CREATE });

  return (
    <DocumentTypeContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_document_type")}
          breadcrumbs={breadcrumb}
          hasTabs={false}
        />

        {isEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("CM.message_empty_data") +
                    translate("CM.let_add_new")
                  }`
                : translate("CM.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={handleAddNew}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <DocumentTypeAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <DocumentTypeTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === ConfirmModalType.DETAIL ? (
        <DocumentTypeView
          documentTypeId={modalType.id}
          dismiss={() =>
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            })
          }
        />
      ) : null}

      {/* Detail Modal */}
      {modalType.type === ConfirmModalType.CREATE ||
      modalType.type === ConfirmModalType.EDIT ? (
        <DocumentTypeDetail
          documentTypeId={modalType?.id}
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            });
          }}
        />
      ) : null}

      {/* Confirm delete modal */}
      {modalType.type === ConfirmModalType.DELETE ? (
        <DeleteRecordModal
          open
          loading={isLoadingModal}
          handleConfirm={handleDeleteRecord}
          handleCancel={() =>
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            })
          }
          title={translate("CG.txt_delete_title")}
          content={translate("CG.txt_delete_content")}
        />
      ) : null}
    </DocumentTypeContext.Provider>
  );
};
