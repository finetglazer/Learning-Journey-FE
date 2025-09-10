import { Collapse, type CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import PurchasePlanPrincipleGenerationInfo from "./Components/GenerationInfo/GenerationInfo";

import { StepProgressBarFooter } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE } from "config/route-const";
import { isUndefined } from "lodash";
import isEmpty from "lodash/isEmpty";
import { useContext } from "react";
import { useHistory } from "react-router";
import { PurchasingPlanPrincipleDetailHookContext } from "../PurchasingPlanPrincipleDetailHook";
import AttachedFile from "./Components/AttachedFile/AttachedFile";
import PlanServicesInformation from "./Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import ProcurementRequestBase from "./Components/ProcurementRequestBase/ProcurementRequestBase";

enum InformationSectionKey {
  REQUEST_GENERAL,
  PURCHASE_REQUIREMENTS_BASED_ON,
  PLAN_SERVICES_INFORMATION,
  ATTACHMENT,
  SUPPLIER_ATTACHMENTS,
}

const PurchasePlanPrincipleGenerationInfoTab = () => {
  const { translate, mappingStatusToProcess, model } = useContext(
    PurchasingPlanPrincipleDetailHookContext
  );
  const history = useHistory();
  const status = mappingStatusToProcess(model?.status);
  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_general_information_tab")}
        </div>
      ),
      children: <PurchasePlanPrincipleGenerationInfo />,
    },
    {
      key: InformationSectionKey.PURCHASE_REQUIREMENTS_BASED_ON,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_based_on_requirements")}
        </div>
      ),
      children: <ProcurementRequestBase />,
    },
    {
      key: InformationSectionKey.PLAN_SERVICES_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_goods_services")}
        </div>
      ),
      children: <PlanServicesInformation />,
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: <AttachedFile />,
    },
  ];

  const isCreate =
    history.location.pathname.includes(
      PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE
    ) && isEmpty(model?.id);

  return (
    <div
      className={classNames("pl-collapse pl-scroll", isCreate && "principle")}
    >
      <Collapse
        ghost
        items={collapseItems}
        defaultActiveKey={[
          InformationSectionKey.REQUEST_GENERAL,
          InformationSectionKey.PURCHASE_REQUIREMENTS_BASED_ON,
          InformationSectionKey.PLAN_SERVICES_INFORMATION,
          InformationSectionKey.ATTACHMENT,
        ]}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <img
              src={IcArrowDown}
              className={classNames(
                "invoice-transition",
                isActive && "invoice-transition_expand"
              )}
              alt=""
            />
          </div>
        )}
      />

      {!isUndefined(model?.status) ? (
        <Comments topicType={TOPIC_TYPE.PURCHASE_PLAN} topicId={model?.id} />
      ) : null}

      <StepProgressBarFooter
        steps={[
          { title: translate("PL.initial_step_text") },
          { title: translate("PL.select_supplier_step_text") },
        ]}
        currentStep={status}
      />
    </div>
  );
};

export default PurchasePlanPrincipleGenerationInfoTab;
