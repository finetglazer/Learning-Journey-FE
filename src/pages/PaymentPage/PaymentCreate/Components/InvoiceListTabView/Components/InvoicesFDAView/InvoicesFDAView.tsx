import { PaymentDetailModel } from "models/Payment/PaymentRequestModel";
import React, { useContext } from "react";
import { Button, Tag } from "react-components-design-system";
import classNames from "classnames";
import { PaymentDetailHookContext } from "../../../../../PaymentDetail/PaymentDetailHook";
import InvoicesTableView from "../InvoicesTableView/InvoicesTableView";
import { MatchStatus, statusMatchInvoices } from "models/Payment";
import { isEqual, isNil, size } from "lodash";
import { Download } from "assets/icons";

function InvoicesFDAView() {
  const { translate, model, handleDownloadFileMatchingInvoice } =
    useContext<PaymentDetailModel>(PaymentDetailHookContext);

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

  const statusMatching = model?.paymentDetailInfomation?.matchingFdaStatus;
  const invoiceMatchingResultIds =
    model?.paymentDetailInfomation?.invoiceMatchingResultIds;
  const paymentInheritanceId =
    model?.paymentDetailInfomation?.paymentInheritanceId;

  const isShowMatchingInvoiceStatus =
    !isNil(paymentInheritanceId) &&
    !isNil(statusMatching) &&
    size(invoiceMatchingResultIds) > 0;

  return (
    <div>
      <div>
        <div className={classNames("d-flex pb-2", "justify-content-end")}>
          {isShowMatchingInvoiceStatus ? (
            <div className={"d-flex align-center m-l--2xs gap-2"}>
              <Button
                type="secondary"
                icon={<Download fillColor={"var(--color-primary)"} />}
                iconPlace="left"
                onClick={handleDownloadFileMatchingInvoice}
              >
                {translate("PM.txt_matching_invoice_download")}
              </Button>
              {renderTag(statusMatching)}
            </div>
          ) : null}
        </div>
        <InvoicesTableView />
      </div>
    </div>
  );
}

export default InvoicesFDAView;
