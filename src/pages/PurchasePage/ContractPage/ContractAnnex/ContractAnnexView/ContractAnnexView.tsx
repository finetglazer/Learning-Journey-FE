import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import WarrantyGuaranteeTab from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/WarrantyGuaranteeTab";
import { useGetStatusProjectSettlement } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetStatusProjectSettlement";
import { useMemo } from "react";
import { Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import ContractTerms from "../Components/ContractTerms/ContractTerms";
import { GroupActions } from "../Components/GroupActions/GroupActions";
import PaymentSchedule from "../Components/PaymentSchedule/PaymentSchedule";
import { TabKey } from "../constants";
import { AnnexFile } from "../ContractAnnexDetail/Tabs/AnnexFiles/AnnexFile";
import { AnnexFileModel } from "../ContractAnnexDetail/Tabs/AnnexFiles/types";
import { GeneralInformation } from "./Components/Tabs/GeneralInformation/GeneralInformation";
import HistoryApproval from "./Components/Tabs/HistoryApprovalTab/HistoryApproval";
import { ContractAnnexViewContext } from "./context";
import { useContractAnnexViewHooks } from "./ContractAnnexViewHooks";

type TabsType = TabsProps["items"];

export const ContractAnnexView = () => {
  const { translate, breadcrumbs, handleConfirmModal, ...contextValue } =
    useContractAnnexViewHooks();

  const { model, loading } = contextValue;

  // Tab items
  const tabItems: TabsType = useMemo(() => {
    const contractTermsProps = { model };
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
        children: <ContractTerms {...contractTermsProps} />,
      },
      {
        key: TabKey.PAYMENT_SCHEDULE,
        label: translate("CA.tab_payment_schedule"),
        children: <PaymentSchedule {...contractTermsProps} />,
      },
      {
        key: TabKey.WARRANTY,
        label: translate("CA.tab_warranty"),
        children: <WarrantyGuaranteeTab />,
      },
      {
        key: TabKey.ATTACHMENT_FILES,
        label: translate("CA.tab_attachment_files"),
        children: <AnnexFile data={annexFile} />,
      },
      {
        key: TabKey.APPROVAL_HISTORY,
        label: translate("CA.tab_approval_history"),
        children: (
          <HistoryApproval
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
    <ContractAnnexViewContext.Provider value={contextValue}>
      <LayoutViewDetail
        title={translate("CA.txt_contract_annex", { code: model?.code })}
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
          <GroupActions
            model={model}
            onClickButton={handleConfirmModal}
            handleChangeSingleField={contextValue.handleChangeSingleField}
          />
        }
      />
      {loading ? <LoadingCM /> : null}
    </ContractAnnexViewContext.Provider>
  );
};
