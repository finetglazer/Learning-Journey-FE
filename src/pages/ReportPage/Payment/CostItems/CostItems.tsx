import dayjs from "dayjs";
import { isUndefined } from "lodash";
import PaymentReportLayout from "pages/ReportPage/Components/Layout/PaymentReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { useTranslation } from "react-i18next";
import { CostItemsContext, useCostItemsHook } from "./CostItemsHook";
import FilterCostItems from "./components/FilterCostItems";
import { useColumns } from "./components/helper";

export default function CostItems() {
  const appUserMaster = useCostItemsHook();

  const {
    list,
    count,
    modelFilter,
    loadingList,
    handleResetFilter,
    handleApplyFilter,
    handlePagination,
    isShowResult,
    loadingFile,
    handleExportExcelFile,
    isHaveDate,
    error,
  } = appUserMaster;
  const isEmptyError = Object.keys(error || {}).length === 0;

  const columns = useColumns();
  const [translate] = useTranslation();

  return (
    <CostItemsContext.Provider value={appUserMaster}>
      <PaymentReportLayout
        title={translate("report.payment.cost_items.title")}
        filterComponent={
          <FilterCostItems
            onReset={handleResetFilter}
            onFilter={handleApplyFilter}
          />
        }
      >
        <ResultReport
          columns={columns}
          dataSource={list}
          loadingList={loadingList}
          isEmptyError={isEmptyError}
          onExport={() =>
            handleExportExcelFile(
              modelFilter,
              translate("report.payment.cost_items.title") +
                `_${dayjs().format("DDMMYYYY HHmm")}`
            )
          }
          modelFilter={modelFilter}
          loadingExport={loadingFile}
          total={count}
          onChangePagination={handlePagination}
          isShowResult={isShowResult && isHaveDate && isUndefined(error)}
        />
      </PaymentReportLayout>
    </CostItemsContext.Provider>
  );
}
