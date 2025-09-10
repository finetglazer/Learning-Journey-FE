import { LoadingCM } from "components";
import TabName from "components/TabName/TabName";
import { isNull } from "lodash";
import { ProjectSettlementLayout } from "pages/PurchasePage/ProjectSettlement/Components/Layout/ProjectSettlementLayout";
import AssetInformation from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/AssetInformation/AssetInformation";
import GoodsServices from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/GoodsServices/GoodsServices";
import SettlementInformation from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/SettlementInformation/SettlementInformation";
import { ProjectSettlementDetailContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/context";
import { useProjectSettlementDetailHook } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/ProjectSettlementDetailHook";
import { useMemo } from "react";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import ApprovalHistory from "../Components/ApprovalHistory/ApprovalHistory";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { ProjectSettlementModal, TabKey } from "../Components/constant";
import { useCheckState } from "../Components/hooks/useCheckState";

import { ConfirmModalType } from "core/helpers/enum";
import SettlementDetailIntergration from "./Components/IntergarationView/SettlementDetailIntergration";

const ProjectSettlementDetail = () => {
  const {
    translate,
    errorsModal,
    modalType,
    setErrorsModal,
    isLoadingModal,
    errorMessage,
    onApplyConfirmModal,
    onCancelConfirmModal,
    ...contextValue
  } = useProjectSettlementDetailHook();
  const { model, loading } = contextValue;

  const { isEditable } = useCheckState();

  const tabItems: TabsProps["items"] = useMemo(() => {
    const list: TabsProps["items"] = [
      {
        key: TabKey.INFORMATION,
        label: (
          <TabName
            text={translate("PS.txt_tab_information_settlement")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INFORMATION)
            )}
          />
        ),
        children: <SettlementInformation />,
      },
      {
        key: TabKey.GOODS_SERVICES,
        label: (
          <TabName
            text={translate("PL.goods_services_text")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.GOODS_SERVICES)
            )}
          />
        ),
        children: <GoodsServices />,
      },
      {
        key: TabKey.INFORMATION_ASSET,
        label: (
          <TabName
            text={translate("PS.txt_tab_invoice_asset")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INFORMATION_ASSET)
            )}
          />
        ),
        children: <AssetInformation />,
      },
    ];
    if (model?.status) {
      list.push({
        key: TabKey.INTERGRATION,
        label: (
          <TabName
            text={translate("TIA.tab_integrated_asset_management")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INTERGRATION)
            )}
          />
        ),
        children: <SettlementDetailIntergration />,
      });
    }

    if (isEditable) {
      list.push({
        key: TabKey.APPROVAL_HISTORY,
        label: (
          <TabName
            text={translate("CM.txt_approval_history")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.APPROVAL_HISTORY)
            )}
          />
        ),
        children: (
          <ApprovalHistory
            topicId={model?.id}
            status={model?.status}
            model={model}
          />
        ),
      });
    }

    return list;
  }, [isEditable, model, translate]);

  const makeConfirmModal = () => {
    if (isNull(modalType)) return null;

    let type: ConfirmModalType;
    switch (modalType) {
      case ProjectSettlementModal.Cancel:
        type = ConfirmModalType.CANCEL;
        break;
      case ProjectSettlementModal.Delete:
        type = ConfirmModalType.DELETE;
        break;
      case ProjectSettlementModal.Reject:
        type = ConfirmModalType.REJECT;
        break;
      case ProjectSettlementModal.Return:
        type = ConfirmModalType.RETURN;
        break;
      default:
        type = null;
    }

    return (
      <ConfirmModal
        type={type}
        isLoading={isLoadingModal}
        model={contextValue.model}
        errorMessage={errorMessage}
        onApply={onApplyConfirmModal}
        onCancel={onCancelConfirmModal}
      />
    );
  };

  return (
    <>
      <ProjectSettlementDetailContext.Provider value={contextValue}>
        <ProjectSettlementLayout
          title={
            isEditable || model?.id
              ? `${translate("CM.menu_title_project_settlement")} ${
                  model?.code || ""
                }`
              : translate("PS.txt_title_create")
          }
          tabItems={tabItems}
          errorsModal={errorsModal}
          setErrorsModal={setErrorsModal}
          onClickButton={contextValue.onClickButton}
        />
        {/* Confirm Modal */}
        {makeConfirmModal()}
      </ProjectSettlementDetailContext.Provider>
      {loading && <LoadingCM />}
    </>
  );
};

export default ProjectSettlementDetail;
