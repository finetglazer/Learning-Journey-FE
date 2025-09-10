import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { LOCAL_STORAGE_PAYMENT_LIST } from "config/const";
import { isEmpty } from "lodash";
import { useContext, useEffect } from "react";
import { PaymentMaster, PaymentMasterContext } from "../PaymentMasterHook";
import EmptyDataCM from "./component/EmptyDataCM";
import PaymentMasterTabTable from "./PaymentMasterTabTable";

const PaymentMasterTab = () => {
  const { list, countFilter, modelFilter } =
    useContext<PaymentMaster>(PaymentMasterContext);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PAYMENT_LIST, JSON.stringify(list));
  }, [list]);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return isEmpty(list) && countFilter === 0;
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
          <LayoutMasterContent>
            <PaymentMasterTabTable />
          </LayoutMasterContent>
        </>
      )}
    </LayoutMaster>
  );
};

export default PaymentMasterTab;
