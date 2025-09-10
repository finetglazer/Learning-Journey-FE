import { LayoutMaster } from "components";
import "./WaitingReceivedGoods.scss";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import WaitingReceivedGoodsTabAction from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/WaitingDeliveryTab/WaitingReceivedGoodsTabAction";
import WaitingReceivedGoodsTabTable from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/WaitingDeliveryTab/WaitingReceivedGoodsTabTable";

const WaitingReceivedGoodsTab = () => {
  return (
    <>
      <LayoutMaster>
        <LayoutMasterActions>
          <WaitingReceivedGoodsTabAction />
        </LayoutMasterActions>
        <LayoutMasterContent>
          <WaitingReceivedGoodsTabTable />
        </LayoutMasterContent>
      </LayoutMaster>
    </>
  );
};

export default WaitingReceivedGoodsTab;
