import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import ApprovalHistoryTab from "components/ApprovalHistoryTab/ApprovalHistoryTab";
import TabName from "components/TabName/TabName";
import { listReceivedType, TOPIC_TYPE } from "config/const";
import { APP_OVERVIEW, CONTRACT_ROUTE_MASTER } from "config/route-const";
import { convertDatesRecursively } from "core/helpers/date-time";
import { HistoryType } from "core/models/History";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import type { History } from "history";
import { isEmpty, isEqual, isNil, size } from "lodash";
import { ReceivedType } from "models/Contract";
import {
  Breadcrumbs,
  ContractAdjustment,
  ContractAdjustmentContextModel,
  ContractAdjustmentDetailModel,
  ContractAdjustmentModel,
  ContractAdjustmentSubmitModel,
  ContractGoodsItem,
  ContractGoodsReceiverInfo,
  ContractRequestType,
  ReceiverInfoDetail,
  ReceiverInfoModel,
  TYPE_PAGE,
} from "models/ContractAdjustment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { finalize, lastValueFrom, tap } from "rxjs";
import { contractAdjustmentRepository } from "../ContractAdjustmentRepository";
import {
  ConfirmModalType,
  ContractAdjustmentStatus,
  ModelSelect,
} from "../constants";
import useRepositoriesTabHook from "./useRepositoriesTabHook/useRepositoriesTabHook";
import { v4 as uuidv4 } from "uuid";

export interface ModalType {
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

export type ParamType = {
  isDraft?: boolean;
  callbackFc?: () => void;
};

export const DEFAULT_MODAL_TYPE: ModalType = { type: "NONE", id: undefined };

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

export const ContractAdjustmentContext =
  createContext<ContractAdjustmentContextModel>({
    model: new ContractAdjustmentModel(),
    history: null,
    loading: false,
    handleChangeSingleField: null,
    handleChangeSelectField: null,
    handleChangeDateField: null,
    breadcrumbs: [],
    handleSave: null,
    loadingButtonConfirm: false,
    handleUploadFileError: null,
    handleDownloadFileAttached: null,
    handleChangeAllField: null,
    setLoading: null,
    notifyToast: null,
    handleApplyButtonInConfirmModal: null,
    errorsModal: null,
    setErrorsModal: null,
    setTabKey: null,
    tabKey: "0",
    handleUploadAttachmentError: null,
    handleApprove: null,
    handleDownloadFile: null,
    dispatch: null,
  });

export function useContractAdjustmentDetailHook(typePage?: TYPE_PAGE) {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<ContractAdjustmentModel>(ContractAdjustmentModel);
  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeListField,
  } = fieldService.useField(model, dispatchModel);
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [LoadingModal, setLoadingModal] = useState<boolean>(false);
  const history: History = useHistory();

  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabKeyParams = queryParams.get("tabKey");
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );
  const { id: idDetail } = useParams<{ id: string }>();
  const idFromQueryString = queryParams.get("id");

  const disabledButtonOpinion = useMemo(() => {
    const nonApprovalStates: number[] = [
      ContractAdjustmentStatus.APPROVED,
      ContractAdjustmentStatus.CANCELED,
    ];

    return nonApprovalStates.includes(model?.status);
  }, [model?.status]);

  useEffect(() => {
    if (!isEmpty(idDetail)) {
      initView(idDetail);
    } else {
      if (!isEmpty(idFromQueryString)) {
        initContractInfo(idFromQueryString);
      }
    }
  }, [idDetail, idFromQueryString]);

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CT.txt_contract"),
      path: CONTRACT_ROUTE_MASTER,
    },
    {
      name: "",
    },
  ];

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  const typeContract = model?.contract?.contractRequestType;

  const updateLastBreadcrumb = (name: string) => {
    setBreadcrumbs((prevState) => {
      const newBreadcrumbs = [...prevState];
      newBreadcrumbs[size(prevState) - 1] = { name };
      return newBreadcrumbs;
    });
  };

  useEffect(() => {
    let breadcrumbName = "";
    if (isEqual(typePage, TYPE_PAGE.CREATE)) {
      // For creation pages
      if (
        isNil(typeContract) ||
        isEqual(typeContract, ContractRequestType.Contract)
      ) {
        breadcrumbName = translate(
          "contractAdjustment.create_new_contract_adjustment"
        );
      } else {
        breadcrumbName = translate(
          "contractAdjustment.create_new_order_adjustment"
        );
      }
    } else {
      // For edit/view pages
      const prefix = isEqual(typeContract, ContractRequestType.Contract)
        ? translate("contractAdjustment.edit_contract_adjustment")
        : translate("contractAdjustment.edit_order_adjustment");

      breadcrumbName = `${prefix} ${model?.code}`;
    }

    updateLastBreadcrumb(breadcrumbName);
  }, [typeContract, typePage, model?.code]);

  const handleGoMaster = useCallback(() => {
    history.push(`${CONTRACT_ROUTE_MASTER}?pageIndex=1&pageSize=10&tabKey=3`);
  }, [history]);

  const handleSave = ({ isDraft = false, callbackFc }: ParamType) => {
    setLoading(true);
    const dataSubmit = getDataSubmit(isDraft, model);
    dataSubmit.isHardValidate = !!(typeof callbackFc === "function");
    if (isEmpty(model?.id)) {
      contractAdjustmentRepository
        .create(dataSubmit)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            notifyToast();
            handleChangeAllField({
              ...model,
              id: response?.data?.id,
              code: response?.data?.code,
              idDetail: response?.data?.id,
            });
            // nếu có callbackFc thì không out ra khỏi detail
            if (typeof callbackFc === "function") {
              callbackFc();
            } else {
              handleGoMaster();
            }
          },
          error: (error: AxiosError) => {
            handleErrorSubmit(error, model);
          },
        });
    } else {
      contractAdjustmentRepository
        .update(dataSubmit, model?.id)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: () => {
            notifyToast();
            if (typeof callbackFc === "function") {
              callbackFc();
            } else {
              handleGoMaster();
            }
          },
          error: (error: AxiosError) => {
            handleErrorSubmit(error, model);
          },
        });
    }
  };

  const getDataSubmit = (
    isDraft: boolean,
    modelPass: ContractAdjustmentModel
  ): ContractAdjustmentSubmitModel => {
    const isSingleReceiver = isEqual(
      modelPass?.received?.id,
      ReceivedType?.SingleReceiver
    );
    const receiverInfo: ReceiverInfoModel = isSingleReceiver
      ? {
          phone: modelPass?.receivedPhoneNumber,
          organizationId: modelPass?.receivedDepartment?.id,
          personId: modelPass?.receivedPerson?.id,
          person: modelPass?.receivedPerson?.email,
          receiverInfoDetails: modelPass?.receiverInfos?.map(
            (item: ReceiverInfoDetail) => {
              return {
                ...item,
                shippingDate:
                  !isEmpty(item?.shippingDate) &&
                  dayjs(item?.shippingDate).isValid()
                    ? dayjs(item?.shippingDate).utc().toISOString()
                    : undefined,
              };
            }
          ) as ReceiverInfoDetail[],
        }
      : undefined;

    const groupedByCategoryId = modelPass?.contractAppendixGoodsItems?.reduce(
      (acc, item) => {
        const catId = item?.goodCategory?.id || 0;
        if (!acc[catId]) {
          acc[catId] = [];
        }
        acc[catId].push(item);
        return acc;
      },
      {}
    );

    const flattenedList = Object.values(groupedByCategoryId).flat();

    const contractGoodsItems = flattenedList?.map((item) => {
      const newItem: ContractGoodsItem = {
        id: isEmpty(idDetail) ? undefined : item?.idSubmitDetail,
        goodsId: item?.goodsIdSubmit,
        purchaseItemId: isEmpty(item?.purchaseItemId)
          ? undefined
          : item?.purchaseItemId,
        contractGoodsItemId: isEmpty(item?.contractGoodsItemId)
          ? undefined
          : item?.contractGoodsItemId,
        branchId: item?.goodBranch?.id,
        description: item?.description,
        quantity: item?.quantity,
        unitPrice: item?.unitPrice,
        note: item?.note,
        taxId: item?.taxModel?.id,
        unitId: item?.goodUnit?.id,
        taxAmount: item?.taxAmount,
        receiverInfos: isSingleReceiver
          ? []
          : (item?.receiverInfos?.map((item: any) => {
              return {
                shippingDate:
                  !isEmpty(item?.shippingDate) &&
                  dayjs(item?.shippingDate)?.isValid()
                    ? dayjs(item?.shippingDate).utc().toISOString()
                    : undefined,
                quantity: item?.quantity,
                organizationId: item?.organizationId,
                person: item?.personEmail, //email người nhận
                personId: item?.personId,
                phone: item?.phone,
                address: item?.address,
                note: item?.note,
              };
            }) as ContractGoodsReceiverInfo[]),
      };
      return newItem;
    }) as ContractGoodsItem[];

    const dataSubmit: ContractAdjustmentSubmitModel = {
      isDraft: isDraft,
      contractId: modelPass?.contract?.contractId,
      desciption: modelPass?.desciption,
      receivedType: modelPass?.received?.id,
      receiverInfo: receiverInfo,
      contractGoodsItems: contractGoodsItems,
      id: modelPass?.idDetail,
      organizationId: modelPass?.managerOrganization?.id,
      manager: modelPass?.managerPerson?.email,
    };

    return dataSubmit;
  };

  const handleErrorSubmit = (
    error: AxiosError<any>,
    newModel: ContractAdjustmentModel
  ) => {
    if (error.response && error.response.status === 400) {
      if (error.response?.data?.type === "Validate") {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error?.response?.data?.tabErrors || [],
        });
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
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      }
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleUploadFileError = (error: AxiosError<any>) => {
    if (error.response?.status === 413) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    }
    if (error.response?.status === 400) {
      if (error?.response?.data?.message) {
        notifyToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      } else {
        setErrorsModal({
          type: "IMPORT_FAIL",
          errors: error?.response?.data?.sheetErrors || [],
        });
      }
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
      error: (err: any) => {
        console.error("Error downloading the file:", err);
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

  const initContractInfo = async (id: string) => {
    try {
      setLoading(true);
      const result = await lastValueFrom(
        contractAdjustmentRepository.getContractDetail(id)
      );
      setLoading(false);
      const data = result?.data;
      const dataNew = convertDatesRecursively(data);
      handleChangeAllField({
        ...model,
        contract: dataNew,
        listDataShoppingPlan: dataNew?.ticketRelated?.purchasePlanRelateds,
        managerOrganization: dataNew.organization,
        managerPerson: dataNew?.managerObj,
        managerOrganizationUnit: dataNew.orgBusinessUnitName,
        managerOrganizationBranch: dataNew.orgBusinessBranchName,
        totalAmount: dataNew?.totalAmount,
        receivedType: dataNew?.receivedType,
        received: listReceivedType?.find(
          (item: any) => item.id === dataNew?.receivedType
        ),
        receiverInfos: dataNew?.receiverInfo?.receiverInfoDetails,
        receivedDepartment: {
          id: dataNew?.receiverInfo?.organizationId,
          name: dataNew?.receiverInfo?.organizationName,
        },
        receivedPerson: {
          id: dataNew?.receiverInfo?.personId,
          name: dataNew?.receiverInfo?.personName,
          email: dataNew?.receiverInfo?.person,
        },
        receivedPhoneNumber: dataNew?.receiverInfo?.phone,
      });
    } catch (error: any) {
      setLoading(false);
      notifyToast({
        type: "error",
        message: error?.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    if (!model?.isView && model?.isEditGoods) {
      const total = model?.contractAppendixGoodsItems?.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue?.totalAmount;
        },
        0
      );
      handleChangeSingleField({
        fieldName: "totalAmount",
      })(model?.contract?.totalAmount + total);
    }
  }, [model?.contractAppendixGoodsItems]);

  const isViewWaitingApprove =
    queryParams.get("isWaitingForApproval") === "true";

  const initView = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const result = await lastValueFrom(
          contractAdjustmentRepository.getDetail({
            id,
            isViewWaitingApprove,
          })
        );
        const response: ContractAdjustmentDetailModel = result?.data;

        if (isEqual(typePage, TYPE_PAGE.VIEW)) {
          handleChangeDetailView(response, TYPE_PAGE.VIEW);
        } else {
          handleChangeDetailView(response, TYPE_PAGE.EDIT);
        }
      } catch (error: any) {
        setLoading(false);
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isViewWaitingApprove, typePage]
  );

  const { tabRepositories: baseRepositories } = useRepositoriesTabHook(
    isEqual(typePage, TYPE_PAGE.VIEW) ? [] : model?.errorTabs,
    isEqual(typePage, TYPE_PAGE.VIEW)
  );

  const approvalHistoryTab = useMemo(
    () =>
      idDetail
        ? [
            {
              tabKey: "1",
              tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
              children: (
                <ApprovalHistoryTab
                  isNewLayoutVersion
                  topicId={idDetail}
                  topicType={TOPIC_TYPE.CONTRACT_ADJUSTMENT}
                  disabledButtonOpinion={disabledButtonOpinion}
                  historyType={HistoryType.AdjustmentHistory}
                />
              ),
            },
          ]
        : [],
    [disabledButtonOpinion, idDetail, translate]
  );

  const tabRepositories = useMemo(
    () => [...baseRepositories, ...approvalHistoryTab],
    [approvalHistoryTab, baseRepositories]
  );

  const mapContractGoodsToGoodItems = (
    contractGoodsItems: any[],
    modelNew: ContractAdjustmentDetailModel
  ) => {
    if (!contractGoodsItems || !contractGoodsItems.length) return [];

    return contractGoodsItems.map((item) => ({
      ...item,
      // Map the category fields to match expected structure
      goodCategory: {
        id: item?.categoryId,
        name: item?.category?.name,
        code: item?.category?.code,
      },
      // Map the unit fields
      goodUnit: {
        id: item?.unitId,
        name: item?.unit?.name,
        code: item?.unit?.code,
      },
      // Map the branch fields
      goodBranch: {
        id: item?.branchId,
        name: item?.branch?.name,
        code: item?.branch?.code,
      },
      // Ensure these fields exist for calculations
      taxAmount: item?.taxAmount || 0,
      totalAmount: item?.totalAmount || 0,
      totalConvertedAmount: item?.totalConvertedAmount || 0,
      totalAmountConvert: item?.totalConvertedAmount || 0,
      amount: item?.quantity * item?.unitPrice || 0,
      taxModel: item?.tax,
      currency: modelNew?.currency,
      currencyRate: modelNew?.rate,
      idSubmitDetail: item?.id,
      goodsIdSubmit: item?.goodsId,
      id: `${
        isEmpty(item?.purchaseItemId)
          ? item?.contractGoodsItemId
          : item?.purchaseItemId
      }_${item?.unit?.code}_${item?.branch?.code}_${uuidv4()}`,
      purchaseItemId: item?.purchaseItemId,
      contractGoodsItemId: item?.contractGoodsItemId,
      receiverInfos: item?.receiverInfos?.map((receiver: ReceiverInfoModel) => {
        return {
          ...receiver,
          organization: receiver?.organizationName,
          personEmail: receiver?.person,
        };
      }),
    }));
  };

  const handleChangeDetailView = (
    data: ContractAdjustmentDetailModel,
    typePage: number
  ) => {
    const dataNew = convertDatesRecursively(data);

    // Usage
    const goodItems = mapContractGoodsToGoodItems(
      data.contractGoodsItems,
      dataNew
    );

    handleChangeAllField({
      ...model,
      id: dataNew?.id,
      commands: dataNew.commands,
      signatureType: dataNew?.signatureType,
      isViewWaitingApprove: isViewWaitingApprove,
      contract: dataNew,
      listDataShoppingPlan: dataNew?.ticketRelated?.purchasePlanRelateds,
      managerOrganization: dataNew.organization,
      managerPerson: dataNew?.managerObj,
      managerOrganizationUnit: dataNew.orgBusinessUnitName,
      managerOrganizationBranch: dataNew.orgBusinessBranchName,
      totalAmount: dataNew?.totalAmount,
      receivedType: dataNew?.receivedType,
      received: listReceivedType?.find(
        (item: any) => item.id === dataNew?.receivedType
      ),
      receiverInfos: dataNew?.receiverInfo?.receiverInfoDetails,
      receivedDepartment: {
        id: dataNew?.receiverInfo?.organizationId,
        name: dataNew?.receiverInfo?.organizationName,
      },
      receivedPerson: {
        id: dataNew?.receiverInfo?.personId,
        name: dataNew?.receiverInfo?.personName,
        email: dataNew?.receiverInfo?.person,
      },
      receivedPhoneNumber: dataNew?.receiverInfo?.phone,
      isView: isEqual(TYPE_PAGE.VIEW, typePage),
      isEdit: isEqual(TYPE_PAGE.EDIT, typePage),
      desciption: dataNew?.desciption,
      code: dataNew?.code,
      user: dataNew?.user,
      contractAppendixGoodsItems: goodItems,
      status: dataNew?.status,
      canCancel: dataNew?.canCancel,
      canEdit: dataNew?.canEdit,
      canDelete: dataNew?.canDelete,
      idDetail: dataNew?.id,
    });
    setLoading(false);
  };

  const handleDownloadFile = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );

  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    React.useState<boolean>(false);

  const handleHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
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

  const deleteContractAdjustment = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractAdjustmentRepository
      .deleteContractAdjustment(id, reason)
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

  const cancelContractAdjustment = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    contractAdjustmentRepository
      .cancelContractAdjustment(id, reason)
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
    model: ContractAdjustment,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelContractAdjustment(model?.idDetail, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteContractAdjustment(model?.idDetail, reason);
        return;
    }
  };

  const valuesContext: ContractAdjustmentContextModel = {
    model,
    loading,
    history,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeListField,
    breadcrumbs,
    handleSave,
    handleUploadFileError,
    handleUploadAttachmentError,
    handleDownloadFileAttached,
    handleChangeAllField,
    setLoading,
    notifyToast,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    handleDownloadFile,
    loadingButtonConfirm,
    setModelSelected,
    modelSelected,
    dispatch: dispatchModel,
    handleApplyButtonInConfirmModal,
    LoadingModal,
  };

  return {
    ...valuesContext,
    tabRepositories,
  };
}
