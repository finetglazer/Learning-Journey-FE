import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { numberConstant } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import {
  GeneralAction,
  GeneralActionEnum,
  HttpStatusCode,
} from "core/services/service-types";
import saveAs from "file-saver";
import { gt, isEqual } from "lodash";
import { AcceptanceModel } from "models/Acceptance";
import { DocumentGroup } from "models/DocumentGroup";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { Dispatch, useCallback, useRef, useState } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";

interface ReferenceDocumentsProps {
  acceptanceFiles?: DocumentGroup[];
  dispatch?: Dispatch<GeneralAction<AcceptanceModel>>;
}

export const useReferenceDocumentsHooks = ({
  acceptanceFiles,
  dispatch,
}: ReferenceDocumentsProps) => {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const fileLoading = useRef<
    {
      files: FileModel[];
      documentId: string | undefined;
    }[]
  >([]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<DocumentGroup>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const handleDownloadFileAttached = (file?: any) => {
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

  const handleDeleteDocumentGroup = useCallback(
    (ids: string[]) => {
      const newDeliveryReceipt = acceptanceFiles.filter((document) => {
        return !ids.includes(document?.id);
      });
      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          acceptanceFiles: newDeliveryReceipt,
        },
      });
      setSelectedRowKeys(
        selectedRowKeys.filter((id) => !ids.includes(id.toString()))
      );
      setIsOpenModelConfirmDeleteRow(false);
    },
    [dispatch, acceptanceFiles, selectedRowKeys, setSelectedRowKeys]
  );

  const handleDeleteDeleteFile = useCallback(
    ({
      systemFileId,
      documentId,
    }: {
      systemFileId: string;
      documentId: string;
    }) => {
      const newDeliveryReceipt = acceptanceFiles.map((document) => {
        if (isEqual(document?.id, documentId)) {
          return {
            ...document,
            attachments: document?.attachments.filter(
              (file) => !isEqual(systemFileId, file?.systemFileId)
            ),
          };
        }

        return document;
      });

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          acceptanceFiles: newDeliveryReceipt,
        },
      });
    },
    [dispatch, acceptanceFiles]
  );

  const handleAddDocument = useCallback(
    ({ id, files }: { id: string; files: FileModel[] }) => {
      let newAcceptanceFiles = acceptanceFiles;

      const indexDocument = acceptanceFiles.findIndex((document) =>
        isEqual(document?.id, id)
      );

      if (gt(indexDocument, -numberConstant.ONE)) {
        newAcceptanceFiles = acceptanceFiles.map((document) => {
          if (isEqual(document?.id, id)) {
            return {
              ...document,
              attachments: [...(files || []), ...(document?.attachments || [])],
            };
          }

          return document;
        });
      } else {
        newAcceptanceFiles.unshift({
          ...new DocumentGroup(),
          attachments: files,
          id,
        });
      }

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          acceptanceFiles: newAcceptanceFiles,
        },
      });
    },
    [dispatch, acceptanceFiles]
  );

  return {
    translate,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleUploadAttachmentError,
    fileLoading,
    handleDownloadFileAttached,
    handleDeleteDocumentGroup,
    handleAddDocument,
    handleDeleteDeleteFile,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
  };
};
