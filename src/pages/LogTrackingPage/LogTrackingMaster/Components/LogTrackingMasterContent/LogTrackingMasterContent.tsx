import { LayoutMaster, EmptyData } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import {
  LogTrackingContext,
  LogTrackingContextType,
} from "pages/LogTrackingPage/LogTrackingHook";
import { useContext } from "react";
import "../../LogTrackingMaster.scss";
import LogTrackingActions from "./LogTrackingActions";
import LogTrackingTable from "./LogTrackingTable";

const LogTrackingMasterContent = () => {
  const { translate, logList, loadingList, modelFilter, countFilter } =
    useContext<LogTrackingContextType>(LogTrackingContext);

  if (
    isEmpty(logList) &&
    isEmpty(modelFilter?.search) &&
    isEqual(countFilter, numberConstants.ZERO) &&
    !loadingList
  ) {
    return <EmptyData message={translate("LT.empty_message_text")} />;
  }

  return (
    <LayoutMaster>
      <LayoutMasterActions>
        <LogTrackingActions />
      </LayoutMasterActions>

      <LayoutMasterContent>
        <LogTrackingTable />
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default LogTrackingMasterContent;
