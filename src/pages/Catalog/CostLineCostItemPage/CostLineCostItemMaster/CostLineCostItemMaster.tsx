import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";
import { budgetManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import CostLineCostItemPreview from "../CostLineCostItemPreview/CostLineCostItemPreview";
import { CostLineCostItemMasterAction } from "./CostLineCostItemMasterAction";
import {
  CostLineCostItemMasterContext,
  useCostLineCostItemMasterHooks,
} from "./CostLineCostItemMasterHook";
import { CostLineCostItemMasterTable } from "./CostLineCostItemMasterTable";
import { CostLineCostItemModalDelete } from "./ModalDelete/CostLineCostItemDelete";

export const CostLineCostItemMaster = () => {
  const { translate, ...context } = useCostLineCostItemMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("costLineCostItems.title");
    const breadcrumbs = [
      ...budgetManagementBreadcrumb,
      {
        name: translate("costLineCostItems.breadcrumbs.costLineCostItem"),
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
    <CostLineCostItemMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("costLineCostItems.message_empty_data") +
                    translate("costLineCostItems.let_add_new")
                  }`
                : translate("costLineCostItems.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleGoDetail()}
              >
                {translate("CM.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <CostLineCostItemMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CostLineCostItemMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CostLineCostItemModalDelete />
      <CostLineCostItemPreview />
    </CostLineCostItemMasterContext.Provider>
  );
};
