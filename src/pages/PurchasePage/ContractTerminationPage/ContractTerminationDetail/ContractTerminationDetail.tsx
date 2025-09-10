import { TabsProps } from "antd/lib";
import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listStatusEnum } from "config/const";
import { isEmpty, isEqual, isNull } from "lodash";
import {
  ContractTerminationContextModel,
  TYPE_PAGE,
} from "models/ContractTermination";
import { RepoStateDetail } from "models/Payment";
import { useMemo } from "react";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import GroupAction from "../Components/GroupAction/GroupAction";
import ModalActionConfirm from "../Components/ModalActionConfirm/ModalActionConfirm";
import styles from "./ContractTerminationDetail.module.scss";
import {
  ContractTerminationDetailHookContext,
  useContractTerminationDetailHook,
} from "./ContractTerminationDetailHook";
const ContractTerminationDetail = () => {
  const { id: idDetail } = useParams<{ id: string }>();
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
  } = useContractTerminationDetailHook(
    isEmpty(idDetail) ? TYPE_PAGE.CREATE : TYPE_PAGE.EDIT
  );
  const history = useHistory();

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
      <ContractTerminationDetailHookContext.Provider
        value={
          { ...contextValue } as unknown as ContractTerminationContextModel
        }
      >
        <LayoutViewDetail
          title={breadcrumbs[breadcrumbs.length - 1]?.name}
          breadcrumbs={breadcrumbs}
          tabItems={tabItems}
          containerClassName={styles["container"]}
          rightComponentTitle={renderTag()}
          hasTabs={true}
          childrenPageHeader={<GroupAction isView={false} />}
        />
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}
        {loading && <LoadingCM />}
        {!isNull(contextValue?.modelSelected) ? (
          <ModalActionConfirm
            type={contextValue?.modelSelected?.type}
            model={contextValue?.modelSelected?.model}
            isLoading={loading}
            loadingButton={contextValue?.loadingButtonConfirm}
            errorMessage={contextValue?.modelSelected?.errorMessage}
            onApply={contextValue?.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue?.setModelSelected(null)}
          />
        ) : null}
      </ContractTerminationDetailHookContext.Provider>
    </>
  );
};

export default ContractTerminationDetail;
