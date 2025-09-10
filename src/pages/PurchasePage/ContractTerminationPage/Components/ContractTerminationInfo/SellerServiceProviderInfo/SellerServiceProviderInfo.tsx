import React, { useContext } from "react";
import { Checkbox, FormItem, InputText } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import {
  EMAIL_REGEX,
  NOT_TAB_ENTER_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";

const SellerServiceProviderInfo = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext(
    ContractTerminationDetailHookContext
  );

  return (
    <div>
      <Row gutter={[12, 16]}>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierName")}
          >
            <InputText
              isRequired
              label={translate("CT.txt_supplier")}
              placeHolder={translate("settlement.placeHolder.supplierName")}
              value={model?.supplierName}
              onChange={handleChangeSingleField({
                fieldName: "supplierName",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierTaxCode"
            )}
          >
            <InputText
              label={translate("AC.txt_tax_id")}
              value={model?.supplierTaxCode}
              onChange={handleChangeSingleField({
                fieldName: "supplierTaxCode",
              })}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
              readOnly={true}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierAddress"
            )}
          >
            <InputText
              label={translate("CT.address")}
              placeHolder={translate("settlement.placeHolder.supplierAddress")}
              value={model?.supplierAddress}
              onChange={handleChangeSingleField({
                fieldName: "supplierAddress",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <div className="postion-relative">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "supplierRepresentative"
              )}
            >
              <div className="position-absolute payment-right_0">
                <Checkbox
                  label={translate("CT.create_contract.title.follow_attorney")}
                  checked={model?.isSupplierAuthorized}
                  onChange={handleChangeSingleField({
                    fieldName: "isSupplierAuthorized",
                  })}
                />
              </div>
              <InputText
                isRequired
                label={translate("CT.create_contract.title.legal_person")}
                placeHolder={translate(
                  "CT.create_contract.placeholder.legal_person"
                )}
                value={model?.supplierRepresentative}
                onChange={handleChangeSingleField({
                  fieldName: "supplierRepresentative",
                })}
                isSmall={false}
                maxLength={255}
                regexInput={NOT_TAB_ENTER_REGEX}
                translate={translate}
              />
            </FormItem>
          </div>
        </Col>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierPosition"
            )}
          >
            <InputText
              isRequired
              label={translate("AC.txt_position")}
              placeHolder={translate("settlement.placeHolder.supplierPosition")}
              value={model?.supplierPosition}
              onChange={handleChangeSingleField({
                fieldName: "supplierPosition",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>

        <Col sm={8}>
          {model?.isSupplierAuthorized && (
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "supplierAuthorizationLetter"
              )}
            >
              <InputText
                label={translate("CT.create_contract.title.power_of_attorney")}
                placeHolder={translate(
                  "CT.create_contract.placeholder.power_of_attorney"
                )}
                value={model?.supplierAuthorizationLetter}
                onChange={handleChangeSingleField({
                  fieldName: "supplierAuthorizationLetter",
                })}
                isSmall={false}
                maxLength={500}
                regexInput={NOT_TAB_ENTER_REGEX}
                translate={translate}
              />
            </FormItem>
          )}
        </Col>

        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierContact"
            )}
          >
            <InputText
              isRequired
              label={translate("CT.create_contract.title.contact_person")}
              placeHolder={translate(
                "CT.create_contract.placeholder.contact_person"
              )}
              value={model?.supplierContact}
              onChange={handleChangeSingleField({
                fieldName: "supplierContact",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierEmail")}
          >
            <InputText
              isRequired
              label={translate("CT.create_contract.title.contact_email")}
              placeHolder={translate(
                "CT.create_contract.placeholder.contact_email"
              )}
              value={model?.supplierEmail}
              onChange={handleChangeSingleField({
                fieldName: "supplierEmail",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={EMAIL_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierPhone")}
          >
            <InputText
              label={translate("CT.phone_number")}
              placeHolder={translate("PR.plh_telephone_number")}
              value={model?.supplierPhone}
              onChange={handleChangeSingleField({
                fieldName: "supplierPhone",
              })}
              isSmall={false}
              translate={translate}
              maxLength={20}
              regexInput={PHONE_NUMBER_REGEX}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default SellerServiceProviderInfo;
