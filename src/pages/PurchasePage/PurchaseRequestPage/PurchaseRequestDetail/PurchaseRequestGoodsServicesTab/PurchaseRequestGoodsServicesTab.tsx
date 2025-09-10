import Currency from "./Components/Currency/Currency";
import PurchaseInfo from "./Components/PurchaseInfo/PurchaseInfo";
import RecipientInfo from "./Components/RecipientInfo/RecipientInfo";
import "./PurchaseRequestGoodsServicesTab.scss";

const PurchaseRequestGoodsServicesTab = () => {
  return (
    <div className="purchase_request_goods_services_tab">
      <Currency />
      <RecipientInfo />
      <PurchaseInfo />
    </div>
  );
};

export default PurchaseRequestGoodsServicesTab;
