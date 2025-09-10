import { Collapse, type CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { isUndefined } from "lodash";
import { useContext } from "react";
import { PurchasingPlanDetailHookContext } from "../PurchasingPlanDetailHook";
import AttachedFile from "./Components/AttachedFile/AttachedFile";
import PlanServicesInformation from "./Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import ProcurementRequestBase from "./Components/ProcurementRequestBase/ProcurementRequestBase";
import PurchasePlanGenerationInfo from "./Components/PurchasePlanGenerationInfo/PurchasePlanGenerationInfo";
import SupplierAttachments from "./Components/SupplierAttachments/SupplierAttachments";
import "./PurchasePlanGenerationInfoTab.scss";

enum InformationSectionKey {
  REQUEST_GENERAL,
  PURCHASE_REQUIREMENTS_BASED_ON,
  PLAN_SERVICES_INFORMATION,
  ATTACHMENT,
  SUPPLIER_ATTACHMENTS,
}

const PurchasePlanGenerationInfoTab = () => {
  const { translate, model } = useContext(PurchasingPlanDetailHookContext);
  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_general_information_tab")}
        </div>
      ),
      children: <PurchasePlanGenerationInfo />,
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
    {
      key: InformationSectionKey.SUPPLIER_ATTACHMENTS,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_supplier_attachment")}
        </div>
      ),
      children: <SupplierAttachments />,
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
      {!isUndefined(model?.status) && (
        <Comments topicType={TOPIC_TYPE.PURCHASE_PLAN} topicId={model?.id} />
      )}
    </div>
  );
};

export default PurchasePlanGenerationInfoTab;
