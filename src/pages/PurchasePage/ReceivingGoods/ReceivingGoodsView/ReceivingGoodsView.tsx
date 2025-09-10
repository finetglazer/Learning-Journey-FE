import { LoadingCM, PageHeader } from "components";
import { RepoState } from "core/services/page-services/master-service";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import { listReceivedGoodsStatus } from "pages/PurchasePage/constants";
import { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import { GroupAction } from "../Components/ReceivedInformationDetail/Components/GroupAction/GroupAction";
import { ReceivingGoodsDetailContext } from "../ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useReceivingGoodsDetailHooks } from "../ReceivingGoodsDetail/ReceivingGoodsDetailHooks";
import "./ReceivingGoodsView.scss";

export const ReceivingGoodsView = () => {
  const { isLoading, breadcrumbs, tabRepositories, title, ...contextValue } =
    useReceivingGoodsDetailHooks({
      isDetail: true,
    });
  const { filter, handleChangeTab, dispatchFilter } = contextValue;
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

  const handleChangeTabs = (tab: string) => {
    handleChangeTab(tab);
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...filter,
        tab,
        opinionResponseId: filter?.opinionResponseId,
      },
    });
  };

  const renderStatusDetail = () => {
    const status = contextValue.model?.status;

    const item = listReceivedGoodsStatus().find((type) => type.id === status);
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

  return (
    <>
      <ReceivingGoodsDetailContext.Provider value={contextValue}>
        <div className="page-content__received">
          <PageHeader
            title={title}
            isShowBackButton
            breadcrumbs={breadcrumbs}
            rightComponentTitle={renderStatusDetail()}
            isView
          >
            <GroupAction />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              tabPosition="top"
              mode="line"
              activeKey={contextValue.repo.tabKey}
              items={tabItems}
              destroyInactiveTabPane={true}
              onTabClick={handleChangeTabs}
            />
          </div>
        </div>
      </ReceivingGoodsDetailContext.Provider>
      {isLoading ? <LoadingCM /> : null}
    </>
  );
};
