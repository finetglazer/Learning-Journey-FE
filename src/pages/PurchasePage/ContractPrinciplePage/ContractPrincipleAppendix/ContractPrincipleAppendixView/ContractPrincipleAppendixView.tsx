import { TabsProps } from "antd/lib";
import { AnnexFileModel } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/AnnexFiles/types";
import { useMemo } from "react";
import { useContractPrincipleAppendixViewHook } from "./ContractPrincipleAppendixViewHook";
import { ContractPrincipleAppendixViewContext } from "./context";

import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import { useGetStatusProjectSettlement } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetStatusProjectSettlement";
import { Tag } from "react-components-design-system";
import { TabKey } from "../../constants";
import { GroupActions } from "../Components/GroupActions/GroupActions";
import { AnnexFile } from "../ContractPrincipleAppendixDetail/Tabs/AnnexFiles/AnnexFile";
import { GeneralInformation } from "./Components/Tabs/GeneralInformation/GeneralInformation";
import ClauseContractPrincipleAppendixTab from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/Tabs/ClauseContractPrincipleAppendix/ClauseContractPrincipleAppendixTab";
import HistoryApprovalContractPrincipleAppendix from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/Components/HistoryApprovalTab/HistoryApprovalContractPrincipleAppendix";
type TabsType = TabsProps["items"];

const ContractPrincipleAppendixView = () => {
  const { translate, breadcrumbs, handleConfirmModal, ...contextValue } =
    useContractPrincipleAppendixViewHook();

  const { model, loading } = contextValue;

  // Tab items
  const tabItems: TabsType = useMemo(() => {
    const annexFile: AnnexFileModel = {
      id: model?.id,
      code: model?.code,
      name: model?.name,
      status: model?.status,
      documentGroups: model?.documentGroups,
      mode: "VIEW",
    };

    const list: TabsType = [
      {
        key: TabKey.INFORMATION,
        label: translate("CA.tab_information_general"),
        children: <GeneralInformation />,
      },
      {
        key: TabKey.TERMS,
        label: translate("CA.tab_terms"),
        children: <ClauseContractPrincipleAppendixTab />,
      },
      {
        key: TabKey.ANNEX_FILES,
        label: translate("CA.tab_attachment_files"),
        children: <AnnexFile data={annexFile} />,
      },
      {
        key: TabKey.HISTORY_APPROVAL,
        label: translate("CPA.tab.history_approval"),
        children: (
          <HistoryApprovalContractPrincipleAppendix
            status={model?.status}
            topicId={model?.id}
            model={model}
          />
        ),
      },
    ];

    return list;
  }, [model, translate]);

  const { statusProjectSettlement } = useGetStatusProjectSettlement({
    status: model?.status,
  });

  return (
    <ContractPrincipleAppendixViewContext.Provider value={contextValue}>
      <LayoutViewDetail
        title={translate("CPA.txt_contract_principle_annex", {
          code: model?.code,
        })}
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
        childrenPageHeader={
          <GroupActions model={model} onClickButton={handleConfirmModal} />
        }
      />
      {loading ? <LoadingCM /> : null}
    </ContractPrincipleAppendixViewContext.Provider>
  );
};

export default ContractPrincipleAppendixView;
