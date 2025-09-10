import { Tooltip, type TableColumnsType } from "antd";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { listPurchasingPlanStatusEnum } from "config/const";
import {
  CONTRACT_ROUTE_VIEW,
  PURCHASE_PRINCIPLE_CONTRACT_DETAIL_ROUTER,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { orderContractReportRepository } from "core/repositories/OrderContractReportRepository";
import dayjs from "dayjs";
import { isObject, isUndefined } from "lodash";
import { OrderContractModel } from "models/OrderContract/OrderContract";
import { OrderContractFilter } from "models/OrderContract/OrderContractFilter";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import OrderContractSummaryFilter from "pages/ReportPage/Purchase/OrderContractSummary/Components/OrderContractSummaryFilter";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function OrderContractSummary() {
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
  } = useReport({
    ModelFilterClass: OrderContractFilter,
    getList: orderContractReportRepository.getAll,
    onExport: orderContractReportRepository.export,
  });

  const columns: TableColumnsType<OrderContractModel> = [
    {
      title: translate(
        "report.purchase.order_contract_summary.table.txt_index"
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
        "report.purchase.order_contract_summary.table.txt_approval_date"
      ),
      key: "approvedDate",
      dataIndex: "approvedDate",
      width: 96,
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
        "report.purchase.order_contract_summary.table.txt_contract_code"
      ),
      key: "code",
      dataIndex: "code",
      width: 120,
      render(value: string, record) {
        const normalContractLink = `${CONTRACT_ROUTE_VIEW}/${record?.contractId}`;
        const principleContractLink = `${PURCHASE_PRINCIPLE_CONTRACT_DETAIL_ROUTER}/${record?.contractId}`;
        const link = record.contractClassification === "0"
          ? normalContractLink
          : (record.contractClassification === "1" ? principleContractLink : "");
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
        "report.purchase.order_contract_summary.table.txt_contract_number"
      ),
      key: "contractNo",
      dataIndex: "contractNo",
      width: 180,
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
        "report.purchase.order_contract_summary.table.txt_contract_name"
      ),
      key: "name",
      dataIndex: "name",
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
        "report.purchase.order_contract_summary.table.txt_effective_date"
      ),
      key: "effectiveDate",
      dataIndex: "effectiveDate",
      width: 120,
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
        "report.purchase.order_contract_summary.table.txt_end_date"
      ),
      key: "endDate",
      dataIndex: "endDate",
      width: 120,
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
        "report.purchase.order_contract_summary.table.txt_contract_type"
      ),
      key: "contractTypeName",
      dataIndex: "contractTypeName",
      width: 160,
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
        "report.purchase.order_contract_summary.table.txt_cost_item"
      ),
      key: "costItemName",
      dataIndex: "costItemName",
      width: 160,
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
        "report.purchase.order_contract_summary.table.txt_contract_name_repeat"
      ),
      key: "name",
      dataIndex: "name",
      width: 300,
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
        "report.purchase.order_contract_summary.table.txt_total_supplementary"
      ),
      key: "appendixCount",
      dataIndex: "appendixCount",
      width: 120,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value || 0)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.table.txt_value_before_tax"
      ),
      key: "totalAmountBeforeTax",
      dataIndex: "totalAmountBeforeTax",
      width: 145,
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
        "report.purchase.order_contract_summary.table.txt_tax_amount"
      ),
      key: "taxAmount",
      dataIndex: "taxAmount",
      width: 156,
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
        "report.purchase.order_contract_summary.table.txt_total_contract_value"
      ),
      key: "totalAmount",
      dataIndex: "totalAmount",
      width: 160,
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
        "report.purchase.order_contract_summary.table.txt_currency_type"
      ),
      key: "currency",
      dataIndex: "currency",
      width: 74,
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
        "report.purchase.order_contract_summary.table.txt_status"
      ),
      key: "status",
      dataIndex: "status",
      width: 128,
      render(value: number) {
        const item = listPurchasingPlanStatusEnum.find(
          (type) => type.id === value
        );
        return (
          <LayoutCell>
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
    {
      title: translate(
        "report.purchase.order_contract_summary.table.txt_settlement_value"
      ),
      key: "settlementValue",
      dataIndex: "settlementValue",
      width: 150,
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
        "report.purchase.order_contract_summary.table.txt_paid_amount"
      ),
      key: "paidAmount",
      dataIndex: "paidAmount",
      width: 150,
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
      title: (
        <UnitTitle
          title={translate(
            "report.purchase.order_contract_summary.table.txt_remaining_payment_settlement.title"
          )}
          unit={translate(
            "report.purchase.order_contract_summary.table.txt_remaining_payment_settlement.subtitle"
          )}
          className="text-start"
        />
      ),
      key: "remainAmountBySettlement",
      dataIndex: "remainAmountBySettlement",
      width: 180,
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
      title: (
        <UnitTitle
          title={translate(
            "report.purchase.order_contract_summary.table.txt_remaining_payment_contract.title"
          )}
          unit={translate(
            "report.purchase.order_contract_summary.table.txt_remaining_payment_contract.subtitle"
          )}
          className="text-start"
        />
      ),
      key: "remainAmountByTotalContract",
      dataIndex: "remainAmountByTotalContract",
      width: 180,
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
        "report.purchase.order_contract_summary.table.txt_tax_code"
      ),
      key: "supplierTaxCode",
      dataIndex: "supplierTaxCode",
      width: 140,
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
        "report.purchase.order_contract_summary.table.txt_supplier_name"
      ),
      key: "supplierName",
      dataIndex: "supplierName",
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
        "report.purchase.order_contract_summary.table.txt_ycms_code"
      ),
      key: "purchaseRequestCode",
      dataIndex: "purchaseRequestCode",
      width: 140,
      render(value: string, record) {
        const link = `${PURCHASE_REQUEST_VIEW_ROUTE}/${record?.purchaseRequestId}`;
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
        "report.purchase.order_contract_summary.table.txt_pams_code"
      ),
      key: "purchasePlanCode",
      dataIndex: "purchasePlanCode",
      width: 140,
      render(value: string, record) {
        const link = `${PURCHASING_PLAN_VIEW_ROUTE}/${record?.purchasePlanId}`;
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
        "report.purchase.order_contract_summary.table.txt_contract_creating_unit"
      ),
      key: "createdOrganizationName",
      dataIndex: "createdOrganizationName",
      width: 160,
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
        "report.purchase.order_contract_summary.table.txt_contract_creator"
      ),
      key: "createdUserEmail",
      width: 160,
      render(record: OrderContractModel) {
        return (
          <LayoutCell>
            <Tooltip
              title={`${record?.createdUserEmail} - ${record?.createdUserName}`}
            >
              <span className="text-truncate w-full">
                {record?.createdUserEmail}
              </span>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.order_contract_summary.table.txt_contract_management_unit"
      ),
      key: "manageOrganizationName",
      dataIndex: "manageOrganizationName",
      width: 180,
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
        "report.purchase.order_contract_summary.table.txt_contract_manager"
      ),
      key: "manageUserEmail",
      width: 180,
      render(record: OrderContractModel) {
        return (
          <LayoutCell>
            <Tooltip
              title={`${record?.manageUserEmail} - ${record?.manageUserName}`}
            >
              <span className="text-truncate w-full">
                {record?.manageUserEmail}
              </span>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.order_contract_summary.title")}
      filterComponent={
        <OrderContractSummaryFilter
          modelFilter={modelFilter}
          error={isReset ? undefined : error}
          onFilter={handleFilter}
          onReset={handleResetFilter}
          handleChangeDateRangeFilter={handleChangeDateRangeFilter}
          handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
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
              "report.purchase.order_contract_summary.title"
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
