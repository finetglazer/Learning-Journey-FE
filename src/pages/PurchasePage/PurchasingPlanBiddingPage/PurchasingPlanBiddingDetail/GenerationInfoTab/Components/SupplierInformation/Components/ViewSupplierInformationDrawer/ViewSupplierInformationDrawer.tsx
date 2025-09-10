import {
  SearchingFilterModel,
  SupplierContact,
  SupplierModel,
} from "models/PurchasingPlan";
import {
  Drawer,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";

import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import EmailRecipientDetails from "./Components/EmailRecipientDetails";
import ViewSupplier from "./Components/ViewSupplier";
import styles from "./ViewSupplierInformationDrawer.module.scss";
import { utilService } from "core/services/common-services/util-service";
import { Model } from "react-3layer-common";
import lowerCase from "lodash/lowerCase";

interface IProps {
  selectedSupplier: SupplierModel;
  onCancel: () => void;
  onSave: () => void;
  onChangeData: (data: SupplierModel) => void;
  isDetail?: boolean;
  modelValidate?: Model;
  fieldValidate?: string;
}

export default function ViewSupplierInformationDrawer({
  selectedSupplier,
  onSave,
  onCancel,
  onChangeData,
  isDetail = false,
  modelValidate,
  fieldValidate = "",
}: IProps) {
  const [translate] = useTranslation();

  return (
    <Drawer
      title={
        <div className="fw-bold">
          <span>{translate("PL.purchasing_plan_supplier_information")}</span>
        </div>
      }
      handleCancel={onCancel}
      handleClose={onCancel}
      handleSave={onSave}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_save")}
      className={styles["modal-container"]}
      size="lg"
      disableButtonDelete={isEmpty(selectedSupplier?.supplierContactSelected)}
      isShowButtonApply={!isDetail}
      loading={false}
      visible
    >
      {isDetail ? (
        <ViewSupplier data={selectedSupplier} />
      ) : (
        <>
          <div className={styles["form-container"]}>
            <div className={styles["form-item"]}>
              <InputText
                label={translate("PL.purchasing_plan_tax_code_supplier_label")}
                value={selectedSupplier?.taxCode}
                isSmall={false}
                readOnly
              />
            </div>
            <div className={styles["form-item"]}>
              <InputText
                label={translate("PL.purchasing_plan_supplier_name")}
                value={selectedSupplier?.name}
                isSmall={false}
                readOnly
              />
            </div>
            <div className={styles["form-item"]}>
              <InputText
                label={translate("PL.purchasing_plan_type_supplier")}
                value={
                  selectedSupplier?.supplierType?.name ?? selectedSupplier?.type
                }
                isSmall={false}
                readOnly
              />
            </div>
            <div className={styles["form-item"]}>
              <InputText
                label={translate("PL.drawer_address_supplier")}
                value={selectedSupplier?.address}
                isSmall={false}
                readOnly
              />
            </div>
            <div className={styles["form-item"]}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  modelValidate,
                  fieldValidate
                )}
              >
                <Select
                  label={translate("PL.drawer_email_person_quoting_price")}
                  classFilter={SearchingFilterModel}
                  getList={(filter) =>
                    of(
                      selectedSupplier?.supplierContacts.filter(
                        (el) =>
                          lowerCase(el.email)?.includes(
                            lowerCase(filter?.name)
                          ) ||
                          lowerCase(el.name)?.includes(lowerCase(filter?.name))
                      ) ?? []
                    )
                  }
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  value={selectedSupplier?.supplierContactSelected}
                  render={(valueRender) => valueRender?.email}
                  onChange={(value, optionSelected) =>
                    onChangeData({
                      supplierContactSelected:
                        optionSelected as SupplierContact,
                      quoteEmail: optionSelected?.email,
                      quoteId: optionSelected?.id,
                      quoteName: optionSelected?.name,
                      phoneNumber: optionSelected?.phone,
                    })
                  }
                  isEnumerable={false}
                  isSmall={false}
                  isRequired={!isDetail}
                  readOnly={isDetail}
                  appendToBody
                  isSearch
                />
              </FormItem>
            </div>
            <div className={styles["form-item"]}>
              <InputText
                label={translate("PL.drawer_name_person_quoting_price")}
                value={selectedSupplier?.quoteName}
                isSmall={false}
                readOnly
              />
            </div>
            <div className={classNames(styles["form-item"], "w-100")}>
              <InputText
                label={translate(
                  "PL.purchasing_plan_phone_number_supplier_label"
                )}
                value={selectedSupplier?.phoneNumber}
                isSmall={false}
                readOnly
              />
            </div>
          </div>
          <CollapseView
            items={[
              {
                key: "1",
                label: translate(
                  "PL.purchasing_plan_email_receiver_information"
                ),
                children: (
                  <EmailRecipientDetails
                    data={selectedSupplier.emailRecipients ?? []}
                    onChangeData={onChangeData}
                    isDetail={isDetail}
                  />
                ),
              },
            ]}
            defaultActiveKey={["1"]}
            className="collapse__container__overflow collapse__container--not-border"
            isShowTopDivider={false}
          />
        </>
      )}
    </Drawer>
  );
}
