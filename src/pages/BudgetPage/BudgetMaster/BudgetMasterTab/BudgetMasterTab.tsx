import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_BUDGET_LIST } from "config/const";
import { isEmpty, isEqual } from "lodash";
import { useContext, useEffect } from "react";
import { BudgetMaster, BudgetMasterContext } from "../BudgetMasterHook";
import BudgetMasterTabAction from "./BudgetMasterTabAction";
import BudgetMasterTabTable from "./BudgetMasterTabTable";
import EmptyDataCM from "./component/EmptyDataCM";

const BudgetMasterTab = () => {
  const { list, countFilter, modelFilter } =
    useContext<BudgetMaster>(BudgetMasterContext);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BUDGET_LIST, JSON.stringify(list));
  }, [list]);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return (
        isEmpty(list) && countFilter === 0 && isEqual(modelFilter.tabKey, 0)
      );
    } else {
      return false;
    }
  }

  return (
    <LayoutMaster>
      {getEmptyData() ? (
        <EmptyDataCM />
      ) : (
        <>
          <LayoutMasterActions>
            <BudgetMasterTabAction />
          </LayoutMasterActions>
          <LayoutMasterContent>
            <BudgetMasterTabTable />
          </LayoutMasterContent>
        </>
      )}
    </LayoutMaster>
  );
};

export default BudgetMasterTab;
