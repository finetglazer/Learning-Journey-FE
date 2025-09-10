import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { reportContractDebtDetailRepository } from "core/repositories/ReportContractDebtDetailRepository";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { OrderContractFilter } from "models/OrderContract/OrderContractFilter";
import CollapseResultReport from "pages/ReportPage/Components/CollapseResultReport/CollapseResultReport";
import useReportDetail from "pages/ReportPage/Components/hooks/useReportDetail";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContractClassification } from "./Components/constant";
import ContractInformation from "./Components/Collapse/ContractInformation";
import PaymentTracking from "./Components/Collapse/PaymentTracking";
import Filter from "./Components/Filter";

const ContractDebtDetail = () => {
  const [translate] = useTranslation();

  const {
    modelFilter,
    isReset,
    detail,
    handleFilterDetail,
    handleResetFilterDetail,
    handleChangeSelectFilter,
    isShowResult,
    handleExportFileWithFilter,
  } = useReportDetail({
    ModelFilterClass: OrderContractFilter,
    getDetail: reportContractDebtDetailRepository.getDetail,
    onExport: reportContractDebtDetailRepository.export,
  });
  const detailData = detail?.data;

  const checkType = isEqual(
    detailData?.contractInfoReportDTO?.contractRequestType,
    ContractClassification.Contract
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: "CONTRACT_INFORMATION",
        label: checkType
          ? translate("AC.txt_tab_contract_info")
          : translate(
              "report.purchase.order_contract_summary.tab.txt_information_order"
            ),
        children: <ContractInformation data={detailData} />,
      },
      {
        key: "PAYMENT_TRACKING",
        label: translate(
          "report.purchase.contract_debt_detail.title_payment_tracking"
        ),
        children: <PaymentTracking data={detailData?.paymentTrackings} />,
      },
    ],
    [detailData, translate]
  );

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.contract_debt_detail.title_detail")}
      filterComponent={
        <Filter
          modelFilter={modelFilter}
          error={isReset ? undefined : modelFilter}
          onFilter={handleFilterDetail}
          onReset={handleResetFilterDetail}
          handleChangeSelectFilter={handleChangeSelectFilter}
        />
      }
    >
      <CollapseResultReport
        items={itemsCollapse}
        modelFilter={modelFilter}
        isShowResult={isShowResult}
        isShowUnit={true}
        onExport={() =>
          handleExportFileWithFilter(
            `${translate(
              "report.purchase.contract_debt_detail.title_detail_contract"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        loadingExport={false}
      />
    </PurchaseReportLayout>
  );
};

export default ContractDebtDetail;
