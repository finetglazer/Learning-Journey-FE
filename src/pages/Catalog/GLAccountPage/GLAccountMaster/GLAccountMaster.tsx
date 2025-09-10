import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { othersManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import GLAccountDetail from "../GLAccountDetail/GLAccountDetail";
import GLAccountPreview from "../GLAccountPreview/GLAccountPreview";
import { GLAccountMasterAction } from "./GLAccountMasterAction";
import {
  GLAccountMasterContext,
  useGLAccountMasterHooks,
} from "./GLAccountMasterHook";
import { GLAccountMasterTable } from "./GLAccountMasterTable";
import { GLAccountModalDelete } from "./ModalDelete/GLAccountModalDelete";

export const GLAccountMaster = () => {
  const { translate, ...context } = useGLAccountMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("glAccounts.title");
    const breadcrumbs = [
      ...othersManagementBreadcrumb,
      {
        name: translate("glAccounts.breadcrumbs.glAccount"),
      },
    ];

    return <PageHeader title={title} breadcrumbs={breadcrumbs}></PageHeader>;
  };

  function getEmptyData(): boolean {
    if (isEmpty(context?.modelFilter?.search)) {
      return isEmpty(context?.list) && lte(context.countFilter, 0);
    } else {
      return false;
    }
  }

  return (
    <GLAccountMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("glAccounts.message_empty_data") +
                    translate("glAccounts.let_add_new")
                  }`
                : translate("glAccounts.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleOpenModal(null, "detail")}
              >
                {translate("CM.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <GLAccountMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <GLAccountMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <GLAccountDetail />

      <GLAccountPreview />
      <GLAccountModalDelete />
    </GLAccountMasterContext.Provider>
  );
};
