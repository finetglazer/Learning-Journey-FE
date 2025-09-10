import { IcEmptySearchSvg } from "assets/icons";
import {
  InvoicesOtherDocumentViewModel,
  PaymentDetailModel,
} from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { useContext, useEffect, useState } from "react";
import { StandardTable } from "react-components-design-system";
import { PaymentDetailHookContext } from "../../../../../PaymentDetail/PaymentDetailHook";
import InvoicesOtherDocumentsColumnView from "../InvoicesOtherDocumentsColumnView/InvoicesOtherDocumentsColumnView";

const InvoicesOtherDocumentTableView = () => {
  const { model, formatNumberToCurrency, translate } =
    useContext<PaymentDetailModel>(PaymentDetailHookContext);

  const [invoiceOtherList, setInvoiceOtherList] = useState<
    InvoicesOtherDocumentViewModel[]
  >([]);

  useEffect(() => {
    setInvoiceOtherList(model?.paymentDetailInfomation?.otherDocuments || []);
  }, []);

  return (
    <div className="page-master__table">
      <StandardTable
        className="payment-custom_table"
        rowKey={"id"}
        columns={InvoicesOtherDocumentsColumnView({
          translate,
          formatNumberToCurrency,
          invoiceOtherList,
          model,
        })}
        dataSource={[
          ...invoiceOtherList,
          {
            isTotal: true,
          },
        ]}
        idContainer="otherDocuments"
        isDragable={true}
        rowClassName="payment-custom_row_table"
        scroll={{
          y: "calc(100vh - 353px)",
        }}
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={500}
            />
          ),
        }}
      />
    </div>
  );
};

export default InvoicesOtherDocumentTableView;
