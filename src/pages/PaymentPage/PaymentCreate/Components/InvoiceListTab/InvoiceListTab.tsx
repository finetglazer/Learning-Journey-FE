import React, { useContext, useEffect, useState } from "react";
import InvoiceMainTaxType from "./Components/InvoiceMainTaxType/InvoiceMainTaxType";
import InvoicesFDA from "./Components/InvoicesFDA/InvoicesFDA";
import "./InvoiceListTab.scss";
// eslint-disable-next-line import/named
import { CollapseProps, Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import { PaymentCreateModel } from "models/Payment/PaymentRequestModel";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import OtherDocuments from "./Components/OtherDocuments/OtherDocuments";
import { isEqual } from "lodash";
import { TypeOfInvoice } from "models/Payment";

const InvoiceListTab = () => {
  const { translate, model } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  const [disableTaxMain, setDisableTaxMain] = useState(false);
  useEffect(() => {
    if (
      model?.invoices?.length > 0 ||
      model?.costAllocation?.length > 0 ||
      model?.invoicesOtherDocument?.length > 0 ||
      model?.expenseApplicationList?.length > 0
    ) {
      setDisableTaxMain(true);
    } else {
      setDisableTaxMain(false);
    }
  }, [model?.invoices, model?.costAllocation, model?.invoicesOtherDocument]);
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_list_electronic_invoice_fda_title")}
        </div>
      ),
      children: <InvoicesFDA />,
    },
    {
      key: "2",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_list_other_document_title")}
        </div>
      ),
      children: <OtherDocuments />,
    },
  ];

  return (
    <div className="cost-allocation__wrapper payment_collapse">
      {!isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE) && (
        <InvoiceMainTaxType disableTaxMain={disableTaxMain} />
      )}
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
    </div>
  );
};

export default InvoiceListTab;
