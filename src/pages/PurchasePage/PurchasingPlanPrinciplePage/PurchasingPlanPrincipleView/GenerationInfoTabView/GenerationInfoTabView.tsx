import { Collapse, type CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { StepProgressBarFooter } from "components";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { useContext } from "react";
import PlanServicesInformation from "../../PurchasingPlanPrincipleDetail/GenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import ProcurementRequestBase from "../../PurchasingPlanPrincipleDetail/GenerationInfoTab/Components/ProcurementRequestBase/ProcurementRequestBase";
import { PurchasingPlanPrincipleDetailHookContext } from "../../PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";
import AttachedFileView from "./Components/AttachedFileView/AttachedFileView";
import PurchasePlanPrincipalGenerationInfoView from "./Components/GenerationInfoView/GenerationInfoView";
import "./GenerationInfoTabView.scss";

enum InformationSectionKey {
  REQUEST_GENERAL,
  PURCHASE_REQUIREMENTS_BASED_ON,
  PLAN_SERVICES_INFORMATION,
  ATTACHMENT,
}

const PurchasePlanPrincipleGenerationInfoTabView = () => {
  const { translate, model, mappingStatusToProcess, step } = useContext(
    PurchasingPlanPrincipleDetailHookContext
  );

  const status = mappingStatusToProcess(step);

  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_general_information_tab")}
        </div>
      ),
      children: <PurchasePlanPrincipalGenerationInfoView />,
    },
    {
      key: InformationSectionKey.PURCHASE_REQUIREMENTS_BASED_ON,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_based_on_requirements")}
        </div>
      ),
      children: <ProcurementRequestBase isView={true} />,
    },
    {
      key: InformationSectionKey.PLAN_SERVICES_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_goods_services")}
        </div>
      ),
      children: <PlanServicesInformation isView={true} />,
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: <AttachedFileView files={model?.attachments} />,
    },
  ];

  return (
    <div className="pl-collapse pl-scroll">
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

      <Comments topicType={TOPIC_TYPE.PURCHASE_PLAN} topicId={model?.id} />

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

export default PurchasePlanPrincipleGenerationInfoTabView;
