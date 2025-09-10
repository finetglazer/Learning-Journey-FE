import { type CollapseProps } from "antd";
import GenerationInfo from "./Components/GenerationInfo/GenerationInfo";
import Attachments from "components/Attachments/Attachments";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import isEmpty from "lodash/isEmpty";
import { InformationSectionKey } from "models/PurchasingPlan";
import { useContext } from "react";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../PurchasingPlanCompetitiveOfferDetailHook";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ProcurementRequestBase from "./Components/ProcurementRequestBase/ProcurementRequestBase";
import BidderInformation from "./Components/BidderInformation/BidderInformation";
import { useTranslation } from "react-i18next";
import PlanServicesInformation from "./Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import BidderInformationTableChildBidding from "./Components/BidderInformation/Components/BidderInformationTableChildBidding/BidderInformationTableChildBidding";

const PurchasingPlanCompetitiveOfferGenerationInfoTab = () => {
  const currentContext = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const { model, handleChangeListField } = currentContext;
  const [translate] = useTranslation();
  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_general_information_tab")}
        </div>
      ),
      children: <GenerationInfo contextValue={currentContext} />,
    },
    {
      key: InformationSectionKey.PURCHASE_REQUIREMENTS_BASED_ON,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_based_on_requirements")}
        </div>
      ),
      children: <ProcurementRequestBase contextValue={currentContext} />,
    },
    {
      key: InformationSectionKey.INVITATION_BIDDING,
      label: (
        <div className="fw-bold">
          {translate("PL.competitive_offer.title.information")}
        </div>
      ),
      children: (
        <BidderInformationTableChildBidding
          contextValue={currentContext}
          isDetail={false}
          isBidderInformation={false}
          handleChangeSingleField={currentContext?.handleChangeSingleField}
        />
      ),
    },
    {
      key: InformationSectionKey.PLAN_SERVICES_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_goods_services")}
        </div>
      ),
      children: <PlanServicesInformation contextValue={currentContext} />,
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: (
        <Attachments
          attachments={model?.attachments}
          handleUpdate={handleChangeListField({ fieldName: "attachments" })}
        />
      ),
    },
  ];

  return (
    <div>
      <AdvancedCollapseView
        items={collapseItems}
        showAll={false}
        defaultActiveKey={[
          InformationSectionKey.REQUEST_GENERAL,
          InformationSectionKey.PURCHASE_REQUIREMENTS_BASED_ON,
          InformationSectionKey.PLAN_SERVICES_INFORMATION,
          InformationSectionKey.INVITATION_BIDDING,
          InformationSectionKey.SUPPLIER_INFORMATION,
          InformationSectionKey.ATTACHMENT,
        ]}
      />
      {!isEmpty(model?.id) && (
        <div className="px-3 pb-4">
          <Comments
            isNewLayoutVersion
            topicType={TopicType.PurchasingPlanCompetitiveOffer}
            topicId={model?.id}
          />
        </div>
      )}
    </div>
  );
};

export default PurchasingPlanCompetitiveOfferGenerationInfoTab;
