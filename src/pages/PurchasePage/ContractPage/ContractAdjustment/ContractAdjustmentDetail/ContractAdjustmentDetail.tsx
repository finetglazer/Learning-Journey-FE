import { TabsProps } from "antd/lib";
import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listStatusEnum } from "config/const";
import { isEmpty, isEqual, size } from "lodash";
import { ContractAdjustmentContextModel } from "models/ContractAdjustment";
import { TYPE_PAGE } from "models/ContractTermination";
import { RepoStateDetail } from "models/Payment";
import React, { useMemo } from "react";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GroupAction from "../Components/GroupAction/GroupAction";
import styles from "./ContractAdjustmentDetail.module.scss";
import {
  ContractAdjustmentContext,
  useContractAdjustmentDetailHook,
} from "./ContractAdjustmentDetailHook";
import { useSignFormHook } from "../../../../SignProcess/useSignFormHook";
import SignProcessModal from "../../../../SignProcess/SignProcessMaster";
import { SIGN_PROCESS_TYPE } from "../../../../SignProcess/SignProcessConstanst";
import { contractAdjustmentRepository } from "../ContractAdjustmentRepository";
const ContractAdjustmentDetail = () => {
  const { id: idDetail } = useParams<{ id: string }>();
  const [translate] = useTranslation();

  const {
    loading,
    breadcrumbs,
    tabRepositories,
    errorsModal,
    setErrorsModal,
    ...contextValue
  } = useContractAdjustmentDetailHook(
    isEmpty(idDetail) ? TYPE_PAGE.CREATE : TYPE_PAGE.EDIT
  );
  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories?.length &&
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

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSave({ isDraft: false });
  }, [contextValue]);

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
          childrenPageHeader={
            <GroupAction
              isView={false}
              handleOpenSigningForm={handleOpenSigningForm}
            />
          }
        >
          {tabItems[0]?.children}
        </LayoutViewDetail>
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}

        {contextValue.model?.id && (
          <SignProcessModal
            isOpen={openSigningForm}
            loadingSend={loading}
            onCancel={handleCancelSigningForm}
            sendRequest={handleSendRequest}
            requestId={contextValue.model?.id}
            requestField="id"
            repository={contractAdjustmentRepository}
            tempateType={SIGN_PROCESS_TYPE.CONTRACT}
          />
        )}
        {loading && <LoadingCM />}
      </ContractAdjustmentContext.Provider>
    </>
  );
};

export default ContractAdjustmentDetail;
