import { LayoutMaster, PageHeader, EmptyData } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, lte } from "lodash";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { ContractClassificationActions } from "./Components/ContractClassificationActions";
import { ContractClassificationTable } from "./Components/ContractClassificationTable";
import "./ContractClassification.scss";
import { ContractClassificationDetail } from "./ContractClassificationDetail/ContractClassificationDetail";
import {
  ContractClassificationMasterContext,
  ContractClassificationModal,
  useContractClassificationMasterHooks,
} from "./ContractClassificationMasterHooks";
import { ContractClassificationView } from "./ContractClassificationView/ContractClassificationView";

export const ContractClassificationMaster = () => {
  const {
    translate,
    breadcrumb,
    isLoadingModal,
    modal,
    contractClassificationIdSelected,
    handleDeleteRecord,
    handleCloseModal,

    ...contextValue
  } = useContractClassificationMasterHooks();
  const { validAction } = contextValue;
  const isEmptyData = () => {
    if (!isEmpty(contextValue?.modelFilter?.search)) return false;

    return (
      isEmpty(contextValue?.list) &&
      lte(contextValue?.countFilter, numberConstants.ZERO)
    );
  };

  return (
    <>
      <ContractClassificationMasterContext.Provider value={contextValue}>
        <div className="page-content contract-classification">
          <PageHeader
            title={translate("CM.menu_title_contract_classification")}
            breadcrumbs={breadcrumb}
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
                  onClick={() =>
                    contextValue.handleActionContractClassification({
                      modal: ContractClassificationModal.CREATE,
                      id: null,
                    })
                  }
                >
                  {translate("BG.btn_add")}
                </Button>
              )}
            </EmptyData>
          ) : (
            <LayoutMaster>
              <ContractClassificationActions />
              <LayoutMasterContent>
                <ContractClassificationTable />
              </LayoutMasterContent>
            </LayoutMaster>
          )}
        </div>
      </ContractClassificationMasterContext.Provider>
      <ContractClassificationView
        open={modal === ContractClassificationModal.DETAIL}
        contractClassificationId={contractClassificationIdSelected}
        handleCancel={handleCloseModal}
      />
      <DeleteRecordModal
        open={modal === ContractClassificationModal.DELETE}
        content={translate("CC.txt_delete_content")}
        loading={isLoadingModal}
        handleConfirm={handleDeleteRecord}
        handleCancel={handleCloseModal}
      />
      <ContractClassificationDetail
        open={[
          ContractClassificationModal.EDIT,
          ContractClassificationModal.CREATE,
        ].includes(modal)}
        personnelByUnitId={contractClassificationIdSelected}
        handleCancel={handleCloseModal}
        date={contextValue?.modelFilter.date}
      />
    </>
  );
};
