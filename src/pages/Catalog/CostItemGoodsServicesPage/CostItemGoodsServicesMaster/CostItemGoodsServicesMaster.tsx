import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import {
  APP_OVERVIEW,
  COST_ITEM_GOODS_SERVICES_MASTER_ROUTE,
} from "config/route-const";
import { isEmpty, lte } from "lodash";
import { CostItemGoodsServicesMasterAction } from "./CostItemGoodsServicesMasterAction";
import {
  CostItemGoodsServicesMasterContext,
  useCostItemGoodsServicesMasterHooks,
} from "./CostItemGoodsServicesMasterHook";
import { CostItemGoodsServicesMasterTable } from "./CostItemGoodsServicesMasterTable";
import { Button } from "react-components-design-system";
import { CostItemGoodsServicesModalDelete } from "./ModalDelete/CostItemGoodsServicesDelete";
import CostItemGoodsServicesPreview from "../CostItemGoodsServicesPreview/CostItemGoodsServicesPreview";

export const CostItemGoodsServicesMaster = () => {
  const { translate, ...context } = useCostItemGoodsServicesMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("costItemGoodsServices.title");
    const breadcrumbs = [
      {
        name: translate("costItemGoodsServices.breadcrumbs.home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate(
          "costItemGoodsServices.breadcrumbs.costItemGoodsServices"
        ),
        path: COST_ITEM_GOODS_SERVICES_MASTER_ROUTE,
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
    <CostItemGoodsServicesMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("costItemGoodsServices.message_empty_data") +
                    translate("costItemGoodsServices.let_add_new")
                  }`
                : translate("costItemGoodsServices.message_empty_data")
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
              <CostItemGoodsServicesMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CostItemGoodsServicesMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CostItemGoodsServicesModalDelete />
      <CostItemGoodsServicesPreview />
    </CostItemGoodsServicesMasterContext.Provider>
  );
};
