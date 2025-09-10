import { PageHeader } from "components";
import { ConfirmModalType } from "core/helpers/enum";
import { isEqual, isNull } from "lodash";
import { ProjectSettlementMasterContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import ProjectSettlementList from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementList/ProjectSettlementList";
import { useProjectSettlementMasterHook } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementMasterHook";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { ProjectSettlementModal } from "../Components/constant";
import SelectionSettlementPolicyModal from "../Components/Modal/SelectionSettlementPolicy/SelectionSettlementPolicy";

const ProjectSettlementMaster = () => {
  const {
    translate,
    breadcrumbs,
    modal,
    record,
    hideModal,
    confirmCancel,
    confirmDelete,
    isLoadingModal,
    errorMessage,
    ...contextValue
  } = useProjectSettlementMasterHook();

  const { handleModal } = contextValue;

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_project_settlement")}
          breadcrumbs={breadcrumbs}
          hasTabs={false}
        />
        <ProjectSettlementMasterContext.Provider value={contextValue}>
          <div className="tab__master">
            <ProjectSettlementList />
          </div>
        </ProjectSettlementMasterContext.Provider>
      </div>
      {isEqual(modal, ProjectSettlementModal.SelectionSettlementPolicy) && (
        <SelectionSettlementPolicyModal onClose={() => handleModal(null)} />
      )}

      {/* Cancel modal */}
      {isEqual(modal, ProjectSettlementModal.Cancel) && !isNull(record) ? (
        <ConfirmModal
          type={ConfirmModalType.CANCEL}
          isLoading={isLoadingModal}
          model={record}
          errorMessage={errorMessage}
          onApply={confirmCancel}
          onCancel={hideModal}
        />
      ) : null}

      {/* Delete modal */}
      {isEqual(modal, ProjectSettlementModal.Delete) && !isNull(record) ? (
        <ConfirmModal
          type={ConfirmModalType.DELETE}
          isLoading={isLoadingModal}
          model={record}
          errorMessage={errorMessage}
          onApply={confirmDelete}
          onCancel={hideModal}
        />
      ) : null}
    </>
  );
};

export default ProjectSettlementMaster;
