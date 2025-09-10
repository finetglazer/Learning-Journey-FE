import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import Filter from "./components/Filter";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { DetailedSupplierPayablesFilter } from "models/Report/DetailedSupplierPayablesFilter";
import { useTranslation } from "react-i18next";
import type { TableColumnsType } from "antd";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { DetailedSupplierPayablesModel } from "models/DetailedSupplierPayables/DetailedSupplierPayablesModel";
import { formatNumber } from "core/helpers/number";
import { formatDate } from "core/helpers/date-time";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import dayjs from "dayjs";
import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { isObject, isUndefined } from "lodash";
import { Link } from "react-router-dom";
import { CONTRACT_ROUTE_VIEW, PURCHASE_PRINCIPLE_CONTRACT_DETAIL_ROUTER } from "config/route-const";

const DetailedSupplierPayables = () => {
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
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleExportFile,
  } = useReport({
    ModelFilterClass: DetailedSupplierPayablesFilter,
    getList: reportRepository.getDetailedSupplierPayables,
    onExport: reportRepository.getDetailedSupplierPayablesFile,
  });

  const [translate] = useTranslation();

  const mapDetailedSupplierPayablesList = () => {
    if (!list || !list.length) return [];
    return list.map((item) => {
      const model = new DetailedSupplierPayablesModel();
      model.supplierName = item.supplierInfoReportDTO?.name;
      model.taxCode = item.supplierInfoReportDTO?.taxCode;

      model.contractId = item.contractInfoReportDTO?.id;
      model.contractCode = item.contractInfoReportDTO?.code;
      model.contractNo = item.contractInfoReportDTO?.contractNo;
      model.contractName = item.contractInfoReportDTO?.name;
      model.approvedDate = item.contractInfoReportDTO?.approvedDate;
      model.contractClassification = item.contractInfoReportDTO?.contractClassification.toString();
      model.effectiveDate = item.contractInfoReportDTO?.effectiveDate;
      model.endDate = item.contractInfoReportDTO?.endDate;

      model.currency = item.currency;
      model.amount = item.totalAmount;
      model.convertedAmount = item.totalConvertedAmount;
      model.settlementAmount = item.contractSettlementAmount;
      model.advanceAmount = item.paymentAdvanceConvertedAmount;
      model.retainedAmount = item.retainedAmount;
      model.remainingAmountAccordingToSettlement =
        item.remainingValuePerFinalSettlementAmount;
      model.remainingAmountAccordingToContract =
        item.remainingValuePerContractAmount;
      return model;
    });
  };

  const columns: TableColumnsType<DetailedSupplierPayablesModel> = [
    {
      width: 400,
      children: [
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_order"
          ),
          key: "id",
          width: 44,
          align: "center",
          render(_, __, index: number) {
            return (
              <LayoutCell position={"center"}>
                <OneLineText value={`${index + 1}`} />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 500,
      title: translate(
        "report.purchase.detailed_supplier_payables.table.txt_supplier_info"
      ),
      align: "center",
      children: [
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_supplier_name"
          ),
          key: "supplierName",
          dataIndex: "supplierName",
          width: 200,
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
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_tax_code"
          ),
          key: "taxCode",
          dataIndex: "taxCode",
          width: 200,
          align: "left",
          render(value: string) {
            return (
              <LayoutCell position="left">
                <OneLineText value={value} />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 1000,
      title: translate("report.purchase.detailed_supplier_payables.table.txt_contract_info"),
      align: "center",
      children: [
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_contract_code"
          ),
          key: "contractCode",
          dataIndex: "contractCode",
          width: 200,
          align: "left",
          render(value: string, record) {
            const normalContractLink = `${CONTRACT_ROUTE_VIEW}/${record?.contractId}`;
            const principleContractLink = `${PURCHASE_PRINCIPLE_CONTRACT_DETAIL_ROUTER}/${record?.contractId}`;
            const link = record.contractClassification === "0"
                ? normalContractLink
                : (record.contractClassification === "1" ? principleContractLink : "");
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
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_contract_name"
          ),
          key: "contractName",
          dataIndex: "contractName",
          width: 200,
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
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_contract_number"
          ),
          key: "contractNo",
          dataIndex: "contractNo",
          width: 200,
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
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_approval_date"
          ),
          key: "approvedDate",
          dataIndex: "approvedDate",
          width: 200,
          align: "left",
          render(value: string) {
            return (
              <LayoutCell position="left">
                <OneLineText value={formatDate(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_effective_date"
          ),
          key: "effectiveDate",
          dataIndex: "effectiveDate",
          width: 200,
          align: "left",
          render(value: string) {
            return (
              <LayoutCell position="left">
                <OneLineText value={formatDate(value)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_end_date"
          ),
          key: "endDate",
          dataIndex: "endDate",
          width: 200,
          align: "left",
          render(value: string) {
            return (
              <LayoutCell position="left">
                <OneLineText value={formatDate(value)} />
              </LayoutCell>
            );
          },
        },
      ],
    },
    {
      width: 500,
      title: translate("report.purchase.detailed_supplier_payables.table.txt_contract_amount"),
      align: "center",
      children: [
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_currency"
          ),
          key: "currency",
          dataIndex: "currency",
          width: 100,
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
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_amount"
          ),
          key: "amount",
          dataIndex: "amount",
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
            "report.purchase.detailed_supplier_payables.table.txt_converted_amount"
          ),
          key: "convertedAmount",
          dataIndex: "convertedAmount",
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
      title: translate(
        "report.purchase.detailed_supplier_payables.table.txt_settlement_amount"
      ),
      key: "settlementAmount",
      dataIndex: "settlementAmount",
      width: 280,
      align: "center",
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
        "report.purchase.detailed_supplier_payables.table.txt_advance_amount"
      ),
      key: "advanceAmount",
      dataIndex: "advanceAmount",
      width: 200,
      align: "center",
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
        "report.purchase.detailed_supplier_payables.table.txt_retained_amount"
      ),
      key: "retainedAmount",
      dataIndex: "retainedAmount",
      width: 200,
      align: "center",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      width: 500,
      title: translate(
        "report.purchase.detailed_supplier_payables.table.txt_remaining_amount"
      ),
      align: "center",
      children: [
        {
          title: translate(
            "report.purchase.detailed_supplier_payables.table.txt_remaining_amount_according_to_settlement"
          ),
          key: "remainingAmountAccordingToSettlement",
          dataIndex: "remainingAmountAccordingToSettlement",
          width: 200,
          align: "center",
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
            "report.purchase.detailed_supplier_payables.table.txt_remaining_amount_according_to_contract"
          ),
          key: "remainingAmountAccordingToContract",
          dataIndex: "remainingAmountAccordingToContract",
          width: 200,
          align: "center",
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
    <>
      <PurchaseReportLayout
        title={translate("report.purchase.detailed_supplier_payables.title")}
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
          bordered
          columns={columns}
          loadingList={loadingList}
          dataSource={mapDetailedSupplierPayablesList()}
          modelFilter={modelFilter}
          total={count}
          onExport={() =>
            handleExportFile(
              `${translate(
                "report.purchase.detailed_supplier_payables.title"
              )}_${formatDate(
                dayjs(),
                STANDARD_DATE_FORMAT_COMPACT_WITH_TIME
              )}.xlsx`
            )
          }
          onChangePagination={handlePagination}
          isShowResult={
            !isUndefined(modelFilter) &&
            isObject(modelFilter?.effectiveDateRange) &&
            !isReset &&
            isShowResult
          }
        />
      </PurchaseReportLayout>
    </>
  );
};

export default DetailedSupplierPayables;
