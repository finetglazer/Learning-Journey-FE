import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { reportGoodsServicesDetailRepository } from "core/repositories/ReportGoodsServicesDetailRepository";
import dayjs from "dayjs";
import { OrderContractFilter } from "models/OrderContract/OrderContractFilter";
import CollapseResultReport from "pages/ReportPage/Components/CollapseResultReport/CollapseResultReport";
import useReportDetail from "pages/ReportPage/Components/hooks/useReportDetail";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Filter from "./Components/Filter";
import GoodsServicesInformation from "./Components/Collapse/GoodsServicesInformation";
import ContractGoodsServiceTable from "./Components/Collapse/ContractGoodsServiceTable";
import { tableService } from "core/services/page-services/table-service";
import { ModelFilter } from "react-3layer-common";

const GoodsServicesDetail = () => {
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
    handleExportFileWithFilter,
  } = useReportDetail({
    ModelFilterClass: OrderContractFilter,
    getDetail: reportGoodsServicesDetailRepository.getDetail,
    onExport: reportGoodsServicesDetailRepository.export,
  });
  const detailData = detail?.data;

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadDetail as (newFilter?: ModelFilter) => void
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: "goodsServicesInfo",
        label: translate(
          "report.purchase.goods_services_detail.tab.goodsServicesInfo"
        ),
        children: (
          <GoodsServicesInformation data={detailData?.goodsServicesInfo} />
        ),
      },
      {
        key: "contractGoodsService",
        label: translate(
          "report.purchase.goods_services_detail.tab.contractGoodsService"
        ),
        children: (
          <ContractGoodsServiceTable
            data={detailData?.contractGoodsServices}
            onPagination={handlePagination}
            loadingList={loadingDetail}
          />
        ),
      },
    ],
    [translate, detail, handlePagination, loadingDetail]
  );

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.goods_services_detail.title_detail")}
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
          handleExportFileWithFilter(
            `${translate(
              "report.purchase.goods_services_detail.title_detail_contract"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        loadingExport={false}
      />
    </PurchaseReportLayout>
  );
};

export default GoodsServicesDetail;
