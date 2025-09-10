import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import React from "react";
import { useTranslation } from "react-i18next";
import Filter from "./Components/Filter";
import useReport from "../../Components/hooks/useReport";
import { PaymentReportAuthorityFilter } from "models/PaymentReport/PaymentReportFilter";
import ResultReport from "../../Components/ResultReport/ResultReport";
import { isObject, isUndefined } from "lodash";
import { reportTransactionDailyRepository } from "core/repositories/ReportTransactionDailyRepository";
import { useColumns } from "./Components/helper";

const TransactionDaily = () => {
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
    getList: reportTransactionDailyRepository.getDetail,
    onExport: reportTransactionDailyRepository.export,
  });
  const columns = useColumns({
    pageIndex: modelFilter?.pageIndex,
    pageSize: modelFilter?.pageSize,
  });

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.transaction_daily.title_detail")}
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
              "report.purchase.transaction_daily.title_detail_contract"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        onChangePagination={handlePagination}
        isShowResult={
          isUndefined(error) &&
          isObject(modelFilter?.createdDateRange) &&
          !isReset &&
          isShowResult
        }
      />
    </PurchaseReportLayout>
  );
};

export default TransactionDaily;
