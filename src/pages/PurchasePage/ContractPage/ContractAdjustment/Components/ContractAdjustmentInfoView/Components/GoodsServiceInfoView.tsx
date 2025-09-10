import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import classNames from "classnames";
import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { JPY_CURRENCY_UNIT, numberConstants } from "core/config/consts";
import { addNumbers, formatCurrency, roundTo } from "core/helpers/number";
import { isEmpty, isEqual, uniqueId } from "lodash";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex";
import { VND_CURRENCY } from "models/Payment";
import styles from "pages/PurchasePage/Acceptance/Components/Acceptance.module.scss";
import styleGood from "../Components/styles.module.scss";
import {
  convertPriceToVND,
  formatNumberToCurrency,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface GoodsServiceInfoProps {
  currentItem: SelectAdjustableGoodsServicesModel;
}

const SPACING = {
  gutter: [12, 16] as [Gutter, Gutter],
  span_8: 8,
  span_16: 16,
};

export interface TaxBoxProps {
  price: string;
  covertPrice?: string;
  currency: string;
}

export const GoodsServiceInfoView: React.FC<GoodsServiceInfoProps> = ({
  currentItem,
}) => {
  const [translate] = useTranslation();

  const currencyCode = currentItem?.currency || VND_CURRENCY;
  const isNotVNDorJPY =
    !isEqual(currencyCode, VND_CURRENCY) &&
    !isEqual(currencyCode, JPY_CURRENCY_UNIT);
  const roundNumber = isNotVNDorJPY ? 2 : 0;

  const currentRate = useMemo(
    () =>
      isEqual(currencyCode, VND_CURRENCY)
        ? numberConstants.ONE
        : currentItem?.currencyRate,
    [currencyCode, currentItem?.currencyRate]
  );

  const formatAmount = (amount: number) =>
    isNotVNDorJPY ? roundTo(amount, 2) : Math.round(amount);

  const getAmountBeforeTax = () =>
    formatAmount((currentItem?.unitPrice || 0) * (currentItem?.quantity || 0));

  const getTotalAmount = useCallback(() => {
    const baseAmount = getAmountBeforeTax();
    const totalAmount = addNumbers(
      baseAmount,
      currentItem?.taxAmount || 0,
      currentItem?.otherAmount || 0
    );
    return formatAmount(totalAmount);
  }, [currentItem?.taxAmount, currentItem?.otherAmount, getAmountBeforeTax]);

  const TaxBox = ({ price, currency, covertPrice }: TaxBoxProps) => (
    <div className="tax">
      <div className="d-flex gap-1 align-items-baseline">
        <strong className="primary-number">{price}</strong>
        <span className="currency">{currency}</span>
      </div>
      {covertPrice &&
        !isEqual(currency?.toLowerCase(), VND_CURRENCY.toLowerCase()) && (
          <div className="d-flex gap-1 align-items-baseline">
            <span className="secondary-number">{covertPrice}</span>
            <span className="currency">{VND_CURRENCY}</span>
          </div>
        )}
    </div>
  );

  const columnsCenter = [
    {
      title: translate("RG.txt_amount_before_tax"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(getAmountBeforeTax(), roundNumber)}
          currency={currencyCode}
          covertPrice={
            convertPriceToVND(getAmountBeforeTax(), currentRate).display
          }
        />
      ),
    },
    {
      title: translate("RG.txt_tax"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(
            currentItem?.taxAmount || 0,
            roundNumber
          )}
          currency={currencyCode}
          covertPrice={
            convertPriceToVND(currentItem?.taxAmount || 0, currentRate).display
          }
        />
      ),
    },
    {
      title: translate("RG.txt_total_amount"),
      content: (
        <TaxBox
          price={formatNumberToCurrency(getTotalAmount(), roundNumber)}
          currency={currencyCode}
          covertPrice={convertPriceToVND(getTotalAmount(), currentRate).display}
        />
      ),
    },
  ];

  const content = [
    {
      label: "settlement.goods_and_services_code",
      value: currentItem?.code,
    },
    {
      label: "settlement.settlement_quantity",
      value: currentItem?.quantity,
    },
    {
      label: "CT.create_contract.drawer_goods_name",
      value: currentItem?.name,
    },

    {
      label: "AC.txt_unit_of_measure",
      value: currentItem?.goodUnit?.name,
    },
    {
      label: "CM.menu_title_manufacturer_categories",
      value: currentItem?.goodBranch?.name,
    },
    {
      label: "PR.unit_price",
      value: `${formatCurrency({
        value: currentItem?.unitPrice || 0,
        code: currencyCode,
      })} ${currencyCode}`,
    },
    {
      label: "contractAdjustment.description_goods_services",
      value: currentItem?.description,
    },
    {
      label: "CT.create_contract.drawer_tax_rate",
      value: !isEmpty(currentItem?.taxModel?.name)
        ? `${currentItem?.taxModel?.name}`
        : "",
    },
    {
      label: "RG.txt_notes",
      value: currentItem?.note,
    },
    {
      label: "RG.txt_tax_amount",
      value: `${formatCurrency({
        value: currentItem?.taxAmount || 0,
        code: currencyCode,
      })} ${currencyCode}`,
    },
  ];

  const renderContent = () => {
    return (
      <Row gutter={SPACING.gutter}>
        {content.map((item) => {
          const { label, value } = item;
          return (
            <ItemView key={uniqueId()} label={translate(label)} value={value} />
          );
        })}
      </Row>
    );
  };

  return (
    <>
      <div>{renderContent()}</div>
      <Row gutter={SPACING.gutter}></Row>
      <div className="my-4 table-goods-service">
        <table className={classNames(styles["table"], "background-table")}>
          <tbody>
            <tr className="table-border-color">
              {columnsCenter.map((props) => (
                <ItemTableView key={uniqueId()} {...props} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const ItemView = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => {
  return (
    <Col span={12} className={styleGood["itemView"]}>
      <div className={styleGood["item"]}>
        <span className={styleGood["label"]}>{label}</span>
        <div className={styleGood["value"]}>{value}</div>
      </div>
    </Col>
  );
};
