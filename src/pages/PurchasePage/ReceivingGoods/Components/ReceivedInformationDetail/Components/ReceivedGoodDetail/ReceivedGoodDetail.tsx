import { Attachments } from "components/GeneralInformationView/GeneralInformationView";
import ContractInformationView from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/ContractInformation/ContractInformationView";
import ReceiverInformationView from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/ReceiverInformation/ReceiverInformationView";
import SellerInformationView from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/SellerInformation/SellerInformationView";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import styles from "./ReceivedGoodDetail.module.scss";

const ReceivedGoodDetail = () => {
  const { model } = useReceivingGoodsDetailContext();

  return (
    <div className={styles["received-information__container"]}>
      <div className={styles["received-sidebar"]}>
        <ContractInformationView />
        <Attachments
          data={model?.attachments}
          className={styles["text-base"]}
        />
      </div>
      <div className={styles["received-information__main"]}>
        <SellerInformationView />
        <ReceiverInformationView />
      </div>
    </div>
  );
};

export default ReceivedGoodDetail;
