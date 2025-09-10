import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import React, { useContext } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { ColumnProps } from "antd/lib/table";
import {
  CONTACT_SETTLEMENT_CONTENT_TYPE,
  PricingModel,
  SettlementHookModel,
  SettlementModel,
} from "models/Settlement";
import { isEmpty, isEqual, isNil, round } from "lodash";
import { utilService } from "core/services/common-services/util-service";
import { VND_CURRENCY } from "models/Payment";
import { NUMBER_MAX_13 } from "config/const";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

type props = {
  isView?: boolean;
  typePage?: number;
};
const emptyText = "---";
const PaymentValueSpreadsheet = ({ isView, typePage }: props) => {
  const { model, formatNumberToCurrency, handleChangeMultipleItem } =
    useContext<SettlementHookModel>(SettlementHookContext);
  const [translate] = useTranslation();

  const columns = (
    modelPass: SettlementModel,
    isView?: boolean
  ): ColumnProps<PricingModel>[] => [
    {
      title: (
        <UnitTitle
          title={translate("settlement.paymentSpreadSheet.STT")}
          isShowUnit={false}
        />
      ),
      dataIndex: "stt",
      key: "stt",
      width: 50,
      render: (text) => {
        return (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate(
            "settlement.paymentSpreadSheet.title.jobDescription"
          )}
          isShowUnit={false}
        />
      ),
      dataIndex: "contentTypeName",
      key: "contentTypeName",
      width: 272,
      render: (text) => {
        return (
          <LayoutCell>
            <OneLineText value={text} useTooltip />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          className="align-items-end"
          title={translate("settlement.paymentSpreadSheet.title.contactValue")}
          unit={model?.contactOrderInfo?.currency}
        />
      ),
      dataIndex: "contractPrice",
      key: "contractPrice",
      width: 126,
      render: (text, record) => {
        return (
          <LayoutCell position={"right"}>
            <OneLineText
              value={
                isEqual(
                  record?.contentType,
                  CONTACT_SETTLEMENT_CONTENT_TYPE.TotalSettlementValue
                )
                  ? !isNil(text)
                    ? formatNumberToCurrency(
                        text,
                        false,
                        model?.contactOrderInfo?.currency
                      )
                    : undefined
                  : undefined
              }
              className="fw-semibold"
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          className="align-items-end"
          title={translate(
            "settlement.paymentSpreadSheet.title.settlementValue"
          )}
          unit={model?.contactOrderInfo?.currency}
        />
      ),
      dataIndex: "settlementPrice",
      key: "settlementPrice",
      width: 155,
      render: (text, record) => {
        if (
          !isView &&
          (isEqual(
            record?.contentType,
            CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty
          ) ||
            isEqual(
              record?.contentType,
              CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation
            ) ||
            isEqual(
              record?.contentType,
              CONTACT_SETTLEMENT_CONTENT_TYPE.WarrantyRetentionValue
            ))
        ) {
          return (
            <LayoutCell position={"right"}>
              <FormItem
                isTableCell={true}
                validateObject={utilService.getValidateObj(
                  model,
                  `pricings[${record?.indexBeforeValidate}].settlementPrice`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  label={translate("PM.payment_amount")}
                  isRequired
                  allowClear={text !== 0}
                  translate={translate}
                  className="payment-custom_input payment-label_none"
                  placeHolder={translate("PM.payment_amount_placeholder")}
                  isSmall={true}
                  onChange={(value: number) => {
                    handleChangeMultipleItem(
                      modelPass,
                      {
                        settlementPrice: value,
                        settlementExchangePrice: !isEqual(
                          modelPass?.currency,
                          VND_CURRENCY
                        )
                          ? round(value * modelPass?.rate, 0)
                          : value,
                      },
                      "settlementPrice",
                      record?.contentType,
                      record.indexBeforeValidate,
                      ["settlementPrice"],
                      "settlementExchangePrice"
                    );
                  }}
                  value={text || 0}
                  isReverseSymb
                  numberType={
                    !isEqual(model?.contactOrderInfo?.currency, VND_CURRENCY)
                      ? "DECIMAL"
                      : null
                  }
                  max={NUMBER_MAX_13}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell position={"right"}>
            <OneLineText
              className={classNames({
                "fw-semibold":
                  isView &&
                  !(
                    isEqual(
                      record?.contentType,
                      CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty
                    ) ||
                    isEqual(
                      record?.contentType,
                      CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation
                    )
                  ),
              })}
              value={
                !isNil(text)
                  ? formatNumberToCurrency(
                      text,
                      false,
                      model?.contactOrderInfo?.currency
                    )
                  : undefined
              }
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          className="align-items-end"
          title={translate(
            "settlement.paymentSpreadSheet.title.convertibleContractValue"
          )}
        />
      ),
      dataIndex: "contractExchangePrice",
      key: "contractExchangePrice",
      width: 178,
      render: (text, record) => {
        return (
          <LayoutCell position={"right"}>
            <OneLineText
              value={
                isEqual(
                  record?.contentType,
                  CONTACT_SETTLEMENT_CONTENT_TYPE.TotalSettlementValue
                )
                  ? !isNil(text)
                    ? formatNumberToCurrency(text, false, VND_CURRENCY)
                    : undefined
                  : undefined
              }
              className="fw-semibold"
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate(
            "settlement.paymentSpreadSheet.title.convertedSettlementValue"
          )}
          className="align-items-end"
        />
      ),
      dataIndex: "settlementExchangePrice",
      key: "settlementExchangePrice",
      width: 186,
      render: (text, record) => {
        if (
          !isView &&
          (isEqual(
            record.contentType,
            CONTACT_SETTLEMENT_CONTENT_TYPE.PaidValue
          ) ||
            isEqual(
              record.contentType,
              CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty
            ) ||
            isEqual(
              record.contentType,
              CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation
            ) ||
            isEqual(
              record.contentType,
              CONTACT_SETTLEMENT_CONTENT_TYPE.WarrantyRetentionValue
            ))
        ) {
          return (
            <LayoutCell position={"right"}>
              <FormItem
                isTableCell={true}
                validateObject={utilService.getValidateObj(
                  model,
                  `pricings[${record?.indexBeforeValidate}].settlementExchangePrice`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  label={translate("PM.payment_amount")}
                  isRequired
                  allowClear={text !== 0}
                  translate={translate}
                  className="payment-custom_input payment-label_none"
                  placeHolder={translate("PM.payment_amount_placeholder")}
                  isSmall={true}
                  onChange={(value: number) => {
                    handleChangeMultipleItem(
                      modelPass,
                      {
                        settlementExchangePrice: value,
                      },
                      "settlementExchangePrice",
                      record?.contentType,
                      record.indexBeforeValidate,
                      ["settlementExchangePrice"]
                    );
                  }}
                  value={text || 0}
                  isReverseSymb
                  numberType={VND_CURRENCY}
                  max={NUMBER_MAX_13}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell position={"right"}>
            {isView ? (
              <OneLineText
                className={classNames({
                  "fw-semibold": !(
                    isEqual(
                      record?.contentType,
                      CONTACT_SETTLEMENT_CONTENT_TYPE.LatePenalty
                    ) ||
                    isEqual(
                      record?.contentType,
                      CONTACT_SETTLEMENT_CONTENT_TYPE.OtherViolation
                    )
                  ),
                })}
                value={
                  !isNil(text)
                    ? formatNumberToCurrency(text, false, VND_CURRENCY)
                    : undefined
                }
                useTooltip
              />
            ) : (
              <OneLineText
                className={
                  isEqual(
                    record.contentType,
                    CONTACT_SETTLEMENT_CONTENT_TYPE.ProposedPaymentValue
                  )
                    ? "fw-bold"
                    : ""
                }
                value={
                  !isNil(text)
                    ? formatNumberToCurrency(text, false, VND_CURRENCY)
                    : undefined
                }
                useTooltip
              />
            )}
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("settlement.paymentSpreadSheet.title.note")}
          isShowUnit={false}
        />
      ),
      width: 321,
      dataIndex: "note",
      key: "note",
      render: (text, record) => {
        return isView ? (
          <LayoutCell>
            <OneLineText value={isEmpty(text) ? emptyText : text} useTooltip />
          </LayoutCell>
        ) : (
          <LayoutCell position={"right"}>
            <FormItem>
              <InputText
                isTableCell={true}
                isSmall={true}
                placeHolder={translate("CT.enter_note")}
                maxLength={500}
                value={text}
                translate={translate}
                regexInput={NOT_TAB_ENTER_REGEX}
                onChange={(value) => {
                  handleChangeMultipleItem(
                    modelPass,
                    {
                      note: value,
                    },
                    "note",
                    record?.contentType,
                    record.indexBeforeValidate,
                    ["note"]
                  );
                }}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div>
      <StandardTable
        className="payment-custom_table"
        rowKey={"id"}
        columns={
          columns(model, isView)?.filter(Boolean) as ColumnProps<PricingModel>[]
        }
        idContainer="table-id"
        dataSource={model?.pricings}
        isDragable={true}
        scroll={{ y: "calc(100vh - 360px)" }}
      />
    </div>
  );
};

export default PaymentValueSpreadsheet;
