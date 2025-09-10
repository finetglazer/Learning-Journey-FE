import React, { useMemo } from "react";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { useTranslation } from "react-i18next";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { ModelFilter } from "react-3layer-common";
import Filter from "pages/ReportPage/Purchase/SupplierGoodsItemsDetail/components/Filter";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import CollapseResultReport from "pages/ReportPage/Components/CollapseResultReport/CollapseResultReport";
import useReportDetail from "pages/ReportPage/Components/hooks/useReportDetail";
import SupplierInformation from "pages/ReportPage/Purchase/SupplierGoodsItemsDetail/SupplierGoodsItemsDetailMaster/SupplierInformation";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import appMessageService from "core/services/common-services/app-message-service";
import GoodsServiceTable from "pages/ReportPage/Purchase/SupplierGoodsItemsDetail/SupplierGoodsItemsDetailMaster/GoodsServiceTable";
import { tableService } from "core/services/page-services/table-service";

const SupplierGoodsItemsDetailMaster = () => {
  const [translate] = useTranslation();

  const {
    modelFilter,
    isReset,
    detail,
    handleFilterDetail,
    handleResetFilterDetail,
    handleChangeSelectFilter,
    isShowResult,
    handleChangeDateRangeFilter,
    loadingDetail,
    dispatchFilter,
    handleLoadDetail,
  } = useReportDetail({
    ModelFilterClass: ModelFilter,
    getDetail: reportRepository.getSupplierGoodsItemsDetail,
  });
  const { notifyToast } = appMessageService.useCRUDMessage();

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadDetail as (newFilter?: ModelFilter) => void
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: 1,
        label: translate(
          "report.purchase.supplier_goods_items_detail.tab.txt_supplier_information"
        ),
        children: <SupplierInformation data={detail?.supplier} />,
      },
      {
        key: 2,
        label: translate(
          "report.purchase.supplier_goods_items_detail.tab.txt_goods_services"
        ),
        children: (
          <GoodsServiceTable
            data={detail?.goodsItems}
            onPagination={handlePagination}
            loadingList={loadingDetail}
          />
        ),
      },
    ],
    [translate, detail, handlePagination, loadingDetail]
  );
  const handleExportFile = (fileName: string) => {
    if (!detail) return;
    reportRepository.getSupplierGoodsItemsDetailFile(modelFilter).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <PurchaseReportLayout
        title={translate(
          "CM.menu_title_report.purchase.supplier_goodsItem_detail"
        )}
        filterComponent={
          <Filter
            modelFilter={modelFilter}
            error={isReset ? undefined : modelFilter}
            onFilter={handleFilterDetail}
            onReset={handleResetFilterDetail}
            handleChangeDateRangeFilter={handleChangeDateRangeFilter}
            handleChangeSelectFilter={handleChangeSelectFilter}
          />
        }
      >
        <CollapseResultReport
          items={itemsCollapse}
          modelFilter={modelFilter}
          isShowResult={isShowResult}
          isShowUnit={true}
          onExport={() =>
            handleExportFile(
              `${translate(
                "CM.menu_title_report.purchase.supplier_goodsItem_detail"
              )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
            )
          }
          loadingExport={false}
        />
      </PurchaseReportLayout>
    </>
  );
};

export default SupplierGoodsItemsDetailMaster;
