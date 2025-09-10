import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { isNil, isUndefined } from "lodash";
import {
  ContractTempReceiptModel,
  TemporaryImportAssetModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { InformationSectionKey } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { useContext, useMemo } from "react";
import AssetInformationTable from "../Components/AssetInformationTable/AssetInformationTable";
import ModalChooseContract from "../Components/ModalChooseContract/ModalChooseContract";
import { TemporaryImportAssetDetailHookContext } from "../TemporaryImportAssetDetailHook";
import AttachedFile from "./Components/AttachedFile/AttachedFile";
import ContractBasicInfo from "./Components/ContractBasicInfo/ContractBasicInfo";
import GenerationInformation from "./Components/GenerationInformation/GenerationInformation";
import "./TemporaryImportAssetGenerationInfoTab.scss";
import { assetRepository } from "../Components/SelectAssetModal/SelectAssetRepository";
import { finalize } from "rxjs";
import { formatDataSelectAsset } from "../Components/SelectAssetModal/SelectAssetHook";
import { AxiosError } from "axios";

const MAX_PAGE_SIZE = 10000;

const TemporaryImportAssetGenerationInfoTab = () => {
  const {
    translate,
    model,
    isModalChooseContract,
    idDetail,
    setIsModalChooseContract,
    handleChangeAllField,
    handleChangeSingleField,
  } = useContext<TemporaryImportAssetModel>(
    TemporaryImportAssetDetailHookContext
  );
  const hasBorder = false;

  const getAssetData = (contractId: string) => {
    assetRepository
      .getAll({
        contractId: contractId,
        pageSize: MAX_PAGE_SIZE,
      })
      .pipe(
        finalize(() => {
          //
        })
      )
      .subscribe({
        next: (data) => {
          handleChangeSingleField({
            fieldName: "tempReceiptItems",
          })(formatDataSelectAsset(data?.data?.items || []));
        },
        error: (error: AxiosError) => {
          console.log("Error");
        },
      });
  };

  const handleConfirm = (value: ContractTempReceiptModel) => {
    if (isNil(value)) {
      setIsModalChooseContract(false);
      return;
    }
    handleChangeAllField({
      ...model,
      contractId: value?.id,
      contractCurrent: value,
      errors: {
        ...model.errors,
        contractId: "",
      },
    });

    getAssetData(value?.id);
  };

  const items = useMemo(
    () => [
      {
        key: InformationSectionKey.CONTRACT_BASIC,
        label: translate("TIA.temporary_import_asset_contract_basics_title"),
        children: (
          <div>
            <div className="p-x--sm p-t--xs">
              <ContractBasicInfo />
            </div>
            <div className="border-bottom m-t--sm" />
          </div>
        ),
      },
      {
        key: InformationSectionKey.GENERATION_INFORMATION,
        label: translate("TIA.temporary_import_asset_generation_info_title"),
        children: (
          <div>
            <div className="p-x--sm p-t--xs">
              <GenerationInformation />
            </div>
            <div className="border-bottom m-t--sm" />
          </div>
        ),
      },
      {
        key: InformationSectionKey.TEMPORARY_IMPORT_ASSET_INFORMATION,
        label: translate("TIA.temporary_import_asset_info_title"),
        children: (
          <div>
            <div className="p-x--sm p-t--xs">
              <AssetInformationTable contractId={model?.contractId} />
            </div>
            <div className="border-bottom m-t--sm" />
          </div>
        ),
      },
      {
        key: InformationSectionKey.ATTACHMENT,
        label: translate("TIA.temporary_import_asset_attachments_title"),
        children: (
          <div>
            <div className="p-x--sm p-t--xs">
              <AttachedFile />
            </div>
          </div>
        ),
      },
    ],
    [translate, model]
  );

  const tabScrollClassname = useMemo(
    () =>
      idDetail
        ? "temporary-import-asset-generation-info-edit-scroll"
        : "temporary-import-asset-generation-info-create-scroll",
    [idDetail]
  );

  return (
    <div
      className={classNames(
        "temporary-import-asset-generation-info",
        "p-x--sm",
        tabScrollClassname
      )}
    >
      <CollapseView
        items={items}
        defaultActiveKey={[
          InformationSectionKey.CONTRACT_BASIC,
          InformationSectionKey.GENERATION_INFORMATION,
          InformationSectionKey.TEMPORARY_IMPORT_ASSET_INFORMATION,
          InformationSectionKey.ATTACHMENT,
        ]}
        className={classNames(
          hasBorder
            ? "collapse__container__overflow"
            : "collapse__container--not-border"
        )}
      />
      {isModalChooseContract && (
        <ModalChooseContract
          setModal={setIsModalChooseContract}
          callback={handleConfirm}
          contractId={model?.contractId}
          selectedKey={model?.contractCurrent}
        />
      )}

      {isUndefined(idDetail) ? null : (
        <Comments
          topicType={TOPIC_TYPE.TEMPORARY_IMPORT_ASSET}
          topicId={model?.id}
        />
      )}
    </div>
  );
};

export default TemporaryImportAssetGenerationInfoTab;
