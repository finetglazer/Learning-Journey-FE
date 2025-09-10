import useReport from "pages/ReportPage/Components/hooks/useReport";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { useTranslation } from "react-i18next";
import type { TableColumnsType } from "antd";
import { LayoutCell, OneLineText } from "react-components-design-system";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  YYYY_MM_DD_FORMAT,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { Link } from "react-router-dom";
import { formatNumber } from "core/helpers/number";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import Filter from "./Components/Filter";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { isObject, isUndefined } from "lodash";
import dayjs from "dayjs";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  ACCOUNTING_ENTRY_VIEW_ROUTE,
  ADVANCE_VIEW_ROUTE,
  BUDGET_ADJUST_DETAIL_ROUTE,
  BUDGET_DETAIL_ROUTE,
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
  CONTRACT_ANNEX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_VIEW_ROUTE,
  CONTRACT_ROUTE_VIEW,
  CONTRACT_TERMINATION_VIEW_ROUTE,
  DEPOSIT_VIEW_ROUTE,
  EXPENSE_VIEW_ROUTE,
  PAYMENT_REQUEST_VIEW_ROUTE,
  PROJECT_SETTLEMENT_DETAIL_ROUTE,
  PROPOSAL_ADJUST_VIEW_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE,
  PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASE_REQUEST_ADJUST_VIEW_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_BIDDING_VIEW_ROUTE,
  PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
  SETTLEMENT_VIEW_ROUTE,
  SUPPLIER_VIEW_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { SLAFilter } from "models/SLA/SLAFilter";
import { SLAModel } from "models/SLA/SLAModel";
import { getWorkingDays } from "./utils";

const SLA = () => {
  const [translate] = useTranslation();

  const {
    modelFilter,
    loadingList,
    list,
    count,
    isReset,
    isShowResult,
    handleFilter,
    handleResetFilter,
    handlePagination,
    handleExportFile,
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
  } = useReport({
    ModelFilterClass: SLAFilter,
    getList: reportRepository.getAllSLAReports,
    onExport: reportRepository.getPurchaseRequirementSummaryFile,
  });

  const mapSecondaryCodeColumnNameWithTopicId = (topicId: string) => {
    if (!topicId) {
      return translate("report.purchase.sla.table.txt_report_code");
    }
    switch (Number(topicId)) {
      case 10:
        return translate("report.purchase.sla.table.txt_tax_code");
      case 11 || 16 || 18:
        return translate("report.purchase.sla.table.txt_contract_no");
      default:
        return translate("report.purchase.sla.table.txt_report_code");
    }
  };

  const mapHyperlinkWithTopicId = (topicId: string, reportId: string) => {
    if (!topicId || !reportId) {
      return "#";
    }
    switch (Number(topicId)) {
      case 1: // BUDGET_PLAN
        return BUDGET_DETAIL_ROUTE + `/${reportId}`;

      case 2: // PAYMENT
        return PAYMENT_REQUEST_VIEW_ROUTE + `/${reportId}`;

      case 3: // PURCHASE_REQUEST
        return PURCHASE_REQUEST_VIEW_ROUTE + `/${reportId}`;

      case 4: // PURCHASE_PROPOSAL
        return PROPOSAL_DETAIL_ROUTE + `/${reportId}`;

      case 5: // BUDGET_ADJUST
        return BUDGET_ADJUST_DETAIL_ROUTE + `/${reportId}`;

      case 6: // ADVANCE_PAYMENT
        return ADVANCE_VIEW_ROUTE + `/${reportId}`;

      case 7: // ADVANCE_REQUEST
        return EXPENSE_VIEW_ROUTE + `/${reportId}`;

      case 8: // ACCOUNTING
        return ACCOUNTING_ENTRY_VIEW_ROUTE + `/${reportId}`;

      case 9: // DEPOSIT
        return DEPOSIT_VIEW_ROUTE + `/${reportId}`;

      case 10: // SUPPLIER GOODS
        return SUPPLIER_VIEW_ROUTE + `/${reportId}`;

      case 11: // CONTRACT
        return CONTRACT_ROUTE_VIEW + `/${reportId}`;

      case 12: // PURCHASE_PROPOSAL_ADJUST
        return PROPOSAL_ADJUST_VIEW_ROUTE + `/${reportId}`;

      case 13: // PURCHASE_REQUEST_ADJUST
        return PURCHASE_REQUEST_ADJUST_VIEW_ROUTE + `/${reportId}`;

      case 14: // PURCHASING_PLAN_DIRECT_AWARD
        return PURCHASING_PLAN_VIEW_ROUTE + `/${reportId}`;

      case 15: // RECEIVING_GOODS
        return RECEIVING_GOODS_DETAIL_ROUTE + `/${reportId}`;

      case 16: // CONTRACT_ADJUST
        return CONTRACT_ADJUSTMENT_VIEW_ROUTE + `/${reportId}`;

      case 17: // TEMPORARY_IMPORT_ASSET
        return TEMPORARY_IMPORT_ASSET_VIEW_ROUTE + `/${reportId}`;

      case 18: // CONTRACT_PRINCIPLE
        return CONTRACT_PRINCIPLE_VIEW_ROUTE + `/${reportId}`;

      case 19: // ACCEPTANCE
        return ACCEPTANCE_DETAIL_ROUTE + `/${reportId}`;

      case 21: // CONTRACT_SETTLEMENT
        return SETTLEMENT_VIEW_ROUTE + `/${reportId}`;

      case 22: // PROJECT_SETTLEMENT
        return PROJECT_SETTLEMENT_DETAIL_ROUTE + `/${reportId}`;

      case 23: // PURCHASING_PLAN_BIDDING
        return PURCHASING_PLAN_BIDDING_VIEW_ROUTE + `/${reportId}`;

      case 24: // CONTRACT_APPENDIX (Note: Mapped to Annex route per image)
        return CONTRACT_ANNEX_DETAIL_ROUTE + `/${reportId}`;

      case 25: // CONTRACT_TERMINATION
        return CONTRACT_TERMINATION_VIEW_ROUTE + `/${reportId}`;

      case 26: // PURCHASING_PLAN_COMPETITIVE_BIDDING_ADJUST
        return (
          PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE + `/${reportId}`
        );

      case 27: // CONTRACT_PRINCIPLE_APPENDIX
        return CONTRACT_PRINCIPLE_APPENDIX_DETAIL_ROUTE + `/${reportId}`;

      case 28: // PURCHASING_PLAN_COMPETITIVE_BIDDING
        return PURCHASING_PLAN_COMPETITIVE_OFFER_VIEW_ROUTE + `/${reportId}`;

      case 29: // PURCHASING_PLAN_BIDDING_ADJUST
        return PURCHASE_PLAN_ADJUST_BID_VIEW_ROUTE + `/${reportId}`;

      default:
        return "";
    }
  };

  const columns: TableColumnsType<SLAModel> = [
    {
      title: translate("report.purchase.sla.table.txt_order"),
      key: "id",
      width: 44,
      render(_, __, index: number) {
        return (
          <LayoutCell>
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_report_type"),
      key: "reportTypeName",
      dataIndex: "reportTypeName",
      width: 220,
      align: "left",
      render(value: string) {
        return (
          <LayoutCell position="left">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_report_code"),
      key: "code",
      dataIndex: "code",
      width: 180,
      align: "left",
      render(value: string, record) {
        const link = mapHyperlinkWithTopicId(
          modelFilter?.reportTypeValue?.id,
          record?.id
        );
        return (
          <LayoutCell position="left">
            <Link to={link} target="_blank" className="hyperlink">
              <OneLineText
                className="text-table-content-primary"
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    // {
    //   title: translate("report.purchase.sla.table.txt_report_name"),
    //   key: "reportName",
    //   dataIndex: "reportName",
    //   width: 280,
    //   align: "left",
    //   render(value: string) {
    //     return (
    //       <LayoutCell position="left">
    //         <OneLineText value={value} />
    //       </LayoutCell>
    //     );
    //   },
    // },
    {
      title: translate(
        mapSecondaryCodeColumnNameWithTopicId(modelFilter?.reportTypeValue?.id)
      ),
      key: "secondaryCode",
      dataIndex: "secondaryCode",
      width: 220,
      align: "left",
      render(value: string) {
        return (
          <LayoutCell position="left">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_proponent"),
      key: "proponent",
      dataIndex: "proponent",
      width: 280,
      align: "left",
      render(value: string) {
        return (
          <LayoutCell position="left">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_created_date"),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 150,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position="center">
            <OneLineText value={formatDate(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_created_business_unit"),
      key: "businessUnit",
      dataIndex: "businessUnit",
      width: 280,
      align: "left",
      render(value: string) {
        return (
          <LayoutCell position="left">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_reviewer"),
      key: "reviewer",
      dataIndex: "reviewer",
      width: 220,
      align: "left",
      render(value: string) {
        return (
          <LayoutCell position="left">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_approved_date"),
      key: "approvedDate",
      dataIndex: "approvedDate",
      width: 150,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position="center">
            <OneLineText value={formatDate(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_execution_time"),
      key: "executionTime",
      dataIndex: "executionTime",
      width: 180,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position="center">
            <OneLineText
              value={
                value
                  ? formatNumber(value) + ` ${translate("CM.txt_days")}`
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_amount"),
      key: "amount",
      dataIndex: "amount",
      width: 220,
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_currency"),
      key: "currency",
      dataIndex: "currency",
      width: 180,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position="center">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.sla.table.txt_status"),
      key: "status",
      dataIndex: "status",
      width: 140,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position="center">
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
  ];

  const mapSLAList = () => {
    return list.map((item: SLAModel, index) => {
      return {
        order: `${++index}`,
        id: item?.id ?? "",
        code: item?.code ?? "",
        secondaryCode: item?.secondaryCode ?? "",
        name: item?.name ?? "",
        reportType: item?.topicType ?? "",
        reportTypeName: item?.topicTypeName ?? "",
        reportTypeCode: item?.topicTypeCode ?? "",
        proponent: item?.createdUser ?? "",
        createdDate: item?.createdDate ?? "",
        createdBusinessUnit: item?.createdOrganization?.code
          ? item.createdOrganization.code +
            " - " +
            item.createdOrganization.name
          : "",
        reviewer: item?.approvedUser ?? "",
        approvedDate: item?.approvedDate ?? "",
        executionTime: getWorkingDays(
          dayjs(item.createdDate).format(YYYY_MM_DD_FORMAT),
          dayjs(item.approvedDate).format(YYYY_MM_DD_FORMAT)
        ).toString(),
        amount: item?.totalAmount,
        currency: (item?.currency as any).code ?? "",
        status: item?.statusName ?? "",
      };
    });
  };

  return (
    <>
      <PurchaseReportLayout
        title={translate("report.purchase.sla.title")}
        filterComponent={
          <Filter
            modelFilter={modelFilter}
            error={isReset ? undefined : modelFilter}
            onFilter={handleFilter}
            onReset={handleResetFilter}
            handleChangeDateRangeFilter={handleChangeDateRangeFilter}
            handleChangeSelectFilter={handleChangeSelectFilter}
            handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
            handleChangeAllFilter={handleChangeAllFilter}
          />
        }
      >
        <ResultReport
          columns={columns}
          loadingList={loadingList}
          dataSource={mapSLAList()}
          modelFilter={modelFilter}
          total={count}
          onExport={() =>
            handleExportFile(
              `${translate("report.purchase.sla.title")}_${formatDate(
                dayjs(),
                STANDARD_DATE_FORMAT_COMPACT_WITH_TIME
              )}.xlsx`
            )
          }
          onChangePagination={handlePagination}
          isShowResult={
            !isUndefined(modelFilter) &&
            isObject(modelFilter?.createdDate) &&
            !isReset &&
            isShowResult
          }
        />
      </PurchaseReportLayout>
    </>
  );
};

export default SLA;
