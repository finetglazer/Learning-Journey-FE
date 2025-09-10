import CollapseView from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { TemporaryImportAssetViewModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { InformationSectionKey } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { useContext } from "react";
import { TemporaryImportAssetViewHookContext } from "../../TemporaryImportAssetViewHook";
import AssetInformationTable from "../AssetInformationTable/AssetInformationTable";
import AttachedFileView from "./components/AttachedFileView";
import BaseContract from "./components/BaseContract";
import GeneralInformation from "./components/GeneralInformation";
import "./TemporaryImportAssetTabView.scss";

const PurchasePlanGenerationInfoTabView = () => {
  const { model, translate } = useContext<TemporaryImportAssetViewModel>(
    TemporaryImportAssetViewHookContext
  );

  const collapseItems = [
    {
      key: InformationSectionKey.CONTRACT_BASIC,
      label: (
        <div className="fw-bold">
          {translate("TIA.temporary_import_asset_contract_basics_title")}
        </div>
      ),
      children: <BaseContract data={model?.baseContract} />,
    },
    {
      key: InformationSectionKey.GENERATION_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("TIA.temporary_import_asset_generation_info_title")}
        </div>
      ),
      children: <GeneralInformation data={model?.generalInformation} />,
    },
    {
      key: InformationSectionKey.TEMPORARY_IMPORT_ASSET_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("TIA.temporary_import_asset_info_title")}
        </div>
      ),
      children: <AssetInformationTable />,
    },
    {
      key: InformationSectionKey.ATTACHMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.purchasing_plan_attachment")}
        </div>
      ),
      children: <AttachedFileView files={model?.attachments} />,
    },
  ];

  return (
    <div className="temporary_import_asset_tab_view">
      <CollapseView
        items={collapseItems}
        defaultActiveKey={Object.values(InformationSectionKey)}
        expandIconPosition="end"
        className="temporary_import_asset_collapse_view"
      />

      <div className="comment_section">
        <Comments
          topicType={TOPIC_TYPE.TEMPORARY_IMPORT_ASSET}
          topicId={model?.id}
        />
      </div>
    </div>
  );
};

export default PurchasePlanGenerationInfoTabView;
