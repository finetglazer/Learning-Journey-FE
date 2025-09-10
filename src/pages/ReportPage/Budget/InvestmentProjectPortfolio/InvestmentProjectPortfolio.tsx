import type { TableColumnsType } from "antd";
import { formatNumber } from "core/helpers/number";
import { useTranslation } from "react-i18next";
import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import { Filter } from "./Components/Filter";
import Tooltip from "antd/es/tooltip";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import BudgetReportLayout from "pages/ReportPage/Components/Layout/BudgetReportLayout";
import { InvestmentProjectPortfolioFilter } from "models/InvestmentProjectPortfolio/InvestmentProjectPortfolioFilter";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import { InvestmentProjectPortfolioModel } from "models/InvestmentProjectPortfolio/InvestmentProjectPortfolioModel";
import { listInvestmentProjectPortfolioStatusEnum } from "config/const";
import { reportRepository } from "../../ReportRepository";

export default function InvestmentProjectPortfolio() {
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
    dispatchFilter,
  } = useReport({
    ModelFilterClass: InvestmentProjectPortfolioFilter,
    getList: reportRepository.getInvestmentProjectPortfolioList,
    onExport: reportRepository.getInvestmentProjectPortfolioFile,
  });

  const columns: TableColumnsType<InvestmentProjectPortfolioModel> = [
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_project_code"
      ),
      width: 250,
      key: "projectCode",
      dataIndex: "projectCode",
      render(_value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.projectCode}
            />
            <OneLineText value={record?.projectCode} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_project_name"
      ),
      width: 280,
      align: "left",
      key: "projectName",
      dataIndex: "projectName",
      render(_value: number, record) {
        return (
          <LayoutCell position="left">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.projectName}
            />
            <OneLineText value={record?.projectName} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_start_date"
      ),
      width: 250,
      key: "startDate",
      dataIndex: "startDate",
      align: "center",
      render(_value: number, record) {
        if (!record) return null;
        return (
          <LayoutCell position="center">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatDate(record?.startDate)}
            />
            <OneLineText value={formatDate(record?.startDate)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_end_date"
      ),
      width: 150,
      key: "endDate",
      dataIndex: "endDate",
      align: "center",
      render(_value: number, record) {
        return (
          <LayoutCell position="center">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatDate(record?.endDate)}
            />
            <OneLineText value={formatDate(record?.endDate)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_unit_handle"
      ),
      width: 250,
      key: "businessUnitHandling",
      dataIndex: "businessUnitHandling",
      align: "center",
      render(_value: number, record) {
        return (
          <LayoutCell position="center">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.businessUnitHandling}
            ></Tooltip>
            <OneLineText value={record?.businessUnitHandling} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_approved_amount"
      ),
      width: 200,
      align: "center",
      key: "approvedAmount",
      dataIndex: "approvedAmount",
      render(_value: number, record) {
        return (
          <LayoutCell position="right">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatNumber(record?.approvedAmount)}
            />
            <OneLineText value={formatNumber(record?.approvedAmount)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_settlement_amount"
      ),
      width: 200,
      align: "center",
      key: "settlementAmount",
      dataIndex: "settlementAmount",
      render(_value: number, record) {
        return (
          <LayoutCell position="right">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatNumber(record?.settlementAmount)}
            />
            <OneLineText value={formatNumber(record?.settlementAmount)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_paid_amount"
      ),
      width: 200,
      align: "center",
      key: "paidAmount",
      dataIndex: "paidAmount",
      render(_value: number, record) {
        return (
          <LayoutCell position="right">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatNumber(record?.paidAmount)}
            />
            <OneLineText value={formatNumber(record?.paidAmount)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_payable_amount"
      ),
      width: 200,
      align: "center",
      key: "payableAmount",
      dataIndex: "payableAmount",
      render(_value: number, record) {
        return (
          <LayoutCell position="right">
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={formatNumber(record?.payableAmount)}
            />
            <OneLineText value={formatNumber(record?.payableAmount)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.budget.investment_project_portfolio.table.txt_status"
      ),
      key: "status",
      dataIndex: "status",
      align: "center",
      width: 140,
      render(_value: number, record) {
        const item = listInvestmentProjectPortfolioStatusEnum.find(
          (type) => type.id === record.status
        );
        return (
          <LayoutCell position="center">
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      },
    },
  ];

  const mapInvestmentProjectPortfolioList =
    (): InvestmentProjectPortfolioModel[] => {
      if (!list || !list.length) return [];
      return list.map((item: InvestmentProjectPortfolioModel) => ({
        projectCode: item.project?.code ?? "",
        projectName: item.name,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        businessUnitHandling: item.businessUnit
          ? item.businessUnit?.code + " - " + item.businessUnit?.name
          : "",
        approvedAmount: item.approvedBudget,
        settlementAmount: item.finalizedAmount,
        paidAmount: item.amountPaid,
        payableAmount: item.remainingAmount,
        status: item.status,
      }));
    };

  return (
    <BudgetReportLayout
      title={translate("report.budget.investment_project_portfolio.title")}
      filterComponent={
        <Filter
          error={error}
          onReset={handleResetFilter}
          onFilter={handleFilter}
          modelFilter={modelFilter}
          handleChangeSelectFilter={handleChangeSelectFilter}
          handleChangeDateFilter={handleChangeDateFilter}
          handleChangeAllFilter={handleChangeAllFilter}
          dispatchFilter={dispatchFilter}
        />
      }
    >
      <ResultReport
        columns={columns}
        dataSource={mapInvestmentProjectPortfolioList()}
        onExport={() =>
          handleExportFile(
            `${translate(
              "report.budget.investment_project_portfolio.title"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
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
