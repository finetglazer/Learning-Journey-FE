import { TabsProps } from "antd/lib";
import { LoadingCM, ModalSubmitError } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import TabName from "components/TabName/TabName";
import { APP_OVERVIEW, CONTRACT_PRINCIPLE_ROUTE } from "config/route-const";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isUndefined } from "lodash";
import { DocumentGroup } from "models/DocumentGroup";
import HistoryApprovalContractPrincipleAppendix from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/Components/HistoryApprovalTab/HistoryApprovalContractPrincipleAppendix";
import { useCheckStateContractPrincipleAppendix } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/Components/hooks/useCheckStateContractPrincipleAppendix";
import ClauseContractPrincipleAppendixTab from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/Tabs/ClauseContractPrincipleAppendix/ClauseContractPrincipleAppendixTab";
import { useGetStatusProjectSettlement } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetStatusProjectSettlement";
import { useCallback, useMemo } from "react";
import { Tag } from "react-components-design-system";
import { useParams } from "react-router-dom";
import { TabKey } from "../../constants";
import { GroupActions } from "../Components/GroupActions/GroupActions";
import { ContractPrincipleAppendixDetailContext } from "./context";
import { useContractPrincipleAppendixDetailHook } from "./ContractPrincipleAppendixDetailHook";
import { AnnexFile } from "./Tabs/AnnexFiles/AnnexFile";
import { AnnexFileModel } from "./Tabs/AnnexFiles/types";
import { GeneralInformation } from "./Tabs/GeneralInformation/GeneralInformation";

type TabsType = TabsProps["items"];
interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

const ContractPrincipleAppendixDetail = () => {
  const { translate, loading, onSave, ...contextValue } =
    useContractPrincipleAppendixDetailHook();
  const { contractId, id } = useParams<Parameters>();
  const { model, errorsModal, setErrorsModal, dispatch } = contextValue;
  const { state } = useCheckStateContractPrincipleAppendix();

  const onAnnexFileChanged = useCallback(
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

  const title = useMemo(() => {
    if (!isUndefined(contractId)) return translate("CPA.title_create_new");
    return translate("CPA.txt_contract_principle_annex", { code: model?.code });
  }, [contractId, model?.code, translate]);

  // Tab items
  const tabItems: TabsType = useMemo(() => {
    const annexFile: AnnexFileModel = {
      id: model?.id,
      code: model?.code,
      name: model?.name,
      status: model?.status,
      documentGroups: model?.documentGroups,
      mode: isEqual(state, "CREATE") ? "CREATE" : "EDIT",
      errors: model?.errors,
    };

    const list: TabsType = [
      // General Information
      {
        key: TabKey.INFORMATION,
        label: (
          <TabName
            text={translate("CPA.tab.general_information")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INFORMATION)
            )}
          />
        ),
        children: <GeneralInformation />,
      },
      // Terms
      {
        key: TabKey.TERMS,
        label: (
          <TabName
            text={translate("CPA.tab.terms")}
            isShowIconError={model?.errorTabs?.includes(Number(TabKey.TERMS))}
          />
        ),
        children: <ClauseContractPrincipleAppendixTab />,
      },
      // Annex Files
      {
        key: TabKey.ANNEX_FILES,
        label: (
          <TabName
            text={translate("CPA.tab.annex_files")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.ANNEX_FILES)
            )}
          />
        ),
        children: <AnnexFile data={annexFile} onChange={onAnnexFileChanged} />,
      },
    ];

    if (!isEqual(state, "CREATE")) {
      list.push({
        key: TabKey.HISTORY_APPROVAL,
        label: (
          <TabName
            text={translate("CPA.tab.history_approval")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.HISTORY_APPROVAL)
            )}
          />
        ),
        children: (
          <HistoryApprovalContractPrincipleAppendix
            status={model?.status}
            topicId={model?.id}
            model={model}
          />
        ),
      });
    }

    return list;
  }, [model, onAnnexFileChanged, state, translate]);

  // BreadCrumbs
  const breadcrumbs = useMemo(() => {
    return [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_shopping"),
      },
      {
        name: translate("CM.menu_title_contract_principle"),
        path: CONTRACT_PRINCIPLE_ROUTE,
      },
      {
        name: title,
        path: CONTRACT_PRINCIPLE_ROUTE,
      },
    ];
  }, [translate, title]);

  const { statusProjectSettlement } = useGetStatusProjectSettlement({
    status: model?.status,
    contractId,
  });

  return (
    <ContractPrincipleAppendixDetailContext.Provider value={contextValue}>
      <LayoutViewDetail
        title={title}
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        rightComponentTitle={
          <Tag
            {...statusProjectSettlement}
            className="m-l--2xs"
            size="sm"
            isShowDot={false}
            isShowBorder
          />
        }
        childrenPageHeader={<GroupActions model={model} onSave={onSave} />}
      />
      {loading ? <LoadingCM /> : null}
      {isEqual(errorsModal?.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={errorsModal?.errors}
          onClose={() => setErrorsModal({ type: "NONE" })}
        />
      )}
    </ContractPrincipleAppendixDetailContext.Provider>
  );
};

export default ContractPrincipleAppendixDetail;
