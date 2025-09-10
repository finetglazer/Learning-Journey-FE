import { useContext, useMemo } from "react";

import { PurchasePlanAdjustCompetitiveOfferDetailHookContext } from "../../PurchasePlanAdjustCompetitiveOfferDetail/PurchasePlanAdjustCompetitiveOfferDetailHook";
import GeneralInfo from "./Components/GeneralInfo/GeneralInfo";

import { AdvancedCollapseView } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import AdjustmentInfo from "./Components/AdjustmentInfo/AdjustmentInfo";
import Assessment from "./Components/Assessment/Assessment";
import SupplierInfo from "./Components/SupplierInfo/SupplierInfo";

import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";
import { useTranslation } from "react-i18next";
import styles from "./GeneralInfoTab.module.scss";
import classNames from "classnames";

enum SectionKey {
  GENERAL_INFO,
  ADJUSTMENT_INFO,
  SUPPLIER_INFO,
  TECHNICAL_CAPABILITY_ASSESSMENT,
  FINANCIAL_ASSESSMENT,
  ROLE,
}

const GeneralInfoTab = ({ isDetail = false }) => {
  const [translate] = useTranslation();
  const contextValue = useContext(
    PurchasePlanAdjustCompetitiveOfferDetailHookContext
  );

  const { model, isCreatePage } = contextValue;
  const status = isCreatePage
    ? model?.status
    : model?.oldOriginalPurchasePlanStatus;

  const collapseItems = useMemo(
    () =>
      [
        !isDetail && {
          key: SectionKey.GENERAL_INFO,
          label: (
            <div className="fw-bold">
              {translate("PL.purchasing_plan_general_information_tab")}
            </div>
          ),
          children: (
            <GeneralInfo contextValue={contextValue} isDetail={isDetail} />
          ),
        },
        {
          key: SectionKey.ADJUSTMENT_INFO,
          label: (
            <div className="fw-bold">{translate("PPA.adjustment_info")}</div>
          ),
          children: (
            <AdjustmentInfo contextValue={contextValue} isDetail={isDetail} />
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
              isDetail={!isDetail || isCreatePage}
            />
          ),
        },
        status !== PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && {
          key: SectionKey.TECHNICAL_CAPABILITY_ASSESSMENT,
          label: (
            <div className="fw-bold">
              {translate("PPA.evaluation_criteria_for_offer_documents")}
            </div>
          ),
          children: (
            <Assessment isDetail={isDetail} contextValue={contextValue} />
          ),
        },
      ].filter((el) => Boolean(el)),
    [contextValue, isCreatePage, isDetail, status, translate]
  );

  return (
    <div
      className={classNames(styles["content-container"], {
        [styles["has-tab"]]: !isCreatePage,
      })}
    >
      <div className={styles["collapse-section"]}>
        {isDetail && (
          <GeneralInfo contextValue={contextValue} isDetail={isDetail} />
        )}
        <AdvancedCollapseView items={collapseItems} />
        <div className="m-r--sm m-l--sm m-b--md">
          {!!model?.id && (
            <Comments
              isNewLayoutVersion
              topicType={TopicType.PurchasePlanAdjustmentCompetition}
              topicId={model.id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
