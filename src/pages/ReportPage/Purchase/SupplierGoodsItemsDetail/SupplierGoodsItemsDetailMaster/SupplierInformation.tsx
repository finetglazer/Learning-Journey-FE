import React from "react";
import { Supplier } from "models/Supplier/Supplier";
import styles from "./CollapseResult.module.scss";
import ContractInforCommon from "pages/ReportPage/Components/ContractInforCommon/ContractInforCommon";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { SUPPLIER_VIEW_ROUTE } from "config/route-const";
import { Link } from "react-router-dom";
import { formatDateToVietnamTimezone } from "core/helpers/date-time";

interface SupplierInformationProps {
  data?: Supplier;
}

const SupplierInformation: React.FC<SupplierInformationProps> = ({ data }) => {
  const [translate] = useTranslation();

  const contractData = [
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_supplier_code"
      ),
      text: (
        <Link
          to={`${SUPPLIER_VIEW_ROUTE}/${data?.id}`}
          target="_blank"
          className="text-decoration-none"
        >
          <OneLineText value={data?.code} className={styles["text-code"]} />
        </Link>
      ),
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_supplier_name"
      ),
      text: <OneLineText value={data?.name} className={styles["text-value"]} />,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_supplier_short_name"
      ),
      text: (
        <OneLineText value={data?.shortName} className={styles["text-value"]} />
      ),
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_supplier_type"
      ),
      text: (
        <OneLineText
          value={
            data?.supplierCategory?.code && data?.supplierCategory?.name
              ? `${data?.supplierCategory?.code} - ${data?.supplierCategory?.name}`
              : data?.supplierCategory?.code
              ? data?.supplierCategory?.name
              : ""
          }
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_supplier_category"
      ),
      text: <OneLineText value={data?.type} className={styles["text-value"]} />,
    },
    {
      title: translate(
        "report.purchase.supplier_goods_items_detail.table.txt_created_date"
      ),
      text: (
        <OneLineText
          value={formatDateToVietnamTimezone(
            dayjs(data?.createDate)?.toDate().toISOString()
          )}
          className={styles["text-value"]}
        />
      ),
    },
  ];
  return (
    <div className={styles["contract-information"]}>
      <ContractInforCommon contractData={contractData} column={3} />
    </div>
  );
};

export default SupplierInformation;
