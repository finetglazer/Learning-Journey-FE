import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import RankDetail from "../RankDetail/RankDetail";
import RankPreview from "../RankPreview/RankPreview";
import { RankModalDelete } from "./ModalDelete/RankModalDelete";
import { RankMasterAction } from "./RankMasterAction";
import { RankMasterContext, useRankMasterHooks } from "./RankMasterHook";
import { RankMasterTable } from "./RankMasterTable";

export const RankMaster = () => {
  const { translate, ...context } = useRankMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("ranks.title");
    const breadcrumbs = [
      ...organizationManagementBaseBreadcrumb,
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
    <RankMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("ranks.message_empty_data") +
                    translate("ranks.let_add_new")
                  }`
                : translate("ranks.message_empty_data")
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
              <RankMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <RankMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <RankDetail />
      <RankModalDelete />
      <RankPreview />
    </RankMasterContext.Provider>
  );
};
