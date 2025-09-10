import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { GoodServiceTypeMasterAction } from "./GoodServiceTypeMasterAction";
import {
  GoodServiceTypeMasterContext,
  useGoodServiceTypeMasterHooks,
} from "./GoodServiceTypeMasterHook";
import { GoodServiceTypeMasterTable } from "./GoodServiceTypeMasterTable";

import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import GoodServiceTypeDetail from "../GoodServiceTypeDetail/GoodServiceTypeDetail";
import GoodServiceTypePreview from "../GoodServiceTypePreview/GoodServiceTypePreview";
import { GoodServiceTypeModalDelete } from "./ModalDelete/GoodServiceTypeModalDelete";

export const GoodServiceTypeMaster = () => {
  const { translate, ...context } = useGoodServiceTypeMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("goodServiceTypes.title");
    const breadcrumbs = [
      ...goodsManagementBreadcrumb,
      {
        name: translate("goodServiceTypes.breadcrumbs.goodServiceType"),
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
    <GoodServiceTypeMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("goodServiceTypes.message_empty_data") +
                    translate("goodServiceTypes.let_add_new")
                  }`
                : translate("goodServiceTypes.message_empty_data")
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
              <GoodServiceTypeMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <GoodServiceTypeMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <GoodServiceTypeDetail />
      <GoodServiceTypePreview />
      <GoodServiceTypeModalDelete />
    </GoodServiceTypeMasterContext.Provider>
  );
};
