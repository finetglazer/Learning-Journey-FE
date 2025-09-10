import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { GoodsServicesCategoryMasterAction } from "./GoodsServicesCategoryMasterAction";
import {
  GoodsServicesCategoryMasterContext,
  useGoodsServicesCategoryMasterHooks,
} from "./GoodsServicesCategoryMasterHook";
import { GoodsServicesCategoryMasterTable } from "./GoodsServicesCategoryMasterTable";

import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import GoodsServicesCategoryDetail from "../GoodsServicesCategoryDetail/GoodsServicesCategoryDetail";
import GoodsServicesCategoryPreview from "../GoodsServicesCategoryPreview/GoodsServicesCategoryPreview";
import { GoodsServicesCategoryModalDelete } from "./ModalDelete/GoodsServicesCategoryModalDelete";

export const GoodsServicesCategoryMaster = () => {
  const { translate, ...context } = useGoodsServicesCategoryMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("goodsServiceCategories.title");
    const breadcrumbs = [
      ...goodsManagementBreadcrumb,
      {
        name: translate(
          "goodsServiceCategories.breadcrumbs.goodsServicesCategory"
        ),
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
    <GoodsServicesCategoryMasterContext.Provider value={context}>
      <div className="page-content category-master">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("goodsServiceCategories.message_empty_data") +
                    translate("goodsServiceCategories.let_add_new")
                  }`
                : translate("goodsServiceCategories.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleOpenModal(null)}
              >
                {translate("CM.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <GoodsServicesCategoryMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <GoodsServicesCategoryMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <GoodsServicesCategoryDetail />
      <GoodsServicesCategoryModalDelete />
      <GoodsServicesCategoryPreview />
    </GoodsServicesCategoryMasterContext.Provider>
  );
};
