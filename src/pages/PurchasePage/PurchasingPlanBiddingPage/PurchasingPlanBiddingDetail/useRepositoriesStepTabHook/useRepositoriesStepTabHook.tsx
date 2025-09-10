import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/useRepositoriesStepTabHook/useRepositoriesStepTabHook.module.scss";
import EvaluationCriteriaTab from "../EvaluationCriteriaTab/EvaluationCriteriaTab";
import PurchasePlanGenerationInfoTab from "../GenerationInfoTab/GenerationInfoTab";
import RequestForBidTab from "../RequestForBidTab/RequestForBidTab";
import SupplierInfoTab from "../SupplierInfoTab/SupplierInfoTab";
import EvaluationTeamInformationTab from "../EvaluationTeamInformationTab/EvaluationTeamInformationTab";
import { TabKeyBidder } from "models/PurchasingPlan";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";

function useRepositoriesStepTabHook(
  tabKeyError: TabKeyBidder[],
  idDetail?: string,
  status = PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.DRAFT
) {
  const [translate] = useTranslation();
  const isDetailByStatus =
    status !== PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.DRAFT;

  const initializeTabs = [
    {
      key: TabKeyBidder.GenerationInfo,
      title: "PL.purchasing_plan_general_information_tab",
      component: <PurchasePlanGenerationInfoTab />,
    },
    {
      key: TabKeyBidder.SupplierInfo,
      title: "PL.purchasing_plan_supplier_information",
      component: <SupplierInfoTab isDetail={isDetailByStatus} />,
    },
    {
      key: TabKeyBidder.EvaluationTeamInformation,
      title: "PL.competitive_offer.title.evaluation_team_information",
      component: <EvaluationTeamInformationTab />,
    },
    {
      key: TabKeyBidder.RequestForBid,
      title: "PL.bidding.title.request_for_bid",
      component: <RequestForBidTab />,
    },
    {
      key: TabKeyBidder.DocumentEvaluation,
      title: "PL.txt_evaluation_criteria_tab",
      component: <EvaluationCriteriaTab />,
    },
  ];

  const tabRepositories = useMemo(
    () =>
      initializeTabs.map((tab) => {
        const { key, title, component } = tab;
        return {
          tabKey: key,
          tabTitle: (
            <TabName
              text={translate(title)}
              isShowIconError={tabKeyError?.includes(key)}
            />
          ),
          children: <div className={styles["scroll"]}>{component}</div>,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabKeyError, translate]
  );

  return {
    tabRepositories,
  };
}

export default useRepositoriesStepTabHook;
