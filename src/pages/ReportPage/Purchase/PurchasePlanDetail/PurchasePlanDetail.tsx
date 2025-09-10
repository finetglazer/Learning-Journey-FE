import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Filter from "./Components/Filter";
import CollapseResultReport from "pages/ReportPage/Components/CollapseResultReport/CollapseResultReport";
import { useMemo } from "react";
import PurchasePlanInformation from "./Components/CollapseResult/PurchasePlanInformation/PurchasePlanInformation";
import ContractTerms from "./Components/CollapseResult/ContractTerms/ContractTerms";
import ProductService from "./Components/CollapseResult/ProductServices/ProductService";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import useReportDetail from "pages/ReportPage/Components/hooks/useReportDetail";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { PurchasingPlanDetailFilter } from "models/Report/PurchasingPlanDetailFilter";
import { PurchaseDataType } from "models/Report/PurchasePlanDetail";
import { AxiosError, AxiosResponse } from "axios";
import saveAs from "file-saver";
import appMessageService from "core/services/common-services/app-message-service";

export default function PurchasePlanDetail() {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    modelFilter,
    isReset,
    detail,
    handleFilterDetail,
    handleResetFilterDetail,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    isShowResult,
    handleChangeMultipleSelectFilter,
  } = useReportDetail({
    ModelFilterClass: PurchasingPlanDetailFilter,
    getDetail: reportRepository.getPurchasePlanDetail,
    onExport: reportRepository.getPurchasePlanDetailFile,
    validateField: ["supplierIdsId", "purchasePlanIdValue"],
  });

  const handleExportFile = () => {
    if (!detail) {
      return;
    }
    // @ts-ignore
    const filterForExport: PurchasingPlanDetailFilter = {
      ...modelFilter,
      isReloadPage: true,
    };

    const fileName = `${translate(
      "report.purchase.purchase_plan_detail.title"
    )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}.xlsx`;

    reportRepository.getPurchasePlanDetailFile(filterForExport).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError<any>) => {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      },
    });
  };

  const itemsCollapse = useMemo(
    () => [
      {
        key: 1,
        label: translate(
          "report.purchase.purchase_plan_detail.tab.information_purchase_plan"
        ),
        children: <PurchasePlanInformation data={detail as PurchaseDataType} />,
      },
      {
        key: 2,
        label: translate(
          "report.purchase.purchase_plan_detail.tab.goods_services"
        ),
        children: <ProductService data={detail?.goodsItems} />,
      },
      {
        key: 3,
        label: translate(
          "report.purchase.purchase_plan_detail.tab.contract_terms"
        ),
        children: <ContractTerms data={detail?.contractTerms} />,
      },
    ],
    [translate, detail]
  );

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.purchase_plan_detail.title")}
      filterComponent={
        <Filter
          modelFilter={modelFilter}
          error={isReset ? undefined : modelFilter}
          onFilter={handleFilterDetail}
          onReset={handleResetFilterDetail}
          handleChangeSelectFilter={handleChangeSelectFilter}
          handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
          handleChangeAllFilter={handleChangeAllFilter}
        />
      }
    >
      <CollapseResultReport
        items={itemsCollapse}
        modelFilter={modelFilter}
        isShowResult={isShowResult}
        isShowUnit={true}
        onExport={handleExportFile}
      />
    </PurchaseReportLayout>
  );
}
