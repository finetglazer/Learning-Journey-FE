import { NOT_AVAILABLE } from "config/const";
import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { purchasingContractReportRepository } from "core/repositories/PurchasingContractReportRepository";
import dayjs from "dayjs";
import { isEqual, isNull, isUndefined } from "lodash";
import { OrderContractFilter } from "models/OrderContract/OrderContractFilter";
import CollapseResultReport from "pages/ReportPage/Components/CollapseResultReport/CollapseResultReport";
import useReportDetail from "pages/ReportPage/Components/hooks/useReportDetail";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { TabKey } from "pages/ReportPage/Purchase/OrderContractSummary/Components/constant";
import ContractAnnexInformation from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/Collaspe/ContractAnnexInformation/ContractAnnexInformation";
import ContractGuarantee from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/Collaspe/ContractGuarantee/ContractGuarantee";
import ContractInformation from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/Collaspe/ContractInformation/ContractInformation";
import ContractWarranty from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/Collaspe/ContractWarranty/ContractWarranty";
import { ContractClassification } from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/constant";
import OrderContractSummaryDetailFilter from "pages/ReportPage/Purchase/OrderContractSummaryDetail/Components/OrderContractSummaryDetailFilter";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./OrderContractSummaryDetail.module.scss";

const OrderContractSummaryDetail = () => {
  const [translate] = useTranslation();

  const {
    modelFilter,
    isReset,
    detail,
    handleFilterDetail,
    handleResetFilterDetail,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    isShowResult,
    handleExportFile,
  } = useReportDetail({
    ModelFilterClass: OrderContractFilter,
    getDetail: purchasingContractReportRepository.getDetail,
    onExport: purchasingContractReportRepository.export,
  });

  const detailData = detail?.data;

  const checkType = isEqual(
    detailData?.info?.contractRequestType,
    ContractClassification.Contract
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.CONTRACT_INFORMATION,
        label: isEqual(
          detailData?.info?.contractRequestType,
          ContractClassification.Contract
        )
          ? translate("AC.txt_tab_contract_info")
          : translate(
              "report.purchase.order_contract_summary.tab.txt_information_order"
            ),
        children: <ContractInformation data={detailData?.info} />,
      },
      {
        key: TabKey.CONTRACT_ANNEX_INFORMATION,
        label: translate(
          checkType
            ? "CT.contract_appendix.title"
            : "report.purchase.order_contract_summary.tab.txt_annex_order"
        ),
        children: (
          <ContractAnnexInformation
            data={detailData?.appendixs}
            currency={detailData?.info?.currency}
          />
        ),
      },
      {
        key: TabKey.CONTRACT_GUARANTEE,
        label: translate(
          "report.purchase.order_contract_summary.tab.txt_contract_guarantee"
        ),
        rightTitle: (
          <span>
            {translate(
              "report.purchase.order_contract_summary.tab.txt_total_guarantee"
            )}
            &nbsp;
            <span className={styles["total-guarantee"]}>
              {isUndefined(detailData?.remainAmountForWarranty) ||
              isNull(detailData?.remainAmountForWarranty)
                ? NOT_AVAILABLE
                : formatNumber(detailData.remainAmountForWarranty)}
            </span>
          </span>
        ),
        children: <ContractWarranty data={detailData?.warranties} />,
      },
      {
        key: TabKey.CONTRACT_WARRANTY,
        label: translate(
          "report.purchase.order_contract_summary.tab.txt_contract_warranty"
        ),
        children: <ContractGuarantee data={detailData?.guarantees} />,
      },
    ],
    [detailData, translate]
  );

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.order_contract_summary.title_detail")}
      filterComponent={
        <OrderContractSummaryDetailFilter
          modelFilter={modelFilter}
          error={isReset ? undefined : modelFilter}
          onFilter={handleFilterDetail}
          onReset={handleResetFilterDetail}
          handleChangeSelectFilter={handleChangeSelectFilter}
          handleChangeAllFilter={handleChangeAllFilter}
        />
      }
    >
      <CollapseResultReport
        items={itemsCollapse}
        modelFilter={modelFilter}
        isShowResult={isShowResult}
        isShowUnit={true}
        onExport={() =>
          handleExportFile(
            `${translate(
              "report.purchase.order_contract_summary.title_detail_contract"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        loadingExport={false}
      />
    </PurchaseReportLayout>
  );
};

export default OrderContractSummaryDetail;
