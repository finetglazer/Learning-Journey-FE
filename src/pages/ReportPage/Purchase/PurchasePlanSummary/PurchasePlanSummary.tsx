import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { paymentReportRepository } from "core/repositories/PaymentReport";
import dayjs from "dayjs";
import { isObject, isUndefined } from "lodash";
import { PaymentReportAuthorityFilter } from "models/PaymentReport/PaymentReportFilter";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { useTranslation } from "react-i18next";
import Filter from "./Components/Filter";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { useColumns } from "./Components/helper";

export default function PurchasePlanSummary() {
  const [translate] = useTranslation();

  const {
    modelFilter,
    loadingList,
    list,
    count,
    error,
    isReset,
    isShowResult,
    handleFilter,
    handleResetFilter,
    handlePagination,
    handleExportFile,
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
  } = useReport({
    ModelFilterClass: PaymentReportAuthorityFilter,
    getList: reportRepository.getPurchasePlanSummary,
    onExport: reportRepository.getPurchasePlanSummaryFile,
  });
  const columns = useColumns({
    pageIndex: modelFilter?.pageIndex,
    pageSize: modelFilter?.pageSize,
  });

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.purchase_plan_summary.title")}
      filterComponent={
        <Filter
          modelFilter={modelFilter}
          error={isReset ? undefined : error}
          onFilter={handleFilter}
          onReset={handleResetFilter}
          handleChangeDateRangeFilter={handleChangeDateRangeFilter}
          handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
          handleChangeSelectFilter={handleChangeSelectFilter}
        />
      }
    >
      <ResultReport
        columns={columns}
        loadingList={loadingList}
        dataSource={list}
        modelFilter={modelFilter}
        total={count}
        onExport={() =>
          handleExportFile(
            `${translate(
              "report.purchase.purchase_plan_summary.title"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        onChangePagination={handlePagination}
        isShowResult={
          isUndefined(error) &&
          isObject(modelFilter?.createDateRange) &&
          !isReset &&
          isShowResult
        }
      />
    </PurchaseReportLayout>
  );
}
