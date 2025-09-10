import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useTranslation } from "react-i18next";
import styles from "../../ReceivedInformationDetail.module.scss";
import { ReactNode } from "react";
import { TextWrapper } from "components";

interface StaticFieldProps {
  title: string;
  value?: ReactNode;
}

const StaticField = ({ title, value }: StaticFieldProps) => (
  <div className={styles["receiver-content"]}>
    <span className={styles["receiver-content__title"]}>{title}</span>
    <p className={styles["receiver-content__value"]}>{value}</p>
  </div>
);

const SellerInformationView = () => {
  const { model } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const staticFields = [
    {
      title: translate("RG.txt_supplier"),
      value: (
        <TextWrapper>
          {model?.contractInfo?.contractSupplier?.supplier?.name}
        </TextWrapper>
      ),
    },
    {
      title: translate("RG.txt_receiver_tax_supplier"),
      value: model?.contractInfo?.contractSupplier?.supplier?.taxCode,
    },
    {
      title: translate("RG.txt_address"),
      value: model?.contractInfo?.contractSupplier?.address,
    },
    {
      title: translate("RG.txt_sender_full_name"),
      value: <TextWrapper>{model?.deliveryPersonName}</TextWrapper>,
    },
    {
      title: translate("RG.txt_sender_phone"),
      value: model?.deliveryPersonPhone,
    },
    {
      title: translate("RG.txt_sender_position"),
      value: <TextWrapper>{model?.deliveryPersonPosition}</TextWrapper>,
    },
  ];

  return (
    <div className={styles["receiver-container"]}>
      <span className={styles["receiver-title"]}>
        {translate("RG.txt_seller")}
      </span>
      <div className={styles["receiver-main"]}>
        {staticFields.map((props, index) => (
          <StaticField key={index} {...props} />
        ))}
      </div>
    </div>
  );
};

export default SellerInformationView;
