import React, { useContext, useMemo } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { SettlementHookContext } from "../../SettlementDetail/SettlementDetailHook";
import styles from "./SettlementInfoView.module.scss";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import GenerationInfoView from "./GenerationInfoView/GenerationInfoView";
import { CollapseItem } from "components/Collapse/CollapseView";
import { isEqual } from "lodash";
import { ContractRequestType, TYPE_PAGE } from "models/Settlement";
import PaymentValueSpreadsheet from "../SettlementInfo/PaymentValueSpreadsheet/PaymentValueSpreadsheet";
import { RelatedDocument } from "../SettlementInfo/RelatedDocument/RelatedDocument";
import AssetFormationValue from "../SettlementInfo/AssetFormationValue/AssetFormationValue";
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

const SettlementInfoView = () => {
  const [translate] = useTranslation();
  const { model } = useContext(SettlementHookContext);
  const itemsCollapse = useMemo<CollapseItem[]>(
    () => [
      {
        key: InformationSectionKey.GENERATION_INFORMATION,
        label: isEqual(
          model?.contactOrderInfo?.contractRequestType,
          ContractRequestType.Contract
        )
          ? translate("settlement.settlement_contact")
          : translate("settlement.settlement_order"),
        children: (
          <div className={classNames("p-t--3xs")}>
            <GenerationInfoView />
          </div>
        ),
      },
      {
        key: InformationSectionKey.PAYMENT_SPREED,
        label: translate("settlement.payment_proposal_value_spreadsheet"),
        children: (
          <PaymentValueSpreadsheet isView={true} typePage={TYPE_PAGE.VIEW} />
        ),
      },
      {
        key: InformationSectionKey.ASSET_FORMATION_VALUE,
        label: translate("settlement.assetFormationValue"),
        children: <AssetFormationValue isView={true} />,
      },
      {
        key: InformationSectionKey.RELATED_DOCUMENTS,
        label: translate("AC.txt_tab_related_documents_info"),
        children: <RelatedDocument />,
      },
    ],
    [translate, model?.contactOrderInfo]
  );
  return (
    <div className={styles["collapse--title_custom"]}>
      <AdvancedCollapseView items={itemsCollapse} />

      <div className="px-3 pb-3">
        <Comments
          isNewLayoutVersion
          topicType={TOPIC_TYPE.CONTRACT_SETTLEMENT}
          topicId={model?.id}
        />
      </div>
    </div>
  );
};

export default SettlementInfoView;
