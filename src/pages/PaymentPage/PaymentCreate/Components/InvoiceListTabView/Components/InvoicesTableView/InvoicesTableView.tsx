import { IcEmptySearchSvg } from "assets/icons";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import {
  InvoiceModel,
  InvoicesViewModel,
  PaymentDetailModel,
} from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useCallback, useContext, useEffect, useState } from "react";
import { StandardTable } from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { getFileNameFromUrl, getIcon } from "../../../../Helper/Helper";
import InvoicesTableColumnView from "../InvoicesTableColumnView/InvoicesTableColumnView";

const InvoicesTableView = () => {
  const {
    model,
    formatNumberToCurrency,
    translate,
    handleDownloadFileAttached,
  } = useContext<PaymentDetailModel>(PaymentDetailHookContext);

  const renderIcon = useCallback(
    (
      item: RequestAttachment,
      handleDownloadFileAttached: (file?: FileModel) => void
    ) => {
      return (
        <div onClick={() => handleDownloadFileAttached(item)}>
          <img src={getIcon(item)} alt="img" width={24} height={24} />
        </div>
      );
    },
    []
  );

  const initFileAttached = useCallback(
    (record: InvoiceModel) => {
      const filePdfAttacheds: RequestAttachment[] = [];
      const pdfUrl = record?.pdfUrl;
      const xmlUrl = record?.xmlUrl;
      if (pdfUrl) {
        const pdfName = getFileNameFromUrl(pdfUrl);
        const filePdfAttached: RequestAttachment = {
          name: pdfName,
          contentType: "application/pdf",
          path: pdfUrl,
        };
        filePdfAttacheds.push(filePdfAttached);
      }
      if (xmlUrl) {
        const xmlName = getFileNameFromUrl(xmlUrl);
        const fileXmlAttached: RequestAttachment = {
          name: xmlName,
          contentType: "application/xml",
          path: xmlUrl,
        };
        filePdfAttacheds.push(fileXmlAttached);
      }
      return filePdfAttacheds.filter((item) => item.path);
    },
    [model.invoices]
  );

  const [invoiceList, setInvoiceList] = useState<InvoicesViewModel[]>([]);
  useEffect(() => {
    setInvoiceList(model?.paymentDetailInfomation?.invoices || []);
  }, []);

  return (
    <div className="page-master__table">
      <StandardTable
        className="payment-custom_table"
        rowKey={"invoiceId"}
        columns={InvoicesTableColumnView({
          translate,
          formatNumberToCurrency,
          renderIcon,
          handleDownloadFileAttached,
          initFileAttached,
          invoiceList,
          model,
        })}
        dataSource={[
          // eslint-disable-next-line no-unsafe-optional-chaining
          ...invoiceList,
          {
            isTotal: true,
          },
        ]}
        isDragable={true}
        idContainer="invoices"
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

export default InvoicesTableView;
