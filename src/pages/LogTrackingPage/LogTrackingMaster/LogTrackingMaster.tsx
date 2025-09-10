import { PageHeader } from "components";
import { LogTrackingContext, useLogTrackingHook } from "../LogTrackingHook";
import LogTrackingMasterContent from "./Components/LogTrackingMasterContent/LogTrackingMasterContent";
import "./LogTrackingMaster.scss";

const LogTrackingMaster = () => {
  const { ...contextValues } = useLogTrackingHook();

  const { translate } = contextValues;

  return (
    <LogTrackingContext.Provider value={contextValues}>
      <div className="page-content">
        <PageHeader title={translate("LT.page_title")} />

        <div className="tab__master">
          <LogTrackingMasterContent />
        </div>
      </div>
    </LogTrackingContext.Provider>
  );
};

export default LogTrackingMaster;
