import React, { useContext } from "react";
import {
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { NOT_TAB_ENTER_REGEX, NUMBER_TYPE_INPUT } from "core/config/consts";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Profile } from "models/Profile";
import { useAppSelector } from "rtk/useRedux";
import { NUMBER_MAX_13 } from "config/const";
import { isEmpty, isEqual } from "lodash";
import { VND_CURRENCY } from "models/Settlement";
import { useTranslation } from "react-i18next";

const GenerationInfo = () => {
  const { model, handleChangeSingleField, handleChangeDateField } = useContext(
    SettlementHookContext
  );
  const [translate] = useTranslation();
  const profile: Profile = useAppSelector((state) => state.profile);
  return (
    <div>
      <Row gutter={[12, 16]}>
        <Col sm={16}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "description")}
          >
            <InputText
              isRequired
              label={translate("settlement.settlement_description")}
              placeHolder={translate("settlement.enter_settlement_description")}
              value={model?.description}
              onChange={handleChangeSingleField({
                fieldName: "description",
              })}
              isSmall={false}
              maxLength={500}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <div className="d-flex gap-12">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "effectiveDate"
              )}
            >
              <DatePicker
                isRequired
                label={translate("settlement.effective_date_settlement")}
                placeholder={translate(
                  "UEI.placeholder_use_electronic_invoice_date"
                )}
                value={model.effectiveDate ? dayjs(model.effectiveDate) : null}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "effectiveDate",
                })}
                isSmall={false}
              />
            </FormItem>
            {!isEqual(model?.contactOrderInfo?.currency, VND_CURRENCY) &&
            !isEmpty(model?.contactOrderInfo?.currency) ? (
              <FormItem
                validateObject={utilService.getValidateObj(model, "rate")}
              >
                <InputNumber
                  isRequired
                  label={translate("settlement.exchange_rate")}
                  placeHolder={translate(
                    "settlement.placeHolder_exchange_rate"
                  )}
                  numberType={
                    !isEqual(model?.currency, VND_CURRENCY)
                      ? NUMBER_TYPE_INPUT
                      : undefined
                  }
                  value={model.rate}
                  onChange={handleChangeSingleField({
                    fieldName: "rate",
                  })}
                  max={NUMBER_MAX_13}
                  isSmall={false}
                />
              </FormItem>
            ) : null}
          </div>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_creator")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.account?.email + " - " + profile?.account?.name}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_creator_unit")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.organization?.name}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_title")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.position?.name}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default GenerationInfo;
