import dayjs from "dayjs";
import PaymentReportLayout from "pages/ReportPage/Components/Layout/PaymentReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { useTranslation } from "react-i18next";
import FilterPromotion from "./components/FilterPromotion";
import { useColumns } from "./components/helper";
import { PromotionContext, usePromotionHook } from "./PromotionHook";
import { isUndefined } from "lodash";

export default function Promotion() {
  const appUserMaster = usePromotionHook();

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
    <PromotionContext.Provider value={appUserMaster}>
      <PaymentReportLayout
        title={translate("report.payment.promotion.title")}
        filterComponent={
          <FilterPromotion
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
              translate("report.payment.promotion.title") +
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
    </PromotionContext.Provider>
  );
}
