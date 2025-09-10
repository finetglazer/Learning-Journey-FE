import { Col, Row } from "antd";
import {
  DESCRIPTION_REGEX,
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useEffect } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";

const SupplierInformationForm = ({
  translate,
  model,
  handleChangeSingleField,
  handleChangeDateField,
  handleChangeSelectField,
  handleChangeAllField,
}: PurchasingPlanModel) => {
  const categoryId =
    model.goodsItems?.map(
      (item: { category: { id: string } }) => item?.category?.id
    ) || [];

  useEffect(() => {
    const result = {
      ...model,
    };

    if (
      model?.listSupplier &&
      model.listSupplier.length > 0 &&
      model.listSupplier[0]
    ) {
      Object.assign(result, {
        taxCode: {
          id: model.listSupplier[0].id,
          name: model.listSupplier[0].name,
          code: model.listSupplier[0].taxCode,
        },
        supplierName: model.listSupplier[0].name,
        supplierType: model.listSupplier[0].type,
        supplierAddress: model.listSupplier[0].type,
      });
    }

    if (model?.supplierPurchasePlans?.[0]?.supplierId) {
      Object.assign(result, {
        supplierId: model.supplierPurchasePlans[0].supplierId,
      });
    }

    if (model?.supplierName) {
      Object.assign(result, {
        supplierName: model.supplierName,
      });
    }
    if (model?.supplierType) {
      Object.assign(result, {
        supplierType: model.supplierType,
      });
    }
    if (model?.supplierAddress) {
      Object.assign(result, {
        supplierAddress: model.supplierAddress,
      });
    }
    if (model?.supplierId) {
      Object.assign(result, {
        supplierId: model.supplierId,
      });
    }

    handleChangeAllField(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleChangeAllField, model?.listSupplier]);

  return (
    <div>
      <div>
        <Row gutter={12}>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "roundStartDate"
              )}
            >
              <DatePicker
                label={translate("PL.purchasing_plan_bidding_start_time")}
                placeholder={"dd/mm/yyyy"}
                isSmall={false}
                isRequired
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "roundStartDate",
                })}
                value={model.roundStartDate}
                minDate={dayjs()}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "roundEndDate")}
            >
              <DatePicker
                label={translate("PL.purchasing_plan_bidding_end_time")}
                placeholder={"dd/mm/yyyy"}
                isSmall={false}
                isRequired
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "roundEndDate",
                })}
                value={model.roundEndDate}
                minDate={
                  model.roundStartDate ? dayjs(model.roundStartDate) : dayjs()
                }
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <Select
              isRequired
              label={translate("PL.purchasing_plan_tax_code_label")}
              isSmall={false}
              classFilter={undefined}
              valueFilter={{
                name: "",
                pageIndex: 1,
                pageSize: 100,
                categoryIds: categoryId,
              }}
              isSearch
              searchType=""
              searchProperty="name"
              getList={purchasingPlanRepository.getListTaxCodeSupplier}
              value={model.taxCode}
              onChange={(id, value) => {
                handleChangeAllField({
                  ...model,
                  supplierName: value.name,
                  supplierType: value.type,
                  supplierAddress: value.address,
                  supplierId: value.id,
                });
                handleChangeSelectField({
                  fieldName: "taxCode",
                })(id, value);
              }}
              render={(item) => item?.code || ""}
              isEnumerable={false}
            />
          </Col>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_name_supplier")}
              value={model.supplierName}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_type_supplier")}
              value={model.supplierType}
              isSmall={false}
            />
          </Col>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_supplier_address")}
              value={model.supplierAddress}
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
              <InputText
                isRequired
                label={translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
                )}
                placeHolder={translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price_placeholder"
                )}
                onChange={handleChangeSingleField({
                  fieldName: "quoteEmail",
                })}
                value={model.quoteEmail}
                isSmall={false}
                allowClear={true}
                translate={translate}
                regexInput={EMAIL_REGEX}
                maxLength={255}
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
      <div className="p-t--sm">
        <FormItem validateObject={utilService.getValidateObj(model, "content")}>
          <TextArea
            label={translate("PL.purchasing_plan_content")}
            placeHolder={translate("PL.purchasing_plan_content_placeholder")}
            showCount
            maxLength={500}
            resize="none"
            onChange={handleChangeSingleField({ fieldName: "content" })}
            value={model.content}
            translate={translate}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default SupplierInformationForm;
