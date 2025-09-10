import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { combineNameAndCode } from "pages/PurchasePage/constants";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useTranslation } from "react-i18next";
import styles from "../../ReceivedInformationDetail.module.scss";
import { TextWrapper } from "components";

const ReceiverInformationView = () => {
  const { model } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const fieldItem = [
    {
      label: "RG.txt_receiver_name",
      value: (
        <TextWrapper>{model?.contractInfo?.legalEntity?.name}</TextWrapper>
      ),
    },
    {
      label: "RG.txt_receiver_tax_id",
      value: (
        <TextWrapper>{model?.contractInfo?.legalEntity?.taxCode}</TextWrapper>
      ),
    },
    {
      label: "RG.txt_receiver_address",
      value: (
        <TextWrapper>{model?.contractInfo?.legalEntity?.address}</TextWrapper>
      ),
    },
    {
      label: "RG.txt_receiver_unit",
      value: <TextWrapper>{model?.contractInfo?.receiverUnitName}</TextWrapper>,
    },
    {
      label: "RG.txt_receiver_branch",
      value: (
        <TextWrapper>
          {combineNameAndCode(
            model?.contractInfo?.receiverOrganizationDetail?.businessBranch
              ?.code,
            model?.contractInfo?.receiverOrganizationDetail?.businessBranch
              ?.name
          )}
        </TextWrapper>
      ),
    },
    {
      label: "RG.txt_receiver_bank_unit",
      value: (
        <TextWrapper>
          {combineNameAndCode(
            model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.code,
            model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.name
          )}
        </TextWrapper>
      ),
    },
    {
      label: "RG.txt_receiver_full_name",
      value: (
        <TextWrapper>
          {combineNameAndCode(
            model?.contractInfo?.receiverEmail,
            model?.contractInfo?.receiverName
          )}
        </TextWrapper>
      ),
    },
    {
      label: "RG.txt_sender_phone",
      value: model?.receiptPersonPhone,
    },
    {
      label: "RG.txt_receiver_position",
      value: <TextWrapper>{model?.receiptPersonPosition}</TextWrapper>,
    },
    {
      label: "RG.txt_actual_receipt_date",
      value: formatDateTimeToVietnamTimezone(
        model?.receiptDate,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
    {
      label: "RG.txt_exchange_rate",
      value: formatNumber(model?.exchangeRate),
    },
  ];

  return (
    <div className={styles["receiver-container"]}>
      <span className={styles["receiver-title"]}>
        {translate("RG.txt_receiver")}
      </span>
      <div className={styles["receiver-main"]}>
        {fieldItem.map((field, index) => (
          <div className={styles["receiver-content"]} key={index}>
            <span className={styles["receiver-content__title"]}>
              {translate(field.label)}
            </span>
            <p className={styles["receiver-content__value"]}>{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverInformationView;
