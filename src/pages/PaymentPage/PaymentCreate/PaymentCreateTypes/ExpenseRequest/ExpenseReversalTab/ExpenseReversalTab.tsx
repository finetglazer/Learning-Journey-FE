// eslint-disable-next-line import/named
import { CollapseProps, Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import { PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import ExpenseApplication from "../../../Components/ReimbursementExpenseReversal/ExpenseApplication/ExpenseApplication";

const ExpenseReversalTab = () => {
  const { translate } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_expense_reversal_title")}
        </div>
      ),
      children: <ExpenseApplication />,
    },
  ];

  return (
    <div className="payment_collapse">
      <Collapse
        items={items}
        ghost
        defaultActiveKey={["1"]}
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
    </div>
  );
};

export default ExpenseReversalTab;
