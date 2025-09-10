import { TableColumnsType } from "antd/lib";
import { PlusIcon, TrashIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import {
  JPY_CURRENCY_UNIT,
  NUMBER_TYPE_INPUT,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { FieldValue } from "core/services/service-types";
import {
  ColumnKey,
  ConvertibleGoodsItems,
  EmailReceiverInformation,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { Key, useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../GoodServicesDrawer.module.scss";
import ModalListGoodsServices from "./ModalListGoodsServices/ModalListGoodsServices";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { changeItemGoodServiceDrawerProps } from "../GoodServicesDrawer";
import { utilService } from "core/services/common-services/util-service";
import { round } from "lodash";
import CONSTANT_NUMBER from "config/number";
import { formatCurrency } from "core/helpers/number";
import { NUMBER_MAX_13 } from "config/const";
import { GoodsServices } from "models/PurchaseRequest";

interface IProps {
  data: GoodsServices[];
  isDetail?: boolean;
  contextValue?: PurchasingPlanModel;
  handleAddNewDataTable: (data: ConvertibleGoodsItems) => void;
  handleChangeDataTable: (data: changeItemGoodServiceDrawerProps) => void;
}

export default function GoodServiceInfoConverted({
  data,
  isDetail = false,
  contextValue,
  handleAddNewDataTable,
  handleChangeDataTable,
}: IProps) {
  const { model, handleChangeSingleField } = contextValue;
  const [translate] = useTranslation();
  const {
    rowSelection,
    selectedRow,
    selectedRowKeys,
    setSelectedRow,
    setSelectedRowKeys,
  } = listService.useRowSelection<unknown>(
    "checkbox",
    [],
    true,
    "manual",
    true
  );
  const [isOpenModalGoodsService, setIsOpenModalGoodsService] = useState(false);

  const exchangeRateData = useMemo(() => {
    return model?.selectSupplier?.exchangeRates?.[0];
  }, [model?.selectSupplier?.exchangeRates]);

  const exChangeClosingRate = useMemo(() => {
    return exchangeRateData?.exchangeRate;
  }, [exchangeRateData?.exchangeRate]);

  const currency = useMemo(() => {
    return exchangeRateData?.currency;
  }, [exchangeRateData?.currency]);

  const currentSelectSupplier = useMemo(() => {
    return model?.currentSelectSupplier;
  }, [model?.currentSelectSupplier]);

  const checkIsSameVNDOrJPY = useMemo(() => {
    return currency === VND_CURRENCY_UNIT || currency === JPY_CURRENCY_UNIT;
  }, [currency]);

  const addGoodServices = () => {
    return (
      <div className="d-flex gap-2">
        <Button
          type="secondary"
          iconPlace="left"
          icon={<img src={PlusIcon} alt="" />}
          onClick={() => {
            setIsOpenModalGoodsService(true);
          }}
          disabled={isDetail}
        >
          {translate("PL.add_goods_services")}
        </Button>
      </div>
    );
  };

  const handleDeleteBulkRow = (ids: string[]) => {
    const newData = data.filter((item) => !ids.includes(item.id));
    const listIds = newData.map((item) => item.id);
    const newSelectedRowKeys = selectedRowKeys.filter((item) =>
      listIds.includes(item as string)
    );

    setSelectedRow(newData);
    setSelectedRowKeys(newSelectedRowKeys);
    handleChangeSingleField({ fieldName: "currentSelectSupplier" })({
      ...model?.currentSelectSupplier,
      convertibleGoodsItems: newData,
    });
  };

  const columns: TableColumnsType<ConvertibleGoodsItems> = [
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.goods_services_text")}
        </div>
      ),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      width: 200,
      render: (valueItem) => {
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">{translate("goodsServices.code")}</div>
      ),
      key: ColumnKey.CODE,
      dataIndex: ColumnKey.CODE,
      width: 120,
      render: (valueItem) => {
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.purchasing_plan_goods_and_services_description")}
        </div>
      ),
      key: ColumnKey.DESCRIPTION,
      dataIndex: ColumnKey.DESCRIPTION,
      width: 200,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].description`
                )}
                isTableCell
              >
                <InputText
                  value={valueItem}
                  placeHolder={translate(
                    "PL.purchasing_plan_goods_and_services_description_placeholder"
                  )}
                  onChange={(value) => {
                    handleChangeDataTable({
                      fieldName: ColumnKey.DESCRIPTION,
                      value,
                      indexBeforeValidate: index,
                      isInput: true,
                      errorField: `convertibleGoodsItems[${index}].${ColumnKey.DESCRIPTION}`,
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.purchasing_plan_unit")}
          <span className="text-danger">&nbsp;*</span>
        </div>
      ),
      key: ColumnKey.UNIT,
      dataIndex: ColumnKey.UNIT,
      width: 120,
      render: (_, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].${ColumnKey.UNIT}`
                )}
                isTableCell
              >
                <Select
                  placeHolder={translate("BG.select_information")}
                  valueFilter={{
                    search: "",
                  }}
                  searchProperty="search"
                  searchType=""
                  type={1}
                  isSearch
                  isSmall={true}
                  classFilter={undefined}
                  getList={proposalRepository.getUnitList}
                  isEnumerable={false}
                  onChange={(id, value) =>
                    handleChangeDataTable({
                      fieldName: ColumnKey.UNIT,
                      value,
                      indexBeforeValidate: index,
                      errorField: `convertibleGoodsItems[${index}].${ColumnKey.UNIT}`,
                    })
                  }
                  value={record?.unit}
                  isRequired
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={record?.unit?.name || record?.unit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.purchasing_plan_purchase_quantity")}
          <span className="text-danger">&nbsp;*</span>
        </div>
      ),
      key: ColumnKey.QUANTITY,
      dataIndex: ColumnKey.QUANTITY,
      width: 120,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].${ColumnKey.QUANTITY}`
                )}
                isTableCell
              >
                <InputNumber
                  value={valueItem}
                  placeHolder={translate(
                    "PL.purchase_quantity_label_placeholder"
                  )}
                  numberType={checkIsSameVNDOrJPY ? null : NUMBER_TYPE_INPUT}
                  onChange={(value) => {
                    const totalAmountBeforeTax = value
                      ? round(
                          value * record.price,
                          checkIsSameVNDOrJPY
                            ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            : CONSTANT_NUMBER.TWO_NUMBER_FIX
                        )
                      : 0;

                    const taxAmount = record.tax?.rate
                      ? round(
                          (totalAmountBeforeTax * record.tax?.rate) / 100,
                          checkIsSameVNDOrJPY
                            ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            : CONSTANT_NUMBER.TWO_NUMBER_FIX
                        )
                      : 0;

                    const totalAmount =
                      totalAmountBeforeTax +
                      round(
                        taxAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      );

                    const taxConvertedAmount = round(
                      round(
                        taxAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      ) * exChangeClosingRate,
                      CONSTANT_NUMBER.ZERO_FIX_NUMBER
                    );

                    const convertTotalAmount = round(
                      round(
                        totalAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      ) * exChangeClosingRate,
                      CONSTANT_NUMBER.ZERO_FIX_NUMBER
                    );

                    return handleChangeDataTable({
                      fieldName: ColumnKey.QUANTITY,
                      value,
                      indexBeforeValidate: index,
                      objectFieldChangeFollow: {
                        totalAmountBeforeTax,
                        taxAmount,
                        totalAmount,
                        taxConvertedAmount,
                        convertTotalAmount,
                      },
                      errorField: `convertibleGoodsItems[${index}].${ColumnKey.QUANTITY}`,
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="d-flex align-center">
          <UnitTitle title={translate("PL.unit_price_label")} unit={currency} />
          <span className="text-danger">&nbsp;*</span>
        </div>
      ),
      key: ColumnKey.PRICE,
      dataIndex: ColumnKey.PRICE,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].${ColumnKey.PRICE}`
                )}
                isTableCell
              >
                <InputNumber
                  value={valueItem}
                  placeHolder={translate("PP.proposal_enter_unit_price")}
                  numberType={checkIsSameVNDOrJPY ? null : NUMBER_TYPE_INPUT}
                  max={NUMBER_MAX_13}
                  onChange={(value) => {
                    const totalAmountBeforeTax = value
                      ? round(
                          value * record.quantity,
                          checkIsSameVNDOrJPY
                            ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            : CONSTANT_NUMBER.TWO_NUMBER_FIX
                        )
                      : 0;
                    const taxAmount = value
                      ? round(
                          (totalAmountBeforeTax * record.tax?.rate) / 100,
                          checkIsSameVNDOrJPY
                            ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            : CONSTANT_NUMBER.TWO_NUMBER_FIX
                        )
                      : 0;

                    const totalAmount =
                      totalAmountBeforeTax +
                      round(
                        taxAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      );

                    const taxConvertedAmount = round(
                      round(
                        taxAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      ) * exChangeClosingRate,
                      CONSTANT_NUMBER.ZERO_FIX_NUMBER
                    );

                    const convertTotalAmount = round(
                      round(
                        totalAmount,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                      ) * exChangeClosingRate,
                      CONSTANT_NUMBER.ZERO_FIX_NUMBER
                    );

                    return handleChangeDataTable({
                      fieldName: ColumnKey.PRICE,
                      value,
                      indexBeforeValidate: index,
                      objectFieldChangeFollow: {
                        totalAmountBeforeTax,
                        taxAmount,
                        totalAmount,
                        convertTotalAmount,
                        taxConvertedAmount,
                      },
                      errorField: `convertibleGoodsItems[${index}].${ColumnKey.PRICE}`,
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="d-flex align-center">
          <UnitTitle title={translate("PL.amount_label")} unit={currency} />
        </div>
      ),
      key: ColumnKey.TOTAL_AMOUNT_BEFORE_TAX,
      dataIndex: ColumnKey.TOTAL_AMOUNT_BEFORE_TAX,
      width: 160,
      render: (valueItem, record) => {
        return (
          <LayoutCell>
            <OneLineText
              value={formatCurrency({
                value: valueItem,
                shouldRoundTwoNumber: false,
                code: currency,
              })}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="d-flex align-center">
          {translate("PL.tax_type_label")}
        </div>
      ),
      key: ColumnKey.TAX,
      dataIndex: ColumnKey.TAX,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <Select
                isSmall={true}
                placeHolder={translate("PM.payment_tax_type_placeholder")}
                searchProperty="name"
                searchType=""
                type={1}
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeEnum,
                }}
                classFilter={undefined}
                isSearch
                isShowTooltip
                allowClear={false}
                onChange={(_, value) => {
                  return handleChangeDataTable({
                    fieldName: ColumnKey.TAX,
                    value,
                    indexBeforeValidate: index,
                    errorField: `convertibleGoodsItems[${index}].${ColumnKey.TAX}`,
                  });
                }}
                value={record.tax || currentSelectSupplier?.tax}
                getList={paymentRepository.taxType}
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
                isEnumerable={false}
                appendToBody
              />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell>
            <OneLineText value={valueItem?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle title={translate("PL.tax_label")} unit={currency} />
      ),
      key: ColumnKey.TAX_AMOUNT,
      dataIndex: ColumnKey.TAX_AMOUNT,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <InputNumber
                disabled={!record?.tax?.name}
                value={valueItem}
                numberType={checkIsSameVNDOrJPY ? null : NUMBER_TYPE_INPUT}
                placeHolder={translate("PP.proposal_enter_unit_price")}
                onChange={(value) => {
                  const taxAmount = value
                    ? round(
                        value,
                        checkIsSameVNDOrJPY
                          ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                          : CONSTANT_NUMBER.TWO_NUMBER_FIX
                      )
                    : 0;

                  const totalAmount =
                    record?.totalAmountBeforeTax +
                    round(
                      taxAmount,
                      checkIsSameVNDOrJPY
                        ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                        : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                    );

                  const taxConvertedAmount = round(
                    round(
                      taxAmount,
                      checkIsSameVNDOrJPY
                        ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                        : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                    ) * exChangeClosingRate,
                    CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  );

                  const convertTotalAmount = round(
                    round(
                      totalAmount,
                      checkIsSameVNDOrJPY
                        ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                        : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                    ) * exChangeClosingRate,
                    CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  );

                  return handleChangeDataTable({
                    fieldName: ColumnKey.TAX_AMOUNT,
                    value,
                    indexBeforeValidate: index,
                    objectFieldChangeFollow: {
                      taxAmount,
                      totalAmount,
                      convertTotalAmount,
                      taxConvertedAmount,
                    },
                    errorField: `convertibleGoodsItems[${index}].${ColumnKey.TAX_AMOUNT}`,
                  });
                }}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle title={translate("PL.total_amount_label")} unit={currency} />
      ),
      key: ColumnKey.TOTAL_AMOUNT,
      dataIndex: ColumnKey.TOTAL_AMOUNT,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <InputNumber
                value={valueItem}
                numberType={checkIsSameVNDOrJPY ? null : NUMBER_TYPE_INPUT}
                placeHolder={translate("PP.proposal_enter_unit_price")}
                onChange={(value) => {
                  const taxConvertedAmount = round(
                    round(
                      record?.taxAmount,
                      checkIsSameVNDOrJPY
                        ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                        : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                    ) * exChangeClosingRate,
                    CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  );

                  const convertTotalAmount = round(
                    round(
                      value,
                      checkIsSameVNDOrJPY
                        ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                        : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                    ) * exChangeClosingRate,
                    CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  );

                  return handleChangeDataTable({
                    fieldName: ColumnKey.TOTAL_AMOUNT,
                    value,
                    indexBeforeValidate: index,
                    objectFieldChangeFollow: {
                      convertTotalAmount,
                      taxConvertedAmount,
                    },
                    errorField: `convertibleGoodsItems[${index}].${ColumnKey.TOTAL_AMOUNT}`,
                  });
                }}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PL.total_converted_amount_label")}
          unit={VND_CURRENCY_UNIT}
        />
      ),
      key: ColumnKey.CONVERT_TOTAL_AMOUNT,
      dataIndex: ColumnKey.CONVERT_TOTAL_AMOUNT,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <InputNumber
                value={valueItem}
                numberType={checkIsSameVNDOrJPY ? null : NUMBER_TYPE_INPUT}
                placeHolder={translate("PP.proposal_enter_unit_price")}
                onChange={(value) => {
                  return handleChangeDataTable({
                    fieldName: ColumnKey.CONVERT_TOTAL_AMOUNT,
                    value,
                    indexBeforeValidate: index,
                  });
                }}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.brand_category_label")}
          <span className="text-danger">&nbsp;*</span>
        </div>
      ),
      key: ColumnKey.BRANCH,
      dataIndex: ColumnKey.BRANCH,
      width: 160,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].${ColumnKey.BRANCH}`
                )}
                isTableCell
              >
                <Select
                  placeHolder={translate("BG.select_information")}
                  valueFilter={{
                    name: "",
                  }}
                  isRequired
                  isSmall={true}
                  classFilter={undefined}
                  isSearch={false}
                  appendToBody
                  getList={proposalRepository.getManufactureList}
                  onChange={(id, value) =>
                    handleChangeDataTable({
                      fieldName: ColumnKey.BRANCH,
                      value,
                      indexBeforeValidate: index,
                    })
                  }
                  value={record?.branch}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">{translate("PL.note_label")}</div>
      ),
      key: ColumnKey.NOTE,
      dataIndex: ColumnKey.NOTE,
      width: 200,
      render: (valueItem, record, index) => {
        if (!isDetail) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `convertibleGoodsItems[${index}].${ColumnKey.NOTE}`
                )}
                isTableCell
              >
                <InputText
                  value={valueItem}
                  placeHolder={translate("PP.proposal_enter_unit_price")}
                  onChange={(value) => {
                    handleChangeDataTable({
                      fieldName: ColumnKey.NOTE,
                      value,
                      indexBeforeValidate: index,
                      isInput: true,
                      errorField: `convertibleGoodsItems[${index}].${ColumnKey.NOTE}`,
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText value={valueItem} />
          </LayoutCell>
        );
      },
    },
    {
      title: "",
      key: ColumnKey.ACTION,
      dataIndex: ColumnKey.ACTION,
      hidden: isDetail,
      width: isDetail ? 1 : 100,
      render: (_, record) =>
        !isDetail && (
          <LayoutCell>
            <Button
              className={styles["delete-row-btn"]}
              onClick={() => {
                handleDeleteBulkRow([record?.id]);
              }}
            >
              <TrashIcon fillColor="#C03629" />
            </Button>
          </LayoutCell>
        ),
    },
  ];

  return (
    <div>
      <TableWithEmpty
        list={data}
        columns={columns}
        rowSelection={isDetail ? undefined : rowSelection}
        rowClassName={styles["drawer-convertible-table"]}
        actionBarComponent={
          <>
            {!isDetail && (
              <>
                <div className="mb-2">{addGoodServices()}</div>
                <ActionBarComponent
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                >
                  <Button
                    type="secondary"
                    size="sm"
                    onClick={() =>
                      handleDeleteBulkRow(selectedRowKeys as string[])
                    }
                  >
                    {translate("CM.txt_delete")}
                  </Button>
                </ActionBarComponent>
              </>
            )}
          </>
        }
        emptyExtra={
          <CloudyEmpty content={translate("CM.message_empty_data")}>
            {!isDetail ? addGoodServices() : ""}
          </CloudyEmpty>
        }
        fieldValidate="convertibleGoodsItems"
        modelValidate={model}
      />
      <ModalListGoodsServices
        open={isOpenModalGoodsService}
        listServicePicked={data}
        handleCancelModalGoodsService={() => setIsOpenModalGoodsService(false)}
        handleChangeSingleField={handleChangeSingleField}
        handleAddNewDataTable={handleAddNewDataTable}
        contextValue={contextValue}
      />
    </div>
  );
}
