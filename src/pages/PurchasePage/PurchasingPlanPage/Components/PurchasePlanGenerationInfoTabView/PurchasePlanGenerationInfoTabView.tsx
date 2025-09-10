import { Collapse, type CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { useContext } from "react";
import PlanServicesInformation from "../../PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import ProcurementRequestBase from "../../PurchasingPlanDetail/PurchasePlanGenerationInfoTab/Components/ProcurementRequestBase/ProcurementRequestBase";
import { PurchasingPlanDetailHookContext } from "../../PurchasingPlanDetail/PurchasingPlanDetailHook";
import AttachedFileView from "./Components/AttachedFileView/AttachedFileView";
import PurchasePlanGenerationInfoView from "./Components/PurchasePlanGenerationInfoView/PurchasePlanGenerationInfoView";
import "./PurchasePlanGenerationInfoTabView.scss";

enum InformationSectionKey {
  REQUEST_GENERAL,
  PURCHASE_REQUIREMENTS_BASED_ON,
  PLAN_SERVICES_INFORMATION,
  ATTACHMENT,
  SUPPLIER_ATTACHMENTS,
}

const PurchasePlanGenerationInfoTabView = () => {
  const { translate, model } = useContext(PurchasingPlanDetailHookContext);

  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_general_information_tab")}
        </div>
      ),
      children: <PurchasePlanGenerationInfoView />,
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
    {
      key: InformationSectionKey.SUPPLIER_ATTACHMENTS,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_supplier_attachment")}
        </div>
      ),
      children: <AttachedFileView files={model?.supplierAttachments} />,
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
          InformationSectionKey.SUPPLIER_ATTACHMENTS,
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
    </div>
  );
};

export default PurchasePlanGenerationInfoTabView;
