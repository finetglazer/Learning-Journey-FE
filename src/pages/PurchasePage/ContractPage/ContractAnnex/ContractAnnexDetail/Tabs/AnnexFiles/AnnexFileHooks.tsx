import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  delay,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  MB,
} from "components/UploadFileCustom/helper";
import { numberConstants } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { listService } from "core/services/page-services/list-service";
import {
  GeneralAction,
  GeneralActionEnum,
  HttpStatusCode,
  KeyType,
} from "core/services/service-types";
import saveAs from "file-saver";
import {
  gt,
  isEmpty,
  isEqual,
  isUndefined,
  map,
  multiply,
  uniqueId,
} from "lodash";
import { Attachment } from "models/Attachment";
import { DocumentGroup } from "models/DocumentGroup";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { acceptanceRepository } from "pages/PurchasePage/Acceptance/AcceptanceRepository";
import {
  ChangeEvent,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AnnexFileModel } from "./types";

export interface AnnexFileContextType {
  model: AnnexFileModel;
  dispatch: Dispatch<GeneralAction<AnnexFileModel>>;
  rowSelection?: TableRowSelection<DocumentGroup>;
  selectedRowKeys?: KeyType[];
  setSelectedRowKeys?: Dispatch<SetStateAction<KeyType[]>>;
  addNewRow?: () => void;
  handleChangeDescription?: (item: DocumentGroup, description: string) => void;
  handleDeleteRow?: (id?: string) => void;
  handleDownloadFileAttached?: (file?: DocumentGroup) => void;
  handleFileChange?: (
    event: ChangeEvent<HTMLInputElement>,
    record: DocumentGroup
  ) => void;

  handleUploadAttachmentError?: (error: any) => void;
  setModalType?: Dispatch<SetStateAction<ModelType>>;
  handleAddMore?: (
    data: DocumentGroup,
    perDispatch: Dispatch<GeneralAction<DocumentGroup>>
  ) => void;
}

export const AnnexFileContext = createContext<AnnexFileContextType>({
  model: null,
  dispatch: null,
});

type ModelType = "DELETE" | "LOADING" | "NONE" | "ADD";

export const useAnnexFileHooks = (
  data?: AnnexFileModel,
  onChange?: (data: DocumentGroup[]) => void
) => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModelType>("NONE");

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { model, dispatch } = detailService.useModel<AnnexFileModel>(
    AnnexFileModel,
    {
      ...new AnnexFileModel(),
      ...data,
    }
  );

  useEffect(() => {
    dispatch({
      type: GeneralActionEnum.SET,
      payload: {
        ...new AnnexFileModel(),
        ...data,
      },
    });
  }, [data, dispatch]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<DocumentGroup>("checkbox", [], true);

  const notifyToChange = useCallback(
    (data: DocumentGroup[]) => onChange?.(data),
    [onChange]
  );

  const addNewRow = () => {
    // If status is 2, do not allow to add new row, we handle show modal add file in another place
    if (isEqual(data?.status, numberConstants.TWO)) {
      setModalType("ADD");
      return;
    }

    const files = [...(model?.documentGroups || [])];
    files.push({
      attachments: [],
      id: new Date().toISOString(),
    });
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        documentGroups: files,
      },
    });

    notifyToChange(files);
  };

  const handleChangeDescription = useCallback(
    (item: DocumentGroup, description: string) => {
      const updatedFile = { ...item, description };

      const files = model?.documentGroups?.map((file) => {
        if (isEqual(file.id, item.id)) {
          return updatedFile;
        }

        return file;
      });

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          documentGroups: files || [],
        },
      });

      notifyToChange(files || []);
    },
    [dispatch, model, notifyToChange]
  );

  const deleteSingleRow = useCallback(
    (ids: string[]) => {
      const files = model?.documentGroups?.filter(
        (file) => !ids.includes(file.id)
      );

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          documentGroups: files,
        },
      });

      notifyToChange(files);
      setSelectedRowKeys([]);
    },
    [dispatch, model, notifyToChange, setSelectedRowKeys]
  );

  const deleteMultipleRow = useCallback(() => {
    deleteSingleRow(selectedRowKeys as string[]);
    setModalType("NONE");
    notifyToast();
  }, [deleteSingleRow, notifyToast, selectedRowKeys]);

  const handleDeleteRow = useCallback(
    (id?: string) => {
      if (isUndefined(id)) {
        setModalType("DELETE");
      } else {
        deleteSingleRow([id]);
      }
    },
    [deleteSingleRow]
  );

  const handleDownloadFileAttached = (file?: Attachment) => {
    const TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: TYPE,
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const validationFileSize = useCallback((size: number) => {
    const BYTE = 1024;
    const MAX_SIZE = 25 * multiply(BYTE, BYTE); // 25MB

    if (gt(size, MAX_SIZE)) {
      return false;
    }

    return true;
  }, []);

  const updateModel = useCallback(
    (record: DocumentGroup) => {
      const documentGroups = map(model?.documentGroups, (item) =>
        isEqual(item.id, record.id) ? record : item
      );
      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          documentGroups,
        },
      });

      notifyToChange(documentGroups);
    },
    [dispatch, model, notifyToChange]
  );

  const handleShowToast = useCallback(
    (files: File[]) => {
      const { totalSize, hasLargeFile } = Array.from(files).reduce(
        (acc, file) => {
          acc.totalSize += file.size;
          if (file.size > MAX_FILE_SIZE * MB) {
            acc.hasLargeFile = true;
          }
          return acc;
        },
        { totalSize: 0, hasLargeFile: false }
      );

      if (hasLargeFile || totalSize > MAX_TOTAL_SIZE * MB) {
        if (hasLargeFile) {
          notifyToast({
            message: translate("CM.input_file_size_validation", {
              maxSize: MAX_FILE_SIZE,
            }),
            type: "error",
          });
        }

        if (totalSize > MAX_TOTAL_SIZE * MB && files?.length > 1) {
          delay(200).then(() => {
            notifyToast({
              message: translate("CM.total_file_size_validation", {
                maxSize: MAX_TOTAL_SIZE,
              }),

              type: "error",
            });
          });
        }
        return;
      }
    },
    [notifyToast, translate]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, record: DocumentGroup) => {
      const files = Array.from(event.target.files || []);
      if (isEmpty(files)) return;
      handleShowToast(files);
      // Check size of each file
      const validFiles = files.filter((file) => validationFileSize(file.size));

      if (isEqual(validFiles.length, numberConstants.ZERO)) return;

      const systemFileIds = validFiles.map(() => uniqueId());
      const newFiles = validFiles.map((file, index) => ({
        name: file.name,
        size: file.size,
        contentType: file.type,
        isUpload: true,
        systemFileId: systemFileIds[index],
      }));

      // add new files to record
      record.attachments = [...(record.attachments || []), ...newFiles];

      updateModel(record);

      // Import file from api
      budgetRepository.import(validFiles).subscribe({
        next: (response) => {
          if (!isEmpty(response)) {
            response.forEach((item, index) => {
              record.attachments = map(record.attachments, (attachment) =>
                isEqual(attachment.systemFileId, systemFileIds[index])
                  ? { ...item, isUpload: false }
                  : attachment
              );
            });
            updateModel(record);
          }
        },
        error: () => {
          record.attachments = record.attachments.filter(
            (item) =>
              !systemFileIds.map(String).includes(String(item.systemFileId))
          );
          updateModel(record);
        },
      });

      event.target.value = "";
    },
    [handleShowToast, updateModel, validationFileSize]
  );

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleAddMore = useCallback(
    (
      documentGroup: DocumentGroup,
      perDispatch: Dispatch<GeneralAction<DocumentGroup>>
    ) => {
      const CONTRACT_ANNEX_TOPIC_TYPE = 24;
      acceptanceRepository
        .documentGroupAddMore(
          model?.id,
          CONTRACT_ANNEX_TOPIC_TYPE,
          documentGroup
        )
        .subscribe({
          next: ({ data }) => {
            if (data) {
              notifyToast();
              setModalType("NONE");

              const documentGroups = [...(model?.documentGroups || []), data];
              dispatch({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...model,
                  documentGroups,
                },
              });

              notifyToChange(documentGroups);
            }
          },
          error: (error: AxiosError) => {
            const { data } = error.response;

            if (isEqual(data?.type, ErrorType.VALIDATE)) {
              perDispatch({
                type: GeneralActionEnum.SET_ERRORS,
                payload: data?.errors,
              });
            }
          },
        });
    },
    [dispatch, model, notifyToChange, notifyToast]
  );

  return {
    translate,
    model,
    rowSelection,
    selectedRowKeys,
    modalType,
    dispatch,
    setSelectedRowKeys,
    addNewRow,
    handleChangeDescription,
    handleDeleteRow,
    handleDownloadFileAttached,
    handleFileChange,
    deleteMultipleRow,
    setModalType,
    handleUploadAttachmentError,
    handleAddMore,
  };
};
