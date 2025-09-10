import type { TableColumnsType } from "antd";
import { NavLink } from "react-router-dom";
import { formatNumber } from "core/helpers/number";
import { useTranslation } from "react-i18next";
import { BudgetReportFilter } from "models/BudgetReport/BudgetReportFilter";
import { CONTRACT_ROUTE_VIEW, PROPOSAL_DETAIL_ROUTE } from "config/route-const";
import { budgetReportRepository } from "core/repositories/BudgetReport";
import { LayoutCell, OneLineText } from "react-components-design-system";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_DATE_FORMAT_SLASH,
  STRING_NA,
} from "core/config/consts";
import {
  formatDate,
  formatDateTimeToVietnamTimezone,
} from "core/helpers/date-time";
import dayjs from "dayjs";
import Filter from "./Components/Filter";
import Tooltip from "antd/es/tooltip";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import BudgetReportLayout from "pages/ReportPage/Components/Layout/BudgetReportLayout";
import { getValueOrDefault } from "core/helpers/common";

export default function Control() {
  const [translate] = useTranslation();

  const {
    list,
    count,
    error,
    modelFilter,
    loadingList,
    isShowResult,
    handleFilter,
    handlePagination,
    handleExportFile,
    handleResetFilter,
    handleChangeDateFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
  } = useReport({
    ModelFilterClass: BudgetReportFilter,
    getList: budgetReportRepository.controlList,
    onExport: budgetReportRepository.exportControlReport,
  });

  const columns: TableColumnsType = [
    {
      title: translate("report.budget.control.table.txt_number_submission"),
      width: 160,
      key: "proposalCode",
      dataIndex: "proposalCode",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.proposalCode + " - " + record?.proposalName}
            >
              <NavLink
                to={`${PROPOSAL_DETAIL_ROUTE}/${record?.proposalId}`}
                className="hyperlink w-100"
              >
                <div className="text-table-content-primary">{value}</div>
              </NavLink>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_approved_budget"),
      width: 200,
      align: "right",
      key: "approvedBudget",
      dataIndex: "approvedBudget",
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText value={`${formatNumber(value)} ${record?.currency}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.filter.txt_project"),
      width: 250,
      key: "projectName",
      dataIndex: "projectName",
      render(_, record) {
        if (!record) return null;
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.projectCode + " - " + record?.projectName}
            >
              <div className="text-in-table-cell">{`${record?.projectCode} - ${record?.projectName}`}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_contract_number"),
      width: 150,
      key: "contractCode",
      dataIndex: "contractCode",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={
                record?.contractCode +
                " - " +
                record?.contractNo +
                " - " +
                record?.contractName
              }
            >
              <NavLink
                to={`${CONTRACT_ROUTE_VIEW}/${record?.contractId}`}
                className="hyperlink w-100"
              >
                <div className="text-table-content-primary">{value}</div>
              </NavLink>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_contract_amount"),
      width: 200,
      align: "right",
      key: "contractAmount",
      dataIndex: "contractAmount",
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.contractAmount + " - " + record?.currency}
            >
              <div className="text-in-table-cell">{`${formatNumber(value)} ${
                record?.currency
              }`}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_settlement_amount"),
      width: 200,
      align: "right",
      key: "finalizedAmount",
      dataIndex: "finalizedAmount",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={getValueOrDefault(formatNumber(value))} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_payment_advance_ratio"),
      width: 190,
      align: "right",
      key: "paymentAdvanceRatioPercent",
      dataIndex: "paymentAdvanceRatioPercent",
      render(value: string) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={
                getValueOrDefault(value) === STRING_NA
                  ? STRING_NA
                  : `${getValueOrDefault(value)}%`
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.control.table.txt_payment_advance_amount"
      ),
      width: 200,
      align: "right",
      key: "paymentAdvanceAmount",
      dataIndex: "paymentAdvanceAmount",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_remaining_amount"),
      width: 200,
      align: "right",
      key: "remainingAmount",
      dataIndex: "remainingAmount",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_warranty_amount"),
      width: 200,
      align: "right",
      key: "warrantyRetentionAmount",
      dataIndex: "warrantyRetentionAmount",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={getValueOrDefault(formatNumber(value))} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_first_payment_date"),
      ellipsis: true,
      width: 200,
      key: "firstPaymentDate",
      dataIndex: "firstPaymentDate",
      render(firstPaymentDate: string) {
        const dateOnly = formatDateTimeToVietnamTimezone(
          firstPaymentDate,
          STANDARD_DATE_FORMAT_SLASH
        );

        return (
          <LayoutCell>
            <OneLineText value={getValueOrDefault(dateOnly)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_reporting_month"),
      ellipsis: true,
      width: 120,
      key: "reportingMonthDate",
      dataIndex: "reportingMonthDate",
      render(reportingMonthDate: string) {
        const dateOnly = formatDateTimeToVietnamTimezone(
          reportingMonthDate,
          STANDARD_DATE_FORMAT_SLASH
        );

        return (
          <LayoutCell>
            <OneLineText value={getValueOrDefault(dateOnly)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_implement_month"),
      width: 145,
      align: "right",
      key: "executionMonths",
      dataIndex: "executionMonths",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={getValueOrDefault(formatNumber(value))} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_clue_unit"),
      width: 200,
      key: "businessLeadUnitName",
      dataIndex: "businessLeadUnitName",
      render(_, item) {
        if (!item) return null;
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={
                item?.ownerBusinessUnitCode +
                " - " +
                item?.ownerBusinessUnitName +
                "," +
                item?.ownerBusinessBranchCode +
                " - " +
                item?.ownerBusinessBranchName +
                "," +
                item?.ownerBusinessDepartmentCode +
                " - " +
                item?.ownerBusinessDepartmentName
              }
            >
              <div className="text-ellipsis">{`${item?.ownerBusinessUnitCode} - ${item?.ownerBusinessUnitName}`}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.control.table.txt_settlement_support_unit"
      ),
      width: 200,
      key: "settlementSupportUnitName",
      dataIndex: "settlementSupportUnitName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={getValueOrDefault(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.budget.control.table.txt_acceptance_status"),
      width: 200,
      key: "acceptanceStatus",
      dataIndex: "acceptanceStatus",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <BudgetReportLayout
      title={translate("report.budget.control.title")}
      filterComponent={
        <Filter
          error={error}
          onReset={handleResetFilter}
          onFilter={handleFilter}
          modelFilter={modelFilter}
          handleChangeSelectFilter={handleChangeSelectFilter}
          handleChangeDateFilter={handleChangeDateFilter}
          handleChangeAllFilter={handleChangeAllFilter}
        />
      }
    >
      <ResultReport
        columns={columns}
        dataSource={list}
        onExport={() =>
          handleExportFile(
            `${translate("report.budget.control.title")}_${formatDate(
              dayjs(),
              STANDARD_DATE_FORMAT_COMPACT_WITH_TIME
            )}`
          )
        }
        bordered={false}
        loadingList={loadingList}
        modelFilter={modelFilter}
        total={count}
        onChangePagination={handlePagination}
        isShowResult={isShowResult}
      />
    </BudgetReportLayout>
  );
}
