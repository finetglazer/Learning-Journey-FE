import { isEqual, isUndefined } from "lodash";

import {
  useUseElectronicInvoiceMasterHook,
  UseElectronicInvoiceContext,
} from "./UseElectronicInvoiceMasterHook";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { UseElectronicInvoiceAction } from "../Components/UseElectronicInvoiceAction";
import { UseElectronicInvoiceTable } from "../Components/UseElectronicInvoiceTable";
import { ChangeSubstitutePerson } from "../ChangeSubstitutePerson/ChangeSubstitutePerson";
import { UseElectronicInvoiceView } from "../UseElectronicInvoiceView/UseElectronicInvoiceView";

export const UseElectronicInvoiceMaster = () => {
  const {
    translate,
    breadcrumb,
    hasChangeSubstitute,
    isEmptyData,
    ...contextValue
  } = useUseElectronicInvoiceMasterHook();

  return (
    <UseElectronicInvoiceContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_use_electronic_invoice")}
          breadcrumbs={breadcrumb}
          hasTabs={false}
        />

        {isEmptyData() ? (
          <EmptyData message={translate("CM.message_empty_data")}></EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <UseElectronicInvoiceAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <UseElectronicInvoiceTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {hasChangeSubstitute && (
        <ChangeSubstitutePerson
          selectedElectronicInvoiceIds={
            contextValue.selectedElectronicInvoiceIds as string[]
          }
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.handleCloseModal();
          }}
        />
      )}

      <UseElectronicInvoiceView />
    </UseElectronicInvoiceContext.Provider>
  );
};
