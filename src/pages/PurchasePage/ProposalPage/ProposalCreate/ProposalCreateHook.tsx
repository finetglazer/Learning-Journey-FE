/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/named */
/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import {
  LIST_TYPE_PROPOSAL,
  listAppointmentMethodEnum,
  listContractValueTypeEnum,
  listProposalStatusEnum,
  listPurposeShoppingEnum,
} from "config/const";
import {
  APP_OVERVIEW,
  PROPOSAL_ADJUST_DETAIL_ROUTE,
  PROPOSAL_CREATE_ROUTE,
  PROPOSAL_DETAIL_ROUTE,
  PROPOSAL_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { addNumbers, roundTo } from "core/helpers/number";
import {
  convertDataToHaveIndexBeforeValidate,
  detailService,
} from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum, HttpStatusCode } from "core/services/service-types";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { History } from "history";
import { get, isEmpty, isEqual, isNil, isUndefined, multiply } from "lodash";
import { JPY_CURRENCY, VND_CURRENCY } from "models/Payment";
import { Project } from "models/Project/Project";
import {
  Asset,
  AutoCostAllocationDocumentAttachModel,
  ContractorAppointment,
  CostAllocation,
  CostCenters,
  CostGroup,
  CostType,
  DEFAULT_MODAL_TYPE,
  EDirectContractingType,
  ErrorModalImport,
  ETabKeys,
  LIST_TYPE_COST,
  ModalType,
  Proposal,
  PROPOSAL_STATUS,
  ProposalCreateModel,
  ProposalGetListCostCenter,
  ProposalListCostCenterAllocation,
  ProposalRequestModel,
  PurchaseItem,
  PurposeShoppingEnum,
  SHOPPING_PURPOSES,
} from "models/Proposal";
import {
  GoodServiceExtend,
  UploadFileGoodsServices,
} from "models/Proposal/GoodService";
import {
  APPROVE_TYPE,
  MODEL_CONFIRM_TYPE,
} from "pages/BudgetPage/BudgetCreate/BudgetCreateHook";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { store } from "rtk";
import { finalize, forkJoin, lastValueFrom, Subscription, tap } from "rxjs";
import appMessageService from "../../../../core/services/common-services/app-message-service";
import { ConfirmModalType } from "../ProposalMaster/ProposalConfirmModal/ProposalConfirmModal";
import { ModelSelect } from "../ProposalMaster/ProposalMasterHook";
import { proposalRepository } from "../ProposalRepository";
import ApprovalHistoryTab from "./ApprovalHistoryTab/ApprovalHistoryTab";
import DirectContractingTab, {
  EDirectContractingField,
} from "./DirectContractingTab/DirectContractingTab";
import ProposalCostAllocationTab from "./ProposalCostAllocationTab/ProposalCostAllocationTab";
import ProposalGenerationInfoTab from "./ProposalGenerationInfoTab/ProposalGenerationInfoTab";
import ProposalGoodServices from "./ProposalGoodServices/ProposalGoodServicesTab";
import {
  calculate,
  formatNumberToCurrency,
} from "./ProposalGoodServices/helper";
import { ROUND_NUM_NOT_VND } from "./ProposalGoodServices/Components/TablePurchaseInfo/helper";
import { detectIntegerCurrency } from "core/helpers/currency";

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

export interface ErrorModalType {
  type: "CREATE" | "UPDATE" | "DETAIL" | "DELETE" | "SUBMIT_FAIL" | "NONE";
  id?: string;
  errors?: string[];
}

const DEFAULT_ERROR_MODAL_TYPE: ErrorModalType = { type: "NONE", errors: [] };

export const ProposalCreateHookContext = createContext<ProposalCreateModel>({
  model: new ProposalRequestModel(),
  dispatchModel: null,
  loading: false,
  handleChangeSingleField: null,
  handleChangeSelectField: null,
  handleChangeDateField: null,
  breadcrumbs: [],
  handleSave: null,
  handleDownloadFileAttached: null,
  handleChangeAllField: null,
  setLoading: null,
  notifyToast: null,
  handleGoMaster: null,
  handleAddNewBasis: null,
  handleCheckAsset: null,
  handleUploadAttachmentError: null,
  isShowComponentForeignCurrency: false,
  getBankExchangeRate: null,
  changeListSelectedGood: null,
  handleClickAddCostAllocationLine: null,
  handleOpenModalAutoCostAllocation: null,
  modalCostAllocation: DEFAULT_MODAL_TYPE,
  setModalCostAllocation: null,
  handleGetListCostCenterByAllocationMonth: null,
  modalConfirm: null,
  handleUpdateTypeModal: null,
  handleApproveProposal: null,
  handleRejectProposal: null,
  handleReturnProposal: null,
  handleCloseProposal: null,
  modelSelected: null,
  setModelSelected: null,
  isLoadingModal: null,
  handleApplyButtonInConfirmModal: null,
  handleCancelUploadGoodsServicesFile: null,
  handleDownloadGoodsServicesTemplate: null,
  handleUpdateListCostCenterByAllocationMonth: null,
  errorsModal: DEFAULT_ERROR_MODAL_TYPE,
  setErrorsModal: null,
  isRowDisabled: null,
});

type props = {
  isDetail?: boolean;
  isAdjust?: boolean;
};

export function useProposalCreateHook({
  isDetail = false,
  isAdjust = false,
}: props) {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const location = useLocation();
  const history: History = useHistory();
  const queryParams = new URLSearchParams(location.search);

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);
  const [modalConfirm, setModalConfirm] =
    React.useState<MODEL_CONFIRM_TYPE | null>(null);
  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);

  const [activeTabKey, setActiveTabKey] = React.useState<ETabKeys>(
    ETabKeys.ProposalGenerationInfo
  );

  const proposalId = useMemo(
    () => history.location.pathname.split("/").pop(),
    [history]
  );

  const { model, dispatch: dispatchModel } =
    detailService.useModel<ProposalRequestModel>(ProposalRequestModel);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [errorModalImport, setErrorModalImport] = useState<ErrorModalImport>();

  const [errorsModal, setErrorsModal] = useState<ErrorModalType>(
    DEFAULT_ERROR_MODAL_TYPE
  );

  const subscriptionRef = useRef<Subscription | null>(null);

  const exchangeRateNumberType = useMemo(
    () =>
      isEqual(model?.currency?.code, VND_CURRENCY) ||
      isEqual(model?.currency?.code, JPY_CURRENCY)
        ? "LONG"
        : "DECIMAL",
    [model.currency?.code]
  );

  const processAfterFeedbackSubmission = useCallback(() => {
    const id = history.location.pathname.split("/").pop();
    const shouldGetDataDetail =
      id &&
      isEqual(
        model?.status,
        get(listProposalStatusEnum, `[${numberConstants.ONE}].id`)
      ) &&
      history.location.pathname !== PROPOSAL_CREATE_ROUTE &&
      history.location.pathname !== PROPOSAL_ADJUST_DETAIL_ROUTE;

    if (shouldGetDataDetail) {
      handleGetDataDetail(id, undefined);
    }
  }, [history.location.pathname, model?.status]);

  const approvalHistoryTab = {
    tabKey: ETabKeys.ApprovalHistory,
    tabTitle: translate("PP.tab_approval_history"),
    children: (
      <ApprovalHistoryTab
        topicId={proposalId}
        opinionType={opinionType}
        opinionId={opinionId}
        status={model?.status}
        processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        model={model}
      />
    ),
  };

  const directContractingTab = isEqual(
    model?.type?.id,
    LIST_TYPE_PROPOSAL[0].id
  )
    ? [
        {
          tabKey: ETabKeys.DirectContracting,
          tabTitle: (
            <TabName
              text={translate("PP.tab_direct_contracting")}
              isShowIconError={model?.errorTabs?.includes(3)}
            />
          ),
          children: <DirectContractingTab />,
        },
      ]
    : [];

  const goodsServiceTab = isEqual(model?.type?.id, LIST_TYPE_PROPOSAL[0].id)
    ? [
        {
          tabKey: ETabKeys.GoodsServices,
          tabTitle: (
            <TabName
              text={translate("PP.tab_goods_services")}
              isShowIconError={model.errorTabs?.includes(1)}
            />
          ),
          children: <ProposalGoodServices />,
        },
      ]
    : [];

  // const shouldShowApprovalHistoryTab = () =>
  //   !(
  //     location.pathname.includes(PROPOSAL_CREATE_ROUTE) ||
  //     location.pathname.includes(PROPOSAL_ADJUST_DETAIL_ROUTE)
  //   );

  const tabRepositories = [
    {
      tabKey: ETabKeys.ProposalGenerationInfo,
      tabTitle: (
        <TabName
          text={translate("PP.tab_general_information")}
          isShowIconError={model.errorTabs?.includes(0)}
        />
      ),
      children: (
        <ProposalGenerationInfoTab
          topicId={
            isEqual(history.location.pathname, PROPOSAL_CREATE_ROUTE) ||
            isEqual(history.location.pathname, PROPOSAL_ADJUST_DETAIL_ROUTE)
              ? undefined
              : proposalId
          }
        />
      ),
    },
    ...goodsServiceTab,
    {
      tabKey: ETabKeys.CostAllocation,
      tabTitle: (
        <TabName
          text={translate("PP.tab_cost_allocation")}
          isShowIconError={model.errorTabs?.includes(2)}
        />
      ),
      children: <ProposalCostAllocationTab />,
    },
    ...directContractingTab,
    ...(model?.id ? [approvalHistoryTab] : []),
  ];

  const [modalCostAllocation, setModalCostAllocation] =
    useState<ModalType>(DEFAULT_MODAL_TYPE);

  const proposalAdjustTitle = useMemo(
    () =>
      model?.id
        ? `${translate("PP.adjust_proposal")} ${model?.code}`
        : translate("PP.adjust_proposal"),
    [model?.id, model?.code]
  );

  const proposalTitle = model?.id
    ? `${translate("PP.proposal")} ${model?.code}`
    : translate("PP.create_proposal");

  const title = isAdjust ? proposalAdjustTitle : proposalTitle;

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate(
        isAdjust ? "PP.adjust_proposal" : "CM.menu_title_proposal"
      ),
      path: !isAdjust
        ? PROPOSAL_MASTER_ROUTE
        : `${PROPOSAL_MASTER_ROUTE}?tabKey=1`,
    },
    {
      name: title,
    },
  ];

  const handleGoMaster = React.useCallback(() => {
    if (isAdjust) {
      history.push(`${PROPOSAL_MASTER_ROUTE}?tabKey=1`);
    } else {
      history.push(PROPOSAL_MASTER_ROUTE);
    }
  }, [history, isAdjust]);

  useEffect(() => {
    const id = history.location.pathname.split("/").pop();

    if (
      id &&
      history.location.pathname !== PROPOSAL_CREATE_ROUTE &&
      history.location.pathname !== PROPOSAL_ADJUST_DETAIL_ROUTE
    ) {
      const searchParams = new URLSearchParams(history.location.search);
      const approveType = searchParams.get("approveType");
      handleGetDataDetail(id, approveType);
    } else {
      handleInitDataCreate();
    }
  }, []);

  useEffect(() => {
    if (opinionType) {
      setActiveTabKey(ETabKeys.ApprovalHistory);
    }
  }, [opinionType]);

  const handleInitDataCreate = async () => {
    const dataProposal = (
      history.location?.state as { dataProposal?: ProposalRequestModel }
    )?.dataProposal;

    if (dataProposal && isAdjust) {
      setLoading(true);

      handleUpdateDataCreate({
        ...dataProposal,
        user: store.getState().profile?.account,
        organization: store.getState().profile.organization,
        position: store.getState().profile.position,
        originalPurchaseProposalId: dataProposal?.id,
        originalCode: dataProposal?.code,
        id: undefined,
        description: undefined,
        originalDescription: dataProposal?.description,
        isAdjust: true,
        status: undefined,
        originalTotalContingencyAmount: dataProposal?.totalContingencyAmount,
        originalTotalEstimateAmount: dataProposal?.totalEstimateAmount,
        proposalReferences: dataProposal?.documentGroups,
      });
      return;
    }
    const dataInit: ProposalRequestModel = {
      procurementPurpose: listPurposeShoppingEnum[0],
      user: store.getState().profile?.account,
      organization: store.getState().profile.organization,
      position: store.getState().profile.position,
      currency: await getCurrencyInit(),
      isExchangeRate: true,
      isPriceExcludingTax: true,
      selectedListGoodsServices: [],
      ...dataProposal,
    };
    handleChangeAllField(dataInit);
  };

  const handleGetDataDetail = (
    id: string,
    approveType: APPROVE_TYPE | string
  ) => {
    setLoading(true);
    proposalRepository.detail(id).subscribe({
      next: (responseDetail) => {
        handleUpdateDataCreate({ ...responseDetail, id, isDetail, isAdjust });
        if (
          approveType &&
          responseDetail.status == PROPOSAL_STATUS.IN_PROGRESS
        ) {
          switch (approveType) {
            case APPROVE_TYPE.REJECT:
              handleUpdateTypeModal(MODEL_CONFIRM_TYPE.REJECT);
              break;
            case APPROVE_TYPE.RETURN:
              handleUpdateTypeModal(MODEL_CONFIRM_TYPE.RETURN);
              break;
            default:
              break;
          }
        }
      },
    });
  };

  const handleUpdateDataCreate = async (response?: Proposal) => {
    let resultCostLines: Project[][] = [];
    if (!isEmpty(response?.costAllocationLines)) {
      try {
        resultCostLines = await getCostCenterList(
          response?.costAllocationLines,
          response
        );
      } catch (error) {
        console.log("Error get cost center: ", error);
      } finally {
        setLoading(false);
      }
    }
    const type = LIST_TYPE_PROPOSAL.find((item) => item.id === response?.type);
    const procurementPurpose = listPurposeShoppingEnum.find(
      (item) => item.id === response?.purchasePurpose?.type
    );
    const appointmentMethod = listAppointmentMethodEnum.find((item) =>
      isEqual(item?.id, response?.contractorAppointment?.appointmentMethod)
    );
    const contractValueType = listContractValueTypeEnum.find((item) =>
      isEqual(item?.id, response?.contractorAppointment?.contractValueType)
    );

    const dataPurchasePurpose = {
      note: response?.purchasePurpose?.note,
      assetCode: response?.purchasePurpose?.assetCode,
      assetName: response?.purchasePurpose?.assetName,
      promotionId: response?.purchasePurpose?.promotion,
      projectId: response?.purchasePurpose?.project,
    };

    const dataCostAllocation = {
      totalContingencyAmount: response?.totalContingencyAmount,
      totalEstimateAmount: response?.totalEstimateAmount,
      positionApproves: response?.positionApprove,
    };

    if (response?.isAdjust) {
      Object.assign(dataCostAllocation, {
        positionApprove: response?.positionApprove?.[0],
      });
    }

    const contractorAppointmentData = response?.contractorAppointment || {};
    const contractorAppointment = {
      ...contractorAppointmentData,
      appointmentMethod,
      contractValueType,
    };

    const dataCostAllocationLines: CostAllocation[] =
      response?.costAllocationLines?.map(
        (item: CostAllocation, index: number) => {
          return {
            id: item?.id,
            businessBranchId: item?.businessBranch,
            businessDepartmentId: item?.businessDepartment,
            businessUnitId: item.businessUnit,
            contingencyAmount: item.contingencyAmount,
            estimateAmount: item.estimateAmount,
            usedAmount: item.usedAmount,
            projectId: {
              ...item?.project,
              costLines: !isEmpty(resultCostLines)
                ? resultCostLines[index]?.filter(
                    (record) => record?.id === item?.project?.id
                  )?.[0]?.costLines
                : [],
            },
            costLineId: item.costLine,
            originalTotalAmount: item.originalTotalAmount,
          };
        }
      );

    const dataDetail: ProposalRequestModel = {
      ...response,
      investmentLocation: response?.purchasePurpose?.investmentLocation,
      type,
      procurementPurpose,
      contractorAppointment,
      ...dataPurchasePurpose,
      ...dataCostAllocation,
      isExchangeRate: response?.exchangeRateEnabled,
      proposalReferences: response?.documentGroups,
      startDate: [dayjs(response.startDate), dayjs(response.endDate)],
      receivedDate: response.receivedDate ? dayjs(response.receivedDate) : null,
      user: response?.user,
      selectedListGoodsServices: handleGoodsServicesResponse(
        response?.purchaseItems,
        response?.costGroup,
        response?.costType,
        isAdjust
      ),
      costAllocation: dataCostAllocationLines,
      rateInfo: response?.rateInfoJson,
    };
    handleChangeAllField(dataDetail);
    setLoading(false);
  };

  const handleGoodsServicesResponse = (
    responsePurchase?: PurchaseItem[],
    costGroup?: CostGroup,
    costType?: CostType,
    notEdit?: boolean
  ): GoodServiceExtend[] => {
    const goodsIdCount: Record<string, number> = {};

    return responsePurchase?.map((item) => {
      if (!goodsIdCount?.[item.goodsId]) {
        goodsIdCount[item.goodsId] = 0;
      }
      const renderId = `${item.goodsId}@${goodsIdCount[item.goodsId]}`;
      goodsIdCount[item.goodsId]++;
      return {
        id: item?.goodsId,
        code: item?.code,
        name: item?.name,
        goodsServicesCategory: item?.category,
        costGroup: costGroup,
        costType: costType,
        goodsServiceUnit: item?.unit,
        unitPrice: item?.unitPrice,
        tax: item?.tax,
        note: item?.note,
        description: item?.description,
        taxAmount: item?.taxAmount,
        totalAmount: item?.totalAmount,
        otherAmount: item?.otherAmount,
        quantity: item?.quantity,
        contractPriceMin: item?.unitPrice,
        manufacturer: item?.branch,
        amountBeforeTax: item?.amountBeforeTax,
        notEdit: notEdit,
        originalTotalAmount: item?.originalTotalAmount,
        renderId: renderId,
        isOriginalItem: item?.isOriginalItem,
      };
    });
  };

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatchModel);

  const handleConvertRequestBodyProposal = React.useCallback(
    (isDraft: boolean) => {
      const getPurchasePurpose = () => {
        switch (model?.procurementPurpose?.id) {
          case PurposeShoppingEnum.RegularPurchasing:
          case PurposeShoppingEnum.Other:
          case PurposeShoppingEnum.FinancialLease:
          case PurposeShoppingEnum.StoragePurchasing:
            return {
              type: model?.procurementPurpose?.id,
              note: model?.note,
            };
          case PurposeShoppingEnum.RepairAndMaintenance:
            return {
              type: model?.procurementPurpose?.id,
              assetCode: model?.assetCode,
              assetName: model?.assetName,
            };
          case PurposeShoppingEnum.ProjectBased:
            return {
              type: model?.procurementPurpose?.id,
              projectId: model?.projectId?.id,
              investmentLocation: model?.investmentLocation,
            };
          case PurposeShoppingEnum.PromotionalPurchasing:
            return {
              type: model?.procurementPurpose?.id,
              promotionId: model?.promotionId?.id,
            };
          default:
            break;
        }
      };
      const getContractorAppointment = (): ContractorAppointment => {
        if (
          isUndefined(get(model, EDirectContractingField.APPOINTMENT_METHOD))
        ) {
          return undefined;
        }

        const appointmentMethodFromModel = get(
          model,
          EDirectContractingField.APPOINTMENT_METHOD
        );

        const appointmentSupplier = get(
          model,
          EDirectContractingField.SUPPLIER
        );
        const contractValueTypeFromModel = get(
          model,
          EDirectContractingField.CONTRACT_VALUE_TYPE
        );

        const baseData = {
          name: get(model, EDirectContractingField.NAME),
          appointmentMethod: appointmentMethodFromModel?.id,
          appointmentReason: get(
            model,
            EDirectContractingField.APPOINTMENT_REASON
          ),
          supplierId: appointmentSupplier?.id,
          purchaseProposalId: model?.id,
        };

        if (
          !isEqual(
            appointmentMethodFromModel?.id,
            EDirectContractingType.DIRECT_CONTRACTING_WITHOUT_ASSESSMENT
          )
        ) {
          return baseData;
        }

        return {
          ...baseData,
          executionTime: get(model, EDirectContractingField.EXECUTION_TIME),
          contractValue: get(model, EDirectContractingField.CONTRACT_VALUE),
          contractValueType: contractValueTypeFromModel?.id,
          taxPayer: get(model, EDirectContractingField.TAX_PAYER),
          contractType: get(model, EDirectContractingField.CONTRACT_TYPE),
          paymentTerms: get(model, EDirectContractingField.PAYMENT_TERMS),
          warrantyContent: get(model, EDirectContractingField.WARRANTY_CONTENT),
          guaranteeContent: get(
            model,
            EDirectContractingField.GUARANTEE_CONTENT
          ),
        };
      };

      let positionApproveId: string[] = [];
      if (model?.isAdjust) {
        positionApproveId = [model?.positionApprove?.id];
      }
      if (!model?.isAdjust) {
        positionApproveId = model?.positionApproves?.map((item) => item.id);
      }

      const body: ProposalRequestModel = {
        isDraft,
        type: model.type?.id,
        purchaseProposalType: isAdjust ? 1 : 0,
        receivedDate: !isEmpty(model.receivedDate)
          ? dayjs(model.receivedDate).format()
          : null,
        name: model?.name,
        description: model?.description,
        documentGroups: model?.proposalReferences?.map((item) => ({
          attachments: item.attachments,
          description: item.description,
        })),
        positionApproveId,
        attachments: model?.attachments,

        //Cơ sở đề xuất
        actualSituation: model?.actualSituation,
        necessity: model?.necessity,
        assessment: model?.assessment,

        //Sự cần thiết của đầu tư / mua sắm
        financialEffectiveness: model?.financialEffectiveness,
        nonFinancialEffectiveness: model?.nonFinancialEffectiveness,

        //Mục đích mua sắm
        purchasePurpose: getPurchasePurpose(),
        costDriverId: model?.costDriver?.id,
        totalContingencyAmount: model?.totalContingencyAmount,
        totalEstimateAmount: model?.totalEstimateAmount,
        costAllocationLines: model.costAllocation?.map(
          (item: CostAllocation) => ({
            businessBranchId: item.businessBranchId?.id,
            businessDepartmentId: item.businessDepartmentId?.id,
            businessUnitId: item.businessUnitId?.id,
            contingencyAmount: item.contingencyAmount,
            estimateAmount: item.estimateAmount,
            projectId: item.projectId?.id,
            costLineId: item.costLineId?.id,
          })
        ),
        automaticCostAllocationJson: {
          costDriver: model?.costDriver,
          project: model?.projectName,
          costLine: model?.costLineName,
          allocationMonth: model?.allocationMonth,
          isUniqueUnitPrice: model?.isPriceExcludingTax,
          estimateAmount: model?.estimateIncludesTax || 0,
          contingencyAmount: model?.contingencyIncludesTax || 0,
          lines: model?.autoCostAllocationDocumentsAttach?.map(
            (line: AutoCostAllocationDocumentAttachModel, index: number) => ({
              id: dayjs().valueOf().toString() + index,
              businessDepartment: line.businessDepartmentId,
              businessUnit: line.businessUnitId,
              businessBranch: line.businessBranchId,
              area: line.area || 0,
              employeeCount: line.employeeCount || 0,
              rate: line.percentage || 0,
              quantity: line.quantity || 0,
              estimateAmount: line.estimateIncludesTax || 0,
              contingencyAmount: line.contingencyIncludesTax || 0,
            })
          ),
        },
        // tab HHDV
        costTypeId: model?.costType?.id,
        costGroupId: model?.costGroup?.id,

        exchangeRateEnabled: model?.isExchangeRate,

        currencyId: model?.currency?.id,

        rateInfoJson:
          model?.currency?.code === VND_CURRENCY ? undefined : model?.rateInfo,

        purchaseItems: model?.selectedListGoodsServices?.map((item) => ({
          goodsId: item.id,
          branchId: item?.manufacturer?.id,
          unitId: item?.goodsServiceUnit?.id,
          description: item?.description,
          quantity: item?.quantity,
          unitPrice: item?.unitPrice,
          taxId: item?.tax?.id,
          taxAmount: item?.taxAmount || 0,
          otherAmount: item?.otherAmount || 0,
          note: item?.note,
        })),

        //Chỉ định thầu
        contractorAppointment: getContractorAppointment(),
      };

      if (!isEmpty(model.startDate?.[0]) || !isEmpty(model.startDate?.[1])) {
        body.startDate = model.startDate?.[0]
          ? dayjs(model.startDate[0]).format()
          : undefined;
        body.endDate = model.startDate?.[1]
          ? dayjs(model.startDate[1]).format()
          : undefined;
      }

      if (model.id) {
        body.id = model.id;
      }
      if (isAdjust) {
        body.originalPurchaseProposalId = model.originalPurchaseProposalId;
        body.originalDescription = model.originalDescription;
      }

      return body;
    },
    [isAdjust, model]
  );

  const handleSave = React.useCallback(
    ({ isDraft = false }) => {
      const requestBody = handleConvertRequestBodyProposal(isDraft);
      const request = model.id
        ? proposalRepository.update(requestBody)
        : proposalRepository.create(requestBody);

      setLoading(true);
      request.pipe(finalize(() => setLoading(false))).subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              setErrorsModal({
                type: "SUBMIT_FAIL",
                errors: error?.response?.data?.tabErrors || [],
              });
              handleChangeAllField({
                ...convertDataToHaveIndexBeforeValidate(model, [], model, [
                  "startDate",
                ]),
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
    [model, handleGoMaster, translate]
  );

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

  const handleAddNewBasis = () => {
    const newBasis = {
      id: Date.now().toString(),
    };
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })([...(model?.proposalReferences || []), newBasis]);
  };

  const handleCheckAsset = () => {
    proposalRepository.checkAsset([...[], model.assetCode]).subscribe({
      next: (response: any) => {
        const assets = response?.data?.LIST_ASSET_INFO;
        if (assets && assets.length > 0) {
          const assetName = assets[0].ASSET_NAME;
          handleChangeSingleField({
            fieldName: "assetName",
          })(assetName);
        }
      },
      error: () => {
        handleChangeSingleField({
          fieldName: "assetName",
        })("");
      },
    });
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (error.response?.status === 413) {
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

  // show item when not currency VND
  const isShowComponentForeignCurrency = useMemo(() => {
    return (
      !isNil(model.currency) &&
      !isEqual(
        model?.currency?.code?.toLocaleLowerCase(),
        VND_CURRENCY.toLocaleLowerCase()
      )
    );
  }, [model.currency]);

  const getCurrencyInit = async () => {
    try {
      const currencyResult = await paymentRepository
        .getCurrencyTypeList({})
        .toPromise();
      const findCurrencyInit = currencyResult?.find(
        (item) => item.code === VND_CURRENCY
      );
      return findCurrencyInit as Asset;
    } catch (error) {
      return null;
    }
  };

  const handleClickAddCostAllocationLine = () => {
    const newCostAllocation: CostAllocation = {
      id: dayjs().valueOf().toString(),
    };
    let costAllocation = [];
    if (model.costAllocation) {
      costAllocation = [...model.costAllocation, newCostAllocation];
    } else {
      costAllocation = [newCostAllocation];
    }
    handleChangeSingleField({
      fieldName: "costAllocation",
    })(costAllocation);
  };

  const handleOpenModalAutoCostAllocation = async () => {
    let resultCostLines: Project[][] = [];
    if (!isEmpty(model?.costAllocationLines)) {
      resultCostLines = await getCostCenterList(
        model?.costAllocationLines,
        model
      );
    }
    setModalCostAllocation({ type: "CREATE" });
    handleChangeAllField({
      ...model,
      allocationMonth: model?.automaticCostAllocationJson?.allocationMonth,
      businessBranchId: null,
      businessUnitId: null,
      businessDepartmentId: null,
      isPriceExcludingTax:
        model?.automaticCostAllocationJson?.isUniqueUnitPrice,
      projectName: model?.automaticCostAllocationJson?.project,
      projectId: {
        ...model?.automaticCostAllocationJson?.project,
        costLines: !isEmpty(resultCostLines)
          ? resultCostLines[0]?.filter(
              (record) => record?.id === model?.projectId?.id
            )?.[0]?.costLines
          : [],
      },
      costLineName: model?.automaticCostAllocationJson?.costLine,
      estimateIncludesTax: model?.automaticCostAllocationJson?.estimateAmount,
      contingencyIncludesTax:
        model?.automaticCostAllocationJson.contingencyAmount,
      autoCostAllocationDocumentsAttach:
        model?.automaticCostAllocationJson?.lines.map(
          (line: AutoCostAllocationDocumentAttachModel) => ({
            id: line.id || "",
            businessDepartmentId: line.businessDepartment,
            businessUnitId: line.businessUnit,
            businessBranchId: line.businessBranch,
            value: line.employeeCount || line.area,
            percentage: line.rate || 0,
            quantity: line.quantity || 0,
            estimateIncludesTax:
              line.estimateAmount ||
              model.automaticCostAllocationJson.estimateAmount ||
              0,
            contingencyIncludesTax:
              line.contingencyAmount ||
              model.automaticCostAllocationJson.contingencyAmount ||
              0,
          })
        ),
      errors: null,
      position: model.position,
      costDriver: model.costDriver,
    });
  };

  const handleGetListCostCenterByAllocationMonth = () => {
    const month = dayjs(model.allocationMonth).hour(12);
    const filter = {
      allocateMonth: model.allocationMonth && month.toISOString(),
      costCenters: [
        {
          businessBranchId: model?.businessBranchId?.id,
          businessUnitId: model?.businessUnitId?.id,
          businessDepartmentId: model?.businessDepartmentId?.id,
        },
      ],
      type:
        model.costDriver?.code === LIST_TYPE_COST.COST__AREA
          ? 0
          : model.costDriver?.code === LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY
          ? 1
          : null,
    };
    proposalRepository.getListCostCenter(filter).subscribe({
      next: (response) => {
        if (response?.items?.length > 0) {
          let listAutoCostAllocationDocumentsAttach: AutoCostAllocationDocumentAttachModel[] =
            [];
          const dataList = response?.items?.map(
            (item: ProposalGetListCostCenter, index: number) => {
              return {
                id: dayjs().valueOf().toString() + index,
                businessBranchId: item.businessBranch,
                businessUnitId: item.businessUnit,
                businessDepartmentId: item.businessDepartment,
                value: item.value,
                month: item.month,
                year: item.year,
                type: item.type,
              };
            }
          );
          // if (model.autoCostAllocationDocumentsAttach) {
          //   listAutoCostAllocationDocumentsAttach = [
          //     ...model.autoCostAllocationDocumentsAttach,
          //     ...dataList,
          //   ];
          // } else {
          // BA Test confirm, khi chọn lại đơn tháng và tính lại đơn vị chịu phí thì load lại list mới
          listAutoCostAllocationDocumentsAttach = [...dataList];
          // }
          dispatchModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...model,
              autoCostAllocationDocumentsAttach:
                listAutoCostAllocationDocumentsAttach,
            },
          });
        } else {
          notifyToast({
            type: "error",
            message: translate(
              "PP.proposal_no_unit_of_responsibility_satisfied"
            ),
          });
        }
      },
    });
  };

  const getBankExchangeRate = useCallback(
    (currencyCode: string, modelContext: ProposalRequestModel) => {
      if (currencyCode && currencyCode !== VND_CURRENCY) {
        proposalRepository.getBankExchangeRate(currencyCode).subscribe({
          next: (res) => {
            if (res) {
              const rateInfoValue = {
                rate: res.rate,
                date: res.date,
                source: res.source,
              };
              handleChangeAllField({
                ...modelContext,
                rateInfo: {
                  ...modelContext.rateInfo,
                  ...rateInfoValue,
                },
                errors: {
                  ...modelContext?.errors,
                  "rateInfo.rate": null,
                  "rateInfo.date": null,
                  "rateInfo.source": null,
                },
              });
            }
          },
          error: (err) => {
            if (err.response?.data?.errors) {
              handleChangeAllField({
                ...modelContext,
                rateInfo: {
                  ...modelContext.rateInfo,
                  rate: null,
                  date: null,
                  source: null,
                },
                errors: {
                  ...modelContext?.errors,
                  "rateInfo.rate": err.response?.data?.errors?.rate || null,
                },
              });
            }
          },
        });
      }
    },
    [model.currency?.code, model?.isExchangeRate]
  );

  const changeListSelectedGood = useCallback(
    (data: GoodServiceExtend) => {
      const listSelectedGood = model?.selectedListGoodsServices || [];
      const index = listSelectedGood.findIndex(
        (item) => item?.renderId === data?.renderId
      );
      if (isEqual(index, -1)) {
        listSelectedGood.push(data);
      } else {
        listSelectedGood[index] = data;
      }

      const roundNum = detectIntegerCurrency(model?.currency?.code)
        ? 0
        : ROUND_NUM_NOT_VND;

      const totalEstimateAmountDefault = listSelectedGood?.reduce(
        (prev: number, curr: GoodServiceExtend) => {
          return prev + roundTo(curr?.totalAmount || 0, roundNum);
        },
        0
      );

      const totalEstimateAmountExchangeRateDefault = listSelectedGood?.reduce(
        (prev: number, curr: GoodServiceExtend) => {
          return (
            prev +
            calculate([
              roundTo(
                addNumbers(
                  curr?.amountBeforeTax || 0,
                  curr?.taxAmount || 0,
                  curr?.otherAmount || 0
                ),
                roundNum
              ),
              model?.rateInfo?.rate,
            ]).value
          );
        },
        0
      );
      const totalEstimateAmountTmp = isEqual(
        model?.currency?.code,
        VND_CURRENCY
      )
        ? totalEstimateAmountDefault
        : totalEstimateAmountExchangeRateDefault;

      handleChangeAllField({
        ...model,
        selectedListGoodsServices: listSelectedGood,
        totalEstimateAmount: totalEstimateAmountTmp,
        errors: {
          ...model?.errors,
          [`purchaseItems[${index}].branchId`]: null,
          [`purchaseItems[${index}].quantity`]: null,
        },
      });
    },
    [model]
  );

  const handleUpdateTypeModal = (type: MODEL_CONFIRM_TYPE | null) => {
    setModalConfirm(type);
  };

  const handleApproveProposal = () => {
    setLoading(true);
    proposalRepository
      .approve(model.id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          setModalConfirm(null);
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const handleRejectProposal = () => {
    setLoading(true);
    proposalRepository
      .reject(model.id, { reason: model.reason })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          setModalConfirm(null);
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              handleChangeAllField({
                ...model,
                errors: error.response?.data?.errors,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
      });
  };

  const handleReturnProposal = () => {
    setLoading(true);
    proposalRepository
      .return(model.id, { reason: model.reason })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          if (error.response && error.response.status === 400)
            if (error.response?.data?.type === "Validate") {
              handleChangeAllField({
                ...model,
                errors: error.response?.data?.errors,
              });
            } else {
              notifyToast({
                message: error.response?.data?.message,
                type: "error",
              });
            }
        },
      });
  };

  const handleValidateError = (
    error: AxiosError,
    newModel: ProposalRequestModel
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
      }
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleCloseProposal = () => {
    setLoading(true);
    proposalRepository
      .closeProposal(model.id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          handleUpdateTypeModal(null);
          handleValidateError(error, model);
        },
      });
  };

  const handleHideModal = () => {
    notifyToast();
    setModelSelected(null);
    handleGoMaster();
  };

  const handleUpdateBudgetError = (error: AxiosError) => {
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
  const deleteProposal = (budgetId: string, reason: string) => {
    proposalRepository
      .deleteProposal(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateBudgetError,
      });
  };

  // Cancel budget request
  const cancelProposal = (budgetId: string, reason: string) => {
    proposalRepository
      .cancelProposal(budgetId, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdateBudgetError,
      });
  };

  const handleApplyButtonInConfirmModal = (model: Proposal, reason: string) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelProposal(model?.id, reason);
        return;
      case ConfirmModalType.DELETE:
        deleteProposal(model?.id, reason);
        return;
    }
  };

  const handleUploadGoodsServicesFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit?: boolean,
    purchaseItems?: PurchaseItem[]
  ) => {
    const file = event.target.files?.[0];

    const MAX_FILE_LENGTH = 30; // Mb
    const BYTE_VALUE = 1024;
    const MEGABYTE = multiply(BYTE_VALUE, BYTE_VALUE);

    if (file && file.size > MAX_FILE_LENGTH * MEGABYTE) {
      notifyToast({
        message: translate("CM.input_file_size_validation", {
          maxSize: MAX_FILE_LENGTH,
        }),
        type: "error",
      });
      event.target.value = "";
    } else if (file) {
      handleChangeSingleField({
        fieldName: "isLoadingGoodsServicesUpload",
      })(true);
      subscriptionRef.current = proposalRepository
        .uploadFileGoodsServices(
          file,
          model?.currency?.code,
          model?.costGroup?.id,
          model?.originalPurchaseProposalId,
          isEdit,
          purchaseItems
        )
        .subscribe({
          next: (response: UploadFileGoodsServices) => {
            handleListImportGoodsServices(response);
            notifyToast({
              message: translate("PP.text_success_upload_list_goods"),
              type: "success",
            });
          },
          error: (error: AxiosError) => {
            if (error.response && error.response.status === 400) {
              setErrorModalImport({
                show: true,
                message: error?.response?.data?.message,
              });
            }
            handleChangeSingleField({
              fieldName: "isLoadingGoodsServicesUpload",
            })(false);
          },
        });
      event.target.value = "";
    }
  };

  const handleCancelUploadGoodsServicesFile = () => {
    handleChangeSingleField({
      fieldName: "isLoadingGoodsServicesUpload",
    })(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  };

  const handleDownloadGoodsServicesTemplate = () => {
    proposalRepository
      .downloadFile({
        CostGroupId: model?.costGroup?.id,
        CostTypeId: model?.costType?.id,
      })
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "template.xlsx");
        },
      });
  };

  const handleListImportGoodsServices = (response: UploadFileGoodsServices) => {
    const goodsIdCount: Record<string, number> = {};

    const responseListGoods: GoodServiceExtend[] = response?.purchaseItems?.map(
      (item) => {
        const amountBeforeTax = calculate([item?.quantity, item?.unitPrice]);

        const totalAmount = addNumbers(
          amountBeforeTax.value,
          item?.taxAmount,
          item?.otherAmount
        );

        if (!goodsIdCount?.[item.goodsId]) {
          goodsIdCount[item.goodsId] = 0;
        }
        const renderId = `${item.goodsId}@${goodsIdCount[item.goodsId]}`;
        goodsIdCount[item.goodsId]++;

        return {
          id: item?.goodsId,
          code: item?.code,
          name: item?.name,
          goodsServicesCategory: item?.category,
          costGroup: model?.costGroup,
          costType: model?.costType,
          goodsServiceUnit: item?.unit,
          unitPrice: item?.unitPrice,
          tax: item?.tax,
          note: item?.note,
          description: item?.description,
          taxAmount: item?.taxAmount,
          totalAmount: totalAmount,
          otherAmount: item?.otherAmount,
          quantity: item?.quantity,
          contractPriceMin: item?.unitPrice,
          manufacturer: item?.branch,
          amountBeforeTax: amountBeforeTax.value,
          renderId: renderId,
          originalTotalAmount: isAdjust && item?.originalTotalAmount,
          notEdit: isAdjust && item?.isPurchaseItemNotEdit,
        };
      }
    );

    const roundNum = detectIntegerCurrency(model?.currency?.code)
      ? 0
      : ROUND_NUM_NOT_VND;

    const totalEstimateAmountDefault = responseListGoods?.reduce(
      (prev: number, curr: GoodServiceExtend) => {
        return prev + roundTo(curr?.totalAmount || 0, roundNum);
      },
      0
    );

    const totalEstimateAmountExchangeRateDefault = responseListGoods?.reduce(
      (prev: number, curr: GoodServiceExtend) => {
        return (
          prev +
          calculate([
            roundTo(
              addNumbers(
                curr?.amountBeforeTax || 0,
                curr?.taxAmount || 0,
                curr?.otherAmount || 0
              ),
              roundNum
            ),
            model?.rateInfo?.rate,
          ]).value
        );
      },
      0
    );
    const totalEstimateAmountTmp = isEqual(model?.currency?.code, VND_CURRENCY)
      ? totalEstimateAmountDefault
      : totalEstimateAmountExchangeRateDefault;

    handleChangeAllField({
      ...model,
      totalEstimateAmount: totalEstimateAmountTmp,
      selectedListGoodsServices: responseListGoods,
      isLoadingGoodsServicesUpload: false,
    });
  };

  const handleClickOriginalCode = (id: string) => {
    window.open(`${PROPOSAL_DETAIL_ROUTE}/${id}`, "_blank");
  };

  const handleUpdateListCostCenterByAllocationMonth = () => {
    if (!model?.allocationMonth) {
      return handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          allocationMonth: translate("CM.input_require_validation"),
        },
      });
    }
    const listCostCenter: CostCenters[] =
      model.autoCostAllocationDocumentsAttach &&
      model.autoCostAllocationDocumentsAttach.map(
        (item: AutoCostAllocationDocumentAttachModel) => {
          return {
            businessBranchId: String(item.businessBranchId?.id) || null,
            businessUnitId: String(item.businessUnitId?.id) || null,
            businessDepartmentId: String(item.businessDepartmentId?.id) || null,
          };
        }
      );
    const month = dayjs(model.allocationMonth).hour(12);
    const filter = {
      allocateMonth: model.allocationMonth && month.toISOString(),
      costCenters: listCostCenter,
      type:
        model.costDriver?.code === LIST_TYPE_COST.COST__AREA
          ? 0
          : model.costDriver?.code === LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY
          ? 1
          : null,
    };
    if (
      model?.autoCostAllocationDocumentsAttach?.length > 0 &&
      model.allocationMonth
    ) {
      proposalRepository.getListCostCenter(filter).subscribe({
        next: (response) => {
          if (response?.items?.length > 0) {
            let listAutoCostAllocationDocumentsAttach: AutoCostAllocationDocumentAttachModel[] =
              [];
            if (model.autoCostAllocationDocumentsAttach) {
              const dataList: AutoCostAllocationDocumentAttachModel[] =
                model.autoCostAllocationDocumentsAttach.map(
                  (item: AutoCostAllocationDocumentAttachModel) => {
                    const matchedItem = response.items.find(
                      (itemRes: ProposalListCostCenterAllocation) =>
                        item?.businessBranchId?.id ===
                          itemRes?.businessBranch?.id &&
                        item?.businessDepartmentId?.id ===
                          itemRes?.businessDepartment?.id &&
                        item?.businessUnitId?.id === itemRes?.businessUnit?.id
                    );

                    return matchedItem
                      ? {
                          id: item.id,
                          businessBranchId: item.businessBranchId,
                          businessUnitId: item.businessUnitId,
                          businessDepartmentId: item.businessDepartmentId,
                          value: matchedItem.value,
                        }
                      : {
                          id: item.id,
                          businessBranchId: item.businessBranchId,
                          businessUnitId: item.businessUnitId,
                          businessDepartmentId: item.businessDepartmentId,
                        };
                  }
                );
              listAutoCostAllocationDocumentsAttach = [...dataList];
            }
            dispatchModel({
              type: GeneralActionEnum.SET,
              payload: {
                ...model,
                autoCostAllocationDocumentsAttach:
                  listAutoCostAllocationDocumentsAttach,
              },
            });
          }
        },
        error: (error) => {
          // eslint-disable-next-line no-console
          console.log("Error get list cost center: ", error);
        },
      });
    }
  };

  const isRowDisabled = (record: AutoCostAllocationDocumentAttachModel) => {
    const line = model?.costAllocationLines?.find(
      (line: CostAllocation) =>
        line.businessBranch?.id === record?.businessBranchId?.id &&
        line.businessUnit?.id === record?.businessUnitId?.id &&
        line.businessDepartment?.id === record?.businessDepartmentId?.id
    );

    return line ? line.usedAmount > 0 : false;
  };

  const getCostCenterList = async (
    project: CostAllocation[],
    proposalDetail: ProposalRequestModel
  ) => {
    const listAPi = project?.map((record) => {
      return proposalRepository?.projectByCostCenter({
        name: "",
        businessBranchId: record?.businessBranchId,
        businessUnitId: record?.businessUnitId,
        businessDepartmentId: record?.businessDepartmentId,
        isProject: !isEmpty(proposalDetail?.purchasePurpose?.projectId),
        budgetId:
          proposalDetail?.purchasePurpose?.type ===
          SHOPPING_PURPOSES.ACCORDING_PROJECT
            ? proposalDetail?.purchasePurpose?.projectId
            : "",
      });
    });

    return await lastValueFrom(forkJoin(listAPi));
  };

  const valuesContext: ProposalCreateModel = {
    model,
    activeTabKey,
    title,
    setActiveTabKey,
    dispatchModel,
    loading,
    breadcrumbs,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleChangeDateField,
    handleSave,
    handleConvertRequestBodyProposal,
    handleDownloadFileAttached,
    handleChangeAllField,
    setLoading,
    notifyToast,
    handleGoMaster,
    handleAddNewBasis,
    handleCheckAsset,
    handleUploadAttachmentError,
    getBankExchangeRate,
    isShowComponentForeignCurrency,
    changeListSelectedGood,
    handleClickAddCostAllocationLine,
    handleOpenModalAutoCostAllocation,
    modalCostAllocation,
    setModalCostAllocation,
    handleGetListCostCenterByAllocationMonth,
    modalConfirm,
    handleUpdateTypeModal,
    handleApproveProposal,
    handleRejectProposal,
    handleReturnProposal,
    handleCloseProposal,
    modelSelected,
    setModelSelected,
    isLoadingModal,
    handleApplyButtonInConfirmModal,
    handleUploadGoodsServicesFile,
    handleCancelUploadGoodsServicesFile,
    handleDownloadGoodsServicesTemplate,
    handleClickOriginalCode,
    errorModalImport,
    setErrorModalImport,
    errorsModal,
    setErrorsModal,
    handleUpdateListCostCenterByAllocationMonth,
    isRowDisabled,
    exchangeRateNumberType,
  };

  return {
    ...valuesContext,
    // not context
    tabRepositories,
  };
}
