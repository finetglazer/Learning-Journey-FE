import { LayoutMaster, PageHeader } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { CostDriverActions } from "./Components/CostDriverActions";
import { CostDriverTable } from "./Components/CostDriverTable";
import "./CostDriver.scss";
import {
  CostDriverMasterContext,
  CostDriverModal,
  useCostDriverMasterHooks,
} from "./CostDriverMasterHooks";
import { CostDriverView } from "./CostDriverView/CostDriverView";

export const CostDriverMaster = () => {
  const {
    translate,
    breadcrumb,
    modal,
    setModal,
    costDriverIdSelected,
    ...contextValue
  } = useCostDriverMasterHooks();

  return (
    <CostDriverMasterContext.Provider value={contextValue}>
      <div className="page-content cost-driver">
        <PageHeader
          title={translate("CM.menu_title_cost_driver")}
          breadcrumbs={breadcrumb}
        />
        <LayoutMaster>
          <CostDriverActions />
          <LayoutMasterContent>
            <CostDriverTable />
          </LayoutMasterContent>
        </LayoutMaster>
      </div>
      <CostDriverView
        open={modal === CostDriverModal.DETAIL}
        CostDriverId={costDriverIdSelected}
        handleCancel={() => setModal(null)}
      />
    </CostDriverMasterContext.Provider>
  );
};
