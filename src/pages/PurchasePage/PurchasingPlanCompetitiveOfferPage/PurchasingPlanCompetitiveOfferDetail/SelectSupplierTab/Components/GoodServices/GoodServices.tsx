import GoodServicesSectionTable from "./GoodServicesTable/GoodServicesTable";
import {
  IExchangeRateTable,
  SelectSupplierTabDefaultProps,
} from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import PriceQuoteTicket from "./PriceQuoteTicket/PriceQuoteTicket";
import styles from "./GoodServices.module.scss";
import SupplierTable from "./SupplierTable/SupplierTable";
import { Supplier } from "models/Supplier/Supplier";
import { PurchasePlanGoodsServicesModel } from "models/PurchasingPlan";

interface Props extends SelectSupplierTabDefaultProps {
  isHaveSupplier?: boolean;
  dataSupplier?: Supplier[];
  dataGoodsItems?: PurchasePlanGoodsServicesModel[];
  dataExchangeRate?: IExchangeRateTable[];
  isShowSecondaryTextPrice?: boolean;
  isDetailTicket?: boolean;
  isHaveFourColumn?: boolean;
}

const GoodServicesSection = (props: Props) => {
  const {
    contextValue,
    isHaveSupplier = true,
    isShowSecondaryTextPrice = true,
    dataSupplier,
    dataGoodsItems,
    dataExchangeRate,
    isDetailTicket = false,
    isHaveFourColumn = false,
  } = props;

  const { handleChangeSingleField, handleChangeAllField } = contextValue;

  return (
    <div>
      {!isHaveSupplier && (
        <SupplierTable
          contextValue={contextValue}
          isHaveSupplier={isHaveSupplier}
          data={dataSupplier}
        />
      )}
      <PriceQuoteTicket
        contextValue={contextValue}
        className={styles["table-price"]}
        dataExchangeRate={dataExchangeRate}
        dataGoodsItems={dataGoodsItems}
        isShowSecondaryTextPrice={isShowSecondaryTextPrice}
        isHaveFourColumn={isHaveFourColumn}
        isDetailTicket={isDetailTicket}
      />
      <GoodServicesSectionTable
        model={contextValue?.model}
        isHaveSupplier={isHaveSupplier}
        handleChangeSingleField={handleChangeSingleField}
        handleChangeAllField={handleChangeAllField}
        data={dataGoodsItems}
      />
    </div>
  );
};

export default GoodServicesSection;
