import {
  PaymentDetailModel,
  PaymentTypeApplicationModel,
} from "models/Payment/PaymentRequestModel";
import React, { useContext } from "react";
import PaymentApplicationTableView from "../PaymentApplicationTable/PaymentApplicationTableView";
import useColumnApplicationTypeView from "../useColumnApplicationTypeView/useColumnApplicationTypeView";
import { PaymentDetailHookContext } from "../../../PaymentDetailHook";

type props = {
  applyAdvances: PaymentTypeApplicationModel[];
};
function AdvancePaymentApplicationView({ applyAdvances }: props) {
  const { translate, formatNumberToCurrency } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

  const { columnsAdvancePaymentView } = useColumnApplicationTypeView({
    translate,
    formatNumberToCurrency,
    advancePaymentList: applyAdvances,
  });

  return (
    <div>
      <PaymentApplicationTableView
        idContainer={"advancePaymentListView"}
        columns={columnsAdvancePaymentView}
        translate={translate}
        list={applyAdvances || []}
      />
    </div>
  );
}

export default AdvancePaymentApplicationView;
