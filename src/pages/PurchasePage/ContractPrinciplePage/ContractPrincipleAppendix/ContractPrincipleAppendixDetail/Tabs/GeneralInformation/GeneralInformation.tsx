import { Tooltip } from "antd";
import { UploadCloudIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import Attachments from "components/Attachments/Attachments";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WarningCircleIcon } from "../../../WarningCircle.Icon";
import { useContractPrincipleAppendixDetailContext } from "../../context";
import { BuyerInformation } from "./Components/BuyerInformation";
import { ContractInformation } from "./Components/ContractInformation";
import { Information } from "./Components/Information";
import { SellerInformation } from "./Components/SellerInformation";
import styles from "./GeneralInformation.module.scss";
import { isNil } from "lodash";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";

enum CollapseKey {
  AnnexInformation = "AnnexInformation",
  ContractInformation = "ContractInformation",
  Buyer = "Buyer",
  Seller = "Seller",
  Attachment = "Attachment",
}

export const GeneralInformation = () => {
  const [translate] = useTranslation();

  const { model, handleChangeListField } =
    useContractPrincipleAppendixDetailContext();

  const makeCollapseTitle = useCallback(
    (type: CollapseKey, haveWarning?: boolean) => {
      let key = "";
      switch (type) {
        case CollapseKey.AnnexInformation:
          key = "CPA.txt_general_information";
          break;
        case CollapseKey.ContractInformation:
          key = "CPA.txt_contract_principle_information";
          break;
        case CollapseKey.Buyer:
          key = "CPA.txt_buyer_information";
          break;
        case CollapseKey.Seller:
          key = "CPA.txt_seller_information";
          break;
        case CollapseKey.Attachment:
          key = "CM.txt_attachment_files";
          break;
        default:
          key = null;
          break;
      }

      return (
        <div className={styles["collapse-title"]}>
          {translate(key)}
          {haveWarning ? (
            <Tooltip title={translate("CPA.txt_adjusted")} placement="topLeft">
              <div className={styles["size-24"]}>
                <WarningCircleIcon />
              </div>
            </Tooltip>
          ) : null}
        </div>
      );
    },
    [translate]
  );

  const items = useMemo(() => {
    const list = [
      {
        key: CollapseKey.AnnexInformation,
        label: makeCollapseTitle(CollapseKey.AnnexInformation),
        children: <Information />,
      },
      {
        key: CollapseKey.ContractInformation,
        label: makeCollapseTitle(
          CollapseKey.ContractInformation,
          model?.isAdjustedContractInfo
        ),
        children: <ContractInformation />,
      },
      {
        key: CollapseKey.Buyer,
        label: makeCollapseTitle(CollapseKey.Buyer, model?.isAdjustedLegalInfo),
        children: <BuyerInformation />,
      },
      {
        key: CollapseKey.Seller,
        label: makeCollapseTitle(
          CollapseKey.Seller,
          model?.isAdjustedSupplierInfo
        ),
        children: <SellerInformation />,
      },
      {
        key: CollapseKey.Attachment,
        label: makeCollapseTitle(
          CollapseKey.Attachment,
          model?.isAdjustedAttachment
        ),
        children: (
          <Attachments
            parentClassName={styles["bg-neutral-1"]}
            uploadIcon={UploadCloudIcon}
            attachments={model?.attachments}
            handleUpdate={handleChangeListField({
              fieldName: "attachments",
            })}
          />
        ),
      },
    ];

    return list;
  }, [
    handleChangeListField,
    makeCollapseTitle,
    model?.attachments,
    model?.isAdjustedAttachment,
    model?.isAdjustedContractInfo,
    model?.isAdjustedLegalInfo,
    model?.isAdjustedSupplierInfo,
  ]);

  return (
    <div className={styles["content-container"]}>
      <AdvancedCollapseView showAll items={items} />
      {isNil(model?.id) ? null : (
        <div className="px-3 pb-3">
          <Comments
            isNewLayoutVersion
            topicId={model?.id}
            topicType={TopicType.ContractPrincipleAppendix}
          />
        </div>
      )}
    </div>
  );
};
