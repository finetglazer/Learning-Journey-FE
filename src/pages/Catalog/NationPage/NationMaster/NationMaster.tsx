import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { othersManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import NationDetail from "../NationDetail/NationDetail";
import NationPreview from "../NationPreview/NationPreview";
import { NationModalDelete } from "./ModalDelete/NationModalDelete";
import { NationMasterAction } from "./NationMasterAction";
import { NationMasterContext, useNationMasterHooks } from "./NationMasterHook";
import { NationMasterTable } from "./NationMasterTable";

export const NationMaster = () => {
  const { translate, ...context } = useNationMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("nations.title");
    const breadcrumbs = [
      ...othersManagementBreadcrumb,
      {
        name: title,
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
    <NationMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("nations.message_empty_data") +
                    translate("nations.let_add_new")
                  }`
                : translate("nations.message_empty_data")
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
              <NationMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <NationMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <NationDetail />
      <NationModalDelete />
      <NationPreview />
    </NationMasterContext.Provider>
  );
};
