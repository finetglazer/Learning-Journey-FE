import ContractDetailAttachedFile from "pages/PurchasePage/ContractPage/ContractDetail/Components/GenerationInfoTab/Components/AttachedFile/AttachedFile";
import ContractViewBasicInformation from "./BasicInformation/BasicInformation";
import ContractViewBuyerInformation from "./BuyerInformation/BuyerInformation";
import ContractViewBase from "./ContractViewBase/ContractViewBase";
import ContractViewSellerInformation from "./SellerInformation/SellerInformation";

import { Comments } from "components/Comment/Comment.stories";
import isEmpty from "lodash/isEmpty";

import { TopicType } from "core/models/History";
import GoodsServicesDetailsDrawer from "pages/PurchasePage/ContractPage/ContractDetail/Components/GenerationInfoTab/Components/GoodsServicesDetailsDrawer/GoodsServicesDetailsDrawer";
import GoodsServicesInfo from "pages/PurchasePage/ContractPage/ContractDetail/Components/GenerationInfoTab/Components/GoodsServicesInfo/GoodsServicesInfo";
import ContractViewDeliveryInformation from "./DeliveryInformation/DeliveryInformation";
import "./GenerationInfoTab.scss";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ContractDetailModel } from "models/Contract";
import { useContext } from "react";
import GoodsServicesDetailsDrawerPrinciple from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleDetail/Components/GoodsServicesDetailsDrawerPrinciple";

interface ContractViewGenerationInfoTabProps {
  topicId?: string;
}

const ContractViewGenerationInfoTab = ({
  topicId,
}: ContractViewGenerationInfoTabProps) => {
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  return (
    <>
      <div className="contract_view_info_tab">
        <ContractViewBase />
        <ContractViewBasicInformation />
        <ContractViewBuyerInformation />
        <ContractViewSellerInformation />
        <GoodsServicesInfo />
        {model?.isPrinciple ? (
          <GoodsServicesDetailsDrawerPrinciple />
        ) : (
          <GoodsServicesDetailsDrawer />
        )}
        <ContractViewDeliveryInformation />
        <ContractDetailAttachedFile />
        {!isEmpty(topicId) && (
          <div className="contract_view_info_tab__comment">
            <Comments
              topicType={
                model?.isPrinciple
                  ? TopicType.ContractPrinciple
                  : TopicType.Contract
              }
              topicId={topicId}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ContractViewGenerationInfoTab;
