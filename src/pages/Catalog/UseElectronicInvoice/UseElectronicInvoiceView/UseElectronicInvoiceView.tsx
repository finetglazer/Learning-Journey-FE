import { useContext } from "react";
import { Drawer } from "react-components-design-system";
import { Tooltip } from "antd";

import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatNumber } from "core/helpers/number";

import {
  UseElectronicInvoiceContext,
  UseElectronicInvoiceContextProps,
} from "../UseElectronicInvoiceMaster/UseElectronicInvoiceMasterHook";
import { useUseElectronicInvoiceViewHook } from "./UseElectronicInvoiceViewHook";

import { FilePPTIcon } from "assets/icons";
import styles from "./UseElectronicInvoiceView.module.scss";

export const UseElectronicInvoiceView = () => {
  const { invoiceDetailId, isOpenDetailDrawer, handleCloseDetailDrawer } =
    useContext<UseElectronicInvoiceContextProps>(UseElectronicInvoiceContext);

  const {
    translate,
    model,
    isLoading,
    handleDownloadFileInvoice,
    shortenFileName,
    getStatusEProText,
    getFileNameFromPath,
  } = useUseElectronicInvoiceViewHook(invoiceDetailId);

  return (
    <Drawer
      visible={isOpenDetailDrawer}
      size={"2xl"}
      loading={isLoading}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={true}
      hasOverlay={true}
      visibleFooter={false}
      title={
        <div>
          <span className={styles["invoice-detail-title"]}>
            {translate("UEI.txt_detail_electronic_invoice")}
          </span>
        </div>
      }
      handleClose={handleCloseDetailDrawer}
    >
      <div className={styles["invoice-detail-table"]}>
        <table>
          <tr>
            <th colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.txt_use_electronic_invoice_seller_name")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.sellerName}
                </span>
              </div>
            </th>
            <th colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_shorten_seller_tax_num")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.sellerTaxNum}
                </span>
              </div>
            </th>
            <th colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.txt_use_electronic_invoice_no")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.no}
                </span>
              </div>
            </th>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_date_invoice")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {formatDate(model?.date, STANDARD_DATE_FORMAT_SLASH)}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_use_electronic_invoice_form_no")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.formNo}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_use_electronic_invoice_notation")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.notation}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.txt_use_electronic_invoice_total_amount")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {formatNumber(model?.totalAmount)}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_use_electronic_invoice_contract_no")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.contractNo}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_use_electronic_invoice_po_no")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.poNo}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate(
                    "UEI.txt_use_electronic_invoice_status_from_email"
                  )}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.fromEmail}
                </span>
              </div>
            </td>
            <td colSpan={3}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_substitute_person")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.substitutePerson}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_file_invoice")}
                </span>
                <div
                  className={styles["invoice-detail__cell-file"]}
                  onClick={() =>
                    handleDownloadFileInvoice(
                      model?.pdfUrl,
                      getFileNameFromPath(model?.pdfUrl)
                    )
                  }
                >
                  <img
                    src={FilePPTIcon}
                    width={16}
                    height={16}
                    alt="File Icon"
                  />
                  <Tooltip title={getFileNameFromPath(model?.pdfUrl)}>
                    <span className={styles["invoice-detail__cell-file--name"]}>
                      {shortenFileName(getFileNameFromPath(model?.pdfUrl))}
                    </span>
                  </Tooltip>
                </div>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.txt_use_electronic_invoice_status_e_pro_2")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {getStatusEProText(model?.statusEPro)}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate("UEI.label_status_invoice")}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.invoiceKind?.name}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={6}>
              <div className={styles["invoice-detail__cell"]}>
                <span className={styles["invoice-detail__cell-label"]}>
                  {translate(
                    "UEI.label_use_electronic_invoice_status_messages"
                  )}
                </span>
                <span className={styles["invoice-detail__cell-value"]}>
                  {model?.statusMessages}
                </span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </Drawer>
  );
};
