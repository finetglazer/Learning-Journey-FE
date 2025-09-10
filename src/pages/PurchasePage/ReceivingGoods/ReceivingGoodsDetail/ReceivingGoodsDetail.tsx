import { LoadingCM, ModalSubmitError, PageHeader } from "components";
import { RepoState } from "core/services/page-services/master-service";
import { isEmpty, isEqual } from "lodash";
import { listReceivedGoodsStatus } from "pages/PurchasePage/constants";
import React, { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import { GroupAction } from "../Components/ReceivedInformationDetail/Components/GroupAction/GroupAction";
import { ReceivingGoodsDetailDrawer } from "../Components/ReceivingGoodsDetailDrawer/ReceivingGoodsDetailDrawer/ReceivingGoodsDetailDrawer";
import { ReceivingGoodsDetailContext } from "./ReceivingGoodsDetailContext";
import { useReceivingGoodsDetailHooks } from "./ReceivingGoodsDetailHooks";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { receivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

export const ReceivingGoodsDetail = () => {
  const {
    isLoading,
    breadcrumbs,
    tabRepositories,
    title,
    handleChangeTab,
    errorsModal,
    setErrorsModal,
    ...contextValue
  } = useReceivingGoodsDetailHooks({});
  const [translate] = useTranslation();

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return !isEmpty(tabRepositories)
      ? tabRepositories.map((tab: RepoState) => ({
          ...tab,
          key: tab.tabKey,
          label: tab.tabTitle,
        }))
      : [];
  }, [tabRepositories]);

  const renderStatusDetail = () => {
    const status = contextValue.model?.status;

    let item = listReceivedGoodsStatus().find((type) =>
      isEqual(type.id, status)
    );
    if (
      isEqual(contextValue.state, "CREATE") ||
      isEqual(contextValue.state, "CLONE")
    ) {
      item = {
        id: undefined,
        code: "DEFAULT",
        name: translate("BG.newly_created"),
      };
    }
    return (
      <Tag
        value={item?.name || translate("BG.newly_created")}
        status={item?.code}
        className="m-l--2xs"
        size="sm"
        isShowBorder
        isShowDot={false}
      />
    );
  };
  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSend = React.useCallback(() => {
    contextValue.handleSendRequest(false);
  }, [contextValue]);

  return (
    <>
      <ReceivingGoodsDetailContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={title}
            isShowBackButton
            breadcrumbs={breadcrumbs}
            rightComponentTitle={renderStatusDetail()}
          >
            <GroupAction handleOpenSigningForm={handleOpenSigningForm} />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              tabPosition="top"
              mode="line"
              activeKey={contextValue.repo.tabKey}
              items={tabItems}
              destroyInactiveTabPane={true}
              onTabClick={handleChangeTab}
            />
          </div>
        </div>

        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}
        <ReceivingGoodsDetailDrawer />
        {contextValue.model?.id && (
          <SignProcessModal
            isOpen={openSigningForm}
            loadingSend={isLoading}
            onCancel={handleCancelSigningForm}
            sendRequest={handleSend}
            requestId={contextValue.model?.id}
            requestField={"id"}
            repository={receivedGoodsRepository}
            tempateType={SIGN_PROCESS_TYPE.GOODS_RECEIPT_REQUEST}
          />
        )}
      </ReceivingGoodsDetailContext.Provider>
      {isLoading ? <LoadingCM /> : null}
    </>
  );
};
