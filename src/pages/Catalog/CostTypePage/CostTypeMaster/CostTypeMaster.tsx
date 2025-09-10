import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { TAX_MASTER_ROUTE } from "config/route-const";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { CostTypeMasterAction } from "./CostTypeMasterAction";
import {
  CostTypeMasterContext,
  useCostTypeMasterHooks,
} from "./CostTypeMasterHook";
import { CostTypeMasterTable } from "./CostTypeMasterTable";

import { budgetManagementBreadcrumb } from "pages/Catalog/constants";
import CostTypeDetail from "../CostTypeDetail/CostTypeDetail";
import CostTypePreview from "../CostTypePreview/CostTypePreview";
import { CostTypeModalDelete } from "./ModalDelete/CostTypeModalDelete";

export const CostTypeMaster = () => {
  const { translate, ...context } = useCostTypeMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("costTypes.title");
    const breadcrumbs = [
      ...budgetManagementBreadcrumb,
      {
        name: translate("costTypes.breadcrumbs.costType"),
        path: TAX_MASTER_ROUTE,
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
    <CostTypeMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("costTypes.message_empty_data") +
                    translate("costTypes.let_add_new")
                  }`
                : translate("costTypes.message_empty_data")
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
              <CostTypeMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CostTypeMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CostTypeDetail />
      <CostTypeModalDelete />
      <CostTypePreview />
    </CostTypeMasterContext.Provider>
  );
};
