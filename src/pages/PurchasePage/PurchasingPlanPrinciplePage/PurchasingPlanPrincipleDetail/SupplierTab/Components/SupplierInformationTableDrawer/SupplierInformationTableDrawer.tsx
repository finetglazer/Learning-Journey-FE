import { ColumnProps } from "antd/lib/table";
import { ExpandableConfig } from "antd/lib/table/interface";

import { emptyIcon, IcArrowDown, TrashIcon } from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { TABLE_ROW_KEY, VND_CURRENCY_UNIT } from "core/config/consts";
import { addNumbers, formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField } from "core/services/service-types";
import {
  convertPriceToVND,
  formatNumberToCurrency,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React from "react";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import TotalBoxItem from "../TotalBoxItem/TotalBoxItem";

import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { NUMBER_MAX_13 } from "config/const";
import {
  detectIntegerCurrency,
  getNumberTypeByCurrency,
} from "core/helpers/currency";
import { size } from "lodash";
import { GoodServiceByCategory, GoodsServices } from "models/PurchaseRequest";
import { SupplierModel } from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { Model } from "react-3layer-common";
import ModalListGoodsServices from "../ModalListGoodsServices/ModalListGoodsServices";
import styles from "./SupplierInformationTableDrawer.module.scss";
import { useSupplierInformationTableDrawerHook } from "./SupplierInformationTableDrawerHook";

interface SupplierInformationTableDrawerProps {
  isDetailPage: boolean;
  modelDetailSupplier: SupplierModel;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeAllField: (data: GoodsServices) => void;
  handleChangeItemTable: (
    data: object,
    id: string,
    errorFields: string[]
  ) => void;
  getAmountBeforeTax: () => number;
  getTaxAmount: () => number;
  getTotalAmount: () => number;
}

const SupplierInformationTableDrawer = ({
  isDetailPage,
  modelDetailSupplier,
  handleChangeSingleField,
  handleChangeItemTable,
  getAmountBeforeTax,
  getTaxAmount,
  getTotalAmount,
}: SupplierInformationTableDrawerProps) => {
  const {
    translate,
    roundNum,
    rowSelections,
    selectedRowKeys,
    selectedDetailSupplierId,
    isOpenModalGoodsService,
    convertDataByCategory,
    setIsOpenModalGoodsService,
    setSelectedRowKeys,
    handleDeleteSingleGoodsServices,
  } = useSupplierInformationTableDrawerHook(
    modelDetailSupplier,
    handleChangeSingleField
  );

  const currencyCode = modelDetailSupplier?.currency || VND_CURRENCY_UNIT;
  const exchangeRate = modelDetailSupplier?.exchangeRate;
  const roundNumCalculate = detectIntegerCurrency(currencyCode) ? 0 : 4;

  const columns: ColumnProps<GoodServiceByCategory>[] = React.useMemo(
    () => [
      {
        title: (
          <div
            className={classNames("p-l--md", {
              "p-l--lg": isDetailPage,
            })}
          >
            {translate("PR.goods_services")}
          </div>
        ),
        ellipsis: true,
        width: 220,
        fixed: "left",
        key: "id",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="m-l--sm">
                <OneLineText
                  useTooltip
                  value={translate("PR.size_type_goods_services", {
                    size: size(modelDetailSupplier?.contractGoodsItems),
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children) {
            return (
              <LayoutCell className="data-with-collapse">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={record?.category?.name}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse">
              <div className="text-ellipsis">
                <TwoLineText
                  classNameFirstLine="text_blue fw-semibold"
                  classNameSecondLine="text-second__style"
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.interpret_of_goods_and_services"),
        ellipsis: true,
        width: 200,
        key: "description",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText value={record?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PR.unit")}</div>,
        ellipsis: true,
        width: 90,
        key: "unit",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>{translate("PL.purchasing_plan_purchase_quantity")}</div>
        ),
        align: "right",
        key: "quantity",
        ellipsis: true,
        width: 180,
        render: (_, record) => {
          if (record?.isTotal) return;
          if (record?.children) return;

          if (!isDetailPage) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  value={formatNumber(record?.quantity)}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailSupplier,
                  `contractGoodsItems.${record?.id}.quantity`
                )}
              >
                <InputNumber
                  isRequired
                  placeHolder={translate("CT.placeholder_enter_quantity")}
                  numberType="DECIMAL"
                  max={record?.requestQuantity}
                  min={0}
                  value={record?.quantity}
                  onChange={(value: number) =>
                    handleChangeItemTable(
                      {
                        quantity: value || 0,
                      },
                      record?.id,
                      [`contractGoodsItems.${record?.id}.quantity`]
                    )
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.unit_price")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.children || record.isTotal) return null;
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.unitPrice,
                  roundNumCalculate
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.total_price")} unit={currencyCode} />
        ),
        ellipsis: true,
        align: "right",
        width: 145,
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelDetailSupplier?.contractGoodsItems?.reduce(
                      (prev: number, curr: GoodsServices) => {
                        return addNumbers(
                          prev || 0,
                          curr.unitPrice * curr.quantity || 0
                        );
                      },
                      0
                    ),
                    roundNum
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev || 0,
                        curr.unitPrice * curr.quantity || 0
                      );
                    }, 0),
                    roundNum
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.unitPrice * record?.quantity || 0,
                  roundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.drawer_tax_type")}</div>,
        key: "tax",
        ellipsis: true,
        width: 145,
        render: (_, record) => {
          if (record?.isTotal) return;
          if (record?.children) return;

          if (!isDetailPage) {
            return (
              <LayoutCell>
                <OneLineText useTooltip value={record?.tax?.name} />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailSupplier,
                  `contractGoodsItems.${record?.id}.tax`
                )}
              >
                <Select
                  isRequired
                  placeHolder={translate(
                    "CT.placeholder_received_organization"
                  )}
                  valueFilter={{
                    name: "",
                  }}
                  isSearch
                  searchType=""
                  classFilter={undefined}
                  getList={purchasingPlanRepository.getTaxList}
                  isEnumerable={false}
                  appendToBody
                  value={record?.tax}
                  render={(tax) =>
                    tax?.id ? `${tax?.code} - ${tax?.name}` : null
                  }
                  onChange={(_, value: Model) => {
                    const taxAmount = roundTo(
                      (record?.unitPrice || 0) *
                        (record?.quantity || 0) *
                        (value?.rate / 100 || 0),
                      roundNum
                    );

                    handleChangeItemTable(
                      { tax: value, taxAmount },
                      record?.id,
                      [`contractGoodsItems.${record?.id}.tax`]
                    );
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.tax")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelDetailSupplier?.contractGoodsItems?.reduce(
                      (prev: number, curr: GoodsServices) => {
                        return addNumbers(prev, curr?.taxAmount || 0);
                      },
                      0
                    ),
                    roundNumCalculate
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.taxAmount || 0);
                    }, 0),
                    roundNumCalculate
                  )}
                />
              </LayoutCell>
            );
          }

          if (!isDetailPage) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  value={formatNumberToCurrency(
                    record?.taxAmount,
                    roundNumCalculate
                  )}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell>
              <FormItem isTableCell>
                <InputNumber
                  placeHolder={translate("PL.enter_tax_amount")}
                  numberType={getNumberTypeByCurrency(currencyCode)}
                  min={0}
                  max={NUMBER_MAX_13}
                  value={record?.taxAmount}
                  onChange={(value: number) =>
                    handleChangeItemTable(
                      {
                        taxAmount: value || 0,
                      },
                      record?.id,
                      [`contractGoodsItems.${record?.id}.taxAmount`]
                    )
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.total_amount")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelDetailSupplier?.contractGoodsItems?.reduce(
                      (prev: number, curr: GoodsServices) => {
                        return addNumbers(
                          prev,
                          roundTo(
                            (curr?.unitPrice || 0) * (curr?.quantity || 0),
                            roundNum
                          ) + (curr?.taxAmount || 0)
                        );
                      },
                      0
                    ),
                    roundNumCalculate
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev,
                        roundTo(
                          (curr?.unitPrice || 0) * (curr?.quantity || 0),
                          roundNum
                        ) + (curr?.taxAmount || 0)
                      );
                    }, 0),
                    roundNumCalculate
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  roundTo(
                    (record?.unitPrice || 0) * (record?.quantity || 0),
                    roundNum
                  ) + (record?.taxAmount || 0),
                  roundNumCalculate
                )}
              />
            </LayoutCell>
          );
        },
      },
      currencyCode !== VND_CURRENCY_UNIT
        ? {
            title: () => (
              <UnitTitle
                title={translate("PR.total_converted_amount")}
                unit={translate("PM.payment_currency_unit")}
              />
            ),
            ellipsis: true,
            width: 145,
            align: "right",
            render: (_, record) => {
              if (record.isTotal) {
                return (
                  <LayoutCell className="justify-content-end">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumberToCurrency(
                        modelDetailSupplier?.contractGoodsItems?.reduce(
                          (prev: number, curr: GoodsServices) => {
                            return addNumbers(
                              prev,
                              roundTo(
                                (curr?.unitPrice || 0) * (curr?.quantity || 0) +
                                  (curr?.taxAmount || 0),
                                roundNum
                              ) * (modelDetailSupplier?.exchangeRate || 0)
                            );
                          },
                          0
                        ),
                        0
                      )}
                    />
                  </LayoutCell>
                );
              }
              if (record.children) {
                return (
                  <LayoutCell className="justify-content-end">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumberToCurrency(
                        record?.children?.reduce((prev: number, curr) => {
                          return addNumbers(
                            prev,
                            roundTo(
                              (curr?.unitPrice || 0) * (curr?.quantity || 0) +
                                (curr?.taxAmount || 0),
                              roundNum
                            ) * (modelDetailSupplier?.exchangeRate || 0)
                          );
                        }, 0),
                        0
                      )}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell className="justify-content-end">
                  <OneLineText
                    useTooltip
                    value={formatNumberToCurrency(
                      roundTo(
                        (record?.unitPrice || 0) * (record?.quantity || 0) +
                          (record?.taxAmount || 0),
                        roundNum
                      ) * (modelDetailSupplier?.exchangeRate || 0),
                      0
                    )}
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: translate("CT.manufacture_categories"),
        ellipsis: true,
        width: 145,
        key: "brand_category",
        render: (_, record) => {
          if (record?.children) return null;

          return (
            <FormItem>
              <LayoutCell>
                <OneLineText value={record?.branch?.name} />
              </LayoutCell>
            </FormItem>
          );
        },
      },
      {
        title: translate("CT.note"),
        ellipsis: true,
        width: 160,
        key: "note",
        dataIndex: "note",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText value={record?.note} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: isDetailPage ? 40 : 1,
        render(_, record) {
          if (record.children || record.isTotal || !isDetailPage) return null;

          return (
            <LayoutCell>
              <button
                className={styles["delete-goods-services-row"]}
                onClick={() => {
                  handleDeleteSingleGoodsServices(record?.id);
                }}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [
      currencyCode,
      handleChangeItemTable,
      handleDeleteSingleGoodsServices,
      isDetailPage,
      modelDetailSupplier,
      roundNum,
      translate,
    ]
  );

  const expandable: ExpandableConfig<GoodServiceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (!record.children || record.children.length === 0) {
        return <div className="table__width-8" />;
      }
      return (
        <div
          onClick={(event) => {
            event.stopPropagation();
            onExpand(record, event);
          }}
        >
          <img
            className={classNames("cursor-pointer m-x--3xs", {
              "rotate-0": expanded,
              "rotate-negative-90": !expanded,
            })}
            src={IcArrowDown}
            alt="img"
            width={10}
            height={10}
          />
        </div>
      );
    },
    defaultExpandAllRows: true,
  };

  return (
    <div className={styles["supplier-goods-services-info__list"]}>
      {modelDetailSupplier?.contractGoodsItems?.length > 0 && (
        <div>
          <div className={styles["total-amount-section"]}>
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_pre_tax_amount")}
              price={formatNumber(getAmountBeforeTax())}
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(getAmountBeforeTax(), exchangeRate).display
              }
            />
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_tax")}
              price={formatNumber(getTaxAmount()) || "0"}
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(getTaxAmount(), exchangeRate).display
              }
            />
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_total_amount")}
              price={formatNumber(getTotalAmount())}
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(getTotalAmount(), exchangeRate).display
              }
            />
          </div>
          {isDetailPage && (
            <div className="m-b--2xs">
              <Button
                type={"secondary"}
                icon={<img src={add} alt="" width={12} height={12} />}
                iconPlace={"left"}
                onClick={() => setIsOpenModalGoodsService(true)}
              >
                {translate("PL.add_goods_services")}
              </Button>
            </div>
          )}
        </div>
      )}

      {modelDetailSupplier?.contractGoodsItems?.length === 0 ? (
        <EmptyInitializeTable
          disableButton={!isDetailPage}
          textButton={translate("PL.add_goods_services")}
          content={<div>{translate("PL.empty_goods_services")}</div>}
          icon={<img src={emptyIcon} alt="Three files icon" />}
          onHandleClickAdd={() => setIsOpenModalGoodsService(true)}
        />
      ) : (
        <div>
          {isDetailPage && (
            <ActionBarComponent
              selectedRowKeys={modelDetailSupplier?.contractGoodsItems
                ?.filter((item: GoodsServices) =>
                  selectedRowKeys?.includes(item?.id)
                )
                ?.map((item: GoodsServices) => item.id)}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <Button
                type="secondary"
                size="sm"
                onClick={() => handleDeleteSingleGoodsServices()}
              >
                {translate("CL.delete_btn")}
              </Button>
            </ActionBarComponent>
          )}
          <StandardTable
            key={convertDataByCategory?.length}
            rowKey={TABLE_ROW_KEY}
            columns={columns}
            dataSource={[{ isTotal: true }, ...convertDataByCategory]}
            isDragable={true}
            rowSelection={isDetailPage ? rowSelections : undefined}
            scroll={{ y: 400 }}
            expandable={expandable}
            rowClassName={(rowData) => {
              const classes = [];
              if (isDetailPage) classes.push("detail-row");
              if (rowData.isTotal) classes.push("total-row");
              if (
                selectedDetailSupplierId &&
                rowData.id === selectedDetailSupplierId
              )
                classes.push("editable-row");
              return classes.join(" ");
            }}
          />
        </div>
      )}

      <ModalListGoodsServices
        open={isOpenModalGoodsService}
        modelDetailSupplier={modelDetailSupplier}
        handleCancelModalGoodsService={() => setIsOpenModalGoodsService(false)}
        handleChangeSingleField={handleChangeSingleField}
      />
    </div>
  );
};

export default SupplierInformationTableDrawer;
