import { Tabs } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { isNil } from "lodash";
import LayoutMasterActions from "../../../components/LayoutMaster/LayoutMasterActions";
import { AppUser } from "../../../models/AppUser";
import { PaymentConfirmModal } from "../PaymentConfirmModal/PaymentConfirmModal";
import "./PaymentMaster.scss";
import {
  PaymentMasterContext,
  usePaymentMasterHook,
} from "./PaymentMasterHook";
import PaymentMasterTab from "./PaymentMasterTab/PaymentMasterTab";
import PaymentMasterTabAction from "./PaymentMasterTab/PaymentMasterTabAction";

const PaymentMaster = () => {
  const { translate, ...contextValue } = usePaymentMasterHook();

  const operations = () => {
    return (
      <div className="d-flex payment-tab_custom">
        <LayoutMasterActions>
          <PaymentMasterTabAction />
        </LayoutMasterActions>
      </div>
    );
  };

  return (
    <>
      <PaymentMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("PM.title_list")}
            breadcrumbs={contextValue.breadcrumb}
            hasTabs={true}
          />
          <div className="tab__master">
            <Tabs
              tabBarExtraContent={operations()}
              tabBarStyle={{
                // padding: "0 20px",
                marginTop: 12,
                marginBottom: 12,
              }}
              className={"payment-tab__master"}
              tabBarGutter={12}
            />

            <PaymentMasterTab />
          </div>
        </div>
        {/* Modal */}
        {!isNil(contextValue.modelSelected?.model) ? (
          <PaymentConfirmModal<AppUser>
            model={contextValue.modelSelected.model}
            type={contextValue.modelSelected.type}
            isLoading={contextValue?.isLoadingModal}
            errorMessage={contextValue.modelSelected?.errorMessage}
            onApply={contextValue.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue.setModelSelected(null)}
          />
        ) : null}
      </PaymentMasterContext.Provider>
    </>
  );
};

export default PaymentMaster;
