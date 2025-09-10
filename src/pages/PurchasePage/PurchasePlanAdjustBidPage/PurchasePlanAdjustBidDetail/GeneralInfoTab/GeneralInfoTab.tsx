import { useContext, useMemo } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";

import { PurchasePlanAdjustBidDetailHookContext } from "../PurchasePlanAdjustBidDetailHook";

import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";

import { useTranslation } from "react-i18next";
import { AdvancedCollapseView } from "components";

import { ColumnKey } from "models/PurchasingPlan";
import TechnicalProfile from "./Components/TechnicalProfile/TechnicalProfile";
import EvaluationTeam from "./Components/EvaluationTeam/EvaluationTeam";
import TechnicalCriteria from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/EvaluationCriteriaTab/Components/TechnicalCriteria/TechnicalCriteria";
import FinancialCriteria from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/EvaluationCriteriaTab/Components/FinancialCriteria/FinancialCriteria";
import AdjustmentInfo from "pages/PurchasePage/PurchasePlanAdjustCompetitiveOfferPage/Components/GeneralInfoTab/Components/AdjustmentInfo/AdjustmentInfo";
import GeneralInfo from "pages/PurchasePage/PurchasePlanAdjustCompetitiveOfferPage/Components/GeneralInfoTab/Components/GeneralInfo/GeneralInfo";
import SupplierInfo from "pages/PurchasePage/PurchasePlanAdjustCompetitiveOfferPage/Components/GeneralInfoTab/Components/SupplierInfo/SupplierInfo";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";
import styles from "./GeneralInfoTab.module.scss";

enum SectionKey {
  GENERAL_INFO,
  ADJUSTMENT_INFO,
  SUPPLIER_INFO,
  EVALUATION_TEAM,
  TECHNICAL_ASSESSMENT,
  FINANCIAL_ASSESSMENT,
  TECHNICAL_CRITERIA,
  FINANCIAL_CRITERIA,
}

const GeneralInfoTab = () => {
  const contextValue = useContext(PurchasePlanAdjustBidDetailHookContext);
  const [translate] = useTranslation();

  const { model, isDetailPage, isCreatePage, isViewPage } = contextValue;
  const ticketStatus = isCreatePage
    ? model?.status
    : model?.oldOriginalPurchasePlanStatus;

  const isHaveTechnicalProfile =
    ticketStatus !== PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING &&
    ticketStatus === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED;

  // Nếu ở những status này thì không cho edit Nhà cung cấp
  const isEditSupplier =
    ![
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE,
    ].includes(ticketStatus) && isDetailPage;

  // Đã tổng hợp điểm thì không cho edit data
  const isResultSummarizedForAdjustment =
    model?.isResultSummarizedForAdjustment;

  const collapseItems = useMemo(
    () =>
      [
        !isViewPage && {
          key: SectionKey.GENERAL_INFO,
          label: (
            <div className="fw-bold">
              {translate("PL.purchasing_plan_general_information_tab")}
            </div>
          ),
          children: (
            <GeneralInfo contextValue={contextValue} isDetail={false} />
          ),
        },
        {
          key: SectionKey.ADJUSTMENT_INFO,
          label: (
            <div className="fw-bold">{translate("PPA.adjustment_info")}</div>
          ),
          children: (
            <AdjustmentInfo
              isDetail={isViewPage}
              contextValue={contextValue}
              fieldData={ColumnKey.TENDER_REQUESTS}
              fieldDataOld={ColumnKey.TENDER_REQUEST_OLD}
            />
          ),
        },
        isHaveTechnicalProfile && {
          key: SectionKey.TECHNICAL_ASSESSMENT,
          label: (
            <div className="fw-bold">
              {translate("PL.bidding.title.technical_profile")}
            </div>
          ),
          children: (
            <TechnicalProfile
              isDetail={isViewPage}
              contextValue={contextValue}
              columnKey={ColumnKey.TECHNICAL_PROFILE}
            />
          ),
        },
        isHaveTechnicalProfile && {
          key: SectionKey.FINANCIAL_ASSESSMENT,
          label: (
            <div className="fw-bold">
              {translate("PL.bidding.title.financial_profile")}
            </div>
          ),
          children: (
            <TechnicalProfile
              isDetail={isViewPage}
              contextValue={contextValue}
              columnKey={ColumnKey.FINANCIAL_PROFILE}
            />
          ),
        },
        {
          key: SectionKey.SUPPLIER_INFO,
          label: (
            <div className="fw-bold">{translate("PPA.supplier_info")}</div>
          ),
          children: (
            <SupplierInfo
              contextValue={contextValue}
              isDetail={isEditSupplier}
              isNegotiating={
                ticketStatus ===
                PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING
              }
            />
          ),
        },
        ticketStatus !==
          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && {
          key: SectionKey.EVALUATION_TEAM,
          label: (
            <div className="fw-bold">
              {translate("PPA.evaluation_team_information")}
            </div>
          ),
          children: (
            <EvaluationTeam
              contextValue={contextValue}
              isDetail={isViewPage || isResultSummarizedForAdjustment}
            />
          ),
        },
        ticketStatus !==
          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && {
          key: SectionKey.TECHNICAL_CRITERIA,
          label: (
            <div className="fw-bold">
              {translate("PPA.technical_capability_assessment_criteria")}
            </div>
          ),
          children: (
            <TechnicalCriteria
              isDetail={isViewPage || isResultSummarizedForAdjustment}
              contextValue={contextValue}
              requiredInTable={true}
            />
          ),
        },
        ticketStatus !==
          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && {
          key: SectionKey.FINANCIAL_CRITERIA,
          label: (
            <div className="fw-bold">
              {translate("PPA.financial_assessment_criteria")}
            </div>
          ),
          children: (
            <FinancialCriteria
              isDetail={isViewPage || isResultSummarizedForAdjustment}
              contextValue={contextValue}
              requiredInTable={true}
            />
          ),
        },
      ]?.filter((el) => Boolean(el)),
    [
      contextValue,
      isHaveTechnicalProfile,
      isResultSummarizedForAdjustment,
      isEditSupplier,
      isViewPage,
      ticketStatus,
      translate,
    ]
  );

  return (
    <div className={classNames(styles["general-info-tab-container"])}>
      {isViewPage && (
        <GeneralInfo contextValue={contextValue} isDetail={isViewPage} />
      )}
      <AdvancedCollapseView
        items={collapseItems}
        defaultActiveKey={[
          SectionKey.GENERAL_INFO,
          SectionKey.ADJUSTMENT_INFO,
          SectionKey.SUPPLIER_INFO,
          SectionKey.TECHNICAL_ASSESSMENT,
          SectionKey.FINANCIAL_ASSESSMENT,
          SectionKey.TECHNICAL_CRITERIA,
          SectionKey.FINANCIAL_CRITERIA,
        ]}
      />
      <div className="m-r--sm m-l--sm m-b--md">
        {!isEmpty(model?.id) && (
          <Comments
            isNewLayoutVersion
            topicType={TopicType.PurchasePlanAdjustment}
            topicId={model?.id}
          />
        )}
      </div>
    </div>
  );
};

export default GeneralInfoTab;
