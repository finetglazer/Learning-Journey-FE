import { type TableColumnsType, Tooltip } from "antd";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_TIME_FORMAT_MM_YYYY,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { budgetReportRepository } from "core/repositories/BudgetReport";
import dayjs from "dayjs";
import { isObject, isUndefined } from "lodash";
import { BudgetReportFilter } from "models/BudgetReport/BudgetReportFilter";
import {
  BudgetReportUsageModel,
  CostLine,
} from "models/BudgetReport/BudgetReportModel";
import { OptionBaseModel } from "models/Common/Common";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import BudgetReportLayout from "pages/ReportPage/Components/Layout/BudgetReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import Filter from "./Components/Filter";

export const Usage = () => {
  const [translate] = useTranslation();
  const {
    modelFilter,
    loadingList,
    count,
    list,
    error,
    isReset,
    isShowResult,
    handleFilter,
    handleResetFilter,
    handlePagination,
    handleExportFile,
    handleChangeSelectFilter,
    handleChangeDateFilter,
    handleChangeAllFilter,
  } = useReport({
    ModelFilterClass: BudgetReportFilter,
    getList: budgetReportRepository.usageList,
    onExport: budgetReportRepository.exportUsageReport,
  });

  const columns: TableColumnsType<BudgetReportUsageModel> = [
    {
      width: 400,
      children: [
        {
          title: translate("report.budget.filter.txt_project"),
          key: "project",
          dataIndex: "project",
          width: 200,
          render(value: OptionBaseModel) {
            return (
              <LayoutCell>
                <Tooltip
                  title={`${value?.code || ""} - ${value?.name || ""} - ${
                    formatDate(
                      value?.startTime,
                      STANDARD_TIME_FORMAT_MM_YYYY
                    ) || ""
                  } - ${
                    formatDate(value?.endTime, STANDARD_TIME_FORMAT_MM_YYYY) ||
                    ""
                  }`}
                  className="w-100"
                >
                  <div className="text-truncate">
                    {value?.code} - {value?.name}
                  </div>
                </Tooltip>
              </LayoutCell>
            );
          },
        },
        {
          title: translate("BG.cost_line"),
          key: "costLine",
          dataIndex: "costLine",
          width: 200,
          render(value: CostLine) {
            return (
              <LayoutCell>
                <OneLineText
                  value={`${value?.code || ""} - ${value?.name || ""}`}
                />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 1000,
      title: translate("report.budget.usage.table.txt_report_period_usage"),
      children: [
        {
          title: translate(
            "report.budget.usage.table.txt_report_period_proposal"
          ),
          key: "usageAmountMonthly",
          dataIndex: "usageAmountMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("report.budget.usage.table.txt_actual_payment"),
          key: "actualPaymentMonthly",
          dataIndex: "actualPaymentMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("report.budget.usage.table.txt_monthly_budget"),
          key: "budgetMonthly",
          dataIndex: "budgetMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_remaining_after_proposal"
          ),
          key: "remainingBudgetAfterProposal",
          dataIndex: "remainingBudgetAfterProposal",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_remaining_after_payment"
          ),
          key: "remainingBudgetAfterPayment",
          dataIndex: "remainingBudgetAfterPayment",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 1000,
      title: translate("report.budget.usage.table.txt_cumulative_usage"),
      children: [
        {
          title: translate("report.budget.usage.table.txt_cumulative_proposal"),
          key: "cumulativeUsageAmountMonthly",
          dataIndex: "cumulativeUsageAmountMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_cumulative_actual_payment"
          ),
          key: "cumulativeActualPaymentMonthly",
          dataIndex: "cumulativeActualPaymentMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("report.budget.usage.table.txt_cumulative_budget"),
          key: "cumulativeBudgetMonthly",
          dataIndex: "cumulativeBudgetMonthly",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_cumulative_remaining_after_proposal"
          ),
          key: "remainingCumulativeBudgetAfterProposal",
          dataIndex: "remainingCumulativeBudgetAfterProposal",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_cumulative_remaining_after_payment"
          ),
          key: "remainingCumulativeBudgetAfterPayment",
          dataIndex: "remainingCumulativeBudgetAfterPayment",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 830,
      title: translate("report.budget.usage.table.txt_annual_budget"),
      children: [
        {
          title: translate("report.budget.usage.table.txt_total_annual_budget"),
          key: "budgetAnnual",
          dataIndex: "budgetAnnual",
          width: 200,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_annual_remaining_after_proposal"
          ),
          key: "remainingAnnualBudgetAfterApprovedProposal",
          dataIndex: "remainingAnnualBudgetAfterApprovedProposal",
          width: 315,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.budget.usage.table.txt_annual_remaining_after_payment"
          ),
          key: "remainingAnnualBudgetAfterPayment",
          dataIndex: "remainingAnnualBudgetAfterPayment",
          width: 315,
          align: "right",
          render(value: number) {
            return (
              <LayoutCell position="right">
                <OneLineText value={formatNumber(value)} />
              </LayoutCell>
            );
          },
        },
      ],
    },
  ];

  return (
    <BudgetReportLayout
      title={translate("report.budget.usage.title")}
      filterComponent={
        <Filter
          error={isReset ? undefined : error}
          modelFilter={modelFilter}
          onFilter={handleFilter}
          onReset={handleResetFilter}
          handleChangeSelectFilter={handleChangeSelectFilter}
          handleChangeDateFilter={handleChangeDateFilter}
          handleChangeAllFilter={handleChangeAllFilter}
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
            `${translate("report.budget.usage.title")}_${formatDate(
              dayjs(),
              STANDARD_DATE_FORMAT_COMPACT_WITH_TIME
            )}`
          )
        }
        onChangePagination={handlePagination}
        isShowResult={
          isUndefined(error) &&
          isObject(modelFilter?.businessUnitValue) &&
          !isReset &&
          isShowResult
        }
        isShowUnit
      />
    </BudgetReportLayout>
  );
};
