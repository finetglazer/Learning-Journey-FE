import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { UnitOfMeasureMasterAction } from "./UnitOfMeasureMasterAction";
import {
  UnitOfMeasureMasterContext,
  useUnitOfMeasureMasterHooks,
} from "./UnitOfMeasureMasterHook";
import { UnitOfMeasureMasterTable } from "./UnitOfMeasureMasterTable";

import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import UnitOfMeasureDetail from "../UnitOfMeasureDetail/UnitOfMeasureDetail";
import UnitOfMeasurePreview from "../UnitOfMeasurePreview/UnitOfMeasurePreview";
import { UnitOfMeasureModalDelete } from "./ModalDelete/UnitOfMeasureModalDelete";

export const UnitOfMeasureMaster = () => {
  const { translate, ...context } = useUnitOfMeasureMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("unitOfMeasures.title");
    const breadcrumbs = [
      ...goodsManagementBreadcrumb,
      {
        name: translate("unitOfMeasures.breadcrumbs.unitOfMeasure"),
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
    <UnitOfMeasureMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("unitOfMeasures.message_empty_data") +
                    translate("unitOfMeasures.let_add_new")
                  }`
                : translate("unitOfMeasures.message_empty_data")
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
              <UnitOfMeasureMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <UnitOfMeasureMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <UnitOfMeasureDetail />
      <UnitOfMeasurePreview />
      <UnitOfMeasureModalDelete />
    </UnitOfMeasureMasterContext.Provider>
  );
};
