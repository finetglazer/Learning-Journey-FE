import { LayoutMaster, PageHeader } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { FileImportErrorModal } from "pages/BudgetPage/FileImportErrorModal/FileImportErrorModal";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import "./AreaUnitCodeCode.scss";
import { AreaUnitCodeDetail } from "./AreaUnitCodeDetail/AreaUnitCodeDetail";
import {
  AreaUnitCodeMasterContext,
  AreaUnitCodeModal,
  useAreaUnitCodeMasterHooks,
} from "./AreaUnitCodeMasterHooks";
import { AreaUnitCodeView } from "./AreaUnitCodeView/AreaUnitCodeView";
import { AreaUnitCodeActions } from "./Components/AreaUnitCodeActions";
import { AreaUnitCodeTable } from "./Components/AreaUnitCodeTable";

export const AreaUnitCodeMaster = () => {
  const {
    translate,
    breadcrumb,
    modal,
    areaUnitCodeIdSelected,
    handleCloseModal,
    handleDeleteRecord,
    handleCloseModalError,
    importError,
    isLoadingModal,
    ...contextValue
  } = useAreaUnitCodeMasterHooks();

  return (
    <>
      <AreaUnitCodeMasterContext.Provider value={contextValue}>
        <div className="page-content area-unit-code">
          <PageHeader
            title={translate("CM.menu_title_area_unit_code")}
            breadcrumbs={breadcrumb}
          />
          <LayoutMaster>
            <AreaUnitCodeActions />
            <LayoutMasterContent>
              <AreaUnitCodeTable />
            </LayoutMasterContent>
          </LayoutMaster>
        </div>
      </AreaUnitCodeMasterContext.Provider>
      <AreaUnitCodeView
        open={modal === AreaUnitCodeModal.DETAIL}
        areaUnitCodeId={areaUnitCodeIdSelected}
        handleCancel={handleCloseModal}
      />
      <AreaUnitCodeDetail
        open={[AreaUnitCodeModal.EDIT, AreaUnitCodeModal.CREATE].includes(
          modal
        )}
        areaUnitCodeId={areaUnitCodeIdSelected}
        handleCancel={handleCloseModal}
        date={contextValue?.modelFilter.date}
      />
      <DeleteRecordModal
        open={modal === AreaUnitCodeModal.DELETE}
        content={translate("AUC.message_confirm_delete_record")}
        loading={isLoadingModal}
        handleConfirm={handleDeleteRecord}
        handleCancel={handleCloseModal}
      />
      {modal === AreaUnitCodeModal.ERROR ? (
        <FileImportErrorModal
          sheetErrors={importError}
          onDismiss={handleCloseModalError}
        />
      ) : null}
    </>
  );
};
