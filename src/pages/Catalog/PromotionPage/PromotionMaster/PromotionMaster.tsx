import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { PROMOTION_MASTER_ROUTE } from "config/route-const";
import { isEmpty, lte } from "lodash";

import { othersManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import PromotionDetail from "../PromotionDetail/PromotionDetail";
import PromotionPreview from "../PromotionPreview/PromotionPreview";
import { PromotionModalDelete } from "./ModalDelete/PromotionModalDelete";
import { PromotionMasterAction } from "./PromotionMasterAction";
import {
  PromotionMasterContext,
  usePromotionMasterHooks,
} from "./PromotionMasterHook";
import { PromotionMasterTable } from "./PromotionMasterTable";

export const PromotionMaster = () => {
  const { translate, ...context } = usePromotionMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("promotions.title");
    const breadcrumbs = [
      ...othersManagementBreadcrumb,
      {
        name: translate("promotions.breadcrumbs.promotion"),
        path: PROMOTION_MASTER_ROUTE,
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
    <PromotionMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("promotions.message_empty_data") +
                    translate("promotions.let_add_new")
                  }`
                : translate("promotions.message_empty_data")
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
              <PromotionMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <PromotionMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <PromotionDetail />

      <PromotionPreview />
      <PromotionModalDelete />
    </PromotionMasterContext.Provider>
  );
};
