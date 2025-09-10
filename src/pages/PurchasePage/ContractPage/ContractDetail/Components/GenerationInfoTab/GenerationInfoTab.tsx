import { useContext } from "react";
import AddGoodsServicesModal from "./Components/AddGoodsServicesModal/AddGoodsServicesModal";
import ContractDetailAttachedFile from "./Components/AttachedFile/AttachedFile";
import ContractDetailBasicInformation from "./Components/BasicInformation/BasicInformation";
import ContractDetailBuyerInformation from "./Components/BuyerInformation/BuyerInformation";
import ContractDetailBase from "./Components/ContractDetailBase/ContractDetailBase";
import ContractDetailDeliveryInformation from "./Components/DeliveryInformation/DeliveryInformation";
import GoodsServicesDetailsDrawer from "./Components/GoodsServicesDetailsDrawer/GoodsServicesDetailsDrawer";
import GoodsServicesInfo from "./Components/GoodsServicesInfo/GoodsServicesInfo";
import ContractDetailSellerInformation from "./Components/SellerInformation/SellerInformation";

import "./GenerationInfoTab.scss";
import { ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import GoodsServicesDetailsDrawerPrinciple from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleDetail/Components/GoodsServicesDetailsDrawerPrinciple";

const ContractGenerationInfoTab = () => {
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);
  return (
    <div className="create_contract_info_tab">
      <ContractDetailBase />
      <ContractDetailBasicInformation />
      <ContractDetailBuyerInformation />
      <ContractDetailSellerInformation />
      <GoodsServicesInfo isDetailPage />
      <AddGoodsServicesModal />
      {model?.isPrinciple ? (
        <GoodsServicesDetailsDrawerPrinciple />
      ) : (
        <GoodsServicesDetailsDrawer
          isDetailPage
          isWithoutAssessment={model?.isWithoutAssessment}
        />
      )}
      <ContractDetailDeliveryInformation />
      <ContractDetailAttachedFile />
    </div>
  );
};

export default ContractGenerationInfoTab;
