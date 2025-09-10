import { LayoutMaster, PageHeader, EmptyData } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, lte } from "lodash";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import "./PersonnelByUnit.scss";
import { PersonnelByUnitDetail } from "./PersonnelByUnitDetail/PersonnelByUnitDetail";
import {
  PersonnelByUnitMasterContext,
  PersonnelByUnitModal,
  usePersonnelByUnitMasterHooks,
} from "./PersonnelByUnitMasterHooks";
import { PersonnelByUnitView } from "./PersonnelByUnitView/PersonnelByUnitView";
import { PersonnelByUnitActions } from "./Components/PersonnelByUnitActions";
import { PersonnelByUnitTable } from "./Components/PersonnelByUnitTable";
import { FileImportErrorModal } from "pages/BudgetPage/FileImportErrorModal/FileImportErrorModal";

export const PersonnelByUnitMaster = () => {
  const {
    translate,
    breadcrumb,
    modal,
    personnelByUnitIdSelected,
    handleCloseModal,
    handleDeleteRecord,
    importError,
    handleCloseModalError,
    isLoadingModal,
    ...contextValue
  } = usePersonnelByUnitMasterHooks();

  return (
    <>
      <PersonnelByUnitMasterContext.Provider value={contextValue}>
        <div className="page-content personnel-by-unit">
          <PageHeader
            title={translate("CM.menu_title_personnel_by_unit")}
            breadcrumbs={breadcrumb}
          />

          <LayoutMaster>
            <PersonnelByUnitActions />
            <LayoutMasterContent>
              <PersonnelByUnitTable />
            </LayoutMasterContent>
          </LayoutMaster>
        </div>
      </PersonnelByUnitMasterContext.Provider>

      <PersonnelByUnitView
        open={modal === PersonnelByUnitModal.DETAIL}
        personnelByUnitId={personnelByUnitIdSelected}
        handleCancel={handleCloseModal}
      />
      <PersonnelByUnitDetail
        open={[PersonnelByUnitModal.EDIT, PersonnelByUnitModal.CREATE].includes(
          modal
        )}
        personnelByUnitId={personnelByUnitIdSelected}
        handleCancel={handleCloseModal}
        date={contextValue?.modelFilter.date}
      />
      <DeleteRecordModal
        open={modal === PersonnelByUnitModal.DELETE}
        content={translate("PBU.message_confirm_delete_record")}
        loading={isLoadingModal}
        handleConfirm={handleDeleteRecord}
        handleCancel={handleCloseModal}
      />
      {modal === PersonnelByUnitModal.ERROR ? (
        <FileImportErrorModal
          sheetErrors={importError}
          onDismiss={handleCloseModalError}
        />
      ) : null}
    </>
  );
};
