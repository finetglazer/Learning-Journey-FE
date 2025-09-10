import {
  PaymentDetailModel,
  PaymentTypeApplicationModel,
} from "models/Payment/PaymentRequestModel";
import React, { useContext } from "react";
import PaymentApplicationTableView from "../PaymentApplicationTable/PaymentApplicationTableView";
import useColumnApplicationTypeView from "../useColumnApplicationTypeView/useColumnApplicationTypeView";
import { PaymentDetailHookContext } from "../../../PaymentDetailHook";
type props = {
  applyDeposits: PaymentTypeApplicationModel[];
};
function DepositApplicationView({ applyDeposits }: props) {
  const { translate, formatNumberToCurrency } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

  const { columnsDepositView } = useColumnApplicationTypeView({
    translate,
    formatNumberToCurrency,
    depositApplicationList: applyDeposits,
  });

  return (
    <div>
      <PaymentApplicationTableView
        idContainer="DepositApplicationView"
        columns={columnsDepositView}
        translate={translate}
        list={applyDeposits || []}
      />
    </div>
  );
}

export default DepositApplicationView;
