import GoodServicesSectionTable from "./GoodServicesTable/GoodServicesTable";
import {
  IExchangeRateTable,
  SelectSupplierTabDefaultProps,
} from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import PriceQuoteTicket from "./PriceQuoteTicket/PriceQuoteTicket";
import styles from "./GoodServices.module.scss";
import { Supplier } from "models/Supplier/Supplier";
import {
  ConvertibleGoodsItems,
  PurchasePlanGoodsServicesModel,
} from "models/PurchasingPlan";
import ExchangeRateFollowCurrency from "./ExchangeRateFollowCurrency/ExchangeRateFollowCurrency";
import GoodServicesDrawer from "./GoodServicesDrawer/GoodServicesDrawer";
import { useState } from "react";

interface Props extends SelectSupplierTabDefaultProps {
  dataSupplier?: Supplier[];
  dataGoodsItems?: PurchasePlanGoodsServicesModel[];
  dataExchangeRate?: IExchangeRateTable[];
  isShowSecondaryTextPrice?: boolean;
  isDetail?: boolean;
  isHaveFourColumn?: boolean;
}

const GoodServicesSection = (props: Props) => {
  const {
    contextValue,
    dataSupplier,
    dataGoodsItems,
    dataExchangeRate,
    isDetail = false,
    isHaveFourColumn = false,
  } = props;

  const { handleChangeSingleField, handleChangeAllField, model } = contextValue;
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div>
      <PriceQuoteTicket
        contextValue={contextValue}
        className={styles["table-price"]}
        dataExchangeRate={dataExchangeRate}
        dataGoodsItems={dataGoodsItems}
        isHaveFourColumn={isHaveFourColumn}
        isDetailTicket={isDetail}
      />
      <ExchangeRateFollowCurrency
        isDetail={isDetail}
        model={contextValue?.model}
        handleChangeSingleField={handleChangeSingleField}
      />
      <GoodServicesSectionTable
        model={contextValue?.model}
        handleChangeSingleField={handleChangeSingleField}
        handleChangeAllField={handleChangeAllField}
        data={dataGoodsItems}
        handleOpenDrawer={() => setOpenDrawer(true)}
        isDetail={isDetail}
      />
      <GoodServicesDrawer
        isDetail={isDetail}
        visible={openDrawer}
        handleClose={handleCloseDrawer}
        contextValue={contextValue}
      />
    </div>
  );
};

export default GoodServicesSection;
