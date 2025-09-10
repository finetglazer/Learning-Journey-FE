import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import {
  MAX_LENGTH_20,
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { BaseModel } from "models/ProjectSettlement";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import {
  Checkbox,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractPrincipleAppendixDetailContext } from "../../../context";
import styles from "./styles.module.scss";

const SPACING = {
  gutter: [16, 12] as [Gutter, Gutter],
  span_4: 4,
  span_8: 8,
  span_16: 16,
  span_24: 24,
};

export const SellerInformation = () => {
  const { model, dispatch } = useContractPrincipleAppendixDetailContext();
  const [translate] = useTranslation();

  const dispatchModel = (key: string, value: unknown) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        supplierInfo: {
          ...model?.supplierInfo,
          [key]: value,
        },
      },
    });
  };

  const handleChangeTextInput = (fieldName: string, value: unknown) => {
    dispatchModel(fieldName, value);
  };

  const handleChangeSellerAuthorized = (value: boolean) => {
    dispatchModel("isByProcuration", value);
  };

  const makeRepresentativeTextInput = () => {
    return (
      <div className={styles["special-text-input__wrapper"]}>
        <InputText
          isRequired
          isSmall={false}
          label={translate("CA.txt_seller_representative")}
          placeHolder={translate("CA.placeholder_seller_representative")}
          value={model?.supplierInfo?.supplierAgentPerson || ""}
          onChange={(value) =>
            handleChangeTextInput("supplierAgentPerson", value)
          }
          maxLength={MAX_LENGTH_500}
          translate={translate}
        />
        {/* Checkbox */}
        <div className={styles["check-box__wrapper"]}>
          <Checkbox
            label={translate("CA.txt_seller_authorized")}
            checked={model?.supplierInfo?.isByProcuration}
            onChange={handleChangeSellerAuthorized}
          />
        </div>
      </div>
    );
  };

  const makeBankNumberDropdown = () => {
    return (
      <div className={styles["special-text-input__wrapper"]}>
        <Select
          isRequired
          isSmall={false}
          isEnumerable={false}
          appendToBody
          label={translate("CA.txt_seller_bank_account_number")}
          placeHolder={translate("CA.placeholder_seller_bank_account_number")}
          value={model?.supplierInfo?.supplierPayment?.bankAccountNoValue}
          classFilter={CommonFilter}
          getList={() => {
            return contractAnnexRepository.getSupplierPayment({
              id: model?.supplierInfo?.supplierId,
            });
          }}
          render={(item) => `${item?.bankAccountNo || item?.name || ""}`}
          onChange={(id: number, value: BaseModel) => {
            dispatch({
              type: GeneralActionEnum.UPDATE,
              payload: {
                ...model,
                supplierInfo: {
                  ...model?.supplierInfo,
                  supplierPayment: {
                    ...model?.supplierInfo?.supplierPayment,
                    id: value?.id,
                    bankAccountNoValue: {
                      id: value?.id,
                      name: value?.bankAccountNo,
                    },
                    bank: {
                      ...model?.supplierInfo?.supplierPayment?.bank,
                      isInternal: value?.bank?.isInternal,
                      name: value?.bank?.name,
                    },
                    currency: {
                      id: value?.currency?.id,
                      symbol: value?.currency?.symbol,
                      name: value?.currency?.name,
                      code: value?.currency?.code,
                    },
                    bankAccountName: value?.bankAccountName,
                  },
                },
              },
            });
          }}
        />
        {/* Checkbox */}
        <div className={styles["check-box__wrapper"]}>
          <Checkbox
            disabled
            checked={
              model?.supplierInfo?.supplierPayment?.currency?.code ===
              VND_CURRENCY_UNIT
            }
            label={translate("CA.txt_seller_domestic_transfer")}
            onChange={(value) => {
              dispatch({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...model,
                  supplierInfo: {
                    ...model?.supplierInfo,
                    supplierPayment: {
                      ...model?.supplierInfo?.supplierPayment,
                      bank: {
                        ...model?.supplierInfo?.supplierPayment?.bank,
                        isInternal: value,
                      },
                    },
                  },
                },
              });
            }}
          />
        </div>
      </div>
    );
  };

  const makeFirstRow = () => {
    return (
      <>
        {/* Supplier name */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierName")}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_supplier_name")}
              placeHolder={translate("CA.placeholder_seller_supplier_name")}
              value={model?.supplierInfo?.supplierName || ""}
              onChange={(value) => handleChangeTextInput("supplierName", value)}
              maxLength={MAX_LENGTH_255}
              translate={translate}
            />
          </FormItem>
        </Col>
        {/* Tax */}{" "}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CA.txt_seller_tax_code")}
              value={model?.supplierInfo?.supplierTaxCode || "---"}
              onChange={(value) =>
                handleChangeTextInput("supplierTaxCode", value)
              }
            />
          </FormItem>
        </Col>
        {/* Address */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierAddress"
            )}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_address")}
              placeHolder={translate("CA.placeholder_seller_address")}
              value={model?.supplierInfo?.supplierAddress || ""}
              onChange={(value) =>
                handleChangeTextInput("supplierAddress", value)
              }
              maxLength={MAX_LENGTH_500}
              translate={translate}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeSecondRow = () => {
    return (
      <>
        {/* Representative */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierAgentPerson"
            )}
          >
            {makeRepresentativeTextInput()}
          </FormItem>
        </Col>
        {/* Position */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierAgentPersonPosition"
            )}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_position")}
              placeHolder={translate("CA.placeholder_seller_position")}
              value={model?.supplierInfo?.supplierAgentPersonPosition || ""}
              onChange={(value) =>
                handleChangeTextInput("supplierAgentPersonPosition", value)
              }
              maxLength={MAX_LENGTH_255}
              translate={translate}
            />
          </FormItem>
        </Col>
        {/* Authorization document */}
        {model?.supplierInfo?.isByProcuration ? (
          <Col span={SPACING.span_8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "supplierProcuration"
              )}
            >
              <InputText
                isSmall={false}
                label={translate("CA.txt_seller_authorization_document")}
                placeHolder={translate(
                  "CA.placeholder_seller_authorization_document"
                )}
                value={model?.supplierInfo?.supplierProcuration || ""}
                onChange={(value) =>
                  handleChangeTextInput("supplierProcuration", value)
                }
                maxLength={MAX_LENGTH_500}
                translate={translate}
              />
            </FormItem>
          </Col>
        ) : null}
      </>
    );
  };

  const makeThirdRow = () => {
    return (
      <>
        {/* Contract person */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierContactPerson"
            )}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_contact_person")}
              placeHolder={translate("CA.placeholder_seller_contact_person")}
              value={model?.supplierInfo?.supplierContactPerson || ""}
              onChange={(value) =>
                handleChangeTextInput("supplierContactPerson", value)
              }
              maxLength={MAX_LENGTH_255}
              translate={translate}
            />
          </FormItem>
        </Col>
        {/* Email */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierEmail")}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_email")}
              placeHolder={translate("CA.placeholder_seller_email")}
              value={model?.supplierInfo?.supplierEmail || ""}
              onChange={(value) =>
                handleChangeTextInput("supplierEmail", value)
              }
              maxLength={MAX_LENGTH_255}
              translate={translate}
            />
          </FormItem>
        </Col>
        {/* Phone number */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierPhone")}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("CA.txt_seller_phone_number")}
              placeHolder={translate("CA.placeholder_seller_phone_number")}
              value={model?.supplierInfo?.supplierPhone || ""}
              onChange={(value) =>
                handleChangeTextInput("supplierPhone", value)
              }
              maxLength={MAX_LENGTH_20}
              translate={translate}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeFourthRow = () => {
    return (
      <>
        {/* Bank number */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierPaymentId"
            )}
          >
            {makeBankNumberDropdown()}
          </FormItem>
        </Col>
        {/* Account name */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CA.txt_seller_account_name")}
              value={model?.supplierInfo?.supplierPayment?.bank?.name || "---"}
              onChange={(value) => {
                dispatch({
                  type: GeneralActionEnum.UPDATE,
                  payload: {
                    ...model,
                    supplierPayment: {
                      ...model?.supplierInfo?.supplierPayment,
                      bank: {
                        ...model?.supplierInfo?.supplierPayment?.bank,
                        name: value,
                      },
                    },
                  },
                });
              }}
            />
          </FormItem>
        </Col>
        {/* Bank name */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CA.txt_seller_bank_name")}
              value={
                model?.supplierInfo?.supplierPayment?.bankAccountName || "---"
              }
              onChange={(value) => {
                dispatch({
                  type: GeneralActionEnum.UPDATE,
                  payload: {
                    ...model,
                    supplierPayment: {
                      ...model?.supplierInfo?.supplierPayment,
                      bankAccountName: value,
                    },
                  },
                });
              }}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  return (
    <Row gutter={SPACING.gutter}>
      {/* Include: Supplier name, tax, address */}
      {makeFirstRow()}
      {/* Include: Representative, position, authorization document */}
      {makeSecondRow()}
      {/* Include: Contract person, email, phone number */}
      {makeThirdRow()}
      {/* Include: Bank number, bank name, bank account name */}
      {makeFourthRow()}
    </Row>
  );
};
