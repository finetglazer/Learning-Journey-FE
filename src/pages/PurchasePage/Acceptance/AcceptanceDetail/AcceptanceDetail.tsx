import { LoadingCM } from "components";
import { numberConstants } from "core/config/consts";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isUndefined } from "lodash";
import { DocumentGroup } from "models/DocumentGroup";
import { EvaluationSupplier } from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/EvaluationSupplier";
import { AcceptanceFile } from "pages/PurchasePage/Acceptance/AcceptanceFile/AcceptanceFile";
import {
  AcceptanceFileModel,
  TopicType,
} from "pages/PurchasePage/Acceptance/AcceptanceFile/types";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { useCallback, useMemo } from "react";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetStatusAcceptance } from "../Components/hooks/useGetStatusAcceptance";
import { AcceptanceLayout } from "../Components/Layout/AcceptanceLayout";
import { AcceptanceDetailContext } from "./AcceptanceDetailContext";
import { useAcceptanceDetailHooks } from "./AcceptanceDetailHooks";
import HistoryApprovalDetail from "./Components/HistoryApproval/HistoryApprovalDetail";
import { AcceptanceInformation } from "./Components/Tabs";
import TabName from "components/TabName/TabName";

enum TabKey {
  INFORMATION = "0",
  EVALUATION = "1",
  FILES = "2",
  HISTORY = "3",
}

interface Parameters {
  contractId: string | undefined;
  acceptanceId: string | undefined;
}

export const AcceptanceDetail = () => {
  const [translate] = useTranslation();
  const { contractId, acceptanceId } = useParams<Parameters>();
  const { loading, errorsModal, setErrorsModal, ...contextValue } =
    useAcceptanceDetailHooks();
  const { model, dispatch } = contextValue;
  const contextDetail = {
    loading,
    errorsModal,
    setErrorsModal,
    ...contextValue,
  };

  const { state } = useAcceptanceActions();

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
      mode: state as "CLONE" | "VIEW" | "EDIT" | "CREATE",
    };

    const list: TabsProps["items"] = [
      {
        key: TabKey.INFORMATION,
        label: (
          <TabName
            text={translate("AC.tab_acceptance_information")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INFORMATION)
            )}
          />
        ),
        children: <AcceptanceInformation {...contextValue} />,
      },
      {
        key: TabKey.EVALUATION,
        label: (
          <TabName
            text={translate("RG.tab_detail_supplier_evaluation")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.EVALUATION)
            )}
          />
        ),
        children: <EvaluationSupplier />,
      },
      {
        key: TabKey.FILES,
        label: (
          <TabName
            text={translate("AC.tab_files")}
            isShowIconError={model?.errorTabs?.includes(Number(TabKey.FILES))}
          />
        ),
        children: (
          <AcceptanceFile
            topicType={TopicType.ACCEPTANCE}
            title={translate("AC.txt_signed_acceptance_file")}
            data={data}
            onChange={onAcceptanceFileChange}
            {...contextDetail}
          />
        ),
      },
      {
        key: TabKey.HISTORY,
        label: (
          <TabName
            text={translate("AC.tab_detail_history_approval")}
            isShowIconError={model?.errorTabs?.includes(Number(TabKey.HISTORY))}
          />
        ),
        children: (
          <HistoryApprovalDetail status={model?.status} model={model} />
        ),
      },
    ];

    if (isEqual(state, "CREATE")) {
      list.splice(-numberConstants.ONE);
    }

    return list;
  }, [
    contextDetail,
    contextValue,
    model,
    onAcceptanceFileChange,
    state,
    translate,
  ]);

  const title = useMemo(() => {
    if (!isUndefined(contractId)) {
      return translate("AC.txt_title_create");
    }

    if (!isUndefined(acceptanceId)) {
      return translate("AC.txt_title_detail", { code: model?.code });
    }
  }, [contractId, acceptanceId, translate, model?.code]);

  const { statusAcceptance } = useGetStatusAcceptance({
    status: model?.status,
  });

  return (
    <>
      <AcceptanceDetailContext.Provider value={{ ...contextValue, loading }}>
        <AcceptanceLayout
          tabItems={tabItems}
          title={title}
          status={statusAcceptance}
          errorsModal={errorsModal}
          setErrorsModal={setErrorsModal}
        />
      </AcceptanceDetailContext.Provider>
      {loading ? <LoadingCM /> : null}
    </>
  );
};
