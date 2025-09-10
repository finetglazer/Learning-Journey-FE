/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { isNil } from "lodash";
import { BudgetConfirmModal } from "pages/BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "../BudgetAdjustCreate/BudgetAdjustCreate.scss";
import {
  BudgetAdjustContext,
  useBudgetAdjustHook,
} from "../BudgetAdjustCreate/BudgetAdjustHook";
import GeneralInformation from "../BudgetAdjustCreate/Components/GeneralInformation/GeneralInformation";
import GroupActionDetail from "../BudgetAdjustCreate/Components/GroupAction/GroupActionDetail";

const BudgetAdjustDetail = () => {
  const [translate] = useTranslation();

  const { breadcrumbs, isLoadingModal, ...contextValue } = useBudgetAdjustHook({
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
      <BudgetAdjustContext.Provider value={contextValue as any}>
        <div className={classNames("page-content-create", "page-content")}>
          <PageHeader
            title={`${translate("BG.budget_plan_adjustment")} - ${
              contextValue?.model?.code
            }`}
            breadcrumbs={breadcrumbs}
            className="page-header"
            rightComponentTitle={renderStatusDetail()}
            isShowBackButton
          >
            <GroupActionDetail />
          </PageHeader>
          <div className="tab__master">
            <GeneralInformation />
          </div>
          {contextValue.loading && <LoadingCM />}
        </div>
      </BudgetAdjustContext.Provider>
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

export default BudgetAdjustDetail;
