import { Tooltip } from "antd";
import {
  CONTRACT_ROUTE_VIEW,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { OrderContractDetailInformationModel } from "models/OrderContract/OrderContract";
import ContractInforCommon from "pages/ReportPage/Components/ContractInforCommon/ContractInforCommon";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./ContractInformation.module.scss";
import { ContractClassification } from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/constant";
import { isEqual } from "lodash";

interface ContractInformationProps {
  data?: OrderContractDetailInformationModel;
}

export default function ContractInformation({
  data,
}: ContractInformationProps) {
  const [translate] = useTranslation();

  const calculateTotalValue = (amountBeforeTax = 0, tax = 0): number =>
    amountBeforeTax + tax;

  const isContract = isEqual(
    data?.contractRequestType,
    ContractClassification.Contract
  );

  const contractData = [
    {
      title: isContract
        ? translate("AC.txt_contract_code")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_code_order"
          ),
      text: (
        <Link
          to={`${CONTRACT_ROUTE_VIEW}/${data?.id}`}
          target="_blank"
          className="text-decoration-none"
        >
          <OneLineText value={data?.code} className={styles["text-code"]} />
        </Link>
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_number")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_number_order"
          ),
      text: (
        <OneLineText
          value={data?.contractNo}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_name")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_name_order"
          ),
      text: <OneLineText value={data?.name} className={styles["text-value"]} />,
    },
    {
      title: isContract
        ? translate("AC.txt_contract_type")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_type_order"
          ),
      text: (
        <OneLineText
          value={data?.contractTypeName}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.tab.txt_tax_code_supplier"
      ),
      text: (
        <OneLineText
          value={data?.supplierTaxCode}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("CA.txt_seller_supplier_name"),
      text: (
        <OneLineText
          value={data?.supplierName}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("CA.txt_expense_type"),
      text: (
        <Tooltip title={`${data?.costTypeName}`} placement="topLeft">
          <span
            className={styles["text-value"]}
          >{`${data?.costTypeCode} - ${data?.costTypeName}`}</span>
        </Tooltip>
      ),
    },
    {
      title: translate("CT.expense_item"),
      text: (
        <OneLineText
          value={data?.costItemName}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_total_value")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_total_order"
          ),
      text: (
        <OneLineText
          value={formatNumber(
            calculateTotalValue(data?.totalAmountBeforeTax, data?.totalTax)
          )}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: isContract
        ? translate(
            "report.purchase.order_contract_summary.tab.txt_value_before_tax"
          )
        : translate(
            "report.purchase.order_contract_summary.tab.txt_value_before_tax_order"
          ),
      text: (
        <OneLineText
          value={formatNumber(data?.totalAmountBeforeTax)}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("AC.txt_tax_amount"),
      text: (
        <OneLineText
          value={formatNumber(data?.totalTax)}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("CT.payment_trackings.currency"),
      text: (
        <OneLineText value={data?.currency} className={styles["text-value"]} />
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_manager_unit_filter")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_unit_order"
          ),
      text: (
        <Tooltip
          title={`${data?.manageOrganizationCode} - ${data?.manageOrganizationName}`}
          placement="topLeft"
        >
          <span className={styles["truncate-25"]}>
            {data?.manageOrganizationName}
          </span>
        </Tooltip>
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_manager_filter")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_person_order"
          ),
      text: (
        <Tooltip
          title={`${data?.manageUserEmail} - ${data?.manageUserName}`}
          placement="topLeft"
        >
          <span className={styles["truncate-25"]}>{data?.manageUserEmail}</span>
        </Tooltip>
      ),
    },
    {
      title: isContract
        ? translate(
            "report.purchase.order_contract_summary.table.txt_contract_creating_unit"
          )
        : translate(
            "report.purchase.order_contract_summary.tab.txt_unit_create_order"
          ),
      text: (
        <Tooltip
          title={`${data?.createdOrganizationCode} - ${data?.createdOrganizationName}`}
          placement="topLeft"
        >
          <span className={styles["truncate-25"]}>
            {data?.createdOrganizationName}
          </span>
        </Tooltip>
      ),
    },
    {
      title: isContract
        ? translate(
            "report.purchase.order_contract_summary.table.txt_contract_creator"
          )
        : translate(
            "report.purchase.order_contract_summary.tab.txt_person_create_order"
          ),
      text: (
        <Tooltip
          title={`${data?.createdUserEmail} - ${data?.createdUserName}`}
          placement="topLeft"
        >
          <span className={styles["truncate-25"]}>
            {data?.createdUserEmail}
          </span>
        </Tooltip>
      ),
    },
    {
      title: translate("AC.txt_table_effective_date"),
      text: (
        <OneLineText
          value={formatDateTimeToVietnamTimezone(
            data?.effectiveDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("CM.txt_end_date"),
      text: (
        <OneLineText
          value={formatDateTimeToVietnamTimezone(
            data?.endDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate("AC.txt_approval_date"),
      text: (
        <OneLineText
          value={formatDateTimeToVietnamTimezone(
            data?.approvedDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
          className={styles["text-value"]}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.tab.txt_count_annex"
      ),
      text: (
        <Tooltip title={data?.appendixCount?.toString()} placement="topLeft">
          <span className={styles["text-value"]}>
            {data?.appendixCount?.toString()}
          </span>
        </Tooltip>
      ),
    },
    {
      title: translate("CT.contract_plan.code"),
      text: (
        <Link
          to={`${PURCHASING_PLAN_VIEW_ROUTE}/${data?.originalPurchasePlanId}`}
          target="_blank"
          className="text-decoration-none"
        >
          <OneLineText
            value={data?.originalPurchasePlanCode}
            className={styles["text-code"]}
          />
        </Link>
      ),
    },
    {
      title: translate("AC.txt_table_purchase_request"),
      text: (
        <Link
          to={`${PURCHASE_REQUEST_VIEW_ROUTE}/${data?.originalPurchaseRequestId}`}
          target="_blank"
          className="text-decoration-none"
        >
          <OneLineText
            value={data?.originalPurchaseRequestCode}
            className={styles["text-code"]}
          />
        </Link>
      ),
    },
  ];

  return (
    <div className={styles["contract-information"]}>
      <ContractInforCommon contractData={contractData} />
    </div>
  );
}
