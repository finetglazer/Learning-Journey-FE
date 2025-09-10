import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { UnitOfMeasureGroupMasterAction } from "./UnitOfMeasureGroupMasterAction";
import {
  UnitOfMeasureGroupMasterContext,
  useUnitOfMeasureGroupMasterHooks,
} from "./UnitOfMeasureGroupMasterHook";
import { UnitOfMeasureGroupMasterTable } from "./UnitOfMeasureGroupMasterTable";

import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import UnitOfMeasureGroupDetail from "../UnitOfMeasureGroupDetail/UnitOfMeasureGroupDetail";
import UnitOfMeasureGroupPreview from "../UnitOfMeasureGroupPreview/UnitOfMeasureGroupPreview";
import { UnitOfMeasureGroupModalDelete } from "./ModalDelete/UnitOfMeasureGroupModalDelete";

export const UnitOfMeasureGroupMaster = () => {
  const { translate, ...context } = useUnitOfMeasureGroupMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("unitOfMeasureGroups.title");
    const breadcrumbs = [
      ...goodsManagementBreadcrumb,
      {
        name: translate("unitOfMeasureGroups.breadcrumbs.unitOfMeasureGroup"),
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
    <UnitOfMeasureGroupMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("unitOfMeasureGroups.message_empty_data") +
                    translate("unitOfMeasureGroups.let_add_new")
                  }`
                : translate("unitOfMeasureGroups.message_empty_data")
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
              <UnitOfMeasureGroupMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <UnitOfMeasureGroupMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <UnitOfMeasureGroupDetail />
      <UnitOfMeasureGroupPreview />
      <UnitOfMeasureGroupModalDelete />
    </UnitOfMeasureGroupMasterContext.Provider>
  );
};
