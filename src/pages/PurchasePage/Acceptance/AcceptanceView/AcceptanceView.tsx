import { LoadingCM } from "components";
import { GeneralActionEnum } from "core/services/service-types";
import { DocumentGroup } from "models/DocumentGroup";
import { LOCAL_STORAGE_ACCEPTANCE } from "pages/PurchasePage/constants";
import { useCallback, useMemo } from "react";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import HistoryApprovalDetail from "../AcceptanceDetail/Components/HistoryApproval/HistoryApprovalDetail";
import { AcceptanceFile } from "../AcceptanceFile/AcceptanceFile";
import { AcceptanceFileModel, TopicType } from "../AcceptanceFile/types";
import { State } from "../Components/constant";
import { useGetStatusAcceptance } from "../Components/hooks/useGetStatusAcceptance";
import { AcceptanceLayout } from "../Components/Layout/AcceptanceLayout";
import { AcceptanceViewContext } from "./AcceptanceViewContext";
import { useAcceptanceViewHooks } from "./AcceptanceViewHooks";
import { AcceptanceInformation, EvaluationSupplier } from "./Components/Tabs";

export enum TabKey {
  INFORMATION = "information",
  EVALUATION = "evaluation",
  CONCLUDE = "conclude",
  FILES = "files",
  HISTORY = "history",
}

export const AcceptanceView = () => {
  const [translate] = useTranslation();
  const { loading, processAfterFeedbackSubmission, ...contextValue } =
    useAcceptanceViewHooks();
  const { model, dispatch } = contextValue;

  const state = useMemo(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE) as string;

    return state as State["mode"];
  }, []);

  const onAcceptanceFileChange = useCallback(
    (documentGroups: DocumentGroup[]) => {
      dispatch({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          documentGroups: documentGroups || [],
        },
      });
    },
    [dispatch, model]
  );

  const tabItems: TabsProps["items"] = useMemo(() => {
    const data: AcceptanceFileModel = {
      id: model?.id,
      documentGroups: model?.documentGroups,
      status: model?.status,
      code: model?.code,
      name: model?.name,
      mode: state,
    };

    const list: TabsProps["items"] = [
      {
        key: TabKey.INFORMATION,
        label: translate("AC.tab_acceptance_information"),
        children: <AcceptanceInformation {...contextValue} />,
      },
      {
        key: TabKey.EVALUATION,
        label: translate("RG.tab_detail_supplier_evaluation"),
        children: <EvaluationSupplier />,
      },
      {
        key: TabKey.FILES,
        label: translate("AC.tab_files"),
        children: (
          <AcceptanceFile
            topicType={TopicType.ACCEPTANCE}
            title={translate("AC.txt_signed_acceptance_file")}
            data={data}
            onChange={onAcceptanceFileChange}
            isView
          />
        ),
      },
      {
        key: TabKey.HISTORY,
        label: translate("AC.tab_detail_history_approval"),
        children: (
          <HistoryApprovalDetail
            status={model?.status}
            processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            model={model}
          />
        ),
      },
    ];

    return list;
  }, [
    contextValue,
    model,
    onAcceptanceFileChange,
    processAfterFeedbackSubmission,
    state,
    translate,
  ]);

  const { statusAcceptance } = useGetStatusAcceptance({
    status: model?.status,
  });

  return (
    <>
      <AcceptanceViewContext.Provider value={contextValue}>
        <AcceptanceLayout
          tabItems={tabItems}
          title={translate("AC.txt_title_detail", { code: model?.code })}
          status={statusAcceptance}
        />
      </AcceptanceViewContext.Provider>
      {loading ? <LoadingCM /> : null}
    </>
  );
};
