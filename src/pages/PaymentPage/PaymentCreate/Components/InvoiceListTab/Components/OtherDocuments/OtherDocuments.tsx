import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import {
  InvoicesOtherDocumentModel,
  PaymentCreateModel,
  PaymentRequestModel,
} from "models/Payment/PaymentRequestModel";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import React, { useContext } from "react";
import { emptyIcon } from "assets/icons";
import { Button } from "react-components-design-system";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import InvoicesOtherDocumentTable from "../InvoicesOtherDocumentTable/InvoicesOtherDocumentTable";
import {
  CODE_TYPE_ADVANCE_TUNCC,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  TypeOfInvoice,
} from "models/Payment";
import { isEqual } from "lodash";

function OtherDocuments() {
  const { translate, model, handleChangeSingleField } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const handleAddInvoiceOtherDocument = (model?: PaymentRequestModel) => {
    let supplier = null;
    const codePaymentRequestType = model?.paymentRequestType?.code;
    if (
      codePaymentRequestType === CODE_TYPE_PAYMENT_REQUEST_CORP ||
      codePaymentRequestType === CODE_TYPE_ADVANCE_TUNCC ||
      codePaymentRequestType === CODE_TYPE_EXPENSE_DCNCC
    ) {
      supplier = {
        supplierTaxCode: model?.supplier?.taxCode,
        supplierName: model?.supplier?.name,
        supplierCode: model?.supplier?.code,
      };
    } else {
      supplier = {
        supplierTaxCode: "",
        supplierName: "",
        supplierCode: "",
      };
    }
    const row = new InvoicesOtherDocumentModel();
    row.id = new Date().getTime().toString();
    row.description = "";
    row.netAmount = null;
    row.taxId = "";
    row.taxAmount = null;
    row.paymentAmount = null;
    row.documentNumber = "";
    row.documentDate = null;
    row.supplierTaxCode = supplier.supplierTaxCode;
    row.supplierName = supplier.supplierName;
    row.supplierCode = supplier.supplierCode;

    if (model?.invoicesOtherDocument.length > 0) {
      row.indexBeforeValidate = model.invoicesOtherDocument?.length - 1 + 1;
    } else {
      row.indexBeforeValidate = 0;
    }
    const dataOtherDocumentInit = model.invoicesOtherDocument?.map(
      (item, index) => {
        return {
          ...item,
          indexBeforeValidate: index,
        };
      }
    );

    handleChangeSingleField({
      fieldName: "invoicesOtherDocument",
    })([...dataOtherDocumentInit, row]);
  };

  return (
    <div>
      <div>
        <div className={classNames("d-flex pb-2")}>
          {model?.invoicesOtherDocument?.length > 0 && (
            <Button
              icon={<img src={add} alt="img" width={12} height={12} />}
              iconPlace="left"
              type="secondary"
              onClick={() => {
                handleAddInvoiceOtherDocument(model);
              }}
              disabled={isEqual(
                model?.invoiceType?.id,
                TypeOfInvoice.OLD_INVOICE
              )}
            >
              {translate("PM.payment_add_line_title")}
            </Button>
          )}
        </div>
        {model.invoicesOtherDocument?.length === 0 ? (
          <EmptyInitializeTable
            textButton={translate("PM.payment_add_other_document")}
            content={
              <div className="invoice-width_content_empty">
                {translate("PM.payment_empty_content_message")}
              </div>
            }
            icon={<img src={emptyIcon} alt="" />}
            onHandleClickAdd={() => {
              handleAddInvoiceOtherDocument(model);
            }}
            disableButton={isEqual(
              model?.invoiceType?.id,
              TypeOfInvoice.OLD_INVOICE
            )}
          />
        ) : (
          <InvoicesOtherDocumentTable />
        )}
      </div>
    </div>
  );
}

export default OtherDocuments;
