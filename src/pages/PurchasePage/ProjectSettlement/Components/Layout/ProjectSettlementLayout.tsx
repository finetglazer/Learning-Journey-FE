import type { TabsProps } from "antd";
import { ModalSubmitError, PageHeader } from "components";
import {
  APP_OVERVIEW,
  PROJECT_SETTLEMENT_MASTER_ROUTE,
} from "config/route-const";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { isEqual } from "lodash";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useProjectSettlementDetailContext } from "../../ProjectSettlementDetail/context";
import { ProjectSettlementModal } from "../constant";
import { GroupActions } from "../GroupActions/GroupActions";
import { useGetStatusProjectSettlement } from "../hooks/useGetStatusProjectSettlement";

interface ProjectSettlementLayoutProps {
  title: string;
  tabItems: TabsProps["items"];
  status?: {
    value: string;
    status: string;
  };
  errorsModal?: ModalTypeError;
  setErrorsModal?: Dispatch<SetStateAction<ModalTypeError>>;
  onClickButton?: (type: ProjectSettlementModal) => void;
}

export const ProjectSettlementLayout = ({
  title,
  tabItems,
  errorsModal,
  setErrorsModal,
  onClickButton,
}: ProjectSettlementLayoutProps) => {
  const [translate] = useTranslation();
  const { model, onCreate, handleChangeSingleField, loading } =
    useProjectSettlementDetailContext();
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

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={title}
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
          isShowBackButton
        >
          <GroupActions
            model={model}
            onSave={onCreate}
            onClickButton={onClickButton}
            loading={loading}
            handleChangeSingleField={handleChangeSingleField}
          />
        </PageHeader>

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
