/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  LEGAL_ENTITY_ROUTE_DETAIL,
  LEGAL_ENTITY_ROUTE_MASTER,
} from "config/route-const";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  ConfigField,
  FieldValue,
  HttpStatusCode,
} from "core/services/service-types";
import { Dayjs } from "dayjs";
import { isEqual, omit } from "lodash";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import legalEntityRepository from "../LegalEntityRepository";
// eslint-disable-next-line import/no-unresolved
import saveAs from "file-saver";
import { contractManagementBreadcrumb } from "pages/Catalog/constants";
import { useHistory } from "react-router";
import {
  Authorizers,
  LegalEntityModel,
} from "../LegalEntityMaster/LegalEntityMasterHooks";
export enum ConfirmModalType {
  EDIT = "EDIT",
  DELETE = "DELETE",
  DETAIL = "DETAIL",
  CREATE = "CREATE",
  NONE = "NONE",
}

export interface ModalType {
  type: ConfirmModalType;
  id?: string;
}

const INITIAL_MODAL_TYPE: ModalType = {
  type: ConfirmModalType.NONE,
};
export interface LegalEntityDetail {
  model: LegalEntityModel;
  loading: boolean;
  isDetail: boolean;
  title?: string;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleSave?: (value?: { isDraft?: boolean }) => void;
  handleUploadAttachmentError?: (error: AxiosError) => void;
  handleDownloadFileAttached?: (file?: FileAttachments) => void;
  handleChangeAllField?: (value: LegalEntityModel) => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  handleResetList: () => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  isLoading?: boolean;
  disableDefault: boolean;
  onSave: () => void;
  handleBack: () => void;
  history?: ReturnType<typeof useHistory>;
}

export interface FileAttachments {
  systemFileId: string;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

export const LegalEntityDetailContext = createContext<LegalEntityDetail>({
  model: new LegalEntityModel(),
  loading: false,
  isDetail: false,
  handleResetList: null,
  handleChangeDateField: null,
  disableDefault: false,
  onSave: null,
  handleBack: null,
});

type props = {
  isDetail?: boolean;
};

export const useLegalEntityDetailHooks = ({ isDetail = false }: props) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const isEditable = useRef<boolean>(false);
  const history = useHistory();
  const { model, dispatch } = detailService.useModel<LegalEntityModel>(
    LegalEntityModel,
    {
      ...new LegalEntityModel(),
    }
  );

  const title = useMemo(
    () =>
      isDetail
        ? translate("LE.txt_view_detail_legal_entity")
        : model?.id
        ? translate("LE.txt_edit_legal_entity")
        : translate("LE.txt_create_legal_entity"),
    [isDetail, model?.id, translate]
  );

  const breadcrumb = useMemo(
    () => [
      ...contractManagementBreadcrumb,
      {
        name: title,
      },
    ],
    [title]
  );

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

  const [disableDefault, setDisableDefault] = useState(false);

  const checkIsDefault = useCallback((model: LegalEntityModel) => {
    legalEntityRepository.checkIsDefault().subscribe(
      (res: any) => {
        if (model?.id) {
          setDisableDefault(res?.data && !model?.isDefaultLegalEntity);
        } else {
          setDisableDefault(res?.data);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error) => {
        setDisableDefault(false);
      }
    );
  }, []);

  const getDetail = useCallback(
    (id: string) => {
      setLoading(true);
      legalEntityRepository.getDetail(id).subscribe({
        next: (response: LegalEntityModel) => {
          handleUpdateDataCreate({ ...response, isDetail });
          checkIsDefault(response);
        },
        error: () => {
          notifyToast({
            type: "error",
            message: translate("CM.message_system_error"),
          });
        },
        complete: () => setLoading(false),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );
  const handleUpdateDataCreate = (response: LegalEntityModel) => {
    const body = {
      ...response,
      ...response?.organization,
      id: response.id,
      positionId: response?.representative?.position?.name,
    };
    handleChangeAllField(body);
  };

  const onSave = () => {
    const newModel = {
      ...model,
      authorizers: model.authorizers?.map((item: Authorizers) => {
        return omit(item, ["id"]) as Authorizers;
      }),
    };
    const request = model.id
      ? legalEntityRepository.update(newModel)
      : legalEntityRepository.create(newModel);
    setLoading(true);
    request.pipe(finalize(() => setLoading(false))).subscribe({
      next: () => {
        notifyToast();
        handleBack();
      },
      error: (error: AxiosError) =>
        handleError<LegalEntityModel>({ model, error, handleChangeAllField }),
    });
  };

  const handleResetList = () => {
    // Implement the logic for resetting the list here
  };

  const copyToClipboard = () => {
    const textToCopy = model?.code || "";

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notifyToast({
            message: translate("CL.copied_to_clipboard_message"),
          });
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    }
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    notifyToast({
      message: isEqual(error.response?.status, HttpStatusCode.PAYLOAD_TOO_LARGE)
        ? translate("CM.message__max_file_size")
        : error.response?.data?.message,
      type: "error",
    });
  };

  const handleBack = React.useCallback(() => {
    history.push(LEGAL_ENTITY_ROUTE_MASTER);
  }, [history]);

  const handleDownloadFileAttached = (file?: FileAttachments) => {
    legalEntityRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  useEffect(() => {
    const id = history.location.pathname.split("/").pop();
    if (id && history.location.pathname !== LEGAL_ENTITY_ROUTE_DETAIL) {
      getDetail(id);
    } else {
      checkIsDefault(new LegalEntityModel());
    }
  }, []);

  return {
    model,
    loading,
    isDetail,
    translate,
    title,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeDateField,
    onSave,
    copyToClipboard,
    isEditable,
    breadcrumb,
    setModalType,
    modalType,
    handleBack,
    history,
    handleResetList,
    handleDownloadFileAttached,
    handleUploadAttachmentError,
    disableDefault,
  };
};
