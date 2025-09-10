import React, { useContext, useMemo } from "react";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import classNames from "classnames";
import GenerationInfo from "./GenerationInfo/GenerationInfo";
import { useTranslation } from "react-i18next";
import ContactOrderInfo from "./ContactOrderInfo/ContactOrderInfo";
import AttachedFile from "./AttachedFile/AttachedFile";
import BuyerServiceUserInfo from "./BuyerServiceUserInfo/BuyerServiceUserInfo";
import SellerServiceProviderInfo from "./SellerServiceProviderInfo/SellerServiceProviderInfo";
import PaymentValueSpreadsheet from "./PaymentValueSpreadsheet/PaymentValueSpreadsheet";
import AssetFormationValue from "./AssetFormationValue/AssetFormationValue";
import { RelatedDocument } from "./RelatedDocument/RelatedDocument";
import { SettlementHookContext } from "../../SettlementDetail/SettlementDetailHook";
import { isEmpty } from "lodash";
import styles from "./SettlementInfo.module.scss";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";

enum InformationSectionKey {
  GENERATION_INFORMATION = "GENERATION_INFORMATION",
  CONTACT_ORDER_INFORMATION = "CONTACT_ORDER_INFORMATION",
  UPLOAD_FILE = "UPLOAD_FILE",
  BY_SERVICE_USER_INFO = "BY_SERVICE_USER_INFO",
  SELLER_SERVICE_PROVIDER_INFO = "SELLER_SERVICE_PROVIDER_INFO",
  PAYMENT_SPREED = "PAYMENT_SPREED",
  ASSET_FORMATION_VALUE = "ASSET_FORMATION_VALUE",
  RELATED_DOCUMENTS = "RELATED_DOCUMENTS",
}

const SettlementInfo = () => {
  const [translate] = useTranslation();
  const { model } = useContext(SettlementHookContext);
  const isHasContract = !isEmpty(model?.contactOrderInfo?.id);
  const items = useMemo<CollapseItem[]>(
    () => [
      {
        key: InformationSectionKey.GENERATION_INFORMATION,
        label: translate("settlement.generation_information"),
        children: (
          <div className={classNames("p-t--3xs")}>
            <GenerationInfo />
          </div>
        ),
      },
      {
        key: InformationSectionKey.CONTACT_ORDER_INFORMATION,
        label: translate("settlement.contact_order_information"),
        children: <ContactOrderInfo isHasContract={isHasContract} />,
      },
      isHasContract && {
        key: InformationSectionKey.BY_SERVICE_USER_INFO,
        label: translate("AC.txt_tab_buyer_service_info"),
        children: <BuyerServiceUserInfo />,
      },
      isHasContract && {
        key: InformationSectionKey.SELLER_SERVICE_PROVIDER_INFO,
        label: translate("AC.txt_tab_seller_service_info"),
        children: <SellerServiceProviderInfo />,
      },
      isHasContract && {
        key: InformationSectionKey.PAYMENT_SPREED,
        label: translate("settlement.payment_proposal_value_spreadsheet"),
        children: <PaymentValueSpreadsheet />,
      },
      isHasContract && {
        key: InformationSectionKey.ASSET_FORMATION_VALUE,
        label: translate("settlement.assetFormationValue"),
        children: <AssetFormationValue />,
      },
      isHasContract && {
        key: InformationSectionKey.RELATED_DOCUMENTS,
        label: translate("AC.txt_tab_related_documents_info"),
        children: <RelatedDocument />,
      },
      {
        key: InformationSectionKey.UPLOAD_FILE,
        label: translate("PL.purchasing_plan_attachment"),
        children: <AttachedFile />,
      },
    ],
    [translate, isHasContract]
  );
  return (
    <div>
      <CollapseView
        items={items?.filter(Boolean) as CollapseItem[]}
        className={`${styles["collapse--title_custom"]} mt-1`}
        isShowTopDivider={false}
        defaultActiveKey={[
          InformationSectionKey.GENERATION_INFORMATION,
          InformationSectionKey.CONTACT_ORDER_INFORMATION,
          InformationSectionKey.UPLOAD_FILE,
          InformationSectionKey.BY_SERVICE_USER_INFO,
          InformationSectionKey.SELLER_SERVICE_PROVIDER_INFO,
          InformationSectionKey.PAYMENT_SPREED,
          InformationSectionKey.ASSET_FORMATION_VALUE,
          InformationSectionKey.RELATED_DOCUMENTS,
        ]}
      />

      {isHasContract && (
        <div className="px-3 pb-3">
          <Comments
            topicType={TOPIC_TYPE.CONTRACT_SETTLEMENT}
            topicId={model?.idEdit}
          />
        </div>
      )}
    </div>
  );
};

export default SettlementInfo;
