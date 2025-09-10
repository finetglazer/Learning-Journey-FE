import { isEmpty, isEqual, isUndefined, lte } from "lodash";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { WarrantyTypeAction } from "./Components/WarrantyTypeAction";
import { WarrantyTypeTable } from "./Components/WarrantyTypeTable";
import { WarrantyTypeDetail } from "./WarrantyTypeDetail/WarrantyTypeDetail";
import {
  ConfirmModalType,
  useWarrantyTypeMasterHook,
  WarrantyTypeContext,
} from "./WarrantyTypeMasterHooks";
import { WarrantyTypeView } from "./WarrantyTypeView/WarrantyTypeView";

export const WarrantyTypeMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useWarrantyTypeMasterHook();
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
    <WarrantyTypeContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_warranty_type")}
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
              <WarrantyTypeAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <WarrantyTypeTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === ConfirmModalType.DETAIL ? (
        <WarrantyTypeView
          warrantyTypeId={modalType.id}
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
        <WarrantyTypeDetail
          warrantyTypeId={modalType?.id}
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
          title={translate("WT.txt_delete_title")}
          content={translate("WT.txt_delete_content")}
        />
      ) : null}
    </WarrantyTypeContext.Provider>
  );
};
