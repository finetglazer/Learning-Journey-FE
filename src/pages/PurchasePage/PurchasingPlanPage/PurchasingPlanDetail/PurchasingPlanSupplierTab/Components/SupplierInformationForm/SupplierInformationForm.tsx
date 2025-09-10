import { Col, Row } from "antd";
import { DESCRIPTION_REGEX, PHONE_NUMBER_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { Contact } from "models/CentralPurchaseUnit";
import {
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierContact,
} from "models/PurchasingPlan";
import { useContext } from "react";
import { ModelFilter } from "react-3layer-common";
import { FormItem, InputText, Select } from "react-components-design-system";
import { delay, map, Observable, of } from "rxjs";
import { PurchasingPlanDetailHookContext } from "../../../PurchasingPlanDetailHook";

const SupplierInformationForm = () => {
  const { translate, model, handleChangeSingleField, handleChangeAllField } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);
  const handleChangeEmail = (object: any) => {
    handleChangeAllField({
      ...model,
      quoteEmailId: object?.id,
      quoteEmail: object?.email,
      quoteName: object?.name,
      phoneNumber: object?.phone,
      errors: {
        ...model.errors,
        quoteEmail: null,
      },
    });
  };
  const supplierContacts =
    model?.supplierContacts ||
    model?.supplierPurchasePlans?.[0]?.supplierContacts ||
    [];

  const getSearchingFilter = (
    model: ModelFilter
  ): Observable<SupplierContact[]> => {
    const search = model?.searchText?.contain?.trim().toLowerCase() ?? "";
    return of(supplierContacts).pipe(
      delay(300),
      map((contacts) =>
        contacts?.filter(
          (contact: Contact) =>
            contact?.email.toLowerCase().includes(search) ||
            contact?.name?.toLowerCase().includes(search)
        )
      )
    );
  };

  const valueEmailObject = {
    id: model?.quoteEmailId,
    name: model?.quoteName,
    email: model?.quoteEmail,
  };
  // form file target
  return (
    <div>
      <Row gutter={12}>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_tax_code_label")}
            value={model.listSupplier[0]?.taxCode}
            isSmall={false}
          />
        </Col>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_name_supplier")}
            value={model.listSupplier[0]?.name}
            isSmall={false}
          />
        </Col>
      </Row>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_type_supplier")}
              value={model.listSupplier[0]?.type}
              isSmall={false}
            />
          </Col>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_supplier_address")}
              value={model.listSupplier[0]?.address}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "quoteEmail")}
            >
              <Select
                label={translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
                )}
                placeHolder={translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price_placeholder"
                )}
                classFilter={SearchingFilterModel}
                searchProperty="searchText"
                isSearch={true}
                isSmall={false}
                getList={getSearchingFilter}
                value={valueEmailObject}
                onChange={(_, object) => {
                  handleChangeEmail(object);
                }}
                isEnumerable={false}
                isRequired
                appendToBody
                render={(valueRender) => {
                  return valueRender?.email;
                }}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "quoteName")}
            >
              <InputText
                isRequired
                label={translate(
                  "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
                )}
                placeHolder={translate(
                  "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price_placeholder"
                )}
                onChange={handleChangeSingleField({
                  fieldName: "quoteName",
                })}
                value={model.quoteName}
                isSmall={false}
                allowClear={true}
                translate={translate}
                maxLength={255}
                regexInput={DESCRIPTION_REGEX}
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <InputText
          label={translate("PL.purchasing_plan_phone_number_supplier_label")}
          placeHolder={translate(
            "PL.purchasing_plan_phone_number_supplier_label_placeholder"
          )}
          isSmall={false}
          onChange={handleChangeSingleField({
            fieldName: "phoneNumber",
          })}
          value={model.phoneNumber}
          maxLength={20}
          regexInput={PHONE_NUMBER_REGEX}
          translate={translate}
        />
      </div>
    </div>
  );
};

export default SupplierInformationForm;
