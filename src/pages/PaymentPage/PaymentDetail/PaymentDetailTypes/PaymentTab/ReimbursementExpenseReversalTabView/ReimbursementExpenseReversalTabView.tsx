import "./ReimbursementExpenseReversalTabView.scss";
// eslint-disable-next-line import/named
import { CollapseProps, Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import { PaymentDetailModel, PaymentDetailTypeModel } from "models/Payment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PaymentDetailHookContext } from "../../../../PaymentDetail/PaymentDetailHook";
import AdvancePaymentApplicationView from "../../../Components/ReimbursementExpenseReversalView/AdvancePaymentApplicationView/AdvancePaymentApplicationView";
import ExpenseApplicationView from "../../../Components/ReimbursementExpenseReversalView/ExpenseApplicationView/ExpenseApplicationView";
import EmptyTab from "components/EmtyTab/EmptyTab";
import _ from "lodash";
import DepositApplicationView from "pages/PaymentPage/PaymentDetail/Components/ReimbursementExpenseReversalView/DepositApplicationView/DepositApplicationView";
const ReimbursementExpenseReversalTabView = () => {
  const { translate, model } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

  const [itemValues, setItemValues] = useState([]);
  useEffect(() => {
    if (_.isEmpty(model?.paymentDetailInfomation)) {
      setItemValues([]);
    } else {
      const items = getItems(model?.paymentDetailInfomation);
      setItemValues(items);
    }
  }, [
    model?.paymentDetailInfomation?.applyAdvances,
    model?.paymentDetailInfomation?.refundPlanToSpents,
  ]);
  const getItems = useCallback(
    (
      paymentDetailInformation: PaymentDetailTypeModel
    ): CollapseProps["items"] => {
      const items = [];
      if (
        _.isArray(paymentDetailInformation?.applyAdvances) &&
        paymentDetailInformation?.applyAdvances?.length > 0
      ) {
        items.push({
          key: "1",
          label: (
            <div className="reimbursement-title">
              {translate("PM.payment_advance_payment_application")}
            </div>
          ),
          children: (
            <AdvancePaymentApplicationView
              applyAdvances={paymentDetailInformation?.applyAdvances}
            />
          ),
        });
      }

      if (
        _.isArray(paymentDetailInformation?.refundPlanToSpents) &&
        paymentDetailInformation?.refundPlanToSpents?.length > 0
      ) {
        items.push({
          key: "2",
          label: (
            <div className="reimbursement-title">
              {translate("PM.tab_expense_reversal")}
            </div>
          ),
          children: (
            <ExpenseApplicationView
              refundPlanToSpents={paymentDetailInformation?.refundPlanToSpents}
            />
          ),
        });
      }

      if (
        _.isArray(paymentDetailInformation?.applyDeposits) &&
        paymentDetailInformation?.applyDeposits?.length > 0
      ) {
        items.push({
          key: "2",
          label: (
            <div className="reimbursement-title">
              {translate("PM.payment_deposit_payment_application")}
            </div>
          ),
          children: (
            <DepositApplicationView
              applyDeposits={paymentDetailInformation?.applyDeposits}
            />
          ),
        });
      }

      return items;
    },
    [translate, itemValues]
  );

  return (
    <div className="cost-allocation__wrapper payment_collapse">
      {itemValues?.length === 0 ? (
        <EmptyTab />
      ) : (
        <Collapse
          items={itemValues}
          ghost
          defaultActiveKey={["1", "2"]}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div>
              <img
                src={IcArrowDown}
                className="reimbursement-transition"
                style={{ transform: isActive ? "rotate(180deg)" : "" }}
                alt=""
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default ReimbursementExpenseReversalTabView;
