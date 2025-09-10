import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { POSITION_MASTER_ROUTE } from "config/route-const";
import { isEmpty, lte } from "lodash";

import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import PositionDetail from "../PositionDetail/PositionDetail";
import PositionPreview from "../PositionPreview/PositionPreview";
import { PositionModalDelete } from "./ModalDelete/PositionModalDelete";
import { PositionMasterAction } from "./PositionMasterAction";
import {
  PositionMasterContext,
  usePositionMasterHooks,
} from "./PositionMasterHook";
import { PositionMasterTable } from "./PositionMasterTable";

export const PositionMaster = () => {
  const { translate, ...context } = usePositionMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("positions.title");
    const breadcrumbs = [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("positions.breadcrumbs.position"),
        path: POSITION_MASTER_ROUTE,
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
    <PositionMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("positions.message_empty_data") +
                    translate("positions.let_add_new")
                  }`
                : translate("positions.message_empty_data")
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
              <PositionMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <PositionMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <PositionDetail />
      <PositionModalDelete />
      <PositionPreview />
    </PositionMasterContext.Provider>
  );
};
