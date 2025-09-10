import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { IntegrateECM, IntegrateERP } from "components";
import { ACCESS_TOKEN, listStatusEnum } from "config/const";
import {
  APP_OVERVIEW,
  PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE,
  PAYMENT_CREATE_ADVANCE_ROUTE,
  PAYMENT_CREATE_DEPOSIT_ROUTE,
  PAYMENT_CREATE_EXPENSE_ROUTE,
  PAYMENT_CREATE_ROUTE,
  PAYMENT_MASTER_ROUTE,
} from "config/route-const";
import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { roundTo } from "core/helpers/number";
import { integrateRepository } from "core/repositories/IntegrateRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralActionEnum } from "core/services/service-types";
import saveAs from "file-saver";
import { get, isEmpty, isEqual, isUndefined } from "lodash";
import {
  COST_PERIODS_ENUM,
  listAttachDocumentInitial,
  listPuchasingDocumentInitial,
  ParamsDownloadMatchingFDA,
  PaymentDetailModel,
  PaymentDetailTypeModel,
  PaymentListInvoiceDetail,
  RepoStateDetail,
  STATUS_PAYMENT_REQUEST,
  TYPE_OF_PAYMENT_DETAIL_TYPE,
  TYPE_OF_PROPOSAL,
} from "models/Payment";
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
import { useAppSelector } from "rtk/useRedux";
import { finalize, forkJoin } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import InvoiceListTabView from "../PaymentCreate/Components/InvoiceListTabView/InvoiceListTabView";
import { getPaymentRequestTypeName } from "../PaymentCreate/PaymentUtils";
import { paymentRepository } from "../PaymentRepository";
import { EConfirmType } from "./Components/ModalConfirmPaymentRequest/ModalConfirmPaymentRequest";
import AcountingEntriesTab from "./PaymentDetailTypes/AccountingTab/AccountingEntriesTab/AcountingEntriesTab";
import AccountingGeneralInfoTab from "./PaymentDetailTypes/AccountingTab/AccountingGeneralInfoTab/AccountingGeneralInfoTab";
import AdvanceGeneralInfoDetailTab from "./PaymentDetailTypes/AdvanceTab/AdvanceGeneralInfoDetailTab/AdvanceGeneralInfoDetailTab";
import DepositGeneralInfoTab from "./PaymentDetailTypes/DepositTab/DepositGeneralInfoDetailTab/DepositGeneralInfoDetailTab";
import ExpenseCostAllocationTab from "./PaymentDetailTypes/ExpenseReversalTab/ExpenseCostAllocationDetailTab/ExpenseCostAllocationDetailTab";
import ExpenseReversalDetailTab from "./PaymentDetailTypes/ExpenseReversalTab/ExpenseReversalDetailTab/ExpenseReversalDetailTab";
import ExpenseReversalGeneralInfoTab from "./PaymentDetailTypes/ExpenseReversalTab/ExpenseReversalGeneralInfoDetailTab/ExpenseReversalGeneralInfoDetailTab";
import PaymentCostAllocationTab from "./PaymentDetailTypes/PaymentTab/PaymentCostAllocationTab/PaymentCostAllocationTab";
import PaymentGeneralDetailInfoTab from "./PaymentDetailTypes/PaymentTab/PaymentGeneralInfoDetailTab/PaymentGeneralInfoDetailTab";
import ReimbursementExpenseReversalTabView from "./PaymentDetailTypes/PaymentTab/ReimbursementExpenseReversalTabView/ReimbursementExpenseReversalTabView";

export const PaymentDetailHookContext = createContext<PaymentDetailModel>({
  model: new PaymentDetailTypeModel(),
  modelInvoice: [],
  setModelInvoice: null,
  translate: null,
  listPuchasingDocument: [],
  listAttachDocument: [],
  loading: false,
  breadcrumbs: [],
  setLoading: null,
  tabRepositories: [],
  formatNumberToCurrency: null,
  renderPaymentMethod: null,
  renderInvoiceType: null,
  renderCostPeriod: null,
  handleDownloadFileAttached: null,
  modal: null,
  setModalType: null,
  handleChangeSelectField: null,
  handleChangeSingleField: null,
  handleApprovePaymentRequest: null,
  handleRejectPaymentRequest: null,
  handleReturnPaymentRequest: null,
  handleDirectToEditPage: null,
  handleDeletePaymentRequest: null,
  handleCancelPaymentRequest: null,
  handleChangeAllField: null,
  handleDownloadFileMatchingInvoice: null,
});

type props = {
  isDetail?: boolean;
};

enum EApproveType {
  RETURN = "0",
  REJECT = "1",
}

const APPROVE_TYPE_PARAM = "approveType";
const IS_VIEW_PARAM = "isView";

export function usePaymentDetailHook({ isDetail = false }: props) {
  const [translate] = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const history = useHistory();
  const profile = useAppSelector((state) => state.profile);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const path = history.location.pathname;

  const { id: idDetail }: any = useParams();
  const [tabRepositories, setTabRepositories] =
    useState<RepoStateDetail[]>(null);
  const [modalType, setModalType] = useState<string>("NONE");

  const { model, dispatch: dispatchModel } =
    detailService.useModel<PaymentDetailTypeModel>(PaymentDetailTypeModel);

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const isVNDOrJPY = useMemo(
    () =>
      isEqual(
        model?.paymentDetailInfomation?.currencyDTO?.code,
        VND_CURRENCY_UNIT
      ) ||
      isEqual(
        model?.paymentDetailInfomation?.currencyDTO?.code,
        JPY_CURRENCY_UNIT
      ),
    [model?.paymentDetailInfomation?.currencyDTO?.code]
  );

  const onConfirmSuccess = useCallback(() => {
    setModalType("NONE");
    notifyToast();
    history.push(PAYMENT_MASTER_ROUTE);
  }, [history, setModalType, notifyToast]);

  const onConfirmFailure = (error: AxiosError) => {
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
  };

  function getLastPath(path: string): string {
    const parts = path.split("/");
    return "/" + parts[parts.length - 2];
  }
  const location = useLocation();
  const statusPayment = (location?.state as { statusPayment: string })
    ?.statusPayment;

  const isView = new URLSearchParams(history.location.search).get(
    IS_VIEW_PARAM
  );

  const getPaymentDetail = () => {
    setLoading(true);
    const isApprovingPaymentRequest =
      isEqual(statusPayment, STATUS_PAYMENT_REQUEST.WAITING_FOR_APPROVAL) ||
      isUndefined(statusPayment);

    forkJoin({
      paymentDetail: paymentRepository.getPaymentDetail(
        idDetail,
        !isApprovingPaymentRequest || (isView === "true" ? true : false)
      ),
      erpData: integrateRepository.getListERP(idDetail),
      ecmData: integrateRepository.getListECM(idDetail),
    })
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response) => {
          handleChangeAllField({
            ...model,
            paymentDetailInfomation: response.paymentDetail,
            listERP: response.erpData,
            listECM: response.ecmData,
          });
        },
        error: (error) => {
          console.log("Error fetching data:", error);
          setLoading(false);
        },
      });
  };

  const handleGetIntegrationData = () => {
    getPaymentDetail();
  };

  useEffect(() => {
    if (idDetail) {
      handleGetIntegrationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDetail]);

  const handleApprovePaymentRequest = () => {
    setLoading(true);
    paymentRepository
      .approvePaymentRequest(model?.paymentDetailInfomation?.id)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          onConfirmSuccess();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const handleRejectPaymentRequest = () => {
    setLoading(true);
    paymentRepository
      .declinePaymentRequest(model?.paymentDetailInfomation?.id, model?.reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: onConfirmSuccess,
        error: onConfirmFailure,
      });
  };

  const handleReturnPaymentRequest = () => {
    setLoading(true);
    paymentRepository
      .returnPaymentRequest(model?.paymentDetailInfomation?.id, model?.reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: onConfirmSuccess,
        error: onConfirmFailure,
      });
  };

  const handleDirectToEditPage = () => {
    const paymentRequestType =
      model?.paymentDetailInfomation?.paymentRequestType;

    switch (paymentRequestType?.paymentGroup) {
      case TYPE_OF_PROPOSAL.PAYMENT:
        return history.push(`${PAYMENT_CREATE_ROUTE}/${idDetail}`);
      case TYPE_OF_PROPOSAL.ADVANCE:
        return history.push(`${PAYMENT_CREATE_ADVANCE_ROUTE}/${idDetail}`);
      case TYPE_OF_PROPOSAL.EXPENSE:
        return history.push(`${PAYMENT_CREATE_EXPENSE_ROUTE}/${idDetail}`);
      case TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY:
        return history.push(
          `${PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}/${idDetail}`
        );
      case TYPE_OF_PROPOSAL.DEPOSIT:
        return history.push(`${PAYMENT_CREATE_DEPOSIT_ROUTE}/${idDetail}`);
      default:
        break;
    }
  };

  const handleDeletePaymentRequest = () => {
    setLoading(true);
    paymentRepository
      .deletePayment(model?.paymentDetailInfomation?.id, model?.reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: onConfirmSuccess,
        error: onConfirmFailure,
      });
  };

  const handleCancelPaymentRequest = () => {
    setLoading(true);
    paymentRepository
      .cancelPayment(model?.paymentDetailInfomation?.id, model?.reason)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: onConfirmSuccess,
        error: onConfirmFailure,
      });
  };

  const processAfterFeedbackSubmission = () => {
    if (
      isEqual(
        model?.paymentDetailInfomation?.status,
        get(listStatusEnum, `[${numberConstants.ONE}].id`)
      )
    ) {
      getPaymentDetail();
    }
  };

  useEffect(() => {
    const number =
      parseFloat(model?.paymentDetailInfomation?.rateInfo?.rate.toString()) ||
      0;
    const result =
      number !== 0
        ? number * model?.paymentDetailInfomation?.amount
        : model?.paymentDetailInfomation?.amount;
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        foreignCurrencyAmount: result,
      },
    });
  }, [model?.paymentDetailInfomation]);

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

  const handlePushIntegrateERP = () => {
    setLoading(true);
    const tokenLogin = localStorage.getItem(ACCESS_TOKEN);
    const param = {
      paymentRequestId: idDetail,
      userEmail: profile?.account?.email,
      tokenLogin: tokenLogin,
    };
    integrateRepository
      .pushIntegrateERP(param)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleGetIntegrationData();
        },
        error: (error) => {
          console.log("Error: ", error);
        },
      });
  };

  const handlePushIntegrateECM = () => {
    setLoading(true);
    const tokenLogin = localStorage.getItem(ACCESS_TOKEN);
    const param = {
      paymentRequestId: idDetail,
      userEmail: profile?.account?.email,
      tokenLogin: tokenLogin,
    };
    integrateRepository
      .pushIntegrateECM(param)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          handleGetIntegrationData();
        },
        error: (error) => {
          console.log("Error: ", error);
        },
      });
  };

  const handleUpdateStatusERP = () => {
    integrateRepository.updateStatusERP(idDetail).subscribe({
      next: () => {
        handleGetIntegrationData();
      },
      error: (error) => {
        console.log("Error: ", error);
      },
    });
  };

  const tabPaymentRepositories = React.useMemo<RepoStateDetail[]>(() => {
    const paymentTab = [
      {
        tabKey: "0",
        tabTitle: translate("PM.tab_general_information"),
        children: <PaymentGeneralDetailInfoTab />,
      },
      {
        tabKey: "1",
        tabTitle: translate("PM.tab_list_invoice"),
        children: <InvoiceListTabView />,
      },
      {
        tabKey: "2",
        tabTitle: translate("PM.tab_cost_Allocation"),
        children: <PaymentCostAllocationTab />,
      },
      {
        tabKey: "3",
        tabTitle: translate("PM.tab_reimbursement_expense_reversal"),
        children: <ReimbursementExpenseReversalTabView />,
      },
    ];

    if (
      model?.paymentDetailInfomation &&
      !model?.paymentDetailInfomation?.canApproved &&
      !model?.paymentDetailInfomation?.canDeclined &&
      !model?.paymentDetailInfomation?.canGiveBack
    ) {
      paymentTab.push(
        {
          tabKey: "4",
          tabTitle: translate("PM.payment_ERP_integration"),
          children: (
            <IntegrateERP
              listERP={model?.listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={handleUpdateStatusERP}
            />
          ),
        },
        {
          tabKey: "5",
          tabTitle: translate("PM.payment_ECM_integration"),
          children: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={model?.listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return paymentTab;
  }, [translate, model]);

  //Đề nghị Tạm ứng
  const tabAdvanceRepositories = React.useMemo<RepoStateDetail[]>(() => {
    const advanceTab = [
      {
        tabKey: "0",
        tabTitle: translate("PM.tab_general_information"),
        children: <AdvanceGeneralInfoDetailTab />,
      },
      {
        tabKey: "1",
        tabTitle: translate("PM.tab_list_invoice"),
        children: <InvoiceListTabView />,
      },
      {
        tabKey: "2",
        tabTitle: translate("PM.tab_cost_Allocation"),
        children: <PaymentCostAllocationTab />,
      },
    ];

    if (
      model?.paymentDetailInfomation &&
      !model?.paymentDetailInfomation?.canApproved &&
      !model?.paymentDetailInfomation?.canDeclined &&
      !model?.paymentDetailInfomation?.canGiveBack
    ) {
      advanceTab.push(
        {
          tabKey: "3",
          tabTitle: translate("PM.payment_ERP_integration"),
          children: (
            <IntegrateERP
              listERP={model?.listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={handleUpdateStatusERP}
            />
          ),
        },
        {
          tabKey: "4",
          tabTitle: translate("PM.payment_ECM_integration"),
          children: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={model?.listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return advanceTab;
  }, [translate, model]);

  //Đề nghị Dự chi
  const tabExpenseRepositories = React.useMemo<RepoStateDetail[]>(() => {
    const expenseTab = [
      {
        tabKey: "0",
        tabTitle: translate("PM.tab_general_information"),
        children: <ExpenseReversalGeneralInfoTab />,
      },
      {
        tabKey: "1",
        tabTitle: translate("PM.tab_list_invoice"),
        children: <InvoiceListTabView />,
      },
      {
        tabKey: "2",
        tabTitle: translate("PM.tab_cost_Allocation"),
        children: <ExpenseCostAllocationTab />,
      },
      {
        tabKey: "3",
        tabTitle: translate("PM.tab_expense_reversal"),
        children: <ExpenseReversalDetailTab />,
      },
    ];

    if (
      model?.paymentDetailInfomation &&
      !model?.paymentDetailInfomation?.canApproved &&
      !model?.paymentDetailInfomation?.canDeclined &&
      !model?.paymentDetailInfomation?.canGiveBack
    ) {
      expenseTab.push(
        {
          tabKey: "4",
          tabTitle: translate("PM.payment_ERP_integration"),
          children: (
            <IntegrateERP
              listERP={model?.listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={handleUpdateStatusERP}
            />
          ),
        },
        {
          tabKey: "5",
          tabTitle: translate("PM.payment_ECM_integration"),
          children: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={model?.listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return expenseTab;
  }, [translate, model]);

  //Đề nghị Hạch toán
  const tabAccountingEntryRepositories = React.useMemo<
    RepoStateDetail[]
  >(() => {
    const accountingEntryTab = [
      {
        tabKey: "0",
        tabTitle: translate("PM.tab_general_information"),
        children: <AccountingGeneralInfoTab />,
      },
      {
        tabKey: "1",
        tabTitle: translate("PM.accounting_entry_title_tab"),
        children: <AcountingEntriesTab />,
      },
    ];

    if (
      model?.paymentDetailInfomation &&
      !model?.paymentDetailInfomation?.canApproved &&
      !model?.paymentDetailInfomation?.canDeclined &&
      !model?.paymentDetailInfomation?.canGiveBack
    ) {
      accountingEntryTab.push(
        {
          tabKey: "2",
          tabTitle: translate("PM.payment_ERP_integration"),
          children: (
            <IntegrateERP
              listERP={model?.listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={handleUpdateStatusERP}
            />
          ),
        },
        {
          tabKey: "3",
          tabTitle: translate("PM.payment_ECM_integration"),
          children: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={model?.listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return accountingEntryTab;
  }, [translate, model?.paymentDetailInfomation]);

  //Đề nghị Đặt cọc
  const tabDepositRepositories = React.useMemo<RepoStateDetail[]>(() => {
    const depositTab = [
      {
        tabKey: "0",
        tabTitle: translate("PM.payment_deposit_information"),
        children: <DepositGeneralInfoTab />,
      },
    ];

    if (
      model?.paymentDetailInfomation &&
      !model?.paymentDetailInfomation?.canApproved &&
      !model?.paymentDetailInfomation?.canDeclined &&
      !model?.paymentDetailInfomation?.canGiveBack
    ) {
      depositTab.push(
        {
          tabKey: "1",
          tabTitle: translate("PM.payment_ERP_integration"),
          children: (
            <IntegrateERP
              listERP={model?.listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={handleUpdateStatusERP}
            />
          ),
        },
        {
          tabKey: "2",
          tabTitle: translate("PM.payment_ECM_integration"),
          children: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={model?.listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return depositTab;
  }, [translate, model?.paymentDetailInfomation]);

  useEffect(() => {
    const key = getLastPath(path);
    switch (key) {
      case TYPE_OF_PAYMENT_DETAIL_TYPE.PAYMENT:
        setTabRepositories(tabPaymentRepositories);
        break;
      case TYPE_OF_PAYMENT_DETAIL_TYPE.ADVANCE:
        setTabRepositories(tabAdvanceRepositories);
        break;
      case TYPE_OF_PAYMENT_DETAIL_TYPE.EXPENSE:
        setTabRepositories(tabExpenseRepositories);
        break;
      case TYPE_OF_PAYMENT_DETAIL_TYPE.ACCOUNTING_ENTRY:
        setTabRepositories(tabAccountingEntryRepositories);
        break;
      case TYPE_OF_PAYMENT_DETAIL_TYPE.DEPOSIT:
        setTabRepositories(tabDepositRepositories);
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, model?.paymentDetailInfomation, model?.listERP]);

  useEffect(() => {
    const approveTypeFromSearchParam = new URLSearchParams(
      history.location.search
    ).get(APPROVE_TYPE_PARAM);
    if (isEqual(approveTypeFromSearchParam, EApproveType.RETURN)) {
      setModalType(EConfirmType.RETURN);
    }

    if (isEqual(approveTypeFromSearchParam, EApproveType.REJECT)) {
      setModalType(EConfirmType.REJECT);
    }
  }, [history]);

  const renderPaymentMethod = () => {
    switch (model?.paymentDetailInfomation?.paymentMethod) {
      case 0:
        return translate("PM.txt_bank_transfer");
      case 1:
        return translate("PM.txt_bank_transfer_reimbursement");
      case 2:
        return translate("PM.txt_bank_reimbursement");
      case 3:
        return translate("PM.no_payment");
      default:
        break;
    }
  };

  const renderInvoiceType = () => {
    switch (model?.paymentDetailInfomation?.invoiceType) {
      case 0:
        return translate("PM.old_invoice");
      case 1:
        return translate("PM.new_invoice");
      default:
        break;
    }
  };

  const renderCostPeriod = () => {
    switch (model?.paymentDetailInfomation?.costPeriod) {
      case COST_PERIODS_ENUM.ONCE:
        return `1 ${translate("PM.payment_time")}`;
      case COST_PERIODS_ENUM.ONE_MONTH:
        return `1 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.THREE_MONTH:
        return `3 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.SIX_MONTH:
        return `6 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.NINE_MONTH:
        return `9 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.TWELVE_MONTH:
        return `12 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.TWENTY_FOUR_MONTH:
        return `24 ${translate("PM.time_month_label")}`;
      case COST_PERIODS_ENUM.THIRTY_SIX_MONTH:
        return `36 ${translate("PM.time_month_label")}`;
      default:
        break;
    }
  };

  const renderTitleHeader = () => {
    if (model?.paymentDetailInfomation) {
      return `${translate("PM.payment_vote")}
            ${getPaymentRequestTypeName(
              model?.paymentDetailInfomation?.paymentRequestType?.name
            )}
            ${model?.paymentDetailInfomation?.code}`;
    }
  };

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_payment"),
      path: PAYMENT_MASTER_ROUTE,
    },
    {
      name: renderTitleHeader(),
    },
  ];

  const formatNumberToCurrency = (value: number, roundNumber?: number) => {
    if (!value) {
      return "0";
    }
    if (roundNumber) {
      roundNumber = roundTo(value, roundNumber);
    }
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1] ? parts[1].replace(".", ",") : "";
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
  };

  const listPuchasingDocument = listPuchasingDocumentInitial;
  const listAttachDocument = listAttachDocumentInitial;

  const [modelInvoice, setModelInvoice] = useState<PaymentListInvoiceDetail[]>([
    {
      id: 1,
      billExplanation: "Chủ trương",
      netAmount: "11.000.000",
      taxRate: "10",
      taxAmount: "1.000.000.000",
      totalAmount: "11.000.000.000",
      paymentAmount: "11.000.000.000",
      retainAmount: "0",
    },
  ]);

  const handleDownloadFileMatchingInvoice = () => {
    const params: ParamsDownloadMatchingFDA = {
      invoiceMatchingResultIds:
        model?.paymentDetailInfomation?.invoiceMatchingResultIds,
      contractId: model?.paymentDetailInfomation?.paymentInheritanceId,
    };
    setLoading(true);
    paymentRepository.getFileMatchingFDA(params).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const nameFile = `result_matching_${uuidv4()}.xlsx`;
        saveAs(blob, nameFile);
        setLoading(false);
      },
      error: (error) => {
        setLoading(false);
        const errorMessage = isEmpty(error?.response?.data?.message)
          ? translate("CM.message_system_error")
          : error?.response?.data?.message;

        notifyToast({
          type: "error",
          message: errorMessage,
        });
      },
    });
  };

  const valuesContext: PaymentDetailModel = {
    model,
    modelInvoice,
    setModelInvoice,
    translate,
    breadcrumbs,
    listPuchasingDocument,
    listAttachDocument,
    loading,
    isVNDOrJPY,
    setLoading,
    tabRepositories,
    formatNumberToCurrency,
    renderPaymentMethod,
    renderInvoiceType,
    renderCostPeriod,
    handleDownloadFileAttached,
    modal: modalType,
    setModalType,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
    handleApprovePaymentRequest,
    handleRejectPaymentRequest,
    handleReturnPaymentRequest,
    handleDirectToEditPage,
    handleDeletePaymentRequest,
    handleCancelPaymentRequest,
    renderTitleHeader,
    processAfterFeedbackSubmission,
    handleDownloadFileMatchingInvoice,
  };

  return {
    ...valuesContext,
  };
}
