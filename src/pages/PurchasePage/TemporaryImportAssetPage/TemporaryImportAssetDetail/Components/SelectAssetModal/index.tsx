import { Dispatch, SetStateAction } from "react";
import { isEmpty } from "lodash";
import { t } from "i18next";
import { Modal } from "react-components-design-system";

import { MODAL_WIDTH_1100 } from "core/config/consts";
import Table from "./SelectAssetTable";
import ActionFilter from "./SelectAssetActionFilter";
import {
  AssetTableContext,
  ModalType,
  useAssetTableHook,
} from "./SelectAssetHook";

import "./SelectAssetStyled.scss";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";

interface SelectAssetModalProps {
  visible: boolean;
  onCloseModal: () => void;
  callback: (list: SelectAsset[]) => void;
  idIgnores: string[];
  setModal: Dispatch<SetStateAction<ModalType>>;
  contractId: string;
}

function SelectAssetModal({
  visible,
  onCloseModal,
  idIgnores,
  setModal,
  callback,
  contractId,
}: SelectAssetModalProps) {
  const { handleApply, loading, ...valueContext } = useAssetTableHook({
    callback,
    idIgnores,
    setModal,
    contractId,
  });

  return (
    <AssetTableContext.Provider value={{ ...valueContext }}>
      <Modal
        open={visible}
        titleButtonApply={t("CM.txt_select")}
        titleButtonCancel={t("CM.txt_status_close")}
        isShowIconBack={false}
        isShowButtonApply={true}
        isShowButtonCancel={true}
        size={MODAL_WIDTH_1100}
        height={688}
        title={t("TIA.txt_select_asset")}
        handleCancel={onCloseModal}
        handleSave={handleApply}
        disableButtonApply={isEmpty(valueContext.selectedRowKeys)}
        closeIcon
        loading={loading}
      >
        <ActionFilter contractId={contractId} />
        <Table />
      </Modal>
    </AssetTableContext.Provider>
  );
}

export default SelectAssetModal;
