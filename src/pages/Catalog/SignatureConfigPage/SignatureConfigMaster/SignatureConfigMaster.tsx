import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { signatureManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import SignatureConfigDetail from "../SignatureConfigDetail/SignatureConfigDetail";
import SignatureConfigPreview from "../SignatureConfigPreview/SignatureConfigPreview";
import { SignatureConfigModalDelete } from "./ModalDelete/SignatureConfigModalDelete";
import { SignatureConfigMasterAction } from "./SignatureConfigMasterAction";
import {
  SignatureConfigMasterContext,
  useSignatureConfigMasterHooks,
} from "./SignatureConfigMasterHook";
import { SignatureConfigMasterTable } from "./SignatureConfigMasterTable";

export const SignatureConfigMaster = () => {
  const { translate, ...context } = useSignatureConfigMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("signatureConfigs.title");
    const breadcrumbs = [
      ...signatureManagementBreadcrumb,
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
    <SignatureConfigMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("signatureConfigs.message_empty_data") +
                    translate("signatureConfigs.let_add_new")
                  }`
                : translate("signatureConfigs.message_empty_data")
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
              <SignatureConfigMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SignatureConfigMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <SignatureConfigDetail />
      <SignatureConfigModalDelete />
      <SignatureConfigPreview />
    </SignatureConfigMasterContext.Provider>
  );
};
