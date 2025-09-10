import { type CollapseProps } from "antd";

import PurchasePlanBiddingGenerationInfo from "./Components/GenerationInfo/GenerationInfo";

import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import Attachments from "components/Attachments/Attachments";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import isEmpty from "lodash/isEmpty";
import { InformationSectionKey } from "models/PurchasingPlan";
import BidderInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/BidderInformation";
import ProcurementRequestBase from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/ProcurementRequestBase/ProcurementRequestBase";
import { useContext } from "react";
import { PurchasingPlanBiddingDetailHookContext } from "../PurchasingPlanBiddingDetailHook";
import { useTranslation } from "react-i18next";
import PlanServicesInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/PlanGoodsServices/PlanServicesInformation/PlanServicesInformation";
import { PURCHASING_PLAN_BIDDING_DETAIL_ROUTE } from "config/route-const";
import styles from "./GenerationInfoTab.module.scss";
import BidderInformationTableChildBidding from "../../../PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/BidderInformation/Components/BidderInformationTableChildBidding/BidderInformationTableChildBidding";

const PurchasePlanBiddingGenerationInfoTab = () => {
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);
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
      children: <PurchasePlanBiddingGenerationInfo />,
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
          {translate("PL.bidding.title.information")}
        </div>
      ),
      children: (
        <BidderInformationTableChildBidding
          contextValue={currentContext}
          isDetail={false}
          isBidderInformation={true}
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
      children: (
        <PlanServicesInformation
          isView={false}
          contextValue={currentContext}
          pathEdit={PURCHASING_PLAN_BIDDING_DETAIL_ROUTE}
        />
      ),
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
        <Comments
          isNewLayoutVersion
          topicType={TopicType.PurchasePlan}
          topicId={model?.id}
        />
      )}
    </div>
  );
};

export default PurchasePlanBiddingGenerationInfoTab;
