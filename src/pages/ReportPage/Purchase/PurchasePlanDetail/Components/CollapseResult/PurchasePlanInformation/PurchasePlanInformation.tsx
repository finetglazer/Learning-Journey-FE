import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import ContractInforCommon from "pages/ReportPage/Components/ContractInforCommon/ContractInforCommon";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./CollapseResult.module.scss";
import { listPurchasingPlanType } from "config/const";
import { formatNumber } from "core/helpers/number";
import { PurchaseDataType } from "models/Report/PurchasePlanDetail";

interface ContractInformationProps {
  data?: PurchaseDataType;
}

export default function PurchasePlanInformation({
  data,
}: ContractInformationProps) {
  const [translate] = useTranslation();

  const contractData = [
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.purchase_plan_code"
      ),
      text: <OneLineText value={data?.code} className={styles["text-code"]} />,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.purchase_plan_name"
      ),
      text: <OneLineText value={data?.name} className={styles["text-value"]} />,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.purchase_plan_form"
      ),
      text: (
        <OneLineText
          value={
            listPurchasingPlanType?.find(
              (item) => item?.id == data?.classification
            )?.name
          }
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: [
        translate(
          "report.purchase.purchase_plan_detail.information.purchase_plan_date"
        ),
        translate(
          "report.purchase.purchase_plan_detail.information.purchase_plan_approve"
        ),
      ],
      text: [
        <OneLineText
          key="created-date"
          value={formatDate(data?.createdDate, STANDARD_DATE_FORMAT_SLASH)}
          className={styles["text-value"]}
        />,
        <OneLineText
          key="approved-date"
          value={formatDate(data?.approvedDate, STANDARD_DATE_FORMAT_SLASH)}
          className={styles["text-value"]}
        />,
      ],
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.staff_handle"
      ),
      text: (
        <OneLineText
          value={data?.createUser + " - " + data?.createUserFullName}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.unit_handle"
      ),
      text: (
        <OneLineText
          value={data?.organization?.code + " - " + data?.organization?.name}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.description"
      ),
      text: <OneLineText value={data?.note} className={styles["text-value"]} />,
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.purchase_type_cost"
      ),
      text: (
        <OneLineText
          value={data?.costType?.code + " - " + data?.costType?.name}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.cost_item"
      ),
      text: (
        <OneLineText
          value={data?.costGroup?.code + " - " + data?.costGroup?.name}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.proposal_code"
      ),
      text: (
        <OneLineText
          value={data?.purchaseProposalCode}
          className={styles["text-code"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.request_purchase_code"
      ),
      text: (
        <OneLineText
          value={data?.purchaseRequestCode}
          className={styles["text-code"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.purchase_plan_detail.information.request_purchase_total"
      ),
      text: (
        <OneLineText
          value={
            formatNumber(data?.purchaseRequestTotalAmount) +
            " " +
            data?.currency
          }
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
}
