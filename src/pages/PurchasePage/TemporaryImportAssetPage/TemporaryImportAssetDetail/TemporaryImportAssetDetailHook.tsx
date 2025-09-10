/* eslint-disable import/no-unresolved */
import { useDebounceFn } from "ahooks";
import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import ApprovalHistoryTab from "components/ApprovalHistoryTab/ApprovalHistoryTab";
import { TOPIC_TYPE } from "config/const";
import {
  APP_OVERVIEW,
  TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  HttpStatusCode,
  NETWORK_ERROR_MESSAGE,
} from "core/services/service-types";
import saveAs from "file-saver";
import { get, isEmpty, isEqual, size } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import {
  Breadcrumbs,
  ConfirmModalType,
  ModelSelect,
  TemporaryImportAssetModel,
  TemporaryImportAssetStatus,
  TemporaryImportAssetTypeModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";
import {
  createContext,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Checkbox } from "react-components-design-system";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { finalize, tap } from "rxjs";
import { temporaryImportAssetRepository } from "../TemporaryImportAssetRepository";
import {
  formatDataSelectAsset,
  ModalType,
} from "./Components/SelectAssetModal/SelectAssetHook";
import TemporaryImportAssetGenerationInfoTab from "./TemporaryImportAssetGenerationInfoTab/TemporaryImportAssetGenerationInfoTab";

export const DELETE_ICON_SIZE = 24;

export interface ModalTypes {
  type:
    | "CREATE"
    | "UPDATE"
    | "DETAIL"
    | "DELETE"
    | "IMPORT_FAIL"
    | "SUBMIT_FAIL"
    | "NONE";
  id?: string;
  errors?: string[];
}

export const DEFAULT_ERROR_MODAL_TYPE: ModalTypes = {
  type: "NONE",
  errors: [],
};

export const TemporaryImportAssetDetailHookContext =
  createContext<TemporaryImportAssetModel>({
    model: new TemporaryImportAssetTypeModel(),
    handleChangeSingleField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    handleChangeAllField: null,
    handleChangeMultipleSelectField: null,
    breadcrumbs: null,
    translate: null,
    dispatchModel: null,
    tabRepositories: null,
    loading: false,
    notifyToast: null,
    handleUploadAttachmentError: null,
    handleDownloadFileAttached: null,
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    handleCallback: undefined as unknown as (data: SelectAsset[]) => void,
    modalType: null,
    setModalType: () => undefined,
    handleDeleteRow: undefined,
    isOpenModelConfirmDeleteRow: false,
    setIsOpenModelConfirmDeleteRow: () => undefined,
    handleConfirmDeleteRow: undefined,
    isModalChooseContract: false,
    setIsModalChooseContract: null,
    errorsModal: DEFAULT_ERROR_MODAL_TYPE,
    handleSave: null,
    setErrorsModal: null,
    handleUpdate: null,
    handleDeleteMultipleRow: () => undefined,
    loadingButtonConfirm: false,
    loadingModal: false,
    handleApplyButtonInConfirmModal: null,
    modelSelected: null,
    setModelSelected: null,
    runAsset: null,
  });

export function useTemporaryImportAssetDetailHook() {
  const { id: idDetail } = useParams<{ id: string }>();

  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [isModalChooseContract, setIsModalChooseContract] = useState(false);

  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>({
    type: "NONE",
    id: null,
  });
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState<boolean>(false);
  const [rowIdDelete, setRowIdDelete] = useState<string>("");
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const history = useHistory();
  const [errorsModal, setErrorsModal] = useState<ModalTypes>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const rowSelection: TableRowSelection<SelectAsset> = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: "checkbox",
    renderCell: (value: boolean, record: SelectAsset) => {
      if (!record?.id) return null;
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.id)
                );
              }
            }}
          />
        </div>
      );
    },
  };

  const { model, dispatch: dispatchModel } =
    detailService.useModel<TemporaryImportAssetTypeModel>(
      TemporaryImportAssetTypeModel
    );

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CM.menu_temporary_import_asset"),
      path: TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
    },
    {
      name: "",
    },
  ];

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  useEffect(() => {
    if (isEmpty(idDetail)) {
      setBreadcrumbs((prevState) => {
        const newBreadcrumbs = [...prevState];
        newBreadcrumbs[size(prevState) - 1] = {
          name: translate("TIA.temporary_import_asset_create_title"),
        };
        return newBreadcrumbs;
      });
    } else {
      setBreadcrumbs((prevState) => {
        const newBreadcrumbs = [...prevState];
        newBreadcrumbs[size(prevState) - 1] = {
          name: `${translate("TIA.temporary_import_asset_title_View")} ${
            model?.code
          }`,
        };
        return newBreadcrumbs;
      });
    }
  }, [idDetail, model?.code, translate]);

  const disabledButtonOpinion = useMemo(() => {
    const nonApprovalStates: number[] = [
      TemporaryImportAssetStatus.CANCEL,
      TemporaryImportAssetStatus.REJECT,
      TemporaryImportAssetStatus.APPROVE,
    ];

    return nonApprovalStates.includes(model?.status);
  }, [model?.status]);

  const approvalHistoryTab = useMemo(
    () =>
      idDetail
        ? [
            {
              tabKey: "1",
              tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
              children: (
                <ApprovalHistoryTab
                  topicId={idDetail}
                  topicType={TOPIC_TYPE.TEMPORARY_IMPORT_ASSET}
                  disabledButtonOpinion={disabledButtonOpinion}
                  model={model}
                />
              ),
            },
          ]
        : [],
    [disabledButtonOpinion, idDetail, model, translate]
  );
  const tabRepositories: RepoStateDetail[] = [
    {
      tabKey: "0",
      tabTitle: (
        <TabName
          text={translate("PP.tab_general_information")}
          isShowIconError={model.errorTabs?.includes(0)}
        />
      ),
      children: <TemporaryImportAssetGenerationInfoTab />,
    },
    ...approvalHistoryTab,
  ];

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (
      isEqual(error?.response?.status, HttpStatusCode?.PAYLOAD_TOO_LARGE) ||
      isEqual(error?.message, NETWORK_ERROR_MESSAGE)
    ) {
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

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const handleCallback = (data: SelectAsset[]) => {
    handleChangeAllField({
      ...model,
      tempReceiptItems: [...(model?.tempReceiptItems || []), ...data],
    });
  };

  const handleConfirmDeleteRow = (id: string) => {
    setRowIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const filterList = model?.tempReceiptItems?.filter(
      (item: { id: string }) => item?.id !== rowIdDelete
    );
    const filterSelected = selectedRowKeys?.filter(
      (item) => item !== rowIdDelete
    );
    setIsOpenModelConfirmDeleteRow(false);
    setSelectedRowKeys(filterSelected);
    handleChangeSingleField({
      fieldName: "tempReceiptItems",
    })(filterList);
  };

  const handleDeleteMultipleRow = () => {
    const filterList = model?.tempReceiptItems?.filter(
      (item: { id: string }) => {
        return !selectedRowKeys?.includes(item.id);
      }
    );
    setSelectedRowKeys([]);
    handleChangeSingleField({
      fieldName: "tempReceiptItems",
    })(filterList);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleGoMaster = useCallback(() => {
    history.push(TEMPORARY_IMPORT_ASSET_MASTER_ROUTE);
  }, [history]);

  const handleValidateError = (
    error: AxiosError,
    newModel: TemporaryImportAssetTypeModel
  ) => {
    if (error.response && error.response.status === 400) {
      setErrorsModal({
        type: "SUBMIT_FAIL",
        errors: error?.response?.data?.tabErrors || [],
      });
      if (error.response?.data?.type === "Validate") {
        handleChangeAllField({
          ...newModel,
          errors: error.response?.data?.errors,
          errorTabs: error.response?.data?.tabs,
        });
      } else if (error.response?.data?.type === "Bad Request") {
        handleChangeAllField({
          ...newModel,
          errorTabs: error.response?.data?.tabs,
        });
        if (error.response?.data?.message) {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        }
      }
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleUpdateError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.BAD_REQUEST)) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  const handleSave = (isDraft: boolean, callbackFc: () => void) => {
    const requestBody = {
      isDraft: isDraft,
      contractId: model?.contractId,
      description: model?.description,
      tempReceiptItems: model?.tempReceiptItems,
      attachments: model?.attachments,
      isHardValidate: !!(typeof callbackFc === "function"),
    };
    setLoading(true);
    temporaryImportAssetRepository
      .createTemporaryImportAsset(requestBody)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (res) => {
          notifyToast();

          handleChangeAllField({
            ...model,
            id: res?.id,
            code: res?.code,
          });
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            handleGoMaster();
          }
        },
        error: (error: any) => {
          handleValidateError(error, model);
        },
      });
  };

  const handleUpdate = (isDraft: boolean, callbackFc: () => void) => {
    const requestBody = {
      id: model?.id,
      isDraft: isDraft,
      contractId: model?.contractId,
      description: model?.description,
      tempReceiptItems: model?.tempReceiptItems,
      attachments: model?.attachments,
      isHardValidate: !!(typeof callbackFc === "function"),
    };
    setLoading(true);
    temporaryImportAssetRepository
      .updateTemporaryImportAsset(requestBody)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          // nếu có callbackFc thì không out ra khỏi detail
          if (typeof callbackFc === "function") {
            callbackFc();
          } else {
            handleGoMaster();
          }
        },
        error: (error: any) => {
          handleValidateError(error, model);
        },
      });
  };

  useEffect(() => {
    if (idDetail) {
      handleGetDataTemporaryAsset(idDetail);
    }
  }, [idDetail]);

  const handleGetDataTemporaryAsset = (id: string) => {
    setLoading(true);
    temporaryImportAssetRepository
      .getTemporaryAssetDetail(id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response?.data) {
            handleChangeAllField({
              ...model,
              ...response.data,
              contractCurrent: {
                ...response?.data?.contract,
                supplierTaxCode: response.data?.supplier?.taxCode,
                supplierName: response.data?.supplier?.name,
              },
              description: response?.data?.description,
              tempReceiptItems: formatDataSelectAsset(
                response?.data?.tempReceiptItems
              ),
            });
          }
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error?.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  useEffect(() => {
    if (model?.canEdit === false && model?.id) {
      history.push(`${TEMPORARY_IMPORT_ASSET_VIEW_ROUTE}/${idDetail}`);
    }
  }, [model?.id, model?.canEdit]);

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const deleteTemporaryImport = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .deleteTemporaryImportAsset(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const cancelTemporaryImport = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .cancelTemporaryImportAsset(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const getAssetClassifyInfo = (
    goodId: string,
    value: number,
    columnId: string,
    fieldNameError: string
  ) => {
    settlementRepository
      .getAssetClassifyInfo({
        goodsId: goodId,
        originalCost: value,
      })
      .pipe(
        finalize(() => {
          //
        })
      )
      .subscribe({
        next: (data) => {
          const res = data?.data;
          const tempReceiptItemsEdit = [...(model?.tempReceiptItems || [])];
          const index = tempReceiptItemsEdit.findIndex(
            (item) => item?.id === columnId
          );

          if (index !== -1) {
            tempReceiptItemsEdit[index] = {
              ...tempReceiptItemsEdit[index],
              amount: !value ? null : value,
              depreciationMonths:
                res.depreciationMonths ?? res.depreciationMonths,
              classify: res?.classify,
            };
          }

          handleChangeSingleField({
            fieldName: "tempReceiptItems",
            errorName: fieldNameError,
          })(tempReceiptItemsEdit);
        },
        error: (error: AxiosError) => {
          console.error("Error");
        },
      });
  };

  const { run: runAsset } = useDebounceFn(
    async (
      goodsId: string,
      originalCost: number,
      columnId: string,
      errorField: string
    ) => getAssetClassifyInfo(goodsId, originalCost, columnId, errorField),
    { wait: 300 }
  );

  //Return req
  const actionTemporaryImport = (
    id: string,
    reason: string,
    action: number
  ) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .actionTemporaryImportAsset(id, reason, action)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: TemporaryImportAssetTypeModel,
    reason: string,
    action: number
  ) => {
    const id = get(model, "id");
    if (!id) return; // Return early if no ID

    const actionMap = {
      [ConfirmModalType.CANCEL]: () => cancelTemporaryImport(id, reason),
      [ConfirmModalType.DELETE]: () => deleteTemporaryImport(id, reason),
    };

    get(actionMap, modelSelected?.type, () =>
      actionTemporaryImport(id, reason, action)
    )();
  };

  const valuesContext: TemporaryImportAssetModel = {
    model,
    idDetail,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeMultipleSelectField,
    dispatchModel,
    translate,
    breadcrumbs,
    tabRepositories,
    loading,
    notifyToast,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    modalType,
    rowSelection,
    selectedRowKeys,
    isOpenModelConfirmDeleteRow,
    setModalType,
    handleCallback,
    setSelectedRowKeys,
    handleDeleteRow,
    setIsOpenModelConfirmDeleteRow,
    handleApplyButtonInConfirmModal,
    handleConfirmDeleteRow,
    isModalChooseContract,
    setIsModalChooseContract,
    handleSave,
    errorsModal,
    setErrorsModal,
    handleUpdate,
    handleDeleteMultipleRow,
    loadingButtonConfirm,
    loadingModal,
    modelSelected,
    setModelSelected,
    runAsset,
    rowIdDelete,
  };

  return {
    ...valuesContext,
  };
}
