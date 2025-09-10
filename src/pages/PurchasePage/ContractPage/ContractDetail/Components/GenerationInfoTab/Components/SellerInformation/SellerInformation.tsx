import { useContext, useEffect, useMemo, useRef } from "react";
import "./SellerInformation.scss";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ContractDetailModel, ContractSupplierModel } from "models/Contract";
import {
  Checkbox,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { map, of } from "rxjs";
import { GeneralActionEnum } from "core/services/service-types";
import { useTranslation } from "react-i18next";
import { getDataContractSupplier } from "./helper";
import { Supplier } from "models/Supplier/Supplier";
import {
  EMAIL_REGEX,
  NOT_TAB_ENTER_REGEX,
  PHONE_NUMBER_REGEX,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAdjustment/constants";
import { isEqual } from "lodash";

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const ContractDetailSellerInformation = () => {
  const [translate] = useTranslation();

  const { model, dispatchModel, handleChangeBoolField } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  const refDisableTranslate = useRef([]);

  const isNotHaveShoppingPlan = useMemo(() => {
    return !model?.originalPurchasePlanId;
  }, [model?.originalPurchasePlanId]);

  const isHaveContractGoodsItems = useMemo(() => {
    return (
      model &&
      !isNotHaveShoppingPlan &&
      model.contractGoodsServicesList &&
      model.contractGoodsServicesList.length > 0
    );
  }, [isNotHaveShoppingPlan, model]);

  const isDisabledSellerInformation = useMemo(() => {
    return isNotHaveShoppingPlan || isHaveContractGoodsItems;
  }, [isNotHaveShoppingPlan, isHaveContractGoodsItems]);

  const listSupplierPayment = useMemo(() => {
    if (model?.contractSupplier?.supplierPayments) {
      const listMapSupplierCode = model.contractSupplier.supplierPayments?.map(
        (item: Supplier) => ({
          ...item,
          name: item.bankAccountName,
          code: item.bankAccountNo,
        })
      );

      return of(listMapSupplierCode);
    }

    return of([]);
  }, [model?.contractSupplier?.supplierPayments]);

  const handleUpdateStringContractSupplier = (
    value: string | Model,
    property = "phone"
  ) => {
    if (!refDisableTranslate.current.includes(property)) {
      refDisableTranslate.current = [...refDisableTranslate.current, property];
    }
    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractSupplier: {
          ...model?.contractSupplier,
          [property]: value,
        },
        errors: {
          ...model?.errors,
          [`contractSupplier.${property}`]: null,
        },
      },
    });
  };

  const handleUpdateSupplier = (data: ContractSupplierModel) => {
    refDisableTranslate.current = [];
    return dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        currency: data?.currency,
        contractSupplier: getDataContractSupplier(data),
        errors: {
          ...model?.errors,
          "contractSupplier.supplierId": null,
          "contractSupplier.address": null,
          "contractSupplier.agentPerson": null,
          "contractSupplier.agentPersonPosition": null,
          "contractSupplier.contactPerson": null,
          "contractSupplier.email": null,
        },
      },
    });
  };

  const getTranslate = (value: string) => {
    return !refDisableTranslate?.current?.includes(value)
      ? undefined
      : translate;
  };

  useEffect(() => {
    refDisableTranslate.current = [];
  }, [model?.originalPurchasePlanId]);

  return (
    <div className="contract_seller_info_wrapper">
      <CollapseCard title={translate("CT.create_contract.seller_information")}>
        <div className="body">
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.supplierId"
                )}
              >
                <Select
                  label={translate("CT.label_supplier")}
                  placeHolder={translate("CT.placeholder_supplier")}
                  isRequired
                  isSmall={false}
                  classFilter={DemoFilter}
                  searchProperty="supplierSearch"
                  searchType=""
                  valueFilter={{ id: model?.originalPurchasePlanId }}
                  getList={(filter) =>
                    contractRepository
                      .getListSupplierByOriginalId(filter)
                      .pipe(map((response) => response?.supplierPurchasePlans))
                  }
                  isSearch
                  isEnumerable={false}
                  render={(item) => {
                    if (!item) return "";
                    return isEqual(
                      item?.id,
                      model?.contractSupplier?.supplier?.id
                    )
                      ? item.name
                      : combineText(item.taxCode, item.name);
                  }}
                  value={model?.contractSupplier?.supplier}
                  onChange={(id, value) => {
                    handleUpdateSupplier(value);
                  }}
                  disabled={isDisabledSellerInformation}
                  appendToBody
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.taxCode"
                )}
              >
                <InputText
                  label={translate("PP.tax_code_title")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "taxCode")
                  }
                  value={model?.contractSupplier?.supplier?.taxCode}
                  disabled
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.address"
                )}
              >
                <InputText
                  label={translate("PR.address")}
                  placeHolder={translate("PR.plh_address")}
                  isSmall={false}
                  isRequired
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "address")
                  }
                  maxLength={500}
                  value={model?.contractSupplier?.address}
                  translate={getTranslate("address")}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.agentPerson"
                )}
              >
                <InputText
                  action={{
                    name: (
                      <Checkbox
                        label={translate(
                          "CT.create_contract.title.follow_attorney"
                        )}
                        onChange={handleChangeBoolField({
                          fieldName: "isEmpower",
                        })}
                        checked={model?.isEmpower}
                        disabled={isNotHaveShoppingPlan}
                      />
                    ),
                  }}
                  label={translate("CT.create_contract.title.legal_person")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.legal_person"
                  )}
                  isRequired
                  isSmall={false}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "agentPerson")
                  }
                  className="follow_attorney"
                  value={model?.contractSupplier?.agentPerson}
                  translate={getTranslate("agentPerson")}
                  maxLength={500}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.agentPersonPosition"
                )}
              >
                <InputText
                  label={translate("CT.create_contract.title.company_position")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.company_position"
                  )}
                  isSmall={false}
                  isRequired
                  maxLength={255}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(
                      val,
                      "agentPersonPosition"
                    )
                  }
                  value={model?.contractSupplier?.agentPersonPosition}
                  translate={getTranslate("agentPersonPosition")}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
            {model?.isEmpower ? (
              <Col span={8}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "contractSupplier.procuration"
                  )}
                >
                  <InputText
                    label={translate(
                      "CT.create_contract.title.power_of_attorney"
                    )}
                    placeHolder={translate(
                      "CT.create_contract.placeholder.power_of_attorney"
                    )}
                    isSmall={false}
                    onChange={(val) =>
                      handleUpdateStringContractSupplier(val, "procuration")
                    }
                    maxLength={500}
                    value={model?.contractSupplier?.procuration}
                    translate={translate}
                    disabled={isNotHaveShoppingPlan}
                    regexInput={NOT_TAB_ENTER_REGEX}
                  />
                </FormItem>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.contactPerson"
                )}
              >
                <InputText
                  label={translate("CT.create_contract.title.contact_person")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contact_person"
                  )}
                  isRequired
                  isSmall={false}
                  maxLength={255}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "contactPerson")
                  }
                  value={model?.contractSupplier?.contactPerson}
                  translate={getTranslate("contactPerson")}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.email"
                )}
              >
                <InputText
                  label={translate("CT.create_contract.title.contact_email")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contact_email"
                  )}
                  isSmall={false}
                  isRequired
                  maxLength={255}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "email")
                  }
                  value={model?.contractSupplier?.email}
                  translate={getTranslate("email")}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={EMAIL_REGEX}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractSupplier.phone"
                )}
              >
                <InputText
                  label={translate("PR.telephone_number")}
                  placeHolder={translate("PR.plh_telephone_number")}
                  isSmall={false}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "phone")
                  }
                  maxLength={20}
                  value={model?.contractSupplier?.phone}
                  translate={translate}
                  disabled={isNotHaveShoppingPlan}
                  regexInput={PHONE_NUMBER_REGEX}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div className={"special-text-input__wrapper"}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "supplierPaymentId"
                  )}
                >
                  <Select
                    label={translate("CT.create_contract.title.account_bank")}
                    placeHolder={translate(
                      "CT.create_contract.placeholder.account_bank"
                    )}
                    isRequired
                    isSmall={false}
                    render={(item) => (item ? `${item.code}` : "")}
                    getList={() => listSupplierPayment}
                    classFilter={DemoFilter}
                    isEnumerable={false}
                    value={model?.contractSupplier?.supplierPayment}
                    onChange={(idValue, value) => {
                      handleUpdateStringContractSupplier(
                        value,
                        "supplierPayment"
                      );
                    }}
                    disabled={isNotHaveShoppingPlan}
                  />
                  <div className={"check-box__wrapper"}>
                    <Checkbox
                      disabled
                      checked={isEqual(model?.currency, VND_CURRENCY_UNIT)}
                      label={translate("CA.txt_seller_domestic_transfer")}
                    />
                  </div>
                </FormItem>
              </div>
            </Col>
            <Col span={8}>
              <InputText
                label={translate("CT.create_contract.title.account_name")}
                placeHolder={translate(
                  "CT.create_contract.placeholder.account_name"
                )}
                isSmall={false}
                value={
                  model?.contractSupplier?.supplierPayment?.bankAccountName
                }
                disabled
              />
            </Col>
            <Col span={8}>
              <InputText
                label={translate("CT.create_contract.title.bank_name")}
                placeHolder={translate(
                  "CT.create_contract.placeholder.bank_name"
                )}
                isSmall={false}
                value={model?.contractSupplier?.supplierPayment?.bank?.name}
                disabled
              />
            </Col>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractDetailSellerInformation;
