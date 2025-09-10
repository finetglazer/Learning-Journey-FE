import { PurchaseRequirementSummaryFilter } from "models/Report/PurchaseRequirementSummaryFilter";
import { PurchaseRequirementSummaryModel } from "models/Report/PurchasingRequirementSummaryModel";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { useTranslation } from "react-i18next";
import type { TableColumnsType } from "antd";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { Link } from "react-router-dom";
import { formatNumber } from "core/helpers/number";
import { purchaseRequirementSummaryStatus } from "config/const";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import Filter from "./Components/Filter";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { isObject, isUndefined } from "lodash";
import dayjs from "dayjs";
import {
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_CREATE_ROUTE,
} from "config/route-const";

const PurchaseRequirementSummary = () => {
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
  } = useReport({
    ModelFilterClass: PurchaseRequirementSummaryFilter,
    getList: reportRepository.getPurchaseRequirementSummaryList,
    onExport: reportRepository.getPurchaseRequirementSummaryFile,
  });

  const columns: TableColumnsType<PurchaseRequirementSummaryModel> = [
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_order"
      ),
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
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchase_created_date"
      ),
      key: "purchaseRequestCreatedDate",
      dataIndex: "purchaseRequestCreatedDate",
      width: 180,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_proposal_code"
      ),
      key: "proposalCode",
      dataIndex: "proposalCode",
      width: 180,
      render(value: string, record) {
        const link = `${PROPOSAL_DETAIL_ROUTE}/${record?.purchaseProposalId}`;
        return (
          <LayoutCell>
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
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchase_request_code"
      ),
      key: "purchaseRequestCode",
      dataIndex: "purchaseRequestCode",
      width: 180,
      render(value: string, record) {
        const link = `${PURCHASE_REQUEST_CREATE_ROUTE}/${record?.purchaseRequestId}`;
        return (
          <LayoutCell>
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
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchase_request_name"
      ),
      key: "purchaseRequestName",
      dataIndex: "purchaseRequestName",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_approved_date"
      ),
      key: "purchaseRequestApprovedDate",
      dataIndex: "purchaseRequestApprovedDate",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={formatDate(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_project"
      ),
      key: "project",
      dataIndex: "project",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_cost_type"
      ),
      key: "costType",
      dataIndex: "costType",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_cost_group"
      ),
      key: "costGroup",
      dataIndex: "costGroup",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_amount_before_tax"
      ),
      key: "amountBeforeTax",
      dataIndex: "amountBeforeTax",
      width: 250,
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_tax"
      ),
      key: "tax",
      dataIndex: "tax",
      width: 250,
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_other_costs"
      ),
      key: "otherAmount",
      dataIndex: "otherAmount",
      width: 250,
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_total_amount"
      ),
      key: "totalAmount",
      dataIndex: "totalAmount",
      width: 250,
      align: "right",
      render(value: string) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_currency"
      ),
      key: "currency",
      dataIndex: "currency",
      width: 180,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position={"center"}>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.goods_receipt_tracking.table.txt_status"
      ),
      key: "status",
      dataIndex: "status",
      width: 128,
      render(value: number) {
        const item = purchaseRequirementSummaryStatus.find(
          (type: any) => type.id === value
        );
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={translate(item?.name)}
              status={item?.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchasing_unit"
      ),
      key: "purchaseUnit",
      dataIndex: "purchaseUnit",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchasing_unit"
      ),
      key: "purchaseUnit",
      dataIndex: "purchaseUnit",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_purchasing_unit"
      ),
      key: "purchaseUnit",
      dataIndex: "purchaseUnit",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_branch_created"
      ),
      key: "branchTransactionOfficeCreated",
      dataIndex: "branchTransactionOfficeCreated",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_bank_block_created"
      ),
      key: "bankBlockCreated",
      dataIndex: "bankBlockCreated",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_department_created"
      ),
      key: "departmentCreated",
      dataIndex: "departmentCreated",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_requirement_summary.table.txt_creator"
      ),
      key: "creator",
      dataIndex: "creator",
      width: 150,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
  ];

  const mapPurchaseRequirementSummaryList = () => {
    return list.map((item: any, index) => {
      return {
        order: `${++index}`,
        purchaseRequestCreatedDate: item.createdDate,
        purchaseRequestApprovedDate: item.approveDate,
        proposalId: item.proposalInfo?.id,
        proposalCode: item.proposalInfo?.code,
        purchaseRequestId: item.id,
        purchaseRequestCode: item.code,
        purchaseRequestName: item.name,
        project: "",
        costType: item.proposalInfo?.costType,
        costGroup: item.proposalInfo?.costGroup,
        amountBeforeTax: item.purchaseAmount?.amountBeforeTax,
        otherAmount: item.purchaseAmount?.otherAmount,
        tax: item.purchaseAmount?.taxAmount,
        totalAmount: item.totalAmount,
        currency: item.currency?.code,
        status: item.status,
        purchaseUnit: item.organization?.businessUnit ?
          item.organization?.businessUnit?.code +
          " - " +
          item.organization?.businessUnit?.name : "",
        branchTransactionOfficeCreated: item.organization?.businessBranch ?
          item.organization?.businessBranch?.code +
          " - " +
          item.organization?.businessBranch?.name : "",
        bankBlockCreated: item.organization?.organization ?
          item.organization?.organization?.code +
          " - " +
          item.organization?.organization?.name : "",
        departmentCreated: item.organization?.businessDepartment ?
          item.organization?.businessDepartment?.businessUnitCode +
          " - " +
          item.organization?.businessDepartment?.businessUnitName : "",
        creator: item.createdUser,
      };
    });
  };

  return (
    <>
      <PurchaseReportLayout
        title={translate("report.purchase.purchase_requirement_summary.title")}
        filterComponent={
          <Filter
            modelFilter={modelFilter}
            error={isReset ? undefined : modelFilter}
            onFilter={handleFilter}
            onReset={handleResetFilter}
            handleChangeDateRangeFilter={handleChangeDateRangeFilter}
            handleChangeSelectFilter={handleChangeSelectFilter}
            handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
          />
        }
      >
        <ResultReport
          columns={columns}
          loadingList={loadingList}
          dataSource={mapPurchaseRequirementSummaryList()}
          modelFilter={modelFilter}
          total={count}
          onExport={() =>
            handleExportFile(
              `${translate(
                "report.purchase.purchase_requirement_summary.title"
              )}_${formatDate(
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

export default PurchaseRequirementSummary;
