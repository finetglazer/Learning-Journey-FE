import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";
import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import { GoodsServicesMasterAction } from "./GoodsServicesMasterAction";
import {
  GoodsServicesMasterContext,
  useGoodsServicesMasterHooks,
} from "./GoodsServicesMasterHook";
import { GoodsServicesMasterTable } from "./GoodsServicesMasterTable";
import { GoodsServicesModalDelete } from "./ModalDelete/GoodsServicesDelete";

export const GoodsServicesMaster = () => {
  const { translate, ...context } = useGoodsServicesMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("goodsServices.title");
    const breadcrumbs = [
      ...goodsManagementBreadcrumb,
      {
        name: translate("goodsServices.breadcrumbs.goodsServices"),
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
    <GoodsServicesMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("goodsServices.message_empty_data") +
                    translate("goodsServices.let_add_new")
                  }`
                : translate("goodsServices.message_empty_data")
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
              <GoodsServicesMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <GoodsServicesMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <GoodsServicesModalDelete />
    </GoodsServicesMasterContext.Provider>
  );
};
