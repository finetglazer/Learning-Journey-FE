import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { EvaluationResult, EvaluationSummary } from "models/PurchasingPlan";
import { TechnicalReviewerTable } from "../TechnicalReviewerTable/TechnicalReviewerTable";
import { FinancialReviewerPassTable } from "../FinancialReviewerPassTable/FinancialReviewerPassTable";
import { FinancialReviewerScoreTable } from "../FinancialReviewerScoreTable/FinancialReviewerScoreTable";
import DetailDocumentEvaluationDrawerTechnical from "../DetailDocumentEvaluationDrawerTechnical/DetailDocumentEvaluationDrawerTechnical";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import DetailDocumentEvaluationDrawerFinancialPassScore from "../DetailDocumentEvaluationDrawerFinancialPassScore/DetailDocumentEvaluationDrawerFinancialPassScore";

export interface RoundTableProps {
  roundData: EvaluationSummary;
}

const RoundTable = ({ roundData }: RoundTableProps) => {
  const [translate] = useTranslation();

  const { isTechnicalView, isFinancialViewPass, isFinancialViewScore } =
    useContext(PurchasingPlanBiddingDetailHookContext);

  const [
    openDetailDocumentEvaluationDrawer,
    setOpenDetailDocumentEvaluationDrawer,
  ] = useState<boolean>(false);
  const [currentReview, setCurrentReview] = useState<EvaluationResult>();
  const [isEditDocumentEvaluation, setIsEditDocumentEvaluation] =
    useState(false);

  const handleOpenDetailDocumentEvaluationDrawer = (
    data: EvaluationResult,
    canEdit = false
  ) => {
    setCurrentReview(data);
    setOpenDetailDocumentEvaluationDrawer(true);
    setIsEditDocumentEvaluation(canEdit);
  };

  const handleCloseDetailDocumentEvaluationDrawer = () => {
    setOpenDetailDocumentEvaluationDrawer(false);
    setIsEditDocumentEvaluation(false);
  };

  if (isEmpty(roundData?.evaluationResults)) {
    return (
      <CloudyEmpty
        content={translate("PM.payment_empty_list_expense_reversal_title")}
      />
    );
  }

  return (
    <>
      {/* Technical view for both pass and score */}
      {isTechnicalView && (
        <TechnicalReviewerTable
          roundData={roundData}
          onOpenDetailDocumentEvaluationDrawer={
            handleOpenDetailDocumentEvaluationDrawer
          }
        />
      )}
      {openDetailDocumentEvaluationDrawer && isTechnicalView && (
        <DetailDocumentEvaluationDrawerTechnical
          data={currentReview}
          roundData={roundData}
          isEdit={isEditDocumentEvaluation}
          onClose={handleCloseDetailDocumentEvaluationDrawer}
        />
      )}

      {/* Financial view for score */}
      {isFinancialViewScore && (
        <FinancialReviewerScoreTable
          roundData={roundData}
          onOpenDetailDocumentEvaluationDrawer={
            handleOpenDetailDocumentEvaluationDrawer
          }
        />
      )}

      {/* Financial view for pass */}
      {isFinancialViewPass && (
        <FinancialReviewerPassTable
          roundData={roundData}
          onOpenDetailDocumentEvaluationDrawer={
            handleOpenDetailDocumentEvaluationDrawer
          }
        />
      )}

      {/* EvaluationDrawer Financial for both pass and score*/}
      {openDetailDocumentEvaluationDrawer &&
        (isFinancialViewScore || isFinancialViewPass) && (
          <DetailDocumentEvaluationDrawerFinancialPassScore
            data={currentReview}
            roundData={roundData}
            isEdit={isEditDocumentEvaluation}
            onClose={handleCloseDetailDocumentEvaluationDrawer}
          />
        )}
    </>
  );
};

export default RoundTable;
