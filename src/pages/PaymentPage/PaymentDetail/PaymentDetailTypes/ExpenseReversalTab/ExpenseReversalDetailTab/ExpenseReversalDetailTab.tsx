// eslint-disable-next-line import/named
import { Collapse, CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import EmptyTab from "components/EmtyTab/EmptyTab";
import { PaymentDetailModel } from "models/Payment";
import ExpenseApplicationView from "pages/PaymentPage/PaymentDetail/Components/ReimbursementExpenseReversalView/ExpenseApplicationView/ExpenseApplicationView";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";

const ExpenseReversalDetailTab = () => {
  const { model, translate } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_expense_reversal_title")}
        </div>
      ),
      children: (
        <ExpenseApplicationView
          refundPlanToSpents={
            model?.paymentDetailInfomation?.refundPlanToSpents
          }
        />
      ),
    },
  ];

  return (
    <div>
      {model?.paymentDetailInfomation?.refundPlanToSpents?.length == 0 ? (
        <EmptyTab />
      ) : (
        model?.paymentDetailInfomation && (
          <Collapse
            items={items}
            ghost
            defaultActiveKey={["1", "2"]}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <div>
                <img
                  src={IcArrowDown}
                  className="invoice-transition"
                  style={{ transform: isActive ? "rotate(180deg)" : "" }}
                  alt=""
                />
              </div>
            )}
          />
        )
      )}
      <div className="m-t--2xl"></div>
    </div>
  );
};

export default ExpenseReversalDetailTab;
