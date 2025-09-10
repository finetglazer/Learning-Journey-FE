import { UploadFileType } from "pages/PurchasePage/ContractPage/ContractDetail/Components/ContractFileTab/Components/ModalUploadFile/helper";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettlementFile } from "./SettlementFile";
import { SettlementStatus } from "models/Settlement/Settlement";
import { Button, StandardTable } from "react-components-design-system";
import { Add } from "@carbon/icons-react";
import { ViewFilesColumns } from "./helper";
import ModalUploadFile from "../ModalUploadFile/ModalUploadFile";
import { isEmpty } from "lodash";
import { emptyCloudIcon } from "assets/icons";
import EmptyData from "./EmptyData";

const SettlementFileView = () => {
  const [translate] = useTranslation();

  const { model, handleDownloadFileAttached, handleUploadFileToContract } =
    useContext(SettlementHookContext);

  const [openModalUploadFile, setModalOpenUploadFile] = useState(false);

  const onPressSaveFromModal = (dataFromModal: UploadFileType) => {
    const newContractFile: SettlementFile = {
      attachments: dataFromModal?.listFile,
      note: dataFromModal?.note,
    };
    handleUploadFileToContract(newContractFile);
  };

  const isShowButtonAdd = model?.status === SettlementStatus.APPROVED;

  if (isEmpty(isShowButtonAdd) && isEmpty(model?.files)) {
    return (
      <div>
        <EmptyData
          icon={emptyCloudIcon}
          message={translate("settlement.empty_file_message")}
          titleButton={translate("settlement.btn_action_empty")}
          action={() => setModalOpenUploadFile(true)}
        />
        {openModalUploadFile && (
          <ModalUploadFile
            open={openModalUploadFile}
            handleCancel={() => {
              setModalOpenUploadFile(false);
            }}
            onPressSave={onPressSaveFromModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="pt_contract_file_wrapper">
      {isShowButtonAdd && (
        <Button
          icon={<Add />}
          iconPlace="left"
          type="secondary"
          className="mb-2"
          onClick={() => setModalOpenUploadFile(true)}
        >
          {translate("CT.contract_file.add_contract")}
        </Button>
      )}
      <StandardTable
        columns={ViewFilesColumns({
          translate,
          handleDownloadFileAttached: handleDownloadFileAttached,
        })}
        dataSource={model?.files ?? []}
        scroll={{ y: "calc(100vh - 360px)" }}
        rowClassName="payment-row"
      />
      {openModalUploadFile && (
        <ModalUploadFile
          open={openModalUploadFile}
          handleCancel={() => {
            setModalOpenUploadFile(false);
          }}
          onPressSave={onPressSaveFromModal}
        />
      )}
    </div>
  );
};

export default SettlementFileView;
