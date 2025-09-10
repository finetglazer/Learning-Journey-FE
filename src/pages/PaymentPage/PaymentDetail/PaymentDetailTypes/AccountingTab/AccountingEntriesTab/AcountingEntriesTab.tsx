import EmptyTab from "components/EmtyTab/EmptyTab";
import AccountingEntriesTable from "./Components/AccountingEntriesTable/AccountingEntriesTable";
import { useContext } from "react";
import { PaymentDetailModel } from "models/Payment";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";

const AcountingEntriesTab = () => {
  const { model } = useContext<PaymentDetailModel>(PaymentDetailHookContext);

  return (
    <div className="p-x--sm">
      {model?.paymentDetailInfomation?.journalEntries?.length == 0 ? (
        <EmptyTab />
      ) : (
        <AccountingEntriesTable />
      )}
      <div className="m-t--2xl"></div>
    </div>
  );
};

export default AcountingEntriesTab;
