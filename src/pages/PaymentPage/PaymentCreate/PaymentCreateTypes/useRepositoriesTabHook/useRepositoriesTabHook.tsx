import _ from "lodash";
import {
  PaymentCreateModel,
  RepoStateDetail,
  TAX_TYPE_ENUM,
  TYPE_OF_PAYMENT_TYPE,
} from "models/Payment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import InvoiceListTab from "../../Components/InvoiceListTab/InvoiceListTab";
import TabName from "../../Components/TabName/TabName";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import AccountingEntryGenerationInfoTab from "../AccountingRequest/AccountingEntryGenerationInfoTab/AccountingEntryGenerationInfoTab";
import AccountingEntryTab from "../AccountingRequest/AccountingEntryTab/AccountingEntryTab";
import AdvanceGenerationInfoTab from "../AdvanceRequest/AdvanceGenerationInfoTab/AdvanceGenerationInfoTab";
import ExpenseCostAllocationTab from "../ExpenseRequest/ExpenseCostAllocationTab/ExpenseCostAllocationTab";
import ExpenseGenerationInfoTab from "../ExpenseRequest/ExpenseGenerationInfoTab/ExpenseGenerationInfoTab";
import ExpenseReversalTab from "../ExpenseRequest/ExpenseReversalTab/ExpenseReversalTab";
import PaymentCostAllocationTab from "../PaymentRequest/PaymentCostAllocationTab/PaymentCostAllocationTab";
import PaymentGenerationInfoTab from "../PaymentRequest/PaymentGenerationInfoTab/PaymentGenerationInfoTab";
import ReimbursementExpenseReversalTab from "../PaymentRequest/ReimbursementExpenseReversalTab/ReimbursementExpenseReversalTab";
import { IntegrateECM, IntegrateERP } from "components";
import { PaymentIntegrateERP } from "components/IntegrateERP/IntegrateERP";
import { PaymentIntegrateECM } from "components/IntegrateECM/IntegrateECM";

function useRepositoriesTabHook(
  tabKeyError: number[],
  path: string,
  idDetail?: string,
  taxTypeInvoiceSubmit?: number,
  listERP?: PaymentIntegrateERP[],
  listECM?: PaymentIntegrateECM[],
  handlePushIntegrateERP?: () => void,
  handlePushIntegrateECM?: () => void,
  updateIntegrateData?: () => void
) {
  const [translate] = useTranslation();
  const { handleDownloadFileAttached } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  function getLastPath(path: string, idDetail?: string): string {
    const parts = path.split("/");
    if (!_.isEmpty(idDetail)) {
      return "/" + parts[parts.length - 2];
    }
    return "/" + parts[parts.length - 1];
  }

  const generateTabConfig = useCallback(
    (
      tabKeyError: number[],
      tabs: { key: string; title: string; component: React.ReactNode }[]
    ): RepoStateDetail[] => {
      return tabs.map((tab) => ({
        tabKey: tab.key,
        tabTitle: (
          <TabName
            text={translate(tab.title)}
            isShowIconError={tabKeyError?.includes(parseInt(tab.key))}
          />
        ),
        children: <>{tab.component}</>,
      }));
    },
    [translate, idDetail, listERP, listECM, updateIntegrateData]
  );

  const paymentTabs = useMemo(() => {
    const tabs = [
      {
        key: "0",
        title: "PM.tab_general_information",
        component: <PaymentGenerationInfoTab />,
      },
      { key: "1", title: "PM.tab_list_invoice", component: <InvoiceListTab /> },
      {
        key: "2",
        title: "PM.tab_cost_Allocation",
        component: <PaymentCostAllocationTab />,
      },
      {
        key: "3",
        title: "PM.tab_reimbursement_expense_reversal",
        component: <ReimbursementExpenseReversalTab />,
      },
    ];
    if (idDetail) {
      tabs.push(
        {
          key: "4",
          title: translate("PM.payment_ERP_integration"),
          component: (
            <IntegrateERP
              listERP={listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={updateIntegrateData}
            />
          ),
        },
        {
          key: "5",
          title: translate("PM.payment_ECM_integration"),
          component: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return tabs;
  }, [idDetail, translate, listERP, listECM, updateIntegrateData]);

  const advanceTabs = useMemo(() => {
    const tabs = [
      {
        key: "0",
        title: "PM.tab_general_information",
        component: <AdvanceGenerationInfoTab />,
      },
      { key: "1", title: "PM.tab_list_invoice", component: <InvoiceListTab /> },
      {
        key: "2",
        title: "PM.tab_cost_Allocation",
        component: <PaymentCostAllocationTab />,
      },
    ];

    if (idDetail) {
      tabs.push(
        {
          key: "3",
          title: translate("PM.payment_ERP_integration"),
          component: (
            <IntegrateERP
              listERP={listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={updateIntegrateData}
            />
          ),
        },
        {
          key: "4",
          title: translate("PM.payment_ECM_integration"),
          component: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return tabs;
  }, [idDetail, translate, listERP, listECM, updateIntegrateData]);

  const expenseTabs = useMemo(() => {
    const tabs = [
      {
        key: "0",
        title: "PM.tab_general_information",
        component: <ExpenseGenerationInfoTab />,
      },
      {
        key: "1",
        title: "PM.tab_list_invoice",
        component: <InvoiceListTab />,
      },
      {
        key: "2",
        title: "PM.tab_cost_Allocation",
        component: <ExpenseCostAllocationTab />,
      },
      taxTypeInvoiceSubmit === TAX_TYPE_ENUM?.VAT ||
      taxTypeInvoiceSubmit === TAX_TYPE_ENUM?.NO_TAX
        ? {
            key: "3",
            title: "PM.tab_expense_reversal",
            component: <ExpenseReversalTab />,
          }
        : undefined,
    ]?.filter(Boolean);

    if (idDetail) {
      tabs.push(
        {
          key: "4",
          title: translate("PM.payment_ERP_integration"),
          component: (
            <IntegrateERP
              listERP={listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={updateIntegrateData}
            />
          ),
        },
        {
          key: "5",
          title: translate("PM.payment_ECM_integration"),
          component: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return tabs;
  }, [
    taxTypeInvoiceSubmit,
    idDetail,
    translate,
    listERP,
    listECM,
    updateIntegrateData,
  ]);

  const accountingEntryTabs = useMemo(() => {
    const tabs = [
      {
        key: "0",
        title: "PM.tab_general_information",
        component: <AccountingEntryGenerationInfoTab />,
      },
      {
        key: "4",
        title: "PM.accounting_entry_title_tab",
        component: <AccountingEntryTab />,
      },
    ];

    if (idDetail) {
      tabs.push(
        {
          key: "2",
          title: translate("PM.payment_ERP_integration"),
          component: (
            <IntegrateERP
              listERP={listERP}
              handlePushIntegrateERP={handlePushIntegrateERP}
              handleGetListERP={updateIntegrateData}
            />
          ),
        },
        {
          key: "3",
          title: translate("PM.payment_ECM_integration"),
          component: (
            <IntegrateECM
              handleDownloadFileAttached={handleDownloadFileAttached}
              listECM={listECM}
              handlePushIntegrateECM={handlePushIntegrateECM}
            />
          ),
        }
      );
    }

    return tabs;
  }, [idDetail, translate, listERP, listECM, updateIntegrateData]);

  const memoizedGetTabPaymentRepositories = useCallback(() => {
    return generateTabConfig(tabKeyError, paymentTabs);
  }, [tabKeyError, idDetail, listERP, listECM, updateIntegrateData]);

  const memoizedGetTabAdvanceRepositories = useCallback(
    () => generateTabConfig(tabKeyError, advanceTabs),
    [tabKeyError, idDetail, listERP, listECM, updateIntegrateData]
  );

  const memoizedGetTabExpenseRepositories = useCallback(
    () => generateTabConfig(tabKeyError, expenseTabs),
    [
      tabKeyError,
      taxTypeInvoiceSubmit,
      idDetail,
      listERP,
      listECM,
      updateIntegrateData,
    ]
  );

  const memoizedGetTabAccountingEntryRepositories = useCallback(
    () => generateTabConfig(tabKeyError, accountingEntryTabs),
    [tabKeyError, idDetail, listERP, listECM, updateIntegrateData]
  );

  const [tabRepositories, setTabRepositories] =
    useState<RepoStateDetail[]>(null);

  const setTabRepositoriesFunc = useCallback(() => {
    const key = getLastPath(path, idDetail);
    switch (key) {
      case TYPE_OF_PAYMENT_TYPE.PAYMENT:
        setTabRepositories(memoizedGetTabPaymentRepositories);
        break;
      case TYPE_OF_PAYMENT_TYPE.ADVANCE:
        setTabRepositories(memoizedGetTabAdvanceRepositories);
        break;
      case TYPE_OF_PAYMENT_TYPE.EXPENSE:
        setTabRepositories(memoizedGetTabExpenseRepositories);
        break;
      case TYPE_OF_PAYMENT_TYPE.ACCOUNTING_ENTRY:
        setTabRepositories(memoizedGetTabAccountingEntryRepositories);
        break;
      default:
        break;
    }
  }, [
    tabKeyError,
    taxTypeInvoiceSubmit,
    idDetail,
    listERP,
    listECM,
    updateIntegrateData,
  ]);

  useEffect(() => {
    setTabRepositoriesFunc();
  }, [
    tabKeyError,
    taxTypeInvoiceSubmit,
    idDetail,
    listERP,
    listECM,
    updateIntegrateData,
  ]);

  return {
    getLastPath,
    tabRepositories,
  };
}

export default useRepositoriesTabHook;
