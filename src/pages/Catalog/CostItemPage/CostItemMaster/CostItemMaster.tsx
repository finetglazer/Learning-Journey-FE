import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { CostItemMasterAction } from "./CostItemMasterAction";
import {
  CostItemMasterContext,
  useCostItemMasterHooks,
} from "./CostItemMasterHook";
import { CostItemMasterTable } from "./CostItemMasterTable";

import { budgetManagementBreadcrumb } from "pages/Catalog/constants";
import CostItemDetail from "../CostItemDetail/CostItemDetail";
import CostItemPreview from "../CostItemPreview/CostItemPreview";
import { CostItemModalDelete } from "./ModalDelete/CostItemModalDelete";

export const CostItemMaster = () => {
  const { translate, ...context } = useCostItemMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("costItems.title");
    const breadcrumbs = [
      ...budgetManagementBreadcrumb,
      {
        name: translate("costItems.breadcrumbs.costItem"),
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
    <CostItemMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("costItems.message_empty_data") +
                    translate("costItems.let_add_new")
                  }`
                : translate("costItems.message_empty_data")
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
              <CostItemMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CostItemMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CostItemDetail />
      <CostItemPreview />
      <CostItemModalDelete />
    </CostItemMasterContext.Provider>
  );
};
