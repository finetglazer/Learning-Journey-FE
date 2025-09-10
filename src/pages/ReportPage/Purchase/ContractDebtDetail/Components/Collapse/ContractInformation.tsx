import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { OrderContractDetailInformationModel } from "models/OrderContract/OrderContract";
import ContractInforCommon from "pages/ReportPage/Components/ContractInforCommon/ContractInforCommon";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContractClassification } from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/constant";
import { isEqual } from "lodash";

interface ContractInformationProps {
  data?: OrderContractDetailInformationModel;
}

export default function ContractInformation({
  data,
}: ContractInformationProps) {
  const [translate] = useTranslation();
  const dataSupplier = data?.supplierInfoReportDTO;
  const dataContract = data?.contractInfoReportDTO;

  const isContract = isEqual(
    dataContract?.contractRequestType,
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
          to={`${CONTRACT_ROUTE_VIEW}/${dataContract?.id}`}
          target="_blank"
          className="text-decoration-none"
        >
          <OneLineText
            value={dataContract?.code}
            className="text-table-content-primary"
          />
        </Link>
      ),
    },
    {
      title: isContract
        ? translate("AC.txt_contract_number")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_number_order"
          ),
      text: <OneLineText value={dataContract?.contractNo} />,
    },
    {
      title: isContract
        ? translate("AC.txt_contract_name")
        : translate(
            "report.purchase.order_contract_summary.tab.txt_name_order"
          ),
      text: <OneLineText value={dataContract?.name} />,
    },
    {},
    {
      title: translate("CA.txt_seller_supplier_name"),
      text: <OneLineText value={dataSupplier?.name} />,
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.tab.txt_tax_code_supplier"
      ),
      text: <OneLineText value={dataSupplier?.taxCode} />,
    },
    {
      title: translate("AC.txt_approval_date"),
      text: (
        <OneLineText
          value={formatDateTimeToVietnamTimezone(
            dataContract?.approvedDate,
            STANDARD_DATE_FORMAT_SLASH
          )}
        />
      ),
    },
    {
      title: translate("AC.txt_table_effective_date"),
      text: (
        <OneLineText
          value={
            formatDateTimeToVietnamTimezone(
              dataContract?.effectiveDate,
              STANDARD_DATE_FORMAT_SLASH
            ) +
            " - " +
            formatDateTimeToVietnamTimezone(
              dataContract?.endDate,
              STANDARD_DATE_FORMAT_SLASH
            )
          }
        />
      ),
    },
    {
      title: translate("report.purchase.contract_debt_detail.table.currency"),
      text: <OneLineText value={data?.currency} />,
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.totalAmount"
      ),
      text: <OneLineText value={formatNumber(data?.totalAmount)} />,
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.paymentAdvanceConvertedAmount"
      ),
      text: (
        <OneLineText
          value={formatNumber(data?.paymentAdvanceConvertedAmount)}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.remainingValuePerContractAmount"
      ),
      text: (
        <OneLineText
          value={formatNumber(data?.remainingValuePerContractAmount)}
        />
      ),
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.contractSettlementAmount"
      ),
      text: (
        <OneLineText value={formatNumber(data?.contractSettlementAmount)} />
      ),
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.proposedPaymentAmount"
      ),
      text: <OneLineText value={formatNumber(data?.proposedPaymentAmount)} />,
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.retainedAmount"
      ),
      text: <OneLineText value={formatNumber(data?.retainedAmount)} />,
    },
    {
      title: translate(
        "report.purchase.contract_debt_detail.table.remainingValuePerFinalSettlementAmount"
      ),
      text: (
        <OneLineText
          value={formatNumber(data?.remainingValuePerFinalSettlementAmount)}
        />
      ),
    },
  ];

  return (
    <div>
      <ContractInforCommon contractData={contractData} />
    </div>
  );
}
