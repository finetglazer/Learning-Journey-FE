import type { ColumnProps } from "antd/es/table";
import { emptyApplicationIcon } from "assets/icons";
import classNames from "classnames";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { ExpandIcon } from "components/TableCustom/ExpandIcon";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import {
  sumWithFixed,
  toFixedByCurrency,
  toFixedNumber,
} from "core/helpers/calculator";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, formatNumber } from "core/helpers/number";
import { GeneralActionEnum } from "core/services/service-types";
import { gt, isEmpty, isEqual, isNaN, isUndefined, lt } from "lodash";
import { GoodItemsModel } from "models/Acceptance/Acceptance";
import { OptionBaseModel } from "models/Common/Common";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { useCallback, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { AcceptanceInformationDrawer } from "../AcceptanceInformationDrawer/AcceptanceInformationDrawer";
import "./GoodsServiceAcceptance.scss";

interface GoodsServiceAcceptanceProps {
  isEdit?: boolean;
}

export const GoodsServiceAcceptance = ({
  isEdit,
}: GoodsServiceAcceptanceProps) => {
  const [translate] = useTranslation();
  const { model, loadingGoodItems, setGoodsReceiptSelect, dispatch } =
    useAcceptanceInformationContext();

  const goodItems = useMemo(
    () => model?.acceptanceGoodsItems,
    [model?.acceptanceGoodsItems]
  );

  const currency = useMemo(() => model?.currency, [model?.currency]);

  const isTotalRow = useCallback((goodItem: GoodItemsModel) => {
    return isUndefined(goodItem?.category?.id);
  }, []);

  const columns: ColumnProps<GoodItemsModel>[] = useMemo(() => {
    const columnsItem: ColumnProps<GoodItemsModel>[] = [
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_goods_services")}
            className="unit--hidden"
          />
        ),
        dataIndex: "name",
        key: "name",
        width: 220,
        fixed: "left",
        render: (value: string, record) => {
          if (!isUndefined(record?.children)) {
            return null;
          }
          const isTotal = isTotalRow(record);

          return (
            <LayoutCell className="received-good__first">
              <div
                className={classNames(
                  {
                    "padding-row w-100":
                      isUndefined(record?.id) || isNaN(Number(record?.id)),
                  },
                  "d-flex flex-column"
                )}
                onClick={() => setGoodsReceiptSelect(record)}
              >
                <OneLineText
                  className={classNames({
                    "text-blue": !isTotal,
                    "font-bold": isTotal && !isUndefined(record?.id),
                  })}
                  value={value}
                />
                <OneLineText className="text-gray" value={record?.code} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_goods_description")}
            className="unit--hidden"
          />
        ),
        dataIndex: "description",
        key: "description",
        render: (value: string) => {
          return (
            <LayoutCell className="received-good__first">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_brand_type")}
            className="unit--hidden"
          />
        ),
        dataIndex: "branch",
        key: "branch",
        width: 140,
        render: (value: OptionBaseModel) => {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_unit_of_measure")}
            className="unit--hidden"
          />
        ),
        dataIndex: "unit",
        key: "unit",
        width: 90,
        render: (unit: OptionBaseModel) => {
          return (
            <LayoutCell>
              <OneLineText value={unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_actual_quantity_received_short")}
            className="unit--hidden text-end"
          />
        ),
        dataIndex: "quantity",
        key: "quantity",
        width: 110,
        render(quantity: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(quantity)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_quantity_contract")}
            className="text-end unit--hidden"
          />
        ),
        dataIndex: "quantityConact",
        key: "quantityConact",
        width: 140,
        render: (value: number, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_quantity_difference")}
            className="unit--hidden text-end"
          />
        ),
        dataIndex: "quantityDifference",
        key: "quantityDifference",
        width: 112,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                  "text-variance": gt(value, numberConstants.ZERO),
                  "text-variance--incomplete":
                    lt(value, numberConstants.ONE) &&
                    !isEqual(value, numberConstants.ZERO),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_approval_notes")}
            className="unit--hidden text-end"
          />
        ),
        dataIndex: "acceptanceNote",
        key: "acceptanceNote",
        render: (value: string, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={value}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_unit_price")}
            unit={currency}
            className="text-end"
          />
        ),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 155,
        render(value: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_amount_due")}
            unit={currency}
            className="text-end"
          />
        ),
        dataIndex: "amountBeforeTax",
        key: "amountBeforeTax",
        width: 155,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_tax_rate")}
            className="unit--hidden text-end"
          />
        ),
        dataIndex: "tax",
        key: "tax",
        width: 155,
        render(value: OptionBaseModel, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={value?.name}
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_tax")}
            unit={currency}
            className="text-end"
          />
        ),
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 155,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_total_amount")}
            unit={currency}
            className="text-end"
          />
        ),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 152,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <UnitTitle
            title={translate("RG.txt_notes")}
            className="unit--hidden"
          />
        ),
        dataIndex: "note",
        key: "note",
        width: 160,
        render(note: string) {
          return (
            <LayoutCell>
              <OneLineText value={note} />
            </LayoutCell>
          );
        },
      },
    ];
    if (!isEqual(currency, VND_CURRENCY_UNIT)) {
      columnsItem.splice(-numberConstants.ONE, numberConstants.ZERO, {
        title: (
          <UnitTitle
            title={translate("RG.txt_total_converted_amount")}
            unit={VND_CURRENCY_UNIT}
            className="text-end"
          />
        ),
        dataIndex: "totalConvertedAmount",
        key: "totalConvertedAmount",
        width: 145,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "font-bold": isTotalRow(record),
                })}
                value={formatNumber(value)}
              />
            </LayoutCell>
          );
        },
      });
    }

    return columnsItem;
  }, [currency, isTotalRow, setGoodsReceiptSelect, translate]);

  const data = useMemo(() => {
    const list: GoodItemsModel[] = [];
    goodItems?.forEach((goodItem, indexItem) => {
      const goodsServicesCategory = goodItem?.category;
      const index = list.findIndex((item) => {
        const idCategory = item?.category?.id;
        return isEqual(idCategory, goodsServicesCategory?.id);
      });

      if (lt(index, numberConstants.ZERO)) {
        const dataFormatNumber = {
          amountBeforeTax: toFixedByCurrency(
            goodItem?.amountBeforeTax || numberConstants.ZERO,
            currency
          ),
          taxAmount: toFixedNumber(
            goodItem?.taxAmount || numberConstants.ZERO,
            detectIntegerCurrency(currency) ? 0 : 4
          ),
          totalAmount: toFixedNumber(
            goodItem?.totalAmount || numberConstants.ZERO,
            detectIntegerCurrency(currency) ? 0 : 4
          ),
          totalConvertedAmount: toFixedNumber(
            goodItem?.totalConvertedAmount || numberConstants.ZERO,
            numberConstants.ZERO
          ),
        };
        const initGoodsReceiptRequest = {
          ...new GoodItemsModel(),
          id: indexItem.toString(),
          category: goodItem?.category,
          name: goodItem?.category?.name,
          quantity: goodItem?.quantity || numberConstants.ZERO,
          quantityConact: goodItem?.quantityConact || numberConstants.ZERO,
          ...dataFormatNumber,
          quantityDifference:
            goodItem?.quantityDifference || numberConstants.ZERO,
          children: [{ ...goodItem, ...dataFormatNumber }],
        };
        list.push(initGoodsReceiptRequest);
      } else {
        const item = list?.[index];
        if (isUndefined(item)) return;

        list.splice(index, numberConstants.ONE, {
          ...item,
          children: [...item.children, goodItem],
          quantity: goodItem?.quantity + item.quantity,
          quantityConact: goodItem?.quantityConact + item.quantityConact,
          amountBeforeTax: sumWithFixed([
            goodItem?.amountBeforeTax,
            item.amountBeforeTax,
          ]),
          taxAmount: toFixedByCurrency(
            goodItem?.taxAmount + item.taxAmount,
            currency
          ),
          totalAmount: sumWithFixed([goodItem?.totalAmount, item.totalAmount]),
          totalConvertedAmount: toFixedNumber(
            goodItem?.totalConvertedAmount + item.totalConvertedAmount,
            numberConstants.ZERO
          ),
          quantityDifference:
            goodItem?.quantityDifference + item.quantityDifference,
        });
      }
    });

    const total = goodItems?.reduce(
      (acc, item) => {
        return {
          ...acc,
          quantity: addNumbers(acc.quantity, item?.quantity),
          quantityConact: addNumbers(acc.quantityConact, item?.quantityConact),
          amountBeforeTax: toFixedByCurrency(
            acc.amountBeforeTax + item?.amountBeforeTax,
            currency
          ),
          taxAmount: toFixedNumber(
            acc.taxAmount + item?.taxAmount,
            detectIntegerCurrency(currency) ? 0 : 4
          ),
          totalAmount: toFixedNumber(
            acc.totalAmount + item?.totalAmount,
            detectIntegerCurrency(currency) ? 0 : 4
          ),
          totalConvertedAmount: toFixedNumber(
            acc.totalConvertedAmount + item?.totalConvertedAmount,
            numberConstants.ZERO
          ),
          quantityDifference: addNumbers(
            acc.quantityDifference,
            item?.quantityDifference
          ),
        };
      },
      {
        ...new GoodsReceiptRequestItem(),
        name: translate("CT.total"),
        quantity: numberConstants.ZERO,
        quantityConact: numberConstants.ZERO,
        amountBeforeTax: numberConstants.ZERO,
        taxAmount: numberConstants.ZERO,
        totalAmount: numberConstants.ZERO,
        totalConvertedAmount: numberConstants.ZERO,
        quantityDifference: numberConstants.ZERO,
      }
    );

    if (isEmpty(list)) {
      return [];
    }

    return [total, ...list];
  }, [currency, goodItems, translate]);

  const handleSave = (data: GoodItemsModel) => {
    const newGoodItems = goodItems.map((item) => {
      if (isEqual(item?.id, data?.id)) {
        return data;
      }
      return item;
    });
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        acceptanceGoodsItems: newGoodItems,
      },
    });
    setGoodsReceiptSelect(null);
  };

  return (
    <>
      {isEmpty(goodItems) ? (
        <EmptyItemTable
          icon={<img src={emptyApplicationIcon} alt="" />}
          content={translate("AC.txt_no_data_displayed")}
        />
      ) : (
        <StandardTable
          rowKey="id"
          columns={columns}
          className="goods-service"
          dataSource={data}
          loading={loadingGoodItems}
          scroll={{ x: 2380 }}
          rowClassName={(record) => {
            return classNames({
              "bg-gray": isUndefined(record?.id),
            });
          }}
          expandable={{
            expandIcon: (props) => (
              <ExpandIcon
                {...props}
                iconClassName="collapse-icon"
                renderTitleExpandable={({ record }) => {
                  return <OneLineText value={record?.name} />;
                }}
                renderCondition={({ record }) => isTotalRow(record)}
              />
            ),
          }}
        />
      )}
      <AcceptanceInformationDrawer onSave={handleSave} isEdit={isEdit} />
    </>
  );
};
