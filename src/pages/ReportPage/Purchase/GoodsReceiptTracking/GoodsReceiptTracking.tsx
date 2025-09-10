import type { AxiosError, AxiosResponse } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { useTranslation } from "react-i18next";
import Filter from "./components/Filter";
import { formatDate } from "core/helpers/date-time";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import dayjs from "dayjs";
import saveAs from "file-saver";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { GoodsReceiptTrackingFilter } from "models/Report/GoodsReceiptTrackingFilter";
import { isObject, isUndefined } from "lodash";
import type { TableColumnsType } from "antd";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import { Link } from "react-router-dom";
import { goodsReceiptTrackingStatus } from "config/const";
import { RECEIVING_GOODS_DETAIL_ROUTE } from "config/route-const";

const GoodsReceiptTracking = () => {
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
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter
  } = useReport({
    ModelFilterClass: GoodsReceiptTrackingFilter,
    getList: reportRepository.getGoodsReceiptTracking,
    onExport: reportRepository.getGoodsReceiptTrackingFile,
  });
  const { notifyToast } = appMessageService.useCRUDMessage();

  const columns: TableColumnsType<GoodsReceiptModel> = [
    {
      title: translate(
        "report.purchase.goods_receipt_tracking.table.txt_order"
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
      title: translate("report.purchase.goods_receipt_tracking.table.txt_code"),
      key: "code",
      dataIndex: "code",
      width: 180,
      render(value: string, record) {
        const link = `${RECEIVING_GOODS_DETAIL_ROUTE}/${record?.contractId}`;
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
        "report.purchase.goods_receipt_tracking.table.txt_created_date"
      ),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 150,
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
        "report.purchase.goods_receipt_tracking.table.txt_receipt_date"
      ),
      key: "receiptDate",
      dataIndex: "receiptDate",
      width: 170,
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
        "report.purchase.goods_receipt_tracking.table.txt_contract_code"
      ),
      key: "contractCode",
      dataIndex: "contractCode",
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
        "report.purchase.goods_receipt_tracking.table.txt_contract_number"
      ),
      key: "contractNo",
      dataIndex: "contractNo",
      width: 200,
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
        "report.purchase.goods_receipt_tracking.table.txt_contract_name"
      ),
      key: "contractName",
      dataIndex: "contractName",
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
        "report.purchase.goods_receipt_tracking.table.txt_supplier_code"
      ),
      key: "supplierCode",
      dataIndex: "supplierCode",
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
        "report.purchase.goods_receipt_tracking.table.txt_supplier_name"
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
        "report.purchase.goods_receipt_tracking.table.txt_receiver_unit"
      ),
      key: "receiverUnit",
      dataIndex: "receiverUnit",
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
        "report.purchase.goods_receipt_tracking.table.txt_receiver_name"
      ),
      key: "receiverName",
      dataIndex: "receiverName",
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
        "report.purchase.goods_receipt_tracking.table.txt_receiver_email"
      ),
      key: "receiverEmail",
      dataIndex: "receiverEmail",
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
        "report.purchase.goods_receipt_tracking.table.txt_receiver_phone_number"
      ),
      key: "receiptPersonPhone",
      dataIndex: "receiptPersonPhone",
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
        "report.purchase.goods_receipt_tracking.table.txt_status"
      ),
      key: "status",
      dataIndex: "status",
      width: 128,
      render(value: number) {
        const item = goodsReceiptTrackingStatus.find(
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
  ];

  const mapGoodsReceiptList = () => {
    return list.map((item) => {
      return {
        id: item.id,
        code: item.code,
        createdDate: item.createdDate,
        receiptDate: item.receiptDate,
        status: item.status,

        contractId: item.contractInfo?.id,
        contractCode: item.contractInfo?.code,
        contractName: item.contractInfo?.name,
        contractNo: item.contractInfo?.contractNo,

        supplierCode: item.supplierInfo?.code,
        supplierName: item.supplierInfo?.name,

        receiverUnit:
          item.receiverUserInfo?.receiverOrganization?.code +
          " - " +
          item.receiverUserInfo?.receiverUnitName,
        receiverName: item.receiverUserInfo?.receiverName,
        receiverEmail: item.receiverUserInfo?.receiverEmail,
        receiptPersonPhone: item.receiverUserInfo?.receiptPersonPhone,
      };
    });
  };

  const handleExportFile = () => {
    const fileName = `${translate(
      "report.purchase.goods_receipt_tracking.title"
    )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}.xlsx`;

    reportRepository.getGoodsReceiptTrackingFile(modelFilter).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: (error?.response?.data as any).message,
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <PurchaseReportLayout
        title={translate("report.purchase.goods_receipt_tracking.title")}
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
          dataSource={mapGoodsReceiptList()}
          modelFilter={modelFilter}
          total={count}
          onExport={handleExportFile}
          onChangePagination={handlePagination}
          isShowResult={
            !isUndefined(modelFilter) &&
            isObject(modelFilter?.createdDateRange) &&
            !isReset &&
            isShowResult
          }
        />
      </PurchaseReportLayout>
    </>
  );
};

export default GoodsReceiptTracking;
