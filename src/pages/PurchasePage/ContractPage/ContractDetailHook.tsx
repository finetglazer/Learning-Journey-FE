/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { BreadcrumbInterface } from "components/PageHeader/PageHeader";
import {
  listPaymentMilestoneType,
  listPaymentTimeType,
  listReceivedType,
  listTypeSuggestion,
  listValueCalculationPaymentSchedule,
  listWarrantyCalculationTime,
  PaymentTimeType,
} from "config/const";
import {
  APP_OVERVIEW,
  CONTRACT_ORDER,
  CONTRACT_ORDER_CREATE,
  CONTRACT_ORDER_PRINCIPAL,
  CONTRACT_ORDER_PRINCIPAL_CREATE,
  CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_MASTER_ROUTE,
  CONTRACT_ROUTE_CREATE,
  CONTRACT_ROUTE_MASTER,
  CONTRACT_ROUTE_VIEW,
} from "config/route-const";
import { JPY_CURRENCY_UNIT } from "core/config/consts";
import {
  getDayIsoToString,
  getISOStringStartDate,
} from "core/helpers/date-time";
import { addNumbers } from "core/helpers/number";
import appMessageService from "core/services/common-services/app-message-service";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  HttpStatusCode,
  NETWORK_ERROR_MESSAGE,
} from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { isEmpty, isEqual, omit, size } from "lodash";
import {
  ActionRowType,
  ActiveTabKeys,
  ContractAddType,
  ContractClassificationType,
  ContractDetailBodyRequest,
  ContractDetailFormModel,
  ContractDetailModel,
  ContractFile,
  ContractGoodsItem,
  ContractGoodsServices,
  ContractReceiverInfos,
  ContractStatus,
  ModelConfirmType,
  PaymentSchedules,
  ReceivedType,
  ReceiverInfo,
  SelectedModal,
} from "models/Contract";
import { ContractPrinciple } from "models/ContractPrinciple";
import { FileModelExtend } from "models/OpinionCollector";
import { VND_CURRENCY } from "models/Payment";
import { GoodService } from "models/Proposal/GoodService";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import { ErrorModalType } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useHistory, useLocation } from "react-router-dom";

import { useAppSelector } from "rtk/useRedux";
import { finalize, tap } from "rxjs";
import { listContractRequestTypeKey } from "../constants";
import { ConfirmModalType } from "../ContractPrinciplePage/ContractPrincipleMaster/ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";
import { contractPrincipleRepository } from "../ContractPrinciplePage/ContractPrincipleRepository";
import ApprovalHistoryTab from "./ContractDetail/Components/ApprovalHistoryTab/ApprovalHistoryTab";
import ContractAppendixTab from "./ContractDetail/Components/ContractAppendixTab/ContractAppendixTab";
import ContractFileTab from "./ContractDetail/Components/ContractFileTab/ContractFileTab";
import ContractTermsTab from "./ContractDetail/Components/ContractTermsTab/ContractTermsTab";
import ContractGenerationInfoTab from "./ContractDetail/Components/GenerationInfoTab/GenerationInfoTab";
import {
  generateDays,
  generateMonths,
} from "./ContractDetail/Components/PaymentSchedulesTab/Components/PaymentScheduleModal/helper";
import PaymentSchedulesTab from "./ContractDetail/Components/PaymentSchedulesTab/PaymentSchedulesTab";
import RelatedTicketsTab from "./ContractDetail/Components/RelatedTicketsTab/RelatedTicketsTab";
import WarrantyGuaranteeTab from "./ContractDetail/Components/WarrantyGuaranteeTab/WarrantyGuaranteeTab";
import { contractRepository } from "./ContractRepository";
import AdjustmentHistoryTab from "./ContractView/Components/AdjustmentHistoryTab/AdjustmentHistoryTab";
import ContractViewGenerationInfoTab from "./ContractView/Components/GenerationInfoTab/GenerationInfoTab";
import useTranslationContract from "./useTranslationContract";

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";
const TAB_KEY = "tabKey";
const DEFAULT_ERROR_MODAL_TYPE: ErrorModalType = { type: "NONE", errors: [] };
const TIME_STAMP_LENGTH = 13;

export const ContractDetailHookContext = createContext<ContractDetailModel>({
  model: new ContractDetailFormModel(),
  canSetContractTerms: null,
  dispatchModel: null,
  breadcrumbs: [],
  loading: false,
  setLoading: null,
  notifyToast: null,
  activeTabKey: ActiveTabKeys.GenerationInfo,
  isOpenGoodsServicesModal: false,
  setIsOpenGoodsServicesModal: null,
  selectedGoodsServices: [],
  setSelectedGoodsServices: null,
  selectedDetailGoodsServices: null,
  selectedDetailGoodsServicesId: "",
  setSelectedDetailGoodsServicesId: null,
  selectedUserEmailWaitForReceiveGoods: "",
  setSelectedUserEmailWaitForReceiveGoods: null,
  translate: null,
  errorsModal: DEFAULT_ERROR_MODAL_TYPE,
  setErrorsModal: null,
  handleChangeAllField: null,
  isOpenModalPaymentSchedule: false,
  setIsOpenModalPaymentSchedule: null,
  setRecordEditPaymentSchedule: null,
  recordEditPaymentSchedule: null,
  modalConfirm: null,
  handleUpdateTypeModal: null,
  listReceiverInfos: null,
  setListReceiverInfos: null,
  getBusinessUnitByOrganization: null,
  getLinkRouter: null,
  currentContractRequestType: null,
  handleUploadFileToContract: null,
  selectedModal: null,
  setSelectedModal: null,
  handleApplyButtonInConfirmModal: null,
  loadingModal: null,
  handleInitDataCreate: null,
});

type props = {
  isDetail?: boolean;
  isPrinciple?: boolean;
};

export function useContractDetailHook({
  isDetail = false,
  isPrinciple = false,
}: props) {
  const [translate] = useTranslationContract();
  const urlParams = new URLSearchParams(window.location.search);
  const isViewWaitingApprove = urlParams.get("isViewWaitingApprove");

  const { notifyToast } = appMessageService.useCRUDMessage();
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const { model, dispatch: dispatchModel } =
    detailService.useModel<ContractDetailFormModel>(ContractDetailFormModel);

  const [selectedModal, setSelectedModal] =
    React.useState<SelectedModal | null>(null);
  const [loadingModal, setLoadingModal] = React.useState<boolean>(false);

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeBoolField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);
  const tabKeyActive = queryParams.get(TAB_KEY);

  const profile = useAppSelector((state) => state.profile);

  const [activeTabKey, setActiveTabKey] = useState<ActiveTabKeys>(
    tabKeyActive
      ? (tabKeyActive as ActiveTabKeys)
      : ActiveTabKeys.GenerationInfo
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [errorsModal, setErrorsModal] = useState<ErrorModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );
  const [isOpenGoodsServicesModal, setIsOpenGoodsServicesModal] =
    useState(false);
  const [selectedGoodsServices, setSelectedGoodsServices] = useState<
    GoodService[]
  >([]);
  const [selectedDetailGoodsServicesId, setSelectedDetailGoodsServicesId] =
    useState("");
  const [isOpenModalPaymentSchedule, setIsOpenModalPaymentSchedule] =
    useState(false);
  const [recordEditPaymentSchedule, setRecordEditPaymentSchedule] =
    useState<PaymentSchedules | null>(null);
  const [canChangeExchangeRateByCurrency, setCanChangeExchangeRateByCurrency] =
    useState(false);

  const [modalConfirm, setModalConfirm] =
    React.useState<ModelConfirmType | null>(null);

  const [listReceiverInfos, setListReceiverInfos] = useState<
    ContractReceiverInfos[]
  >([new ContractReceiverInfos()]);

  const [
    selectedUserEmailWaitForReceiveGoods,
    setSelectedUserEmailWaitForReceiveGoods,
  ] = useState("");

  const selectedDetailGoodsServices = model?.contractGoodsServicesList?.find(
    (item) => item?.id === selectedDetailGoodsServicesId
  );

  const canSetContractTerms = useRef(false);

  const currentContractRequestType = useMemo(() => {
    if (isPrinciple) return undefined;

    const pathName = history.location.pathname;
    const lastIndexSlash = history.location.pathname.lastIndexOf("/");
    const lastPathName = history.location.pathname.substring(0, lastIndexSlash);

    let currentObject = listContractRequestTypeKey.find(
      (item) => item.id === pathName
    );

    if (!currentObject) {
      currentObject = listContractRequestTypeKey.find(
        (item) => item.id === lastPathName
      );
    }

    if (currentObject) {
      return currentObject.code;
    }
  }, [history.location.pathname]);

  const isCreateNewRouter = useMemo(() => {
    const lastRouter = history.location.pathname.split("/").pop();

    if (
      history.location.pathname === CONTRACT_ROUTE_CREATE ||
      history.location.pathname === CONTRACT_ORDER_CREATE ||
      history.location.pathname === CONTRACT_ORDER_PRINCIPAL_CREATE ||
      !lastRouter
    )
      return true;

    const listMapIdRouter = listContractRequestTypeKey.map((item) => item.id);

    const isCreate = listMapIdRouter.includes(lastRouter);

    return isCreate;
  }, [history.location.pathname]);

  const contractId = useMemo(() => {
    const lastRouter = history.location.pathname.split("/").pop();

    if (isCreateNewRouter) return;

    return lastRouter;
  }, [history, isCreateNewRouter]);

  const titlePageHeader = useMemo(() => {
    let title = isCreateNewRouter
      ? translate("CT.create_contract.title.page")
      : translate("CT.contract_view.title.page");

    if (model?.code) {
      title += ` - ${model.code}`;
    }

    return title;
  }, [isCreateNewRouter, model?.code, translate]);

  const inputNumberType = useMemo(
    () =>
      isEqual(model?.currency, VND_CURRENCY) ||
      isEqual(model?.currency, JPY_CURRENCY_UNIT)
        ? "LONG"
        : "DECIMAL",
    [model?.currency]
  );

  const shouldShowApprovalHistoryTab = () =>
    isDetail || model?.status === ContractStatus.DRAFT;

  const shouldShowRelatedTicketsTab = () =>
    (location.pathname.includes(CONTRACT_ROUTE_VIEW) ||
      location.pathname.includes(CONTRACT_ORDER) ||
      location.pathname.includes(CONTRACT_ORDER_PRINCIPAL)) &&
    model?.status !== ContractStatus.WAITING_FOR_APPROVAL;

  const paymentScheduleTab = {
    tabKey: ActiveTabKeys.PaymentSchedule,
    tabTitle: (
      <TabName
        text={translate("CT.tab_payment_schedule")}
        isShowIconError={model.errorTabs?.includes(
          Number(ActiveTabKeys.PaymentSchedule)
        )}
      />
    ),
    children: <PaymentSchedulesTab />,
  };

  const contractAppendixTab = {
    tabKey: ActiveTabKeys.ContractAppendix,
    tabTitle: (
      <TabName
        text={translate("CT.contract_appendix.tab")}
        isShowIconError={model.errorTabs?.includes(
          Number(ActiveTabKeys.ContractAppendix)
        )}
      />
    ),
    children: <ContractAppendixTab />,
  };

  const adjustmentHistoryTab = {
    tabKey: ActiveTabKeys.AdjustmentHistory,
    tabTitle: translate("CT.adjustment_history"),
    children: <AdjustmentHistoryTab />,
  };

  const relatedTicketsTab = {
    tabKey: ActiveTabKeys.RelatedTickets,
    tabTitle: (
      <TabName
        text={translate("CT.related_tickets")}
        isShowIconError={model?.errorTabs?.includes(
          ActiveTabKeys.RelatedTickets
        )}
      />
    ),
    children: <RelatedTicketsTab />,
  };

  const principleTitle = model?.id
    ? `${translate("CT.txt_contract_principles")} ${model?.code}`
    : translate("CT.create_new_contract_principle");

  const breadcrumbs: BreadcrumbInterface[] = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_shopping"),
    },
    {
      name: translate(
        isPrinciple
          ? "CM.menu_title_contract_principle"
          : "CM.menu_title_contract"
      ),
      path: isPrinciple
        ? CONTRACT_PRINCIPLE_MASTER_ROUTE
        : CONTRACT_ROUTE_MASTER,
    },
    {
      name: isPrinciple ? principleTitle : titlePageHeader,
    },
  ];

  const getPayloadPaymentSchedule = () => {
    return {
      calculationValue: model?.calculationValue?.id,
      paymentSchedules: model?.paymentSchedules?.map((item) => ({
        paymentBatch: item?.paymentBatch,
        suggestionType: item?.suggestionType?.id,
        percent: item?.percent,
        amount: item?.amount,
        paymentTerm: item?.paymentTerm,
        paymentTimeType: item?.paymentTimeType?.id,
        paymentDay: Number(item?.paymentDay?.id) || Number(item?.paymentDay),
        paymentMilestoneType: item?.paymentMilestoneType?.id,
        months: item?.months?.map((el) => el?.id),
        paymentCondition: item?.paymentCondition,
        referenceDocument: item?.referenceDocument,
        description: item?.description,
      })),
    };
  };

  const getPayloadWarranty = () => {
    return {
      warranties: model?.warranties?.map((item) => ({
        ...item,
        warrantyCalculationTime: item?.warrantyCalculationTime?.id,
      })),
    };
  };

  const goToMaster = () => {
    history.push(
      isPrinciple ? CONTRACT_PRINCIPLE_MASTER_ROUTE : CONTRACT_ROUTE_MASTER
    );
  };

  const handleSave = useCallback(
    ({
      isDraft = false,
      callbackFc,
    }: {
      isDraft?: boolean;
      callbackFc?: () => void;
    }) => {
      let contractGoodsItems = [] as ContractGoodsItem[];
      let receiverInfos = [] as ReceiverInfo[];
      if (!model) return;

      if (!isEmpty(model.contractGoodsServicesList)) {
        contractGoodsItems = model.contractGoodsServicesList?.map((item) => ({
          ...item,
          goodsItemId: item?.id,
          branchId: item?.branch?.id,
          unitId: item?.unit?.id,
          taxId: item?.tax?.id || item?.taxId,
          receiverInfos: item?.shippingInfo?.map((el) => ({
            ...el,
            organizationId: el?.receivedOrganization?.id,
            person: el?.receiver?.email,
            personId: el?.receiver?.id,
            phone: el?.phoneNumber,
          })),
        })) as [];
      }

      if (
        listReceiverInfos?.length &&
        model.receivedType === ReceivedType.SingleReceiver
      ) {
        // Thông tin giao nhận
        receiverInfos = listReceiverInfos.map((item: ContractReceiverInfos) => {
          const shippingDate = getISOStringStartDate(dayjs(item.shippingDate));

          return omit(
            {
              ...item,
              shippingDate,
              phone: model.receivedPhone,
              person: model.receivedPerson?.email,
              personId: model.receivedPerson?.id,
              organizationId: model.receivedOrganization?.id,
              organizationName: model.receivedOrganization?.name,
            },
            ["id"]
          );
        });

        contractGoodsItems = contractGoodsItems.map((item) => ({
          ...item,
          receiverInfos,
        }));
      }

      const requestBody: ContractDetailBodyRequest = omit(
        {
          ...model,
          contractClassification: isPrinciple
            ? ContractClassificationType.PrincipleContract
            : ContractClassificationType.Contract,
          isDraft,
          effectiveDate: getDayIsoToString(model?.effectiveDate),
          endDate: getDayIsoToString(model?.endDate),
          manager: model.managerObj?.email,
          isEmpower: !!model.isEmpower,
          isContractTermination: !!model.isContractTermination,
          createdOrganizationId: model.createdOrganization?.id,
          receiverInfos,
          contractGoodsItems,
          contractRequestType: currentContractRequestType,
          contractFiles: handleMapContractFile(),
          appendixs: handleMapAppendix(),
          ...getPayloadPaymentSchedule(),
          ...getPayloadWarranty(),
        },
        [
          "user",
          "errors",
          "contractSupplierId",
          "supplierPayment",
          "supplierPayments",
          "supplierPaymentId",
          "contractForm",
          "contractType",
          "isReturn",
          "receivedTypeOption",
          "receivedTypeOptionId",
          "receivedOrganization",
          "receivedOrganizationId",
          "receivedPerson",
          "receivedPersonId",
          "receivedPhone",
          "managerObj",
          "errorTabs",
          "createdOrganization",
          "businessDepartment",
          "orgBusinessBranch",
          "orgBusinessDepartment",
          "position",
          "legalEntity",
        ]
      );

      if (requestBody?.organization?.id) {
        Object.assign(requestBody, {
          organizationId: requestBody.organization.id,
        });
      }

      if (requestBody?.contractSupplier?.supplierPayment?.id) {
        Object.assign(requestBody, {
          contractSupplier: {
            ...requestBody.contractSupplier,
            supplierPaymentId: requestBody.contractSupplier.supplierPayment.id,
            // eslint-disable-next-line no-extra-boolean-cast
            procuration: !!model?.isEmpower
              ? requestBody.contractSupplier?.procuration
              : null,
          },
        });
      }

      requestBody.isHardValidate = !!(typeof callbackFc === "function");

      const request = model.id
        ? contractRepository.update(requestBody)
        : contractRepository.create(requestBody);

      setLoading(true);
      request.pipe(finalize(() => setLoading(false))).subscribe({
        next: (response) => {
          if (response) {
            notifyToast();
            handleChangeAllField({
              ...model,
              id: response?.id,
              code: response?.code,
            });
            // nếu có callbackFc thì không out ra khỏi detail
            if (typeof callbackFc === "function") {
              callbackFc();
            } else {
              goToMaster();
            }
          }
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            setErrorsModal({
              type: "SUBMIT_FAIL",
              errors: error?.response?.data?.tabErrors || [],
            });

          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...convertDataToHaveIndexBeforeValidate(model, [], model),
              errors: error.response?.data?.errors,
              errorTabs: error.response?.data?.tabs,
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
    [handleChangeAllField, model, notifyToast, history]
  );

  const handleInitDataCreate = useCallback(() => {
    const initUserData = {
      isPrinciple,
      calculationValue: listValueCalculationPaymentSchedule[0],
    };

    if (profile) {
      Object.assign(initUserData, {
        user: profile.account,
        orgBusinessDepartment: profile.businessDepartment,
        orgBusinessBranch: profile.businessBranch,
        createdOrganization: profile.organization,
        organization: profile.organization,
        position: profile.position,
        managerObj: profile.account,
      });
    }

    handleChangeAllField(initUserData);
    return initUserData;
  }, [handleChangeAllField, profile]);

  const handleMapContractFile = () => {
    return model?.contractFiles?.map((item: ContractFile) => ({
      ...item,
      id: size(item?.attachments) > TIME_STAMP_LENGTH ? item?.id : undefined,
    }));
  };

  const handleMapAppendix = () => {
    return model?.appendixs?.map((item) => ({
      ...item,
      id: size(item?.attachments) > TIME_STAMP_LENGTH ? item?.id : undefined,
      appendixTerms: item?.appendixTerms?.map((el) => ({
        ...el,
        id: size(el?.attachments) > TIME_STAMP_LENGTH ? el?.id : undefined,
      })),
    }));
  };

  const handleUploadFileToContract = useCallback(
    (file: ContractFile) => {
      setLoading(true);
      contractRepository
        .uploadContractFile(model?.id, file)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response) {
              handleChangeSingleField({ fieldName: "contractFiles" })(
                response?.contractFiles
              );
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

  const getBankExchangeRate = useCallback(
    (currencyCode: string, modelContext: ContractDetailFormModel) => {
      if (
        currencyCode &&
        currencyCode !== VND_CURRENCY &&
        modelContext?.contractSupplier?.supplierId
      ) {
        proposalRepository.getBankExchangeRate(currencyCode).subscribe({
          next: (response) => {
            if (response && response.rate !== modelContext.rate) {
              // I setup like this because it's effect on other component
              handleChangeSingleField({
                fieldName: "rate",
              })(response.rate);
              handleChangeSingleField({
                fieldName: "errors",
              })({
                ...modelContext?.errors,
                rate: null,
              });
            }
          },
          error: (error) => {
            if (error.response?.data) {
              // I setup like this because it's effect on other component
              handleChangeSingleField({
                fieldName: "rate",
              })(null);
              handleChangeSingleField({
                fieldName: "errors",
              })({
                ...modelContext?.errors,
                rate: error.response?.data?.message || null,
              });
            }
          },
        });
        return;
      }

      // I setup like this because it's effect on other component
      handleChangeSingleField({
        fieldName: "rate",
      })(0);
      handleChangeSingleField({
        fieldName: "errors",
      })({
        ...modelContext?.errors,
        rate: null,
      });
    },
    [handleChangeSingleField, model?.contractSupplier?.supplierId]
  );

  const handleUpdateDataDetail = useCallback(
    (response?: ContractDetailFormModel) => {
      if (
        response?.receivedType === ReceivedType.SingleReceiver ||
        response?.receivedType === ReceivedType.MultipleReceivers
      ) {
        Object.assign(response, {
          receivedTypeOption: listReceivedType[response.receivedType],
        });

        const receiverInfos =
          response?.contractGoodsItems?.[0]?.receiverInfos?.[0];

        if (receiverInfos) {
          Object.assign(response, {
            receivedOrganization: receiverInfos?.organization,
            receivedPerson: receiverInfos?.personObj,
            receivedPhone: receiverInfos?.phone,
          });
        }

        const dataListReceiverInfos =
          response?.contractGoodsItems?.[0]?.receiverInfos.map((item) => {
            return {
              ...item,
              shippingDate: dayjs(item.shippingDate),
            };
          });

        setListReceiverInfos(dataListReceiverInfos);
      }

      if (!isEmpty(response?.contractGoodsItems)) {
        const contractGoodsServicesList = response?.contractGoodsItems?.map(
          (item: ContractGoodsServices) => ({
            ...item,
            shippingInfo: item?.receiverInfos?.map(
              (item: { [key: string]: string }) => ({
                ...item,
                receivedOrganization: item?.organization,
                receiver: item?.personObj,
                phoneNumber: item?.phone,
              })
            ),
          })
        );

        const totalAmountContractGoodsServicesList =
          contractGoodsServicesList?.reduce(
            (prev: number, curr: ContractGoodsServices) => {
              return addNumbers(prev, curr.totalConvertedAmount || 0);
            },
            0
          );

        Object.assign(response, {
          contractGoodsServicesList,
          totalAmountContractGoodsServicesList,
        });
      }

      if (!isEmpty(response?.contractSupplier?.supplierPayment)) {
        Object.assign(response, {
          contractSupplier: {
            ...response.contractSupplier,
            supplierPayment: {
              ...response.contractSupplier.supplierPayment,
              code: response.contractSupplier.supplierPayment?.bankAccountNo,
              name: response.contractSupplier.supplierPayment?.bankAccountName,
            },
          },
        });
      }

      if (response.effectiveDate) {
        Object.assign(response, {
          effectiveDate: dayjs(response.effectiveDate).add(7, "hour"),
        });
      }

      if (response.endDate) {
        Object.assign(response, {
          endDate: dayjs(response.endDate).add(7, "hour"),
        });
      }

      handleChangeAllField(response);
    },
    [handleChangeAllField]
  );

  const handleGetDataDetail = useCallback(
    (id: string) => {
      setLoading(true);
      contractRepository
        .detail(id, !!isViewWaitingApprove, isPrinciple)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (responseDetail) => {
            // Function redirect if user try to change wrong url to show create data
            handleRedirectBasedOnResponse(responseDetail);

            handleUpdateDataDetail({
              ...responseDetail,
              isDetail,
              isPrinciple,
              ...getDataDetailPaymentSchedule(responseDetail),
              ...getDataDetailWarranty(responseDetail),
            });
          },
        });
    },
    [setLoading, handleUpdateDataDetail]
  );

  const processAfterFeedbackSubmission = useCallback(() => {
    if (isEqual(model?.status, ContractStatus.WAITING_FOR_APPROVAL)) {
      handleGetDataDetail(contractId);
    }
  }, [model?.status, contractId]);

  const approvalHistoryTab = {
    tabKey: ActiveTabKeys.ApprovalHistory,
    tabTitle: translate("PP.tab_approval_history"),
    children: (
      <ApprovalHistoryTab
        topicId={contractId}
        opinionType={opinionType}
        opinionId={opinionId}
        status={model?.status}
        processAfterFeedbackSubmission={processAfterFeedbackSubmission}
      />
    ),
  };

  const tabRepositories = [
    {
      tabKey: ActiveTabKeys.GenerationInfo,
      tabTitle: (
        <TabName
          text={translate("PP.tab_general_information")}
          isShowIconError={model.errorTabs?.includes(
            Number(ActiveTabKeys.GenerationInfo)
          )}
        />
      ),
      children: !isDetail ? (
        <ContractGenerationInfoTab />
      ) : (
        <ContractViewGenerationInfoTab topicId={model.id} />
      ),
    },
    {
      tabKey: ActiveTabKeys.ContractTerms,
      tabTitle: (
        <TabName
          text={translate("CT.contract_terms")}
          isShowIconError={model?.errorTabs?.includes(
            Number(ActiveTabKeys.ContractTerms)
          )}
        />
      ),
      children: <ContractTermsTab />,
    },
    contractAppendixTab,
    ...(!isPrinciple ? [paymentScheduleTab] : []),
    {
      tabKey: ActiveTabKeys.Warranty,
      tabTitle: (
        <TabName
          text={translate("CT.warranty_guarantee")}
          isShowIconError={model.errorTabs?.includes(
            Number(ActiveTabKeys.Warranty)
          )}
        />
      ),
      children: <WarrantyGuaranteeTab />,
    },
    ...(shouldShowRelatedTicketsTab() ? [relatedTicketsTab] : []),
    {
      tabKey: ActiveTabKeys.ContractFile,
      tabTitle: (
        <TabName
          text={translate("CT.create_contract.contract_file")}
          isShowIconError={model.errorTabs?.includes(
            Number(ActiveTabKeys.ContractFile)
          )}
        />
      ),
      children: <ContractFileTab />,
    },
    ...(shouldShowApprovalHistoryTab() ? [approvalHistoryTab] : []),
    ...(isDetail && !isPrinciple ? [adjustmentHistoryTab] : []),
  ];

  const getBusinessUnitByOrganization = useCallback(
    (id: string) => {
      contractRepository.getBusinessUnitByOrganization(id).subscribe({
        next: (res) => {
          handleChangeSingleField({
            fieldName: "orgBusinessUnit",
          })(res?.businessUnit);
          handleChangeSingleField({
            fieldName: "orgBusinessBranch",
          })(res?.businessBranch);
          handleChangeSingleField({
            fieldName: "orgBusinessDepartment",
          })(res?.businessDepartment);
        },
        error: () => {
          handleChangeSingleField({
            fieldName: "orgBusinessUnit",
          })("");
          handleChangeSingleField({
            fieldName: "orgBusinessBranch",
          })("");
          handleChangeSingleField({
            fieldName: "orgBusinessDepartment",
          })("");
        },
      });
    },
    [setLoading, handleUpdateDataDetail]
  );

  const getDataDetailPaymentSchedule = (res: ContractDetailFormModel) => {
    return {
      calculationValue: listValueCalculationPaymentSchedule?.find(
        (i) => i.id === res?.calculationValue
      ),
      paymentSchedules: res?.paymentSchedules?.map((item) => {
        const newItem = {
          ...item,
          paymentTimeType: listPaymentTimeType?.find(
            (i) => i.id === item?.paymentTimeType
          ),
          suggestionType: listTypeSuggestion?.find(
            (i) => i.id === Number(item?.suggestionType)
          ),
          paymentMilestoneType: listPaymentMilestoneType?.find(
            (i) => i.id === Number(item?.paymentMilestoneType)
          ),
        };
        if (item.paymentTimeType === PaymentTimeType.DATE) {
          newItem.paymentDay = generateDays(31).find(
            (i) => i.id === item?.paymentDay?.toString()
          );
          newItem.months = item?.months?.map((el) => {
            return generateMonths().find((i) => i.id === el?.toString());
          });
        }
        return newItem;
      }),
    };
  };

  const getDataDetailWarranty = (res: ContractDetailFormModel) => {
    return {
      warranties: res?.warranties?.map((item) => {
        return {
          ...item,
          warrantyCalculationTime: listWarrantyCalculationTime?.find(
            (i) => i.id === Number(item?.warrantyCalculationTime)
          ),
        };
      }),
    };
  };

  const handleDownloadFileAttached = (file?: FileModelExtend) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const handleUpdateTypeModal = (type: ModelConfirmType | null) => {
    setModalConfirm(type);
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

  const handleUploadFileError = (error: AxiosError) => {
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

  const getLinkRouter = React.useCallback(
    (type: ContractAddType, action?: ActionRowType) => {
      let objectRequestType = listContractRequestTypeKey?.find(
        (item) => item.code === type
      );

      if (action >= ActionRowType.VIEW) {
        objectRequestType = listContractRequestTypeKey?.find((item) => {
          const checkByType = item.code === type;
          return checkByType && item.action.includes(action);
        });
      }

      return objectRequestType?.id;
    },
    []
  );

  const handleRedirectBasedOnResponse = (response: ContractDetailFormModel) => {
    if (isPrinciple) return;
    const lastIndexSlash = history.location.pathname.lastIndexOf("/");
    const lastPathName = history.location.pathname.substring(0, lastIndexSlash);
    const isEditRouter =
      getLinkRouter(response.contractRequestType, ActionRowType.EDIT) ===
      lastPathName;

    const isViewRouter =
      getLinkRouter(response.contractRequestType, ActionRowType.VIEW) ===
      lastPathName;

    const isCanEditOnContract = !!response.id && response?.canEdit;

    // use history replace because it's should not save history on router
    if (isEditRouter && !isCanEditOnContract) {
      history.replace(
        `${getLinkRouter(response.contractRequestType, ActionRowType.VIEW)}/${
          response.id
        }`
      );
    }

    if (!isViewRouter && !isEditRouter) {
      history.replace(
        `${getLinkRouter(response.contractRequestType, ActionRowType.VIEW)}/${
          response.id
        }`
      );
    }
  };

  const handleInitReceiverInfos = useCallback(() => {
    if (
      !model ||
      !model.contractGoodsItems?.length ||
      model.receivedType !== ReceivedType.SingleReceiver
    )
      return;
    let startInitValue = [new ContractReceiverInfos()];

    if (model.contractGoodsItems?.[0]?.receiverInfos?.length > 0) {
      startInitValue = [...model.contractGoodsItems[0].receiverInfos].map(
        (item, index) => {
          return new ContractReceiverInfos({
            ...item,
            id: index,
          });
        }
      );
    }

    setListReceiverInfos(startInitValue);
  }, [setListReceiverInfos]);

  const refreshListAndHideModal = () => {
    notifyToast();
    goToMaster();
    setSelectedModal(null);
  };

  const handleError = (error: AxiosError) => {
    if (error.response && error.response.status === 400) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setSelectedModal((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors?.["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };
  const handleContractPrincipleAction = (
    actionType: ConfirmModalType,
    reason: string
  ) => {
    const repositoryAction =
      actionType === ConfirmModalType.DELETE
        ? contractPrincipleRepository.deleteContractPrinciple
        : contractPrincipleRepository.cancelContractPrinciple;

    repositoryAction(model?.id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: ContractPrinciple,
    reason: string
  ) => {
    if (selectedModal?.type) {
      handleContractPrincipleAction(selectedModal.type, reason);
    }
  };

  useEffect(() => {
    handleInitReceiverInfos();
    if (
      contractId &&
      history.location.pathname !== CONTRACT_ROUTE_CREATE &&
      history.location.pathname !== CONTRACT_PRINCIPLE_DETAIL_ROUTE
    ) {
      handleGetDataDetail(contractId);
      return;
    }

    handleInitDataCreate();
  }, [contractId, handleGetDataDetail, handleInitDataCreate, history]);

  useEffect(() => {
    if (opinionType) {
      setActiveTabKey(ActiveTabKeys.ApprovalHistory);
    }
  }, [opinionType]);

  useEffect(() => {
    if (model?.contractType?.id && canSetContractTerms.current) {
      canSetContractTerms.current = false;
      handleChangeSingleField({
        fieldName: "contractTerms",
      })(model?.contractType?.contractClauses || []);
    }
  }, [model?.contractType?.id]);

  useEffect(() => {
    if (
      model &&
      model.currency &&
      model.originalPurchasePlanId &&
      model.contractSupplier?.supplierId &&
      canChangeExchangeRateByCurrency
    ) {
      getBankExchangeRate(model.currency, model);
    }
  }, [
    getBankExchangeRate,
    model?.originalPurchasePlanId,
    model?.currency,
    model?.contractSupplier?.supplierId,
  ]);

  const valuesContext: ContractDetailModel = {
    canSetContractTerms,
    activeTabKey,
    principleTitle,
    setActiveTabKey,
    loading,
    setLoading,
    breadcrumbs,
    notifyToast,
    handleSave,
    model,
    dispatchModel,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    isOpenGoodsServicesModal,
    setIsOpenGoodsServicesModal,
    selectedGoodsServices,
    setSelectedGoodsServices,
    selectedDetailGoodsServices,
    selectedDetailGoodsServicesId,
    setSelectedDetailGoodsServicesId,
    selectedUserEmailWaitForReceiveGoods,
    setSelectedUserEmailWaitForReceiveGoods,
    handleChangeBoolField,
    translate,
    getBankExchangeRate,
    errorsModal,
    setErrorsModal,
    titlePageHeader,
    contractId,
    handleDownloadFileAttached,
    isDetail,
    isOpenModalPaymentSchedule,
    setIsOpenModalPaymentSchedule,
    setRecordEditPaymentSchedule,
    recordEditPaymentSchedule,
    modalConfirm,
    handleUpdateTypeModal,
    listReceiverInfos,
    setListReceiverInfos,
    handleDownloadFile,
    handleUploadFileError,
    getBusinessUnitByOrganization,
    getLinkRouter,
    currentContractRequestType,
    handleUploadFileToContract,
    setCanChangeExchangeRateByCurrency,
    inputNumberType,
    selectedModal,
    setSelectedModal,
    handleApplyButtonInConfirmModal,
    loadingModal,
    handleInitDataCreate,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
  };
}
