import { TabsProps } from "antd/lib/tabs";
import { ModalSubmitError, PageHeader } from "components";
import { BreadcrumbInterface } from "components/PageHeader/PageHeader";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { isEqual } from "lodash";
import { useGetStatusProjectSettlement } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useGetStatusProjectSettlement";
import { Dispatch, SetStateAction } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { GroupActions } from "../GroupActions/GroupActions";
import { useContractAnnexDetailContext } from "../../ContractAnnexDetail/context";

interface ContractAnnexLayoutProps {
  title?: string;
  breadcrumbs?: BreadcrumbInterface[];
  tabItems: TabsProps["items"];
  status?: number;
  onSave?: (params: { isDraft: boolean }) => void;
  setErrorsModal?: Dispatch<SetStateAction<ModalTypeError>>;
  errorsModal?: ModalTypeError;
  contractId?: string;
  id?: string;
  handleOpenSigningForm?: () => void;
}

export const ContractAnnexLayout = ({
  title,
  tabItems,
  breadcrumbs = [],
  status,
  onSave,
  errorsModal,
  setErrorsModal,
  contractId,
  id,
  handleOpenSigningForm,
}: ContractAnnexLayoutProps) => {
  const { statusProjectSettlement } = useGetStatusProjectSettlement({
    status: status,
    contractId,
    id,
  });

  const { model } = useContractAnnexDetailContext();

  const StatusView = () => {
    return (
      <Tag
        {...statusProjectSettlement}
        isShowDot={false}
        isShowBorder
        size="sm"
        className="m-l--2xs"
      />
    );
  };

  return (
    <>
      <div className="page-content">
        <PageHeader
          isShowBackButton
          title={title}
          breadcrumbs={breadcrumbs}
          rightComponentTitle={<StatusView />}
        >
          {/* Group actions */}
          <GroupActions
            onSave={onSave}
            model={model}
            handleOpenSigningForm={handleOpenSigningForm}
          />
        </PageHeader>
        {/* Tabs */}
        <div className="tab__master">
          <Tabs
            tabPosition="top"
            mode="line"
            items={tabItems}
            destroyInactiveTabPane={false}
          />
        </div>
      </div>
      {isEqual(errorsModal?.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={errorsModal?.errors}
          onClose={() => setErrorsModal({ type: "NONE" })}
        />
      )}
    </>
  );
};
