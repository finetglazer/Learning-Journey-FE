import { Badge, Col, Divider, Row } from "antd";

import { UserFillIcon } from "assets/icons";
import classNames from "classnames";
import { PURCHASE_REQUEST_VIEW_ROUTE } from "config/route-const";
import { EMPTY_STRING, numberConstants } from "core/config/consts";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./GeneralInfo.module.scss";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { TYPE_PURCHASING_PLAN_OPTIONS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { useMemo } from "react";

interface GeneralInfoProps {
  isDetail?: boolean;
  contextValue:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
}

const GeneralInfo = ({ isDetail = false, contextValue }: GeneralInfoProps) => {
  const [translate] = useTranslation();
  const { model, isCreatePage } = contextValue;

  const linkRedirectPurchasingPlan = useMemo(() => {
    return TYPE_PURCHASING_PLAN_OPTIONS.find(
      (el) => el.id === model?.purchasePlanType
    );
  }, [model?.purchasePlanType]);

  if (isDetail) {
    return (
      <div className={styles["ticket"]}>
        <div className={styles["ticket-container"]}>
          <div className={styles["ticket-general"]}>
            <div className={styles["ticket-general-title"]}>
              <Link
                to={`${PURCHASE_REQUEST_VIEW_ROUTE}/${model?.originalPurchaseRequestId}`}
                target="_blank"
              >
                {model?.originalPurchaseRequest?.code}
              </Link>
            </div>
            <div className={styles["ticket-general-content"]}>
              {model?.originalPurchaseRequest?.name}
            </div>
          </div>
          <div className={styles["ticket-general-data"]}>
            <div className={styles["ticket-general-data-avatar"]}>
              <Badge dot offset={[-numberConstants.FOUR, numberConstants.FOUR]}>
                <img src={UserFillIcon} alt="UserFillIcon" />
              </Badge>
              {model?.user?.email} - {model?.user?.name}
            </div>
            <div className={styles["ticket-general-data-plan"]}>
              {translate("PPA.purchase_plan_basis")}
              <Link
                to={`${linkRedirectPurchasingPlan?.pathView}/${model?.originalPurchasePlanId}`}
                target="_blank"
                className={styles["ticket-general-data-title-link"]}
              >
                {model?.originalCode}
              </Link>
            </div>
            <div className={styles["ticket-general-data-plan"]}>
              {translate("PPA.purchase_plan_name")}
              <div className={styles["ticket-general-data-plan-content"]}>
                {model?.originalName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column">
      <Row gutter={24}>
        <Col span={8}>
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={styles["label-text"]}>
              {translate("PL.purchasing_plan_based_on_requirements")}
            </span>
            <a
              href={`${PURCHASE_REQUEST_VIEW_ROUTE}/${model?.purchaseRequestId}`}
              target="_blank"
              className={`${styles["content-text"]} ${styles["content-text--primary"]}`}
            >
              {model?.purchaseRequestCode ?? EMPTY_STRING}
            </a>
          </div>
        </Col>
        <Col span={16}>
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={styles["label-text"]}>
              {translate("PR.request_name")}
            </span>
            <p className={`${styles["content-text"]}`}>
              {model?.purchaseRequestName ?? EMPTY_STRING}
            </p>
          </div>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={8}>
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={styles["label-text"]}>
              {translate("PPA.purchase_plan_basis")}
            </span>
            <a
              href={`${linkRedirectPurchasingPlan?.pathView}/${
                model.originalPurchasePlanId ?? model?.id
              }`}
              target="_blank"
              className={classNames(
                styles["content-text"],
                styles["content-text--primary"]
              )}
            >
              {(isCreatePage ? model?.code : model?.originalCode) ??
                EMPTY_STRING}
            </a>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={styles["label-text"]}>
              {translate("PPA.purchase_plan_name")}
            </span>
            <p className={classNames(styles["content-text"])}>
              {model?.originalName ?? EMPTY_STRING}
            </p>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={styles["label-text"]}>
              {translate("PPA.purchase_plan_by_creator")}
            </span>
            <p className={classNames(styles["content-text"])}>
              {[
                model?.originalCreateUser?.email,
                model?.originalCreateUser?.name,
              ]
                .filter((item) => item)
                .join(" - ") || EMPTY_STRING}
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralInfo;
