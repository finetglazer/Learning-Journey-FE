import classNames from "classnames";
import { AdvancedCollapseView } from "components";
import { SupplierModel } from "models/PurchasingPlan";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../ViewSupplierInformationDrawer.module.scss";
import EmailRecipientDetails from "./EmailRecipientDetails";

interface IProps {
  data: SupplierModel;
}

export default function ViewSupplier({ data }: IProps) {
  const [translate] = useTranslation();

  const renderGeneral = (
    <>
      <div className={classNames(styles["container"], "pt-0")}>
        <div className={styles["item"]}>
          <span className={styles["label"]}>
            {translate("PL.purchasing_plan_tax_code_supplier_label")}
          </span>
          <OneLineText className={styles["value"]} value={data?.taxCode} />
        </div>
        <div className={styles["item"]}>
          <span className={styles["label"]}>
            {translate("PL.purchasing_plan_supplier_name")}
          </span>
          <OneLineText className={styles["value"]} value={data?.name} />
        </div>
        <div className={styles["item"]}>
          <span className={styles["label"]}>
            {translate("PL.purchasing_plan_type_supplier")}
          </span>
          <OneLineText
            className={styles["value"]}
            value={data?.supplierType?.name ?? data?.type}
          />
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["item"]}>
          <span className={styles["label"]}>
            {translate("PL.drawer_email_person_quoting_price")}
          </span>
          <OneLineText
            className={styles["value"]}
            value={data?.supplierContactSelected?.email || data?.quoteEmail}
          />
        </div>
        <div className={styles["item"]}>
          <span className={styles["label"]}>
            {translate("PL.drawer_name_person_quoting_price")}
          </span>
          <OneLineText className={styles["value"]} value={data?.quoteName} />
        </div>
        <div className={styles["item"]}>
          <span>{translate("CM.phone_number")}</span>
          <OneLineText className={styles["value"]} value={data?.phoneNumber} />
        </div>
      </div>
      <div className={classNames(styles["container"], "border-bottom-0")}>
        <div className={classNames(styles["item"], "w-100")}>
          <span className={styles["label"]}>
            {translate("PL.drawer_address_supplier")}
          </span>
          <OneLineText className={styles["value"]} value={data?.address} />
        </div>
      </div>
    </>
  );

  return (
    <AdvancedCollapseView
      items={[
        {
          key: "1",
          label: translate("CM.tab_general_information"),
          children: renderGeneral,
        },
        {
          key: "2",
          label: translate("PL.purchasing_plan_email_receiver_information"),
          children: (
            <EmailRecipientDetails data={data.emailRecipients ?? []} isDetail />
          ),
        },
      ]}
      className="p-0"
    />
  );
}
