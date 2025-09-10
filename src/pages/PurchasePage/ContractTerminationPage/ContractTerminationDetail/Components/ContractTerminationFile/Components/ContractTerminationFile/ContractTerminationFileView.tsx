import { Add } from "@carbon/icons-react";
import { emptyCloudIcon } from "assets/icons";
import { isEmpty } from "lodash";
import {
  ContractTerminationContextModel,
  ContractTerminationStatus,
} from "models/ContractTermination";
import { UploadFileType } from "pages/PurchasePage/ContractPage/ContractDetail/Components/ContractFileTab/Components/ModalUploadFile/helper";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { useContext, useState } from "react";
import { Button, StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import ModalUploadFile from "../ModalUploadFile/ModalUploadFile";
import { ContractTerminationFile } from "./ContractTerminationFile";
import EmptyData from "./EmptyData";
import { ViewFilesColumns } from "./helper";

const ContractTerminationFileView = () => {
  const [translate] = useTranslation();
  const { model, handleDownloadFileAttached, handleUploadFileToContract } =
    useContext<ContractTerminationContextModel>(
      ContractTerminationDetailHookContext
    );

  const [openModalUploadFile, setModalOpenUploadFile] = useState(false);

  const onPressSaveFromModal = (dataFromModal: UploadFileType) => {
    const newContractFile: ContractTerminationFile = {
      attachments: dataFromModal?.listFile,
      note: dataFromModal?.note,
    };
    handleUploadFileToContract(newContractFile);
  };

  const isShowButtonAdd = model?.status === ContractTerminationStatus.APPROVED;

  if (isEmpty(isShowButtonAdd) && isEmpty(model?.files)) {
    return (
      <div>
        <EmptyData
          icon={emptyCloudIcon}
          message={translate(
            "contractTermination.contract_termination_empty_title"
          )}
          titleButton={translate(
            "contractTermination.contract_termination_add_document"
          )}
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
          {translate("contractTermination.contract_termination_add_document")}
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

export default ContractTerminationFileView;
