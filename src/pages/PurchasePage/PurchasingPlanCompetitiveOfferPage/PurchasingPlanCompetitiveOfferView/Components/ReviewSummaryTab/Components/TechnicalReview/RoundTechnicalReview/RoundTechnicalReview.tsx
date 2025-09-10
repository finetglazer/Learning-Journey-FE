import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import {
  EvaluationSummary,
  TabKeyBidder,
  RoundTechnicalReviewType,
} from "models/PurchasingPlan";
import { convertDataEvaluationSummary } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/helper";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext } from "react";
import TechnicalReviewTable from "../SummaryReviewTable";
import "./RoundTechnicalReview.scss";
import { isEmpty, isEqual } from "lodash";
import { Button } from "react-components-design-system";
import { IcDownloadRed } from "assets/icons";
import EmptyTable from "../../EmptyView/EmptyTable/EmptyTable";
import type { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { purchasingPlanRepository } from "../../../../../../../PurchasingPlanPage/PurchasingPlanRepository";

const RoundTechnicalReview = () => {
  const {
    translate,
    model,
    tabKeyParams: tabKey,
    notifyToast,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const handleQuotationComparison = (id: string) => {
    purchasingPlanRepository.downloadQuotationComparison(id).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "quotation_comparison.xlsx");
      },
      error: (error) => {
        notifyToast({
          message:
            error.response?.data?.message ||
            translate("CM.title_export_file_error"),
          type: "error",
        });
      },
    });
  };

  const getData = isEqual(tabKey, TabKeyBidder.DocumentEvaluation)
    ? (model?.profileEvaluation?.evaluationRound as EvaluationSummary[])
    : model?.evaluationSummary;

  const collapseItems = convertDataEvaluationSummary(getData)?.map(
    (item, index) => {
      return {
        key: item.id,
        label: (
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {item?.type === RoundTechnicalReviewType.Bid
                ? translate("PL.label_round_offer_price")
                : translate("PL.label_round_negotiate")}{" "}
              {item?.roundNumber}:{" "}
              {formatDateTimeToVietnamTimezone(
                item?.startDate,
                STANDARD_DATE_FORMAT_SLASH
              )}{" "}
              -{" "}
              {formatDateTimeToVietnamTimezone(
                item?.endDate,
                STANDARD_DATE_FORMAT_SLASH
              )}
            </div>
            {!isEmpty(item?.evaluationResults) && !index && (
              <Button
                icon={<img src={IcDownloadRed} alt="download_red" />}
                iconPlace="left"
                type="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuotationComparison(model?.id);
                }}
              >
                {translate("PL.txt_download_compare_price")}
              </Button>
            )}
          </div>
        ),
        children: isEmpty(item?.evaluationResults) ? (
          <EmptyTable />
        ) : (
          <TechnicalReviewTable data={item?.evaluationResults} />
        ),
      };
    }
  );

  return (
    <AdvancedCollapseView
      className="result_review_summary_view"
      items={collapseItems}
      isFullView
      key={JSON.stringify(model)}
    />
  );
};

export default RoundTechnicalReview;
