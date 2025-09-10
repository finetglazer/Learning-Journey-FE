import { Button } from "react-components-design-system";
import { isEqual, isUndefined } from "lodash";

import {
  useCentralPurchaseUnitMasterHook,
  CentralPurchaseUnitContext,
} from "./CentralPurchaseUnitMasterHook";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { CentralPurchaseUnitAction } from "../Components/CentralPurchaseUnitAction";
import { CentralPurchaseUnitTable } from "../Components/CentralPurchaseUnitTable";
import { CentralPurchaseUnitDetail } from "../CentralPurchaseUnitDetail/CentralPurchaseUnitDetail";
import CentralPurchaseUnitView from "../CentralPurchaseUnitView/CentralPurchaseUnitView";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";

export const CentralPurchaseUnitMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    isEmptyData,
    ...contextValue
  } = useCentralPurchaseUnitMasterHook();
  const { validAction } = contextValue;

  return (
    <CentralPurchaseUnitContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_central_purchase_unit")}
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
                onClick={contextValue.handleAddNew}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <CentralPurchaseUnitAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CentralPurchaseUnitTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === "DETAIL" ? (
        <CentralPurchaseUnitView
          centralPurchaseUnitId={modalType.id}
          dismiss={() => contextValue.handleCloseModal()}
        />
      ) : null}

      {/* Detail Modal */}
      {modalType.type === "CREATE" || modalType.type === "EDIT" ? (
        <CentralPurchaseUnitDetail
          centralPurchaseUnitId={modalType?.id}
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.handleCloseModal();
          }}
        />
      ) : null}

      {/* Confirm delete modal */}
      {modalType.type === "DELETE" ? (
        <DeleteRecordModal
          open
          loading={isLoadingModal}
          title={translate("CPU.txt_delete_title")}
          content={translate("CPU.txt_delete_content")}
          handleConfirm={handleDeleteRecord}
          handleCancel={() => contextValue.handleCloseModal()}
        />
      ) : null}
    </CentralPurchaseUnitContext.Provider>
  );
};
