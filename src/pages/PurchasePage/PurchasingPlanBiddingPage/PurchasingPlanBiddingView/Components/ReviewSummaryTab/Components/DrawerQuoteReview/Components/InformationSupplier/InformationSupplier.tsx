import {
  STANDARD_DATE_FORMAT_HAVE_CLOCK,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { Quotation } from "models/PurchasingPlan/PurchasingPlanBidder";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./InformationSupplier.module.scss";

interface InformationSupplierProps {
  data?: Quotation;
}

const InformationSupplier = ({ data }: InformationSupplierProps) => {
  const [translate] = useTranslation();

  const infoItems = [
    { key: "PP.tax_code", value: data?.supplierInfo?.taxCode },
    { key: "AC.txt_address", value: data?.supplierInfo?.address },
    {
      key: "PL.effective_date_quote_table",
      value: formatDateTimeToVietnamTimezone(
        data?.supplierInfo?.quotaionValidity,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
    {
      key: "PL.time_delivery_table",
      value: formatDateTimeToVietnamTimezone(
        data?.supplierInfo?.deliveryTime,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
    {
      key: "PL.time_sent_quote_table",
      value: formatDateTimeToVietnamTimezone(
        data?.supplierInfo?.createdDate,
        STANDARD_DATE_FORMAT_HAVE_CLOCK
      ),
    },
  ];

  const infoItemsRight = [
    { key: "PM.payment_invoice_name", value: data?.supplierInfo?.name },
    {
      key: "CPA.txt_contract_principle_currency_type",
      value: data?.currency?.code,
    },
    {
      key: "PL.select_supplier.exchange_rate.quoted_rate",
      value: formatNumber(data?.currency?.rate),
    },
    {
      key: "PL.email_contact_person_table",
      value: data?.supplierInfo?.contactEmail,
    },
    {
      key: "PL.description_label",
      value: data?.supplierInfo?.description,
    },
    {
      key: "PL.note_label",
      value: data?.supplierInfo?.note,
    },
  ];

  return (
    <div className={styles["information-supplier__container"]}>
      <div className={styles["information-supplier__left"]}>
        {infoItems.map(({ key, value }) => (
          <div key={key} className={styles["box-item"]}>
            <span className={styles["item-title"]}>{translate(key)}</span>
            <OneLineText className={styles["item-value"]} value={value} />
          </div>
        ))}
      </div>

      <div className={styles["information-supplier__right"]}>
        {infoItemsRight.map(({ key, value }) => (
          <div key={key} className={styles["box-item"]}>
            <span className={styles["item-title"]}>{translate(key)}</span>
            <OneLineText className={styles["item-value"]} value={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformationSupplier;
