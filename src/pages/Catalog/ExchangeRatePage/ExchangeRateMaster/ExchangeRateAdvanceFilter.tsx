import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { ExchangeRateFilter } from "models/ExchangeRate";
import { useContext, useEffect } from "react";
import {
  CheckboxGroup,
  MultipleSelect,
  InputRange,
  DateRangePicker,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ExchangeRateMasterContext,
  ExchangeRateMasterContextModel,
} from "./ExchangeRateMasterHook";
import { exchangeRateRepository } from "../ExchangeRateRepository";
import { Currency, CurrencyFilter } from "models/Currency";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface ExchangeRateMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExchangeRateMasterAdvanceFilter = ({
  setVisible,
}: ExchangeRateMasterAdvanceFilterProps) => {
  const exchangeRateMaster = useContext<ExchangeRateMasterContextModel>(
    ExchangeRateMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = exchangeRateMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ExchangeRateFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeDateFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
    handleChangeNumberRangeFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="exchange-rate-filter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
        handleClearModelFilter={handleClearFilter}
        modelFilter={modelFilter}
        handleToggleFilter={setVisible}
        handleClickOutside={handleClickOutside}
        className=""
      >
        <FilterPanel.Right lg={24}>
          <Row gutter={16}>
            {/* Code */}
            <Col lg={12} className="m-b--md">
              <MultipleSelect
                label={translate("exchangeRates.exchangeCodeFrom")}
                placeHolder={translate(
                  "exchangeRates.placeholder.exchangeCodeFrom"
                )}
                getList={exchangeRateRepository.getDropdownCurrency}
                classFilter={CurrencyFilter}
                onChange={(selectedList?: Currency[]) => {
                  handleChangeMultipleSelectFilter({
                    fieldName: "fromCurrency",
                  })(selectedList);
                }}
                values={modelFilter?.fromCurrencyValue || []}
                isEnumerable={false}
                searchProperty="search"
                searchType={null}
                render={(curency) => {
                  return curency?.id
                    ? `${curency?.code} - ${curency?.name}`
                    : null;
                }}
              />
            </Col>

            <Col lg={12} className="m-b--md">
              <MultipleSelect
                label={translate("exchangeRates.exchangeCodeTo")}
                placeHolder={translate(
                  "exchangeRates.placeholder.exchangeCodeTo"
                )}
                getList={exchangeRateRepository.getDropdownCurrency}
                classFilter={CurrencyFilter}
                onChange={(selectedList?: Currency[]) => {
                  handleChangeMultipleSelectFilter({
                    fieldName: "toCurrency",
                  })(selectedList);
                }}
                values={modelFilter?.toCurrencyValue || []}
                isEnumerable={false}
                searchProperty="search"
                searchType={null}
                render={(curency) => {
                  return curency?.id
                    ? `${curency?.code} - ${curency?.name}`
                    : null;
                }}
              />
            </Col>
            {/* Name */}
            <Col lg={24} className="m-b--md">
              <DateRangePicker
                label={translate("exchangeRates.date")}
                placeholder={[
                  translate("exchangeRates.placeholder.startDate"),
                  translate("exchangeRates.placeholder.endDate"),
                ]}
                value={[
                  modelFilter?.date?.greaterEqual,
                  modelFilter?.date?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "date",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
              />
            </Col>

            <Col lg={24} className="m-b--md">
              <InputRange
                label={translate("exchangeRates.sellBankTransfer")}
                valueRange={[
                  modelFilter?.sellTransfer?.greaterEqual,
                  modelFilter?.sellTransfer?.lessEqual,
                ]}
                onChangeRange={handleChangeNumberRangeFilter({
                  fieldName: "sellTransfer",
                })}
                placeHolderRange={[
                  translate("exchangeRates.placeholder.buyBankTransferFrom"),
                  translate("exchangeRates.placeholder.buyBankTransferTo"),
                ]}
                isSmall
              />
            </Col>
            <Col lg={24} className="m-b--md">
              <InputRange
                label={translate("exchangeRates.buyBankTransfer")}
                valueRange={[
                  modelFilter?.buyTransfer?.greaterEqual,
                  modelFilter?.buyTransfer?.lessEqual,
                ]}
                onChangeRange={handleChangeNumberRangeFilter({
                  fieldName: "buyTransfer",
                })}
                placeHolderRange={[
                  translate("exchangeRates.placeholder.buyBankTransferFrom"),
                  translate("exchangeRates.placeholder.buyBankTransferTo"),
                ]}
                isSmall
              />
            </Col>

            <Col lg={24} className="m-b--md">
              <InputRange
                label={translate("exchangeRates.centralExchangeRate")}
                valueRange={[
                  modelFilter?.centralExchangeRate?.greaterEqual,
                  modelFilter?.centralExchangeRate?.lessEqual,
                ]}
                onChangeRange={handleChangeNumberRangeFilter({
                  fieldName: "centralExchangeRate",
                })}
                placeHolderRange={[
                  translate(
                    "exchangeRates.placeholder.centralExchangeRateFrom"
                  ),
                  translate("exchangeRates.placeholder.centralExchangeRateTo"),
                ]}
                isSmall
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
