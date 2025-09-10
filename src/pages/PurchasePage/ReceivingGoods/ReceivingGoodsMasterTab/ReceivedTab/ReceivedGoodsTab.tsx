import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import ReceivedGoodsTabAction from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/ReceivedTab/ReceivedGoodsTabAction";
import ReceivedGoodsTabTable from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/ReceivedTab/ReceivedGoodsTabTable";

const ReceivedGoodsTab = () => {
  return (
    <>
      <LayoutMaster>
        <LayoutMasterActions>
          <ReceivedGoodsTabAction />
        </LayoutMasterActions>
        <LayoutMasterContent>
          <ReceivedGoodsTabTable />
        </LayoutMasterContent>
      </LayoutMaster>
    </>
  );
};

export default ReceivedGoodsTab;
