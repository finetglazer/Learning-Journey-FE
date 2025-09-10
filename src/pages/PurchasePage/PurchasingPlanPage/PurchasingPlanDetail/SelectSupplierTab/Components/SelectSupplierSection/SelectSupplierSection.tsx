import { NUMBER_MAX_13 } from "config/const";
import { gt, isEqual, size } from "lodash";
import GoodsServiceTableView from "pages/PurchasePage/PurchasingPlanPage/Components/GoodServiceTableView/GoodServiceTableView";
import TablePricesQuote from "pages/PurchasePage/PurchasingPlanPage/Components/TablePricesQuote/TablePricesQuote";
import { useMemo } from "react";
import { ModelFilter } from "react-3layer-common";
import { InputNumber, Select } from "react-components-design-system";
import { useSelectSupplierTab } from "../../SelectSupplierTabHook";
import BiddingSupplierTable from "../BiddingSupplierTable/BiddingSupplierTable";
import GoodsServiceTable from "./Components/GoodsServiceTable/GoodsServiceTable";
import "./SelectSupplierSection.scss";

export const VIETNAMESE_CURRENCY = "VND";
export const JPY_CURRENCY = "JPY";

interface SelectSupplierSectionProperties {
  isView?: boolean;
}

const SelectSupplierSection = ({ isView }: SelectSupplierSectionProperties) => {
  const {
    model,
    translate,
    priceQuotesData,
    handleChangeBiddingSupplier,
    handleChangeBiddingRound,
    getListSupplier,
    getQuotationBiddingRounds,
    handleChangeSingleField,
  } = useSelectSupplierTab();

  const isDisableExchangeRate = useMemo(
    () =>
      isEqual(
        model?.currentBiddingRound?.quotations?.currency?.code,
        VIETNAMESE_CURRENCY
      ) || isView,
    [isView, model?.currentBiddingRound?.quotations?.currency?.code]
  );

  const renderSelectBiddingRoundController = () =>
    !isView &&
    (gt(size(model?.quotationSupplier), 1) ||
    gt(size(model?.quotationBiddingRounds), 1) ? (
      <div className="select_round_controller">
        <Select
          className="supplier_dropdown"
          label={translate("PL.purchasing_plan_supplier_tab")}
          value={model?.biddingSupplier}
          render={(item) => item?.name}
          onChange={handleChangeBiddingSupplier}
          getList={getListSupplier}
          classFilter={ModelFilter}
          isRequired
          isShowTooltip
          appendToBody
          isSmall={false}
        />
        <Select
          className="bidding_rounds_dropdown"
          label={translate("PL.bidding_round_label")}
          value={model?.currentBiddingRound}
          render={(item) => item?.name}
          onChange={handleChangeBiddingRound}
          getList={getQuotationBiddingRounds}
          classFilter={ModelFilter}
          isRequired
          isShowTooltip
          appendToBody
          isSmall={false}
          isEnumerable={false}
        />
      </div>
    ) : null);

  const renderPricesQuote = () => (
    <div className="prices_quote">
      <span>{translate("PL.goods_services_text")}</span>
      <TablePricesQuote data={priceQuotesData} />
    </div>
  );

  const renderGoodsServiceTable = () => (
    <div className="goods_service">
      <div className="exchange_rate">
        <span>{translate("PL.exchange_rate_label")}</span>
        <InputNumber
          className="exchange_rate_input"
          value={model?.biddingExchangeRate}
          onChange={handleChangeSingleField({
            fieldName: "biddingExchangeRate",
          })}
          isShowTooltip
          max={NUMBER_MAX_13}
          numberType="DECIMAL"
          allowClear={false}
          isInputRight
          disabled={isDisableExchangeRate}
        />
      </div>

      {isView ? (
        <GoodsServiceTableView
          goodsPrices={model?.goodPrices}
          currencyCode={model?.currentBiddingRound?.quotations?.currency?.code}
          biddingExchangeRate={model?.biddingExchangeRate}
        />
      ) : (
        <GoodsServiceTable />
      )}
    </div>
  );

  return (
    <div className="select_supplier_section">
      {renderSelectBiddingRoundController()}
      <BiddingSupplierTable />
      {renderPricesQuote()}
      {renderGoodsServiceTable()}
    </div>
  );
};

export default SelectSupplierSection;
