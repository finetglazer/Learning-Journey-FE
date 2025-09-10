/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingCM } from "components";
import TabName from "components/TabName/TabName";
import { APP_OVERVIEW, CONTRACT_ROUTE } from "config/route-const";
import { numberConstants } from "core/config/consts";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, isUndefined } from "lodash";
import { DocumentGroup } from "models/DocumentGroup";
import { CONTRACT_TITLES } from "pages/PurchasePage/ContractPage/constants";
import WarrantyGuaranteeTab from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/WarrantyGuaranteeTab";
import React, { useCallback, useMemo } from "react";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useParams } from "react-router";
import ContractTerms from "../Components/ContractTerms/ContractTerms";
import { useCheckStateContractAnnex } from "../Components/hooks/useCheckStateContractAnnex";
import { ContractAnnexLayout } from "../Components/Layout/ContractAnnexLayout";
import PaymentSchedule from "../Components/PaymentSchedule/PaymentSchedule";
import { TabKey } from "../constants";
import HistoryApproval from "../ContractAnnexView/Components/Tabs/HistoryApprovalTab/HistoryApproval";
import { ContractAnnexDetailContext } from "./context";
import { useContractAnnexDetail } from "./ContractAnnexDetailHooks";
import { AnnexFile } from "./Tabs/AnnexFiles/AnnexFile";
import { AnnexFileModel } from "./Tabs/AnnexFiles/types";
import { GeneralInformation } from "./Tabs/GeneralInformation/GeneralInformation";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { contractAnnexRepository } from "../ContractAnnexRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

type TabsType = TabsProps["items"];

interface Parameters {
  contractId: string | undefined;
  id: string | undefined;
}

export const ContractAnnexDetail = () => {
  const { translate, onSave, ...contextValue } = useContractAnnexDetail();
  const { contractId, id } = useParams<Parameters>();
  const { model, dispatch, loading, errorsModal, setErrorsModal } =
    contextValue;
  const { state } = useCheckStateContractAnnex();

  const onAnnexFileChanged = useCallback(
    (documentGroups: DocumentGroup[]) => {
      dispatch({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          documentGroups: documentGroups || [],
        },
      });
    },
    [dispatch, model]
  );

  // Tab items
  const tabItems: TabsType = useMemo(() => {
    const contractTermsProps = { model, dispatch, isEditMode: true };

    const annexFile: AnnexFileModel = {
      id: model?.id,
      code: model?.code,
      name: model?.name,
      status: model?.status,
      documentGroups: model?.documentGroups,
      mode: isEqual(state, "CREATE") ? "CREATE" : "EDIT",
      errors: model?.errors,
    };

    const list: TabsType = [
      {
        key: TabKey.INFORMATION,
        label: (
          <TabName
            text={translate("CA.tab_information_general")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.INFORMATION)
            )}
          />
        ),
        children: <GeneralInformation />,
      },
      {
        key: TabKey.TERMS,
        label: (
          <TabName
            text={translate("CA.tab_terms")}
            isShowIconError={model?.errorTabs?.includes(Number(TabKey.TERMS))}
          />
        ),
        children: <ContractTerms {...contractTermsProps} />,
      },
      {
        key: TabKey.PAYMENT_SCHEDULE,
        label: (
          <TabName
            text={translate("CA.tab_payment_schedule")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.PAYMENT_SCHEDULE)
            )}
          />
        ),
        children: <PaymentSchedule {...contractTermsProps} />,
      },
      {
        key: TabKey.WARRANTY,
        label: (
          <TabName
            text={translate("CA.tab_warranty")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.WARRANTY)
            )}
          />
        ),
        children: <WarrantyGuaranteeTab />,
      },
      {
        key: TabKey.ATTACHMENT_FILES,
        label: (
          <TabName
            text={translate("CA.tab_attachment_files")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.ATTACHMENT_FILES)
            )}
          />
        ),
        children: <AnnexFile data={annexFile} onChange={onAnnexFileChanged} />,
      },
      {
        key: TabKey.APPROVAL_HISTORY,
        label: (
          <TabName
            text={translate("CA.tab_approval_history")}
            isShowIconError={model?.errorTabs?.includes(
              Number(TabKey.APPROVAL_HISTORY)
            )}
          />
        ),
        children: (
          <HistoryApproval
            status={model?.status}
            topicId={model?.id}
            model={model}
          />
        ),
      },
    ];

    if (isEqual(state, "CREATE")) {
      list.splice(-numberConstants.ONE);
    }

    return list;
  }, [dispatch, model, onAnnexFileChanged, state, translate]);

  const getTitle = useCallback(
    (type: "CREATE" | "EDIT") => {
      const { contractRequestType } = model?.contractInfo || {};
      const titles = CONTRACT_TITLES[type];
      const key = titles[contractRequestType] || titles[numberConstants.ZERO];

      return isEqual(type, "EDIT")
        ? translate(key, { code: model?.code })
        : translate(key);
    },
    [model, translate]
  );

  const title = useMemo(() => {
    if (!isUndefined(contractId)) return getTitle("CREATE");
    if (!isUndefined(id)) return getTitle("EDIT");
  }, [contractId, id, getTitle]);

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
        name: translate("CM.menu_title_contract"),
        path: CONTRACT_ROUTE,
      },
      {
        name: title,
        path: CONTRACT_ROUTE,
      },
    ];
  }, [translate, title]);

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    onSave({ isDraft: false });
  }, [contextValue]);

  return (
    <ContractAnnexDetailContext.Provider value={contextValue}>
      <ContractAnnexLayout
        title={title}
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        onSave={onSave}
        handleOpenSigningForm={handleOpenSigningForm}
        errorsModal={errorsModal}
        setErrorsModal={setErrorsModal}
        contractId={contractId}
        id={id}
      />
      {contextValue.model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField={"id"}
          repository={contractAnnexRepository}
          tempateType={SIGN_PROCESS_TYPE.CONTRACT_APPENDIX}
        />
      )}
      {loading ? <LoadingCM /> : null}
    </ContractAnnexDetailContext.Provider>
  );
};
