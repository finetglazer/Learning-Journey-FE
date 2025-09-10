/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import attached from "assets/icons/attached.svg";
import { AxiosError } from "axios";
import classNames from "classnames";
import { UploadFileCustom } from "components";
import { getIconFile } from "core/helpers/common";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import dayjs from "dayjs";
import { TFunction } from "i18next";
import { isEmpty } from "lodash";
import {
  ContractDetailFormModel,
  ContractFile,
  RequestAttachment,
} from "models/Contract";
import { FileModelExtend } from "models/OpinionCollector";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import {
  Button,
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
  UploadFile,
} from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

enum ColumnKey {
  ATTACHMENTS = "attachments",
  UPLOADED_DATE = "uploadedDate",
  IS_HISTORY = "isHistory",
  NOTE = "note",
}

type helperColumnsProps = {
  translate: TFunction<"translation", undefined>;
  model: ContractDetailFormModel;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  handleDownloadFileAttached: (file?: FileModelExtend) => void;
  handleUploadFileError: (error: AxiosError) => void;
  handleDeleteRowConfirm: (id: string) => void;
};

export const columns = ({
  translate,
  model,
  setLoading,
  handleChangeSingleField,
  handleDownloadFileAttached,
  handleUploadFileError,
  handleDeleteRowConfirm,
}: helperColumnsProps): ColumnProps<ContractFile>[] => [
  {
    title: () => (
      <div className="payment-font-14">
        <label className={classNames("component__title")}>
          {translate("PP.attach")}
          <span className="text-danger">&nbsp;*</span>
        </label>
      </div>
    ),
    key: ColumnKey.ATTACHMENTS,
    dataIndex: ColumnKey.ATTACHMENTS,
    ellipsis: true,
    width: 572,
    render: (_, record, index) => (
      <FormItem
        validateObject={utilService.getValidateObj(
          model,
          isEmpty(record?.attachments)
            ? `contractFiles[${index}].attachments`
            : null
        )}
      >
        <div className="mt-1 px-2 d-flex justify-content-between w-100">
          <div className="payment-custom_grid_9 w-100 payment-gap_x_2">
            {record?.attachments?.map(
              (item: RequestAttachment, index: number) => {
                return (
                  <UploadFile.FileLoadedContent
                    key={index}
                    file={{
                      ...item,
                      name: item.name,
                    }}
                    onClickFile={() => handleDownloadFileAttached(item)}
                    className={classNames(
                      "file-loaded-item w-100 position-relative payment-custom_grid_9-col_3"
                    )}
                    icon={
                      <img
                        src={getIconFile(item)}
                        alt="img"
                        width={24}
                        height={24}
                      />
                    }
                    removeFile={() =>
                      handleRemoveFile(
                        model,
                        handleChangeSingleField,
                        item.systemFileId,
                        record?.id
                      )
                    }
                  />
                );
              }
            )}
          </div>
          <Button className="btn payment-w-30">
            <UploadFileCustom
              uploadFile={budgetRepository.import}
              updateList={(listFile: FileModel[]) => {
                handleUpdateLoadFileDocument(
                  model,
                  handleChangeSingleField,
                  listFile,
                  record?.id
                );
              }}
              type={"link"}
              icon={<img src={attached} alt="" height={18} width={16} />}
              maximumSize={999999999999999}
              setListFileLoading={(res) => {
                setLoading(!isEmpty(res));
              }}
              onUploadError={handleUploadFileError}
            />
          </Button>
        </div>
      </FormItem>
    ),
  },
  {
    title: () => (
      <div className="payment-font-14">
        {translate("CT.contract_file.file_description")}
        <span className="text-danger">&nbsp;*</span>
      </div>
    ),
    key: ColumnKey.NOTE,
    dataIndex: ColumnKey.NOTE,
    ellipsis: true,
    width: 500,
    render: (text, record, index) => (
      <LayoutCell>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            isEmpty(text) ? `contractFiles[${index}].note` : null
          )}
        >
          <InputText
            value={record?.note}
            placeHolder={translate("PP.document_description")}
            onChange={(e) => {
              handleChangeItemTable(
                model,
                handleChangeSingleField,
                "note",
                e,
                record?.id
              );
            }}
            isSmall={true}
            maxLength={500}
            translate={translate}
          />
        </FormItem>
      </LayoutCell>
    ),
  },
  {
    title: "",
    key: "action",
    dataIndex: "action",
    width: 40,
    render: (_, record, index) => (
      <LayoutCell>
        <div className="payment-red cursor-pointer btn">
          <TrashCan
            size={20}
            onClick={() => handleDeleteRowConfirm(record.id)}
          />
        </div>
      </LayoutCell>
    ),
  },
];

export const handleChangeItemTable = (
  model: ContractDetailFormModel,
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void,
  fieldName: string,
  value: FieldValue,
  id: string
) => {
  const contractFiles = model?.contractFiles.map((item: ContractFile) => {
    if (id === item?.id) {
      return {
        ...item,
        [fieldName]: value,
      };
    }
    return item;
  });
  handleChangeSingleField({
    fieldName: "contractFiles",
  })(contractFiles);
};

export const handleRemoveFile = (
  model: ContractDetailFormModel,
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void,
  fileId: string | number,
  id: string
) => {
  const contractFiles = model?.contractFiles.map((item: ContractFile) => {
    if (item?.id === id) {
      return {
        ...item,
        attachments: item.attachments.filter(
          (p: RequestAttachment) => p?.systemFileId !== fileId
        ),
      };
    }
    return item;
  });
  handleChangeSingleField({
    fieldName: "contractFiles",
  })(contractFiles);
};

export const handleUpdateLoadFileDocument = (
  model: ContractDetailFormModel,
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void,
  listFile: FileModel[],
  id: string
) => {
  const proposalReferencesEdit = model?.contractFiles.map(
    (item: ContractFile) => {
      if (item?.id === id) {
        return {
          ...item,
          attachments: [...(item?.attachments || []), ...listFile],
        };
      }
      return item;
    }
  );
  handleChangeSingleField({
    fieldName: "contractFiles",
  })(proposalReferencesEdit);
};

// VIEW CONTRACT FILE

type ViewFilesColumnsProps = {
  translate: TFunction<"translation", undefined>;
  handleDownloadFileAttached: (file?: FileModelExtend) => void;
};

export const ViewFilesColumns = ({
  translate,
  handleDownloadFileAttached,
}: ViewFilesColumnsProps): ColumnProps<ContractFile>[] => [
  {
    title: translate("CT.contract_file.upload_time"),
    width: 180,
    key: ColumnKey.UPLOADED_DATE,
    dataIndex: ColumnKey.UPLOADED_DATE,
    render(value) {
      return (
        <LayoutCell>
          <OneLineText value={dayjs(value).format("DD/MM/YYYY HH:mm:ss")} />
        </LayoutCell>
      );
    },
  },
  {
    title: translate("CT.contract_file.file_description"),
    key: ColumnKey.NOTE,
    dataIndex: ColumnKey.NOTE,
    render(value) {
      return (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      );
    },
  },
  {
    title: translate("CT.contract_file.attachment"),
    key: ColumnKey.ATTACHMENTS,
    dataIndex: ColumnKey.ATTACHMENTS,
    render(value) {
      return (
        <LayoutCell className="row pt-2 g-2">
          {value.map((item: RequestAttachment, index: number) => {
            return (
              <UploadFile.FileLoadedContent
                className={"col-4"}
                key={index}
                file={item}
                onClickFile={() => handleDownloadFileAttached(item)}
                isViewMode
                icon={
                  <img
                    src={getIconFile(item)}
                    alt="img"
                    width={24}
                    height={24}
                  />
                }
              />
            );
          })}
        </LayoutCell>
      );
    },
  },
];
