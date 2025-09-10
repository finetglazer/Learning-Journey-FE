/* eslint-disable import/no-unresolved */
import { Col, Row } from "antd";
import { LoadingCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import {
  DatePicker,
  FormItem,
  InputNumber,
  Modal,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ExchangeRateDetail.scss";

import { NUMBER_MAX_13 } from "config/const";
import { Currency, CurrencyFilter } from "models/Currency";
import {
  ExchangeRateMasterContext,
  ExchangeRateMasterContextModel,
} from "../ExchangeRateMaster/ExchangeRateMasterHook";
import { exchangeRateRepository } from "../ExchangeRateRepository";
import { useExchangeRateDetailHook } from "./ExchangeRateDetailHook";

const ExchangeRateDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<ExchangeRateMasterContextModel>(ExchangeRateMasterContext);

  const {
    loading,
    handleChangeSingleField,
    handleChangeAllField,
    handleChangeDateField,
    handleSave,
  } = useExchangeRateDetailHook(
    model,
    dispatchModel,
    handleCloseModal,
    handleLoadList
  );

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("exchangeRates.update")}`
            : `${translate("exchangeRates.create")}`
        }
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("detail")}
        onCancel={() => handleCloseModal("detail")}
        handleSave={handleSave}
        loading={loading}
        isShowIconBack={false}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "fromCurrencyId"
              )}
            >
              <Select
                label={translate("exchangeRates.exchangeCodeFrom")}
                placeHolder={translate(
                  "exchangeRates.placeholder.exchangeCodeFrom"
                )}
                isRequired
                getList={exchangeRateRepository.getDropdownCurrency}
                value={
                  model?.fromCurrencyId
                    ? {
                        id: model?.fromCurrencyId,
                        name: model?.fromCurrencyName,
                        code: model?.fromCurrencyCode,
                      }
                    : undefined
                }
                classFilter={CurrencyFilter}
                onChange={(id: number, T?: Currency) => {
                  handleChangeAllField({
                    ...model,
                    fromCurrencyId: id.toString(),
                    fromCurrencyName: T?.name,
                    fromCurrencyCode: T?.code,
                  });
                }}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
                render={(curency) => {
                  return curency?.id
                    ? `${curency?.code} - ${curency?.name}`
                    : null;
                }}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "toCurrencyId")}
            >
              <Select
                label={translate("exchangeRates.exchangeCodeTo")}
                placeHolder={translate(
                  "exchangeRates.placeholder.exchangeCodeTo"
                )}
                isRequired
                getList={exchangeRateRepository.getDropdownCurrency}
                value={
                  model?.toCurrencyId
                    ? {
                        id: model?.toCurrencyId,
                        name: model?.toCurrencyName,
                        code: model?.toCurrencyCode,
                      }
                    : undefined
                }
                classFilter={CurrencyFilter}
                onChange={(id: number, T?: Currency) => {
                  handleChangeAllField({
                    ...model,
                    toCurrencyId: id.toString(),
                    toCurrencyName: T?.name,
                    toCurrencyCode: T?.code,
                  });
                }}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
                render={(curency) => {
                  return curency?.id
                    ? `${curency?.code} - ${curency?.name}`
                    : null;
                }}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "sellTransfer")}
            >
              <InputNumber
                label={translate("exchangeRates.sellBankTransfer")}
                placeHolder={translate(
                  "exchangeRates.placeholder.sellBankTransfer"
                )}
                value={model?.sellTransfer}
                onChange={handleChangeSingleField({
                  fieldName: "sellTransfer",
                })}
                isSmall={false}
                max={NUMBER_MAX_13}
                numberType="DECIMAL"
                decimalDigit={4}
                isRequired
              />
            </FormItem>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "buyTransfer")}
            >
              <InputNumber
                label={translate("exchangeRates.buyBankTransfer")}
                placeHolder={translate(
                  "exchangeRates.placeholder.buyBankTranfer"
                )}
                value={model?.buyTransfer}
                onChange={handleChangeSingleField({
                  fieldName: "buyTransfer",
                })}
                isSmall={false}
                max={NUMBER_MAX_13}
                numberType="DECIMAL"
                decimalDigit={4}
                isRequired
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "centralExchangeRate"
              )}
            >
              <InputNumber
                label={translate("exchangeRates.centralExchangeRate")}
                placeHolder={translate(
                  "exchangeRates.placeholder.centralExchangeRate"
                )}
                value={model?.centralExchangeRate}
                onChange={handleChangeSingleField({
                  fieldName: "centralExchangeRate",
                })}
                isSmall={false}
                max={NUMBER_MAX_13}
                numberType="DECIMAL"
                decimalDigit={4}
                isRequired
              />
            </FormItem>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "exchangeRateDate"
              )}
            >
              <DatePicker
                isRequired
                label={translate("exchangeRates.exchangeRateDate")}
                placeholder={translate(
                  "exchangeRates.placeholder.exchangeRateDate"
                )}
                value={model.exchangeRateDate}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "exchangeRateDate",
                })}
                isSmall={false}
                dateFormat={["DD-MM-YYYY HH:mm"]}
                showTime={{ format: "HH:mm" }}
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default ExchangeRateDetail;
