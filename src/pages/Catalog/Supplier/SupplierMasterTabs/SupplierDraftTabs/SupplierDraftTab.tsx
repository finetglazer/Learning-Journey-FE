import { EmptyData, LayoutMaster } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { isEmpty, lte } from "lodash";
import { Button } from "react-components-design-system";
import { SupplierAction } from "./Components/SupplierAction";
import { SupplierTable } from "./Components/SupplierTable";
import { SupplierContext, SupplierContextType } from "../../context";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AccountModal } from "./Components/AccountModal/AccountModal";

export const SupplierdraftTab = () => {
  const { ...contextValue } = useContext<SupplierContextType>(SupplierContext);

  const { validAction } = contextValue;

  const isEmptyData = () => {
    if (isEmpty(contextValue?.modelFilter?.search)) {
      return (
        isEmpty(contextValue?.list) &&
        lte(contextValue?.countFilter, numberConstants.ZERO)
      );
    }

    return false;
  };

  const [translate] = useTranslation();

  return (
    <div>
      {isEmptyData() ? (
        <EmptyData
          message={
            validAction("CREATE")
              ? `${
                  translate("CM.message_empty_data") +
                  translate("CM.let_add_new")
                }`
              : translate("CM.message_empty_data")
          }
        >
          {validAction("CREATE") && (
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={() => contextValue.handleGoDetail(null)}
            >
              {translate("BG.btn_add")}
            </Button>
          )}
        </EmptyData>
      ) : (
        <>
          <LayoutMaster>
            <LayoutMasterActions>
              <SupplierAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SupplierTable />
            </LayoutMasterContent>
          </LayoutMaster>
          <AccountModal />
        </>
      )}
    </div>
  );
};
