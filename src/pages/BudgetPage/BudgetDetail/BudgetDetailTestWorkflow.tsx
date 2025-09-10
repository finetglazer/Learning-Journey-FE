/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { isEqual, isNil } from "lodash";
import { useMemo } from "react";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "../BudgetCreate/BudgetCreate.scss";
import {
  CreateBudgetContext,
  useBudgetCreateHook,
} from "../BudgetCreate/BudgetCreateHook";
import GeneralInformation from "../BudgetCreate/Components/GeneralInformation/GeneralInformation";
import { BudgetConfirmModal } from "../BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import GroupActionDetailTestWorkflow from "../BudgetCreate/Components/GroupAction/GroupActionDetailTestWorkflow";

const BudgetDetailTestWorkflow = () => {
  const [translate] = useTranslation();

  const { breadcrumbs, title, isLoadingModal, ...contextValue } =
    useBudgetCreateHook({
      isDetail: true,
    });

  const getTitleStatus = () => {
    return listStatusEnum.find(
      (item) => item.id === contextValue?.model?.status
    );
  };

  const renderStatusDetail = () => {
    return (
      <Tag
        value={getTitleStatus()?.name}
        className="m-l--2xs"
        size="sm"
        status={getTitleStatus()?.code}
        isShowBorder
        isShowDot={false}
      />
    );
  };

  return (
    <>
      <CreateBudgetContext.Provider value={contextValue as any}>
        <div className={classNames("page-content-create", "page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            rightComponentTitle={renderStatusDetail()}
            isShowBackButton
          >
            <GroupActionDetailTestWorkflow />
          </PageHeader>
          <div className="tab__master">
            <GeneralInformation />
          </div>
          {contextValue.loading && <LoadingCM />}
        </div>
      </CreateBudgetContext.Provider>
      {/* Modal */}
      {!isNil(contextValue.modelSelected?.model) ? (
        <BudgetConfirmModal
          model={contextValue.modelSelected.model}
          type={contextValue.modelSelected.type}
          isLoading={isLoadingModal}
          errorMessage={contextValue.modelSelected?.errorMessage}
          onApply={contextValue.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue.setModelSelected(null)}
        />
      ) : null}
    </>
  );
};

export default BudgetDetailTestWorkflow;
