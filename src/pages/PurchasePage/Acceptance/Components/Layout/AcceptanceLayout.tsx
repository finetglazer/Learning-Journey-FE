import type { TabsProps } from "antd";
import { ModalSubmitError, PageHeader } from "components";
import { ACCEPTANCE_ROUTE_MASTER, APP_OVERVIEW } from "config/route-const";
import { ModalTypeError } from "core/models/Common/ErrorModal";
import { isEqual } from "lodash";
import { GroupActionAcceptance } from "pages/PurchasePage/Acceptance/Components/GroupActionAcceptance/GroupActionAcceptance";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface AcceptanceLayoutProps {
  title: string;
  status: {
    value: string;
    status: string;
  };
  tabItems: TabsProps["items"];
  errorsModal?: ModalTypeError;
  setErrorsModal?: Dispatch<SetStateAction<ModalTypeError>>;
}

export const AcceptanceLayout = ({
  title,
  status,
  tabItems,
  errorsModal,
  setErrorsModal,
}: AcceptanceLayoutProps) => {
  const [translate] = useTranslation();
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
        name: translate("CM.menu_title_acceptance"),
        path: ACCEPTANCE_ROUTE_MASTER,
      },
      {
        name: title,
      },
    ];
  }, [title, translate]);

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={title}
          breadcrumbs={breadcrumbs}
          isShowBackButton
          rightComponentTitle={
            <Tag
              {...status}
              className="m-l--2xs"
              size="sm"
              isShowDot={false}
              isShowBorder
            />
          }
        >
          <GroupActionAcceptance />
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
