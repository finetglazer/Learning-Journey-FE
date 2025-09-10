import type { TabsProps } from "antd";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import TabName from "components/TabName/TabName";
import {
  APP_OVERVIEW,
  PROJECT_SETTLEMENT_MASTER_ROUTE,
} from "config/route-const";
import AssetInformation from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/Tabs/AssetInformation";
import { ProjectSettlementViewContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/context";
import { useProjectSettlementViewHook } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/ProjectSettlementViewHook";
import { useMemo } from "react";

import { LoadingCM } from "components";
import { ConfirmModalType } from "core/helpers/enum";
import { isNull } from "lodash";
import { Tag } from "react-components-design-system";
import ApprovalHistory from "../Components/ApprovalHistory/ApprovalHistory";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { ProjectSettlementModal, TabKey } from "../Components/constant";
import { GroupActions } from "../Components/GroupActions/GroupActions";
import { useGetStatusProjectSettlement } from "../Components/hooks/useGetStatusProjectSettlement";
import SettlementDetailIntergration from "../ProjectSettlementDetail/Components/IntergarationView/SettlementDetailIntergration";
import GoodsServices from "./Components/Tabs/GoodsServices/GoodsServices";
import SettlementInformation from "./Components/Tabs/SettlementInformation";

export default function ProjectSettlementView() {
  const {
    translate,
    modalType,
    isLoadingModal,
    isLoadingView,
    errorMessage,
    onApplyConfirmModal,
    onCancelConfirmModal,
    handleChangeSingleField,
    ...contextValue
  } = useProjectSettlementViewHook();
  const { model, loading } = contextValue;

  const tabItems: TabsProps["items"] = useMemo(() => {
    const list: TabsProps["items"] = [
      {
        key: TabKey.INFORMATION,
        label: (
          <TabName text={translate("PS.txt_tab_information_settlement")} />
        ),
        children: <SettlementInformation />,
      },
      {
        key: TabKey.GOODS_SERVICES,
        label: <TabName text={translate("PL.goods_services_text")} />,
        children: <GoodsServices />,
      },
      {
        key: TabKey.INFORMATION_ASSET,
        label: <TabName text={translate("PS.txt_tab_invoice_asset")} />,
        children: <AssetInformation />,
      },
      {
        key: TabKey.INTERGRATION,
        label: (
          <TabName text={translate("TIA.tab_integrated_asset_management")} />
        ),
        children: <SettlementDetailIntergration />,
      },
      {
        key: TabKey.APPROVAL_HISTORY,
        label: translate("CM.txt_approval_history"),
        children: (
          <ApprovalHistory
            topicId={model?.id}
            status={model?.status}
            model={model}
          />
        ),
      },
    ];

    return list;
  }, [model, translate]);

  const title = useMemo(
    () =>
      `${translate("CM.menu_title_project_settlement")} ${model?.code || ""}`,
    [model?.code, translate]
  );

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
        name: translate("CM.menu_title_project_settlement"),
        path: PROJECT_SETTLEMENT_MASTER_ROUTE,
      },
      {
        name: title,
      },
    ];
  }, [title, translate]);

  const { statusProjectSettlement } = useGetStatusProjectSettlement({
    status: model?.status,
  });

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
    <ProjectSettlementViewContext.Provider value={contextValue}>
      <LayoutViewDetail
        title={title}
        tabItems={tabItems}
        breadcrumbs={breadcrumbs}
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
            loading={loading}
            handleChangeSingleField={handleChangeSingleField}
          />
        }
      />
      {/* Confirm Modal */}
      {makeConfirmModal()}
      {isLoadingView || loading ? <LoadingCM /> : null}
    </ProjectSettlementViewContext.Provider>
  );
}
