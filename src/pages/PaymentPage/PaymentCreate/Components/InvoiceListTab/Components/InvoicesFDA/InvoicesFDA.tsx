import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import {
  InvoiceModel,
  PaymentCreateModel,
} from "models/Payment/PaymentRequestModel";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import React, { useContext, useEffect, useState } from "react";
import { emptyIcon, matchingIcon } from "assets/icons";
import InvoicesModal from "../InvoicesModal/InvoicesModal";
import InvoicesTable from "../InvoicesTable/InvoicesTable";
import { Button, Tag } from "react-components-design-system";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import {
  CODE_TYPE_ADVANCE_TUNCC,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  MatchStatus,
  statusMatchInvoices,
  TAX_TYPE_ENUM,
  TYPE_OF_PROPOSAL,
  TypeOfInvoice,
} from "models/Payment";
import { isEqual, isNil, size } from "lodash";

function InvoicesFDA() {
  const {
    translate,
    model,
    handleChangeSingleField,
    endPath,
    typeGroup,
    handleApplyInvoiceFDA,
    handleMatchingInvoice,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [openModalInvoice, setOpenModalInvoice] = useState(false);
  const handleApply = (data: InvoiceModel[]) => {
    setOpenModalInvoice(false);
    handleApplyInvoiceFDA(data);
  };
  const [isDisableButton, setIsDisableButton] = useState(false);
  useEffect(() => {
    switch (Number(typeGroup?.typeGroup)) {
      case TYPE_OF_PROPOSAL.ADVANCE:
        if (
          model?.paymentRequestType?.code === CODE_TYPE_ADVANCE_TUNCC &&
          !model?.supplier?.id
        ) {
          handleChangeSingleField({
            fieldName: "invoices",
          })([]);
          setIsDisableButton(true);
        } else if (
          !(model?.taxTypeInvoiceSubmit === TAX_TYPE_ENUM.VAT) &&
          !isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
        ) {
          setIsDisableButton(true);
        } else {
          setIsDisableButton(false);
        }
        break;
      case TYPE_OF_PROPOSAL.PAYMENT:
        if (
          model?.paymentRequestType?.code === CODE_TYPE_PAYMENT_REQUEST_CORP &&
          !model?.supplier?.id
        ) {
          handleChangeSingleField({
            fieldName: "invoices",
          })([]);
          setIsDisableButton(true);
        } else if (
          !(model?.taxTypeInvoiceSubmit === TAX_TYPE_ENUM.VAT) &&
          !isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
        ) {
          setIsDisableButton(true);
        } else {
          setIsDisableButton(false);
        }
        break;
      case TYPE_OF_PROPOSAL.EXPENSE:
        if (
          model?.paymentRequestType?.code === CODE_TYPE_EXPENSE_DCNCC &&
          !model?.supplier?.id
        ) {
          handleChangeSingleField({
            fieldName: "invoices",
          })([]);
          setIsDisableButton(true);
        } else if (
          !(model?.taxTypeInvoiceSubmit === TAX_TYPE_ENUM.VAT) &&
          !isEqual(model?.invoiceType?.id, TypeOfInvoice.OLD_INVOICE)
        ) {
          setIsDisableButton(true);
        } else {
          setIsDisableButton(false);
        }
        break;
      default:
        break;
    }
  }, [
    model?.paymentRequestType,
    model?.supplier,
    model?.taxTypeInvoiceSubmit,
    model?.invoiceType,
  ]);

  const renderTag = (matchingInvoiceParams: MatchStatus) => {
    const item = statusMatchInvoices?.find((type) =>
      isEqual(type.id, matchingInvoiceParams)
    );

    if (!item) return null;

    return (
      <div>
        <Tag
          size="md"
          value={item?.name}
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  return (
    <div>
      <div>
        <div
          className={classNames(
            "d-flex pb-2",
            model?.invoices?.length > 0
              ? "justify-content-between"
              : "justify-content-end "
          )}
        >
          {model?.invoices?.length > 0 && (
            <Button
              icon={<img src={add} alt="img" width={12} height={12} />}
              iconPlace="left"
              type="secondary"
              onClick={() => {
                setOpenModalInvoice(true);
              }}
            >
              {translate("PM.payment_add_invoice")}
            </Button>
          )}
          {}
          {model?.isShowButtonMapPo && (
            <div className="d-flex align-items-center gap-2">
              <Button
                className={classNames(
                  isEqual(size(model?.invoices), 0) && "disable_button_icon"
                )}
                icon={<img src={matchingIcon} alt="" />}
                iconPlace="left"
                type="text"
                disabled={isEqual(size(model?.invoices), 0)}
                onClick={() => {
                  handleMatchingInvoice(model);
                }}
              >
                {translate("PM.payment_matching_contract")}
              </Button>
              {!isNil(model?.matchingInvoiceStatus) ? (
                <div className="m-l--2xs">
                  {renderTag(model?.matchingInvoiceStatus)}
                </div>
              ) : null}
            </div>
          )}
        </div>
        {model.invoices.length === 0 ? (
          <EmptyInitializeTable
            textButton={translate("PM.payment_add_invoice")}
            content={
              <div className="invoice-width_content_empty">
                {translate("PM.payment_add_invoice_add_content")}
              </div>
            }
            icon={<img src={emptyIcon} alt="" />}
            onHandleClickAdd={() => {
              setOpenModalInvoice(true);
            }}
            disableButton={isDisableButton}
          />
        ) : (
          <InvoicesTable />
        )}
      </div>
      {openModalInvoice && (
        <InvoicesModal
          open={openModalInvoice}
          handleCancel={() => {
            setOpenModalInvoice(false);
          }}
          handleApply={handleApply}
        />
      )}
    </div>
  );
}

export default InvoicesFDA;
