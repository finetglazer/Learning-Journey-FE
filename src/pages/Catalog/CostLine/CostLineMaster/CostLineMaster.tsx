import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";
import { budgetManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import { CostLineCreate } from "../CostLineCreate/CostLineCreate";
import { CostLineDelete } from "../CostLineDelete/CostLineDelete";
import { ConstLineDetail } from "../CostLineDetail/CostLineDetail";
import { CostLineUpdate } from "../CostLineUpdate/CostLineUpdate";
import { CostLineMasterAction } from "./CostLineMasterAction";
import {
  CostLineMasterContext,
  useCostLineMasterHooks,
} from "./CostLineMasterHook";
import { CostLineMasterTable } from "./CostLineMasterTable";
import { authorizationService } from "core/services/common-services/authorization-service";

export const CostLineMaster = () => {
  const { translate, ...context } = useCostLineMasterHooks();

  const { validAction } =
    authorizationService.useAuthorizedAction("CATALOG_COSTLINE");

  const makeAddNewButton = () => {
    return (
      validAction("CREATE") && (
        <Button
          iconPlace="right"
          type="primary"
          size="lg"
          onClick={() => context.setModalType({ type: "CREATE" })}
        >
          {translate("CM.btn_add")}
        </Button>
      )
    );
  };

  const _renderPageHeader = () => {
    const title = translate("CL.title");
    const breadcrumbs = [
      ...budgetManagementBreadcrumb,
      {
        name: translate("CM.menu_title_cost_line"),
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
    <CostLineMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("CL.message_empty_data") +
                    translate("CL.let_add_new")
                  }`
                : translate("CL.message_empty_data")
            }
          >
            {makeAddNewButton()}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <CostLineMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CostLineMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CostLineCreate />
      <ConstLineDetail />
      <CostLineDelete />
      <CostLineUpdate />
    </CostLineMasterContext.Provider>
  );
};
