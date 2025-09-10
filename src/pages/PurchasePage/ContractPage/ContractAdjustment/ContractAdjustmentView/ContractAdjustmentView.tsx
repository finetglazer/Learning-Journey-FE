import { TabsProps } from "antd/lib";
import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import { listStatusEnum } from "config/const";
import { isEmpty, size } from "lodash";
import { RepoStateDetail } from "models/Payment";
import React, { useMemo } from "react";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractAdjustmentContext,
  useContractAdjustmentDetailHook,
} from "../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import {
  ContractAdjustmentContextModel,
  TYPE_PAGE,
} from "models/ContractAdjustment";
import GroupAction from "../Components/GroupAction/GroupAction";
import styles from "../ContractAdjustmentDetail/ContractAdjustmentDetail.module.scss";

const ContractAdjustmentView = () => {
  const [translate] = useTranslation();

  const {
    loading,
    breadcrumbs,
    tabRepositories,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    ...contextValue
  } = useContractAdjustmentDetailHook(TYPE_PAGE.VIEW);
  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [tabRepositories]);
  const renderTag = () => {
    let status = -1; //is init status
    const isNotInit = isEmpty(contextValue?.model?.status);
    if (isNotInit) {
      status = contextValue?.model?.status;
    }
    const item = listStatusEnum.find((type) => type.id === status);
    return (
      <div className="d-flex align-center m-l--2xs">
        <Tag
          size="sm"
          value={isEmpty(item) ? translate("CM.txt_create") : item?.name}
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  return (
    <>
      <ContractAdjustmentContext.Provider
        value={{ ...contextValue } as unknown as ContractAdjustmentContextModel}
      >
        <LayoutViewDetail
          title={breadcrumbs[breadcrumbs.length - 1]?.name}
          breadcrumbs={breadcrumbs}
          tabItems={tabItems}
          isNotShowTab={size(tabItems) === 1}
          containerClassName={styles["container"]}
          rightComponentTitle={renderTag()}
          hasTabs={true}
          childrenPageHeader={<GroupAction isView={true} />}
        >
          {tabItems[0]?.children}
        </LayoutViewDetail>
        {loading && <LoadingCM />}
      </ContractAdjustmentContext.Provider>
    </>
  );
};

export default ContractAdjustmentView;
