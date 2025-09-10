import "./ReimbursementExpenseReversalTab.scss";
// eslint-disable-next-line import/named
import { CollapseProps, Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import { PaymentCreateHookContext } from "../../../PaymentCreateHook";
import { PaymentCreateModel, TAX_TYPE_ENUM } from "models/Payment";
import { useContext, useMemo } from "react";
import AdvancePaymentApplication from "../../../Components/ReimbursementExpenseReversal/AdvancePaymentApplication/AdvancePaymentApplication";
import ExpenseApplication from "../../../Components/ReimbursementExpenseReversal/ExpenseApplication/ExpenseApplication";
import DepositApplication from "pages/PaymentPage/PaymentCreate/Components/ReimbursementExpenseReversal/DepositApplication/DepositApplication";
import { isNil } from "lodash";

const ReimbursementExpenseReversalTab = () => {
  const { translate, model } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  const itemsTab = useMemo((): CollapseProps["items"] => {
    return [
      {
        key: "1",
        label: (
          <div className="reimbursement-title">
            {translate("PM.payment_advance_payment_application")}
          </div>
        ),
        children: <AdvancePaymentApplication />,
      },
      !isNil(model?.taxTypeInvoiceSubmit) &&
        (model?.taxTypeInvoiceSubmit === TAX_TYPE_ENUM.VAT ||
          model?.taxTypeInvoiceSubmit === TAX_TYPE_ENUM.NO_TAX) && {
          key: "2",
          label: (
            <div className="reimbursement-title">
              {translate("PM.tab_expense_reversal")}
            </div>
          ),
          children: <ExpenseApplication />,
        },
      // kế thừa từ PO thì mới hiển thị
      model?.isShowDepositApplication && {
        key: "3",
        label: (
          <div className="reimbursement-title">
            {translate("PM.payment_deposit_payment_application")}
          </div>
        ),
        children: <DepositApplication />,
      },
    ].filter(Boolean) as CollapseProps["items"];
  }, [translate, model?.taxTypeInvoiceSubmit]);

  return (
    <div className="cost-allocation__wrapper payment_collapse">
      <Collapse
        items={itemsTab}
        ghost
        defaultActiveKey={["1", "2", "3"]}
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
    </div>
  );
};

export default ReimbursementExpenseReversalTab;
