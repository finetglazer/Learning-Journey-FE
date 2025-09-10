import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty, isEqual, isNil, size } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { CostGroup, ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { useContext, useEffect, useMemo } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import {
  BORDER_TYPE,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map, of } from "rxjs";
import styles from "./FundamentalInfo.module.scss";

const FundamentalInfo = () => {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    getBankExchangeRate,
    isShowComponentForeignCurrency,
    handleChangeAllField,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const isReadOnly = !!model?.isAdjust;

  const isShowSystemExchangeRate = useMemo(() => {
    const val = !isEqual(model.currency?.code, VND_CURRENCY);
    return val;
  }, [model?.currency]);

  useEffect(() => {
    if (model.currency?.code && model?.isExchangeRate) {
      getBankExchangeRate(model.currency?.code, model);
    }
  }, [model?.isExchangeRate, model?.currency?.code]);

  const getListCostGroup = (filter: ModelFilter) => {
    return of(model?.costType?.costGroups).pipe(
      map((costGroupList: CostGroup[]) => {
        if (!Array.isArray(costGroupList)) {
          return [];
        }

        const trimmedName = filter?.search?.trim()?.toLowerCase();
        if (!trimmedName) {
          return costGroupList;
        }

        return costGroupList.filter(
          (period) =>
            period?.code?.toLowerCase()?.includes(trimmedName) ||
            period?.name?.toLowerCase()?.includes(trimmedName)
        );
      })
    );
  };

  const handleSelectCostType = (idValue: number, value: Model) => {
    if (!isEqual(model.costGroup?.costTypeId, value?.id)) {
      handleChangeSelectField({
        fieldName: "costGroup",
        errorName: "costGroupId",
      })(undefined, undefined);
    }
    handleChangeSelectField({
      fieldName: "costType",
      errorName: "costTypeId",
    })(idValue, value);
  };

  return (
    <div className={classNames(styles.body)}>
      <div className="row g-3">
        <div className="col-4">
          <FormItem
            validateObject={utilService.getValidateObj(model, "currency")}
          >
            <Select
              isSearch
              isRequired
              label={translate("PM.payment_proposed_amount_input_unit_label")}
              searchProperty="search"
              valueFilter={{
                search: "",
              }}
              classFilter={undefined}
              searchType=""
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              getList={proposalRepository.getCurrencyTypeList}
              onChange={handleChangeSelectField({
                fieldName: "currency",
              })}
              render={(curency) => {
                return curency?.id
                  ? `${curency?.code} - ${curency?.name}`
                  : null;
              }}
              value={model.currency}
              allowClear={false}
              isEnumerable={false}
              readOnly={isReadOnly}
            />
          </FormItem>
        </div>
        <div className="col-4">
          {isShowComponentForeignCurrency && (
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "rateInfoJson.rate"
              )}
            >
              {isShowSystemExchangeRate && (
                <div className="position-absolute payment-right_0">
                  <Checkbox
                    label={translate(
                      "PM.payment_exchange_system_rate_input_label"
                    )}
                    checked={model.isExchangeRate}
                    onChange={
                      handleChangeSingleField({
                        fieldName: "isExchangeRate",
                      }) as () => (value: boolean) => void
                    }
                  />
                </div>
              )}
              <InputNumber
                translate={translate}
                label={translate("PM.payment_exchange_rate_input_label")}
                className="payment-custom_input"
                isRequired={true}
                disabled={model.isExchangeRate}
                isSmall={false}
                onChange={(value) => {
                  handleChangeSingleField({
                    fieldName: "rateInfo",
                    errorName: "rateInfoJson.rate",
                  })({ ...model?.rateInfo, rate: value });
                }}
                value={model.rateInfo?.rate}
                isReverseSymb
                numberType="DECIMAL"
                max={NUMBER_MAX_13}
                readOnly={isReadOnly}
              />
            </FormItem>
          )}
        </div>
        <div className="col-4">
          {isShowComponentForeignCurrency && (
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "rateInfo.source"
              )}
            >
              <InputText
                translate={translate}
                isRequired={true}
                label={translate("PM.payment_exchange_rate_source_input_label")}
                isByteCheck
                className="payment-custom_input"
                isSmall={false}
                disabled={model.isExchangeRate}
                onChange={(value) => {
                  handleChangeSingleField({
                    fieldName: "rateInfo",
                    errorName: "rateInfo.source",
                  })({ ...model?.rateInfo, source: value });
                }}
                maxLength={255}
                value={model.rateInfo?.source}
                readOnly={isReadOnly}
              />
            </FormItem>
          )}
        </div>
      </div>
      <div className="row g-3">
        <div className="col-4">
          <FormItem
            validateObject={utilService.getValidateObj(model, "costTypeId")}
          >
            <Select
              readOnly={
                size(model?.selectedListGoodsServices) > 0 || isReadOnly
              }
              isSearch
              isRequired
              searchType=""
              searchProperty="search"
              label={translate("PM.label_type_cost")}
              valueFilter={{
                search: "",
                isActive: true,
              }}
              isSmall={false}
              isEnumerable={false}
              value={model?.costType}
              placeHolder={translate("PM.plh_type_cost")}
              getList={proposalRepository.listCostType}
              classFilter={undefined}
              onChange={handleSelectCostType}
              render={(costType) => {
                return costType?.id
                  ? `${costType?.code} - ${costType?.name}`
                  : null;
              }}
              checkAllowClearWithRequire={
                isEmpty(model?.selectedListGoodsServices) &&
                isEmpty(model?.costAllocation)
                  ? false
                  : true
              }
            />
          </FormItem>
        </div>
        <div className="col-8">
          <FormItem
            validateObject={utilService.getValidateObj(model, "costGroupId")}
          >
            <Select
              readOnly={
                size(model?.selectedListGoodsServices) > 0 || isReadOnly
              }
              disabled={isNil(model.costType)}
              isRequired
              isSearch
              searchProperty="search"
              searchType=""
              valueFilter={{
                search: "",
              }}
              label={translate("PM.label_cost_item")}
              placeHolder={translate("PM.plh_cost_item")}
              isEnumerable={false}
              classFilter={undefined}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              getList={getListCostGroup}
              onChange={handleChangeSelectField({
                fieldName: "costGroup",
                errorName: "costGroupId",
              })}
              value={model.costGroup}
              render={(item) =>
                item?.id ? `${item?.code} - ${item?.name}` : null
              }
              checkAllowClearWithRequire={
                isEmpty(model?.selectedListGoodsServices) &&
                isEmpty(model?.costAllocation)
                  ? false
                  : true
              }
            />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default FundamentalInfo;
