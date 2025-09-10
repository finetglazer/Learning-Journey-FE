import { Button } from "react-components-design-system";
import { isEqual, isUndefined } from "lodash";

import {
  usePaymentConditionMasterHook,
  PaymentConditionContext,
} from "./PaymentConditionMasterHook";

import { LayoutMaster, PageHeader, EmptyData } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { PaymentConditionAction } from "../Components/PaymentConditionAction";
import { PaymentConditionTable } from "../Components/PaymentConditionTable";
import { PaymentConditionDetail } from "../PaymentConditionDetail/PaymentConditionDetail";
import PaymentConditionView from "../PaymentConditionView/PaymentConditionView";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";

export const PaymentConditionMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    isEmptyData,
    ...contextValue
  } = usePaymentConditionMasterHook();
  const { validAction } = contextValue;
  return (
    <PaymentConditionContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_payment_condition")}
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
              <PaymentConditionAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <PaymentConditionTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === "DETAIL" ? (
        <PaymentConditionView
          paymentConditionId={modalType.id}
          dismiss={() => contextValue.handleCloseModal()}
        />
      ) : null}

      {/* Detail Modal */}
      {modalType.type === "CREATE" || modalType.type === "EDIT" ? (
        <PaymentConditionDetail
          paymentConditionId={modalType?.id}
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
          title={translate("PC.txt_delete_title")}
          content={translate("PC.txt_delete_content")}
          handleConfirm={handleDeleteRecord}
          handleCancel={() => contextValue.handleCloseModal()}
        />
      ) : null}
    </PaymentConditionContext.Provider>
  );
};
