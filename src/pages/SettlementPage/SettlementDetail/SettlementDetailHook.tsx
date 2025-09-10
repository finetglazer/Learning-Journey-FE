import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import ApprovalHistoryTab from "components/ApprovalHistoryTab/ApprovalHistoryTab";
import TabName from "components/TabName/TabName";
import { TOPIC_TYPE } from "config/const";
import {
  APP_OVERVIEW,
  SETTLEMENT_MASTER_ROUTE,
  SETTLEMENT_ROUTE_ENUM,
} from "config/route-const";
import { addZStringToDate } from "core/helpers/date-time";
import { ConfirmModalType } from "core/helpers/enum";
import { JPY_CURRENCY } from "core/helpers/number";
import { getLastPath } from "core/helpers/path";
import { validateFieldsClearError } from "core/helpers/validator";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import type { History } from "history";
import _, { isEmpty, isEqual, isNil, isUndefined, round, size } from "lodash";
import {
  AssetFormationModel,
  AssetFormationType,
  AssetFormationTypeListCalculator,
  AssetItems,
  AssetItemSubmit,
  AssetTypePass,
  Breadcrumbs,
  CONTACT_SETTLEMENT_CONTENT_TYPE,
  ContractDataSubmitModel,
  ContractRequestType,
  FileAttachment,
  GoodsItem,
  GoodsItemsType,
  ModelSelect,
  PricingModel,
  SettlementDetailModel,
  SettlementHookModel,
  SettlementModel,
  SettlementStatus,
  TYPE_PAGE,
  VND_CURRENCY,
} from "models/Settlement";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { finalize, lastValueFrom, tap } from "rxjs";
import { settlementRepository } from "../SettlementRepository";
import useRepositoriesTabHookView from "../SettlementView/useRepositoriesTabHookView/useRepositoriesTabHookView";
import { SettlementFile } from "./components/SettlementFileTab/components/SettlementFile/SettlementFile";
import useRepositoriesTabHook from "./useRepositoriesTabHook/useRepositoriesTabHook";

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

export const DEFAULT_MODAL_TYPE: ModalType = { type: "NONE", id: undefined };

export const DEFAULT_ERROR_MODAL_TYPE: ModalType = { type: "NONE", errors: [] };

export const SettlementHookContext = createContext<SettlementHookModel>({
  model: new SettlementModel(),
  history: null,
  translate: null,
  loading: false,
  handleChangeSingleField: null,
  handleChangeSelectField: null,
  handleChangeDateField: null,
  breadcrumbs: [],
  formatNumberToCurrency: null,
  handleSave: null,
  modal: null,
  setModalType: null,
  loadingModal: false,
  loadingButtonConfirm: false,
  handleUploadFileError: null,
  handleDownloadFileAttached: null,
  handleChangeAllField: null,
  forceUpdateModal: null,
  updateModal: null,
  handleUploadFileToContract: null,
  setLoading: null,
  notifyToast: null,
  modelSelected: null,
  setModelSelected: null,
  handleApplyButtonInConfirmModal: null,
  errorsModal: null,
  setErrorsModal: null,
  setTabKey: null,
  tabKey: "0",
  handleUploadAttachmentError: null,
  handleGetContractDetail: null,
  handleCalculateTotalProposedPaymentValue: null,
  handleChangeMultipleItem: null,
  handleApprove: null,
});

export function useSettlementDetailHook(typePage?: number) {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<SettlementModel>(SettlementModel);
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [modalType, setModalType] = useState<string>("NONE");
  const [updateModal, forceUpdateModal] = useReducer((x) => x + 1, 0);
  const history: History = useHistory();
  const { tabRepositories: baseTabRepositories } = useRepositoriesTabHook(
    model?.errorTabs
  );
  const { tabRepositoriesView: baseTabRepositoriesView } =
    useRepositoriesTabHookView();
  const [modalCostAllocation, setModalCostAllocation] =
    useState<ModalType>(DEFAULT_MODAL_TYPE);
  const [errorsModal, setErrorsModal] = useState<ModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const queryParams = new URLSearchParams(location.search);
  const tabKeyParams = queryParams.get("tabKey");
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );
  const { id: idDetail } = useParams<{ id: string }>();
  useEffect(() => {
    if (!isEmpty(idDetail)) {
      initDetailSettlement(idDetail);
    }
  }, [idDetail]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const shouldShowApprovalHistoryTab = useMemo(
    () => !isUndefined(idDetail),
    [idDetail]
  );

  const disabledButtonOpinion = useMemo(() => {
    const nonApprovalStates: number[] = [
      SettlementStatus.CANCEL,
      SettlementStatus.REJECT,
      SettlementStatus.APPROVE,
    ];

    return nonApprovalStates.includes(model?.status);
  }, [model?.status]);

  const formatNumberToCurrency = (
    value: number,
    shouldRound = false,
    code = model?.currency
  ): string => {
    if (isNil(value) || isNaN(value) || value === 0) {
      return "0";
    }
    const isVND =
      isEqual(code?.toLowerCase(), VND_CURRENCY.toLowerCase()) ||
      isEqual(code?.toLowerCase(), JPY_CURRENCY.toLowerCase());
    const formattedValue = isVND
      ? _.round(value, 0)
      : shouldRound
      ? _.round(value, 2)
      : _.round(value, 4);
    const [integerPartRaw, decimalPartRaw = ""] =
      _.toString(formattedValue).split(".");
    const integerPart = _.replace(integerPartRaw, /\B(?=(\d{3})+(?!\d))/g, ".");
    if (isVND || _.isInteger(value)) {
      return integerPart;
    }
    // Loại bỏ các số 0 thừa ở cuối phần thập phân
    const decimalPartTrimmed = decimalPartRaw.replace(/0+$/, "");
    // Nếu phần thập phân còn lại rỗng thì chỉ trả về phần nguyên
    if (!decimalPartTrimmed) {
      return integerPart;
    }
    return `${integerPart},${decimalPartTrimmed}`;
  };

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("settlement.settlement_contact"),
      path: SETTLEMENT_MASTER_ROUTE,
    },
    {
      name: "",
    },
  ];

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  useEffect(() => {
    if (isEqual(typePage, TYPE_PAGE.VIEW)) {
      return;
    } else if (isEqual(typePage, TYPE_PAGE.EDIT) && renderCount?.current < 2) {
      return;
    } else {
      if (model?.goodsItems || !isEqual(model?.currency, VND_CURRENCY)) {
        const dataGoodsItems = model?.goodsItems?.map(
          (item: GoodsItemsType) => {
            return {
              ...item,
              totalExchangeAmount: item?.totalAmount * model?.rate || 0,
            };
          }
        );
        const pricingsUpdate = model?.pricings?.map((item: PricingModel) => {
          return {
            ...item,
            settlementExchangePrice: round(
              item?.settlementPrice * model?.rate || 0,
              0
            ),
            contractExchangePrice: round(
              item?.contractPrice * model?.rate || 0,
              0
            ),
          };
        });
        handleChangeAllField({
          ...model,
          goodsItems: dataGoodsItems,
          pricings: pricingsUpdate,
        });
      }
    }
  }, [model?.rate]);

  useEffect(() => {
    if (isNil(typePage)) {
      if (isNil(model?.contactOrderInfo?.contractRequestType)) {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name: translate("settlement.title"),
          };
          return newBreadcrumbs;
        });
      } else {
        if (
          isEqual(
            model?.contactOrderInfo?.contractRequestType,
            ContractRequestType.Contract
          )
        ) {
          setBreadcrumbs((prevState) => {
            const newBreadcrumbs = [...prevState];
            newBreadcrumbs[size(prevState) - 1] = {
              name: translate("settlement.title"),
            };
            return newBreadcrumbs;
          });
        } else {
          setBreadcrumbs((prevState) => {
            const newBreadcrumbs = [...prevState];
            newBreadcrumbs[size(prevState) - 1] = {
              name: translate("settlement.title_order"),
            };
            return newBreadcrumbs;
          });
        }
      }
    } else {
      if (
        isEqual(
          model?.contactOrderInfo?.contractRequestType,
          ContractRequestType.Contract
        )
      ) {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name:
              translate("settlement.settlement_contact") + " " + model?.code,
          };
          return newBreadcrumbs;
        });
      } else {
        setBreadcrumbs((prevState) => {
          const newBreadcrumbs = [...prevState];
          newBreadcrumbs[size(prevState) - 1] = {
            name: translate("settlement.settlement_order") + " " + model?.code,
          };
          return newBreadcrumbs;
        });
      }
    }
  }, [model?.contactOrderInfo?.contractRequestType]);

  useEffect(() => {
    if (isEqual(typePage, TYPE_PAGE.VIEW)) {
      return;
    } else if (isEqual(typePage, TYPE_PAGE.EDIT) && renderCount?.current < 3) {
      return;
    } else {
      //tổng tiền quyết toán
      const totalSettlementAmount = model?.goodsItems?.reduce(
        (total: number, item: GoodsItem) => total + item.totalAmount,
        0
      );
      //tổng tiền quyết toán quy đổi
      const totalSettlementAmountExchange = model?.goodsItems?.reduce(
        (total: number, item: GoodsItem) => total + item.totalExchangeAmount,
        0
      );

      handleChangeMultipleItem(
        model,
        {
          settlementPrice: totalSettlementAmount,
          settlementExchangePrice: round(totalSettlementAmountExchange, 0) || 0,
        },
        "settlementPrice",
        CONTACT_SETTLEMENT_CONTENT_TYPE.TotalSettlementValue,
        0,
        ["settlementPrice"],
        "settlementExchangePrice"
      );
    }
  }, [model?.goodsItems]);

  const handleGoMaster = useCallback(() => {
    history.push(SETTLEMENT_MASTER_ROUTE);
  }, [history]);

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const handleSave = (isDraft: boolean, callbackFc: () => void) => {
    setLoading(true);
    const dataSubmit = getDataSubmit(isDraft, model);
    if (isEmpty(model?.idEdit) && isEmpty(model?.id)) {
      settlementRepository
        .createSettlement({
          ...dataSubmit,
          isHardValidate: !!(typeof callbackFc === "function"),
        })
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (res) => {
            notifyToast();
            handleChangeAllField({
              ...model,
              id: res?.id,
              idEdit: res?.id,
              code: res?.code,
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
      settlementRepository
        .updateSettlement({
          ...dataSubmit,
          isHardValidate: !!(typeof callbackFc === "function"),
        })
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
          error: (error: AxiosError) => {
            handleErrorSubmit(error, model);
          },
        });
    }
  };

  const convertAndSortGoodsItems = (modelPass: {
    goodsItems: GoodsItem[];
  }): GoodsItem[] => {
    const mappedItems =
      modelPass?.goodsItems?.map((item: GoodsItem) => ({
        ...item,
        contractGoodsItemId: item?.contractGoodsItemId,
        note: item?.note,
        quantity: item?.quantity,
        unitPrice: item?.unitPrice,
        reducedPrice: item?.reducedPrice,
        taxId: item?.tax?.id,
        taxAmount: item?.taxAmount,
        totalExchangeAmount: item?.totalExchangeAmount,
      })) || [];

    const { categoryMap, categoryOrder } = mappedItems.reduce(
      (acc, item) => {
        const catId = item?.contractGoodsItem?.categoryId;
        if (!acc.categoryMap[catId]) {
          acc.categoryMap[catId] = [];
          acc.categoryOrder.push(catId);
        }
        acc.categoryMap[catId].push(item);
        return acc;
      },
      {
        categoryMap: {} as Record<string, GoodsItem[]>,
        categoryOrder: [] as string[],
      }
    );

    return categoryOrder.flatMap((catId) => categoryMap[catId]);
  };

  const getDataSubmit = (
    isDraft: boolean,
    modelPass: SettlementModel
  ): ContractDataSubmitModel => {
    const dataSubmit = {
      isDraft: isDraft,
      id: isEmpty(modelPass?.id) ? undefined : modelPass?.id,
      idEdit: isEmpty(modelPass?.idEdit) ? undefined : modelPass?.idEdit,
      contractId: modelPass?.contactOrderInfo?.id,
      description: modelPass?.description,
      effectiveDate: isEmpty(modelPass?.effectiveDate)
        ? undefined
        : dayjs(modelPass?.effectiveDate).format(),
      rate: modelPass?.rate,
      supplierName: modelPass?.supplierName,
      supplierTaxCode: modelPass?.supplierTaxCode,
      supplierAddress: modelPass?.supplierAddress,
      isSupplierAuthorized: modelPass?.isSupplierAuthorized,
      supplierRepresentative: modelPass?.supplierRepresentative,
      supplierPosition: modelPass?.supplierPosition,
      supplierAuthorizationLetter: modelPass?.supplierAuthorizationLetter,
      supplierContact: modelPass?.supplierContact,
      supplierEmail: modelPass?.supplierEmail,
      supplierPhone: modelPass?.supplierPhone,
      statusIntergrationAssetInfos: modelPass?.statusIntergrationAssetInfos,
      attachments: modelPass?.attachments as unknown as FileAttachment[],
      assetCost: round(
        modelPass?.assetFormations?.find((item: AssetFormationModel) =>
          isEqual(item?.type, AssetFormationType.Cost)
        )?.amountExchange || 0,
        0
      ),
      pricings: modelPass?.pricings?.map((item: PricingModel) => {
        return {
          contentType: item?.contentType,
          settlementPrice: item?.settlementPrice,
          settlementExchangePrice: round(item?.settlementExchangePrice, 0) || 0,
          note: isEmpty(item?.note) ? undefined : item?.note,
        };
      }),
      goodsItems: convertAndSortGoodsItems({
        goodsItems: modelPass.goodsItems,
      }),
      assetItems: modelPass?.assetItems?.map((item: AssetItems) => {
        return {
          ...item,
          assetId: isEmpty(item?.assetId) ? undefined : item?.assetId,
          code: item?.code,
          goodsId: item?.goods?.id,
          branchId: item?.branch?.id,
          goodsDescription: item?.goodsDescription,
          goodsNote: item?.goodsNote,
          ownerOrganizationId: item?.ownerOrganization?.id,
          ownerUserId: item?.ownerUser?.id,
          originalCost: item?.originalCost,
          type: item?.type,
          usageStartDate: isEmpty(item?.usageStartDate)
            ? undefined
            : dayjs(item?.usageStartDate).format(),
          depreciationStartDate: isEmpty(item?.depreciationStartDate)
            ? undefined
            : dayjs(item?.depreciationStartDate).format(),
          note: item?.note,
        };
      }) as AssetItemSubmit[],
      files: modelPass?.contractFiles?.map((file: SettlementFile) => {
        const { id, ...rest } = file;
        return rest;
      }),
    };

    return dataSubmit;
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [loadingModal, setLoadingModal] = React.useState<boolean>(false);
  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    React.useState<boolean>(false);

  const handleErrorSubmit = (
    error: AxiosError<any>,
    newModel: SettlementModel
  ) => {
    if (error.response && error.response.status === 400) {
      // Cho trường hợp chỉ check luồng duyệt workflow
      if (
        error.response?.data?.type === "Bad Request" &&
        error.response?.data?.message &&
        isEmpty(error.response?.data?.errors) &&
        isEmpty(error.response?.data?.tabs)
      ) {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      } else if (error.response?.data?.type !== "Invoice") {
        setErrorsModal({
          type: "SUBMIT_FAIL",
          errors: error?.response?.data?.tabErrors || [],
        });
      }
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

  const handleUploadFileToContract = useCallback(
    (file: SettlementFile) => {
      setLoading(true);
      settlementRepository
        .uploadContractFile(model?.id, file)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response) {
              handleChangeSingleField({ fieldName: "files" })(response?.files);
              notifyToast();
            }
          },
          error: (error: AxiosError) => {
            if (error.response && error.response.status === 400) {
              setErrorsModal({
                type: "SUBMIT_FAIL",
                errors: error?.response?.data?.tabErrors || [],
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
          },
        });
    },
    [model?.id, notifyToast]
  );

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
  // Delete single budget
  const deleteSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .deleteSettlement(id, reason)
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

  // Cancel budget request
  const cancelSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .cancelSettlement(id, reason)
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

  //Return req
  const returnSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .returnSettlement(id, reason)
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

  //Reject req
  const rejectSettlement = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    settlementRepository
      .rejectSettlement(id, reason)
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
    model: SettlementModel,
    reason: string
  ) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelSettlement(model?.idDetail, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteSettlement(model?.idDetail, reason);
        return;
      case ConfirmModalType.RETURN:
        returnSettlement(model?.id, reason);
        return;
      case ConfirmModalType.REJECT:
        rejectSettlement(model?.id, reason);
    }
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

  const handleGetContractDetail = useCallback(
    async (id: string, modelPass: SettlementModel) => {
      try {
        setLoading(true);
        const response = await lastValueFrom(
          settlementRepository.getContractDetail(id)
        );
        const modelNews = {
          rate: response?.data?.rate,
          assetFormations: response?.data?.assetFormations?.map(
            (item: AssetFormationModel) => {
              return {
                ...item,
                amount: item?.amount / response?.data?.rate,
              };
            }
          ),
          statusIntergrationAssetInfos:
            response?.data?.statusIntergrationAssetInfos,
          contactOrderInfo: {
            ...response?.data,
            effectiveDate: addZStringToDate(response?.data?.effectiveDate),
          },
          assetCost:
            response?.data?.assetFormations?.find((item: AssetFormationModel) =>
              isEqual(item?.type, AssetFormationType.Cost)
            )?.amount || 0,
          contactOrderInfoId: response?.data?.id,
          supplierName: response?.data?.contractSupplier?.supplier?.name,
          supplierTaxCode: response?.data?.contractSupplier?.supplier?.taxCode,
          supplierAddress: response?.data?.contractSupplier?.address,
          supplierRepresentative: response?.data?.contractSupplier?.agentPerson,
          supplierPosition:
            response?.data?.contractSupplier?.agentPersonPosition,
          isSupplierAuthorized: response?.data?.isEmpower,
          supplierAuthorizationLetter:
            response?.data?.contractSupplier?.procuration,
          supplierContact: response?.data?.contractSupplier?.contactPerson,
          supplierEmail: response?.data?.contractSupplier?.email,
          supplierPhone: response?.data?.contractSupplier?.phone,
          currency: response?.data?.currency,
          pricings: response?.data?.pricings?.map(
            (item: PricingModel, i: number) => {
              const isGetContractPrice = isEqual(
                item?.contentType,
                CONTACT_SETTLEMENT_CONTENT_TYPE.TotalSettlementValue
              );
              return {
                ...item,
                stt: item?.index,
                contractPrice: isGetContractPrice
                  ? item?.contractPrice
                  : undefined,
                contractExchangePrice: isGetContractPrice
                  ? item?.contractExchangePrice
                  : undefined,
                indexBeforeValidate: i,
              };
            }
          ),
          goodsItems: response?.data?.goodsItems,
          assetItems: response?.data?.assetItems?.map((item: AssetItems) => {
            return {
              ...item,
              usageStartDate: addZStringToDate(item?.usageStartDate),
              depreciationStartDate: addZStringToDate(
                item?.depreciationStartDate
              ),
            };
          }),
          commands: response?.data?.commands,
        };
        const errorsNews = validateFieldsClearError(modelNews);
        handleChangeAllField({
          ...modelPass,
          ...modelNews,
          errors: {
            ...modelPass.errors,
            ...errorsNews,
          },
        });
      } catch (error: any) {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [model]
  );

  const handleCalculateTotalProposedPaymentValue = useCallback(
    (pricings: PricingModel[] = [], name: string): number => {
      // Định nghĩa các loại cần trừ
      const proposedTypes = [
        CONTACT_SETTLEMENT_CONTENT_TYPE.PaidValue,
        CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty,
        CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation,
        CONTACT_SETTLEMENT_CONTENT_TYPE.WarrantyRetentionValue,
      ];

      // Tính tổng các settlementPrice thuộc các loại trên
      const valueToSubtract = pricings.reduce((acc, curr) => {
        if (proposedTypes.includes(curr.contentType)) {
          return acc + ((curr[name as keyof PricingModel] as number) || 0);
        }
        return acc;
      }, 0);

      // Tìm tổng settlement của loại TotalSettlementValue
      const totalSettlementValue =
        (pricings.find(
          (item) =>
            item.contentType ===
            CONTACT_SETTLEMENT_CONTENT_TYPE.TotalSettlementValue
        )?.[name as unknown as keyof PricingModel] as number) || 0;

      // Kết quả cuối cùng = tổng settlement - các giá trị cần trừ
      return totalSettlementValue - valueToSubtract;
    },
    [model?.pricings]
  );

  const handleChangeMultipleItem = useCallback(
    (
      modelPass: SettlementModel,
      data: object,
      name: string,
      contentType: number,
      indexBeforeValidate: number,
      nameErrors: string[],
      nameSub?: string
    ) => {
      // 1. Map lại pricings (nếu cùng contentType thì merge data)
      const pricingsEdit = modelPass?.pricings?.map((item: PricingModel) => {
        if (isEqual(item.contentType, contentType)) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      });

      const pricingsEditCustom = pricingsEdit?.map((item: PricingModel) => {
        if (
          isEqual(
            item.contentType,
            CONTACT_SETTLEMENT_CONTENT_TYPE.ContractViolationValue
          )
        ) {
          // Tính tổng settlementPrice của LatePenalty + OtherViolation
          const priceSum = pricingsEdit?.reduce((acc, curr) => {
            const matchViolation =
              isEqual(
                curr.contentType,
                CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty
              ) ||
              isEqual(
                curr.contentType,
                CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation
              );
            return matchViolation
              ? acc + ((curr[name as keyof PricingModel] as number) ?? 0)
              : acc;
          }, 0);

          return {
            ...item,
            [name]: isEqual(name, "note") ? item?.note : priceSum,
            [nameSub as string]: isEqual(name, "note")
              ? item?.note
              : priceSum * model?.rate,
          };
        }

        if (
          isEqual(
            item.contentType,
            CONTACT_SETTLEMENT_CONTENT_TYPE.ProposedPaymentValue
          )
        ) {
          if (isEmpty(nameSub)) {
            return {
              ...item,
              [name]: isEqual(name, "note")
                ? item?.note
                : handleCalculateTotalProposedPaymentValue(pricingsEdit, name),
            };
          } else {
            return {
              ...item,
              [name]: isEqual(name, "note")
                ? item?.note
                : handleCalculateTotalProposedPaymentValue(pricingsEdit, name),
              [nameSub as string]: handleCalculateTotalProposedPaymentValue(
                pricingsEdit,
                nameSub as string
              ),
            };
          }
        }
        return item;
      });
      // 3. Tạo lại errors, set null cho các key tương ứng
      const newErrors = nameErrors.reduce<Record<string, null>>(
        (acc, errName) => {
          const key = `pricings[${indexBeforeValidate}].${errName}`;
          return {
            ...acc,
            [key]: null,
          };
        },
        {}
      );

      // 4. Gọi hàm handleChangeAllField để cập nhật state (model)
      handleChangeAllField({
        ...modelPass, // Lấy model hiện tại từ scope (hoặc có thể dùng modelPass, tuỳ logic)
        pricings: pricingsEditCustom, // Cập nhật pricings mới
        errors: {
          ...modelPass.errors, // Lấy errors hiện tại từ scope
          ...newErrors,
        },
      });
    },
    [model?.pricings, model?.goodsItems]
  );

  const initDetailSettlement = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        const isView = queryParams.get("isView") === "true";

        const response = await lastValueFrom(
          settlementRepository.getSettlementDetail(id, isView)
        );
        if (isEqual(typePage, TYPE_PAGE.VIEW)) {
          handleChangeDetailView(response?.data, TYPE_PAGE.VIEW);
        } else {
          handleChangeDetailView(response?.data, TYPE_PAGE.EDIT);
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
    [idDetail]
  );

  const approvalHistoryTab = useMemo(
    () => [
      {
        tabKey: "4",
        tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
        children: (
          <ApprovalHistoryTab
            topicId={idDetail}
            topicType={TOPIC_TYPE.CONTRACT_SETTLEMENT}
            disabledButtonOpinion={disabledButtonOpinion}
            isNewLayoutVersion={isEqual(typePage, TYPE_PAGE.VIEW)}
            processAfterFeedbackSubmission={() =>
              isEqual(model?.status, SettlementStatus.IN_PROGRESS)
                ? initDetailSettlement(idDetail)
                : undefined
            }
            model={model}
          />
        ),
      },
    ],
    [
      disabledButtonOpinion,
      idDetail,
      initDetailSettlement,
      model?.status,
      translate,
      typePage,
    ]
  );

  const tabRepositories = useMemo(
    () =>
      baseTabRepositories
        ? [
            ...baseTabRepositories,
            ...(shouldShowApprovalHistoryTab ? approvalHistoryTab : []),
          ]
        : baseTabRepositories,
    [baseTabRepositories, shouldShowApprovalHistoryTab, approvalHistoryTab]
  );

  const tabRepositoriesView = useMemo(
    () =>
      baseTabRepositoriesView
        ? [...baseTabRepositoriesView, ...approvalHistoryTab]
        : baseTabRepositoriesView,
    [baseTabRepositoriesView, approvalHistoryTab]
  );

  const handleChangeDetailView = (
    data: SettlementDetailModel,
    typePage: number
  ) => {
    handleChangeAllField({
      ...model,
      idDetail: data?.id,
      id: data?.id,
      idEdit: isEqual(typePage, TYPE_PAGE.EDIT) ? data?.id : undefined,
      isEdit: isEqual(typePage, TYPE_PAGE.EDIT),
      status: data?.status,
      code: data?.code,
      effectiveDate: addZStringToDate(data?.effectiveDate),
      description: data?.description,
      statusIntergrationAssetInfos: data?.statusIntergrationAssetInfos,
      assetFormations: data?.assetFormations?.map(
        (item: AssetFormationModel) => {
          return {
            ...item,
            amount: item?.amount / data?.rate,
            amountExchange: round(item?.amount, 0),
          };
        }
      ),
      creator: data?.creator,
      createdOrganization: data?.createdOrganization,
      attachments: data?.attachments,
      rate: data?.rate,
      position: data?.position,
      supplierName: data?.supplierName,
      supplierAddress: data?.supplierAddress,
      supplierTaxCode: data?.supplierTaxCode,
      supplierRepresentative: data?.supplierRepresentative,
      supplierPosition: data?.supplierPosition,
      supplierEmail: data?.supplierEmail,
      supplierPhone: data?.supplierPhone,
      isSupplierAuthorized: data?.isSupplierAuthorized,
      supplierAuthorizationLetter: data?.supplierAuthorizationLetter,
      files: data?.files,
      contactPerson: data?.supplierContact,
      supplierContact: data?.supplierContact,

      contactOrderInfo: {
        ...model?.contactOrderInfo,
        id: data?.contract?.id,
        code: data?.contract?.code,
        contractRequestType: data?.contract?.contractRequestType,
        assetFormations: data?.assetFormations,
        toTalAssetFormation: data?.toTalAssetFormation,
        name: data?.contract?.name,
        contractNo: data?.contract?.contractNo,
        total: data?.contract?.total,
        currency: data?.contract?.currency,
        effectiveDate: addZStringToDate(data?.contract?.effectiveDate),
        managerEmail: data?.contract?.managerEmail,
        managerName: data?.contract?.managerName,
        legalEntity: data?.contract?.legalEntity,
        relatedSlips: data?.relatedSlips,
        endDate: addZStringToDate(data?.contract?.endDate),
      },
      pricings: data?.pricings?.map((item: PricingModel) => {
        return {
          ...item,
          stt: item?.index,
        };
      }),
      goodsItems: data?.goodsItems,
      assetItems: data?.assetItems,
      contractFiles: data?.files,
      canEdit: data?.canEdit,
      canCancel: data?.canCancel,
      canDelete: data?.canDelete,
      canApprove: data?.canApprove,
      canReturn: data?.canReturn,
      canDecline: data?.canDecline,
      canIntergrationAsset: data?.canIntergrationAsset,
      commands: data?.commands,
      signedForm: data?.signedForm,
      isOpinionValid: data?.isOpinionValid,
    });
    setLoading(false);
  };

  const handleApprove = (id: string) => {
    setLoading(true);
    settlementRepository
      .approveSettlement(id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          notifyToast({
            type: "error",
            message: error?.response?.data?.message,
          });
        },
      });
  };

  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    if (isEqual(typePage, TYPE_PAGE.VIEW)) {
      return;
    } else if (isEqual(typePage, TYPE_PAGE.EDIT) && renderCount?.current < 3) {
      return;
    } else {
      const rate = !isEqual(model?.currency, VND_CURRENCY) ? model?.rate : 1;
      const hasAssetItems = size(model?.assetItems) > 0;
      let newAssetFormations: AssetFormationModel[] = [];
      if (!hasAssetItems) {
        newAssetFormations = model?.assetFormations?.map((item) => {
          if (AssetFormationTypeListCalculator.includes(item?.type)) {
            return {
              ...item,
              amount: 0,
            };
          }
          return item;
        });
      } else {
        newAssetFormations = model?.assetFormations?.map((item) => {
          const assetItem = model?.assetItems?.filter((asset: AssetTypePass) =>
            isEqual(asset?.classifyType, item?.type)
          );
          if (size(assetItem) > 0) {
            return {
              ...item,
              amount:
                assetItem?.reduce(
                  (total: number, item: AssetItems) =>
                    total + item?.originalCost,
                  0
                ) / rate || 0,
            };
          }
          if (AssetFormationTypeListCalculator.includes(item?.type)) {
            return {
              ...item,
              amount: 0,
            };
          }
          return item;
        });
      }

      const totalAssetsDeducted = newAssetFormations?.reduce((acc, cur) => {
        if (
          isEqual(cur?.type, AssetFormationType.FixedTangible) ||
          isEqual(cur?.type, AssetFormationType.FixedIntangible) ||
          isEqual(cur?.type, AssetFormationType.Tools)
        ) {
          return acc + cur.amount;
        }
        return acc;
      }, 0);

      const totalAssetFixed = newAssetFormations?.reduce((acc, cur) => {
        if (
          isEqual(cur?.type, AssetFormationType.FixedTangible) ||
          isEqual(cur?.type, AssetFormationType.FixedIntangible)
        ) {
          return acc + cur.amount;
        }
        return acc;
      }, 0);

      const totalAssetCost =
        model?.goodsItems?.reduce(
          (total: number, item: GoodsItem) => total + item?.totalAmount,
          0
        ) - totalAssetsDeducted;

      const newAssetFormationsExchange = newAssetFormations?.map(
        (item: AssetFormationModel) => {
          if (isEqual(item?.type, AssetFormationType.Cost)) {
            return {
              ...item,
              amount: Math.max(totalAssetCost, 0),
              amountExchange: round(Math.max(totalAssetCost, 0) * rate, 0),
            };
          }
          if (isEqual(item?.type, AssetFormationType?.Fixed)) {
            return {
              ...item,
              amount: totalAssetFixed,
              amountExchange: round(totalAssetFixed * rate, 0),
            };
          }
          return {
            ...item,
            amountExchange: round(item?.amount * rate || 0, 0),
          };
        }
      );

      handleChangeSingleField({ fieldName: "assetFormations" })(
        newAssetFormationsExchange
      );
    }
  }, [model?.assetItems, model?.rate, model?.goodsItems]);

  const valuesContext: SettlementHookModel = {
    loading,
    history,
    translate,
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    breadcrumbs,
    formatNumberToCurrency,
    handleSave,
    modal: modalType,
    setModalType,
    handleUploadFileError,
    handleDownloadFileAttached,
    handleChangeAllField,
    forceUpdateModal,
    updateModal,
    setLoading,
    notifyToast,
    modalCostAllocation,
    setModalCostAllocation,
    modelSelected,
    setModelSelected,
    loadingModal,
    loadingButtonConfirm,
    handleApplyButtonInConfirmModal,
    handleUploadAttachmentError,
    handleUploadFileToContract,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    handleGetContractDetail,
    handleCalculateTotalProposedPaymentValue,
    handleChangeMultipleItem,
    handleApprove,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
    tabRepositoriesView,
  };
}
