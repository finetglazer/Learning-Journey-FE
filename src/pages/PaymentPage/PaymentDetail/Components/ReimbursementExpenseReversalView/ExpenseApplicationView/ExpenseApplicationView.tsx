import {
  PaymentDetailModel,
  PaymentTypeApplicationModel,
} from "models/Payment/PaymentRequestModel";
import React, { useContext } from "react";
import PaymentApplicationTableView from "../PaymentApplicationTable/PaymentApplicationTableView";
import useColumnApplicationTypeView from "../useColumnApplicationTypeView/useColumnApplicationTypeView";
import { PaymentDetailHookContext } from "../../../PaymentDetailHook";
type props = {
  refundPlanToSpents: PaymentTypeApplicationModel[];
};
function ExpenseApplicationView({ refundPlanToSpents }: props) {
  const { translate, formatNumberToCurrency } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

  const { columnsExpenseView } = useColumnApplicationTypeView({
    translate,
    formatNumberToCurrency,
    expenseApplicationList: refundPlanToSpents,
  });

  return (
    <div>
      <PaymentApplicationTableView
        idContainer="ExpenseListView"
        columns={columnsExpenseView}
        translate={translate}
        list={refundPlanToSpents || []}
      />
    </div>
  );
}

export default ExpenseApplicationView;
