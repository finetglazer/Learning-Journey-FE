import React, { useCallback, useContext, useEffect, useState } from "react";
import InvoicesFDAView from "./Components/InvoicesFDAView/InvoicesFDAView";
import "./InvoiceListTabView.scss";
// eslint-disable-next-line import/named
import { CollapseProps, Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import {
  PaymentDetailModel,
  PaymentInformationModel,
} from "models/Payment/PaymentRequestModel";
import { PaymentDetailHookContext } from "../../../PaymentDetail/PaymentDetailHook";
import InvoicesOtherDocumentTableView from "./Components/InvoicesOtherDocumentTableView/InvoicesOtherDocumentTableView";
import EmptyTab from "components/EmtyTab/EmptyTab";

const InvoiceListTabView = () => {
  const { translate, model } = useContext<PaymentDetailModel>(
    PaymentDetailHookContext
  );
  const [itemValues, setItemValues] = useState([]);
  useEffect(() => {
    if (!model?.paymentDetailInfomation) return;
    const items = getItems(model?.paymentDetailInfomation);
    setItemValues(items);
  }, [model?.paymentDetailInfomation]);

  const getItems = useCallback(
    (
      paymentDetailInformation: PaymentInformationModel
    ): CollapseProps["items"] => {
      const invoiceItems = [];
      if (paymentDetailInformation?.invoices?.length > 0) {
        invoiceItems.push({
          key: "1",
          label: (
            <div className="invoice-title">
              {translate("PM.payment_list_electronic_invoice_fda_title")}
            </div>
          ),
          children: <InvoicesFDAView />,
        });
      }

      if (paymentDetailInformation?.otherDocuments?.length > 0) {
        invoiceItems.push({
          key: "2",
          label: (
            <div className="invoice-title">
              {translate("PM.payment_list_other_document_title")}
            </div>
          ),
          children: <InvoicesOtherDocumentTableView />,
        });
      }

      return invoiceItems;
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
                className="invoice-transition"
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

export default InvoiceListTabView;
