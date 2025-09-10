import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual, isUndefined, lte } from "lodash";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { SpecializedBankAction } from "./Components/SpecializedBankAction";
import { SpecializedBankTable } from "./Components/SpecializedBankTable";
import "./SpecializedBank.scss";
import { SpecializedBankDetail } from "./SpecializedBankDetail/SpecializedBankDetail";
import {
  SpecializedBankContext,
  useSpecializedBankMasterHooks,
} from "./SpecializedBankMasterHooks";
import { SpecializedBankView } from "./SpecializedBankView/SpecializedBankView";

export const SpecializedBankMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useSpecializedBankMasterHooks();

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

  const handleAddNew = () => contextValue.setModalType({ type: "CREATE" });

  return (
    <SpecializedBankContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_specialized_bank")}
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
              <SpecializedBankAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SpecializedBankTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      {/* View Modal */}
      {modalType.type === "DETAIL" ? (
        <SpecializedBankView
          specialBankId={modalType.id}
          dismiss={() =>
            contextValue.setModalType({ type: "NONE", id: undefined })
          }
        />
      ) : null}
      {/* Detail Modal */}
      {modalType.type === "CREATE" || modalType.type === "EDIT" ? (
        <SpecializedBankDetail
          specialBankId={modalType?.id}
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.setModalType({ type: "NONE", id: undefined });
          }}
        />
      ) : null}
      {/* Confirm delete modal */}
      {modalType.type === "DELETE" ? (
        <DeleteRecordModal
          open
          loading={isLoadingModal}
          handleConfirm={handleDeleteRecord}
          handleCancel={() =>
            contextValue.setModalType({ type: "NONE", id: undefined })
          }
        />
      ) : null}
    </SpecializedBankContext.Provider>
  );
};
