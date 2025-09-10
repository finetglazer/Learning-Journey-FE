import { CriteriaType, TechnicalCompetenceType } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./CriterialSection.scss";
import CriterialTable from "./CriterialTable";
import { getDataTableByCriteriaType } from "./helper";

type Props = {
  criteriaType: CriteriaType;
};

const CriterialTechSection = ({ criteriaType }: Props) => {
  const [translate] = useTranslation();

  const { model } = useContext(PurchasingPlanBiddingDetailHookContext);

  const criteriaMetData = getDataTableByCriteriaType(
    model?.evaluationCriteriaSummary?.evaluationCriteriaGroups,
    criteriaType,
    TechnicalCompetenceType.TechnicalCriteriaMet
  );

  const scoreData = getDataTableByCriteriaType(
    model?.evaluationCriteriaSummary?.evaluationCriteriaGroups,
    criteriaType,
    TechnicalCompetenceType.TechnicalScore
  );

  if (criteriaType === CriteriaType.Finance) {
    return (
      <div className="criterial-section-wrapper">
        <div className="header_criteria p-b--sm">
          <span>{translate("PL.txt_evaluation_method")}: </span>
          {criteriaMetData ? (
            <span className="fw-bold m-l--2xs">
              {translate("PL.txt_pass_or_fail")}
            </span>
          ) : (
            <React.Fragment>
              <span className="fw-bold m-l--2xs">
                {translate("PL.txt_scoring")}
              </span>
              <div className="partition" />
              <span className="">{translate("PL.txt_technical_weight")}: </span>
              <span className="fw-bold m-l--2xs">
                {scoreData?.financialWeight} %
              </span>
            </React.Fragment>
          )}
        </div>
        <CriterialTable
          data={criteriaMetData ?? scoreData}
          technicalCompetenceType={
            criteriaMetData
              ? TechnicalCompetenceType.TechnicalCriteriaMet
              : TechnicalCompetenceType.TechnicalScore
          }
        />
      </div>
    );
  }

  return (
    <div className="criterial-section-wrapper">
      <div className="header_criteria p-b--sm">
        <span>{translate("PL.txt_evaluation_method")}: </span>
        <span className="fw-bold m-l--2xs">
          {translate("PL.txt_pass_or_fail")}
        </span>
      </div>
      <CriterialTable
        data={criteriaMetData}
        criteriaType={CriteriaType.TechnicalCompetence}
        technicalCompetenceType={TechnicalCompetenceType.TechnicalCriteriaMet}
      />

      <div className="header_criteria m-t--lg  p-b--sm">
        <span>{translate("PL.txt_evaluation_method")}:</span>
        <span className="fw-bold m-l--2xs">{translate("PL.txt_scoring")}</span>
        <div className="partition" />
        <span className="">{translate("PL.txt_technical_weight")}: </span>
        <span className="fw-bold m-l--2xs">{scoreData?.technicalWeight} %</span>
      </div>
      <CriterialTable
        data={scoreData}
        criteriaType={CriteriaType.TechnicalCompetence}
        technicalCompetenceType={TechnicalCompetenceType.TechnicalScore}
      />
    </div>
  );
};

export default CriterialTechSection;
