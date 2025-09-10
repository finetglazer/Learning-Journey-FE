import { Col, Row } from "antd";
import { ColumnProps } from "antd/lib/table";
import dayjs, { Dayjs } from "dayjs";
import { isEmpty, isEqual } from "lodash";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  Button,
  DatePicker,
  DEFAULT_DATETIME_VALUE,
  Drawer,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";

import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  VND_CURRENCY_UNIT,
  WIDTH_400,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";

import { EmptyData } from "components";
import { NUMBER_MAX_13 } from "config/const";
import CommonFilter from "models/CommonFilter";
import { ShippingInfo } from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import {
  convertPriceToVND,
  formatNumberToCurrency,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { useGoodsServicesDetailsDrawerHook } from "./GoodsServicesDetailsDrawerHook";

import { Budget, DeleteRoundIcon, IcPlusSVG, TrashIcon } from "assets/icons";
import { detectIntegerCurrency } from "core/helpers/currency";
import styles from "./GoodsServicesDetailsDrawer.module.scss";

export interface TotalBoxItemProps {
  title: string;
  price: string;
  covertPrice?: string;
  currency: string;
}

const TotalBoxItem = ({
  title,
  price,
  covertPrice,
  currency,
}: TotalBoxItemProps) => {
  return (
    <div className={styles["total-amount-item"]}>
      <span className={styles["title"]}>{title}</span>
      <div className="d-flex gap-1 align-items-baseline">
        <strong className={styles["primary-number"]}>{price}</strong>
        <span className={styles["currency"]}>{currency}</span>
      </div>
      {covertPrice &&
        !isEqual(currency?.toLowerCase(), VND_CURRENCY.toLowerCase()) && (
          <div className="d-flex gap-1 align-items-baseline">
            <span className={styles["secondary-number"]}>{covertPrice}</span>
            <span className={styles["currency"]}>{VND_CURRENCY}</span>
          </div>
        )}
    </div>
  );
};

enum ColumnKey {
  SHIPPING_DATE = "shippingDate",
  QUANTITY = "quantity",
  RECEIVED_ORGANIZATION = "receivedOrganization",
  RECEIVER = "receiver",
  PHONE_NUMBER = "phoneNumber",
  ADDRESS = "address",
  NOTE = "note",
}

const columnsWidth = {
  shippingDate: 140,
  quantity: 130,
  receivedOrganization: 224,
  receiver: 224,
  phoneNumber: 140,
  address: 208,
  note: 140,
  overflowMenu: 40,
};

interface GoodsServicesDetailsDrawerProps {
  isDetailPage?: boolean;
  isWithoutAssessment?: boolean;
}

const GoodsServicesDetailsDrawer = ({
  isDetailPage,
  isWithoutAssessment = false,
}: GoodsServicesDetailsDrawerProps) => {
  const {
    translate,
    selectedDetailGoodsServicesId,
    modelDetailGoodsServices,
    currencyCode,
    roundNumber,
    currentRate,
    isOpenModalConfirmDelete,
    getTaxAmount,
    getAmountBeforeTax,
    getTotalAmount,
    shouldShowShippingInformation,
    setIsOpenModalConfirmDelete,
    handleAddShippingRow,
    handleChangeItemTable,
    handleDeleteShippingRow,
    handleChangeSingleField,
    handleChangeSelectField,
    handleCloseGoodsServicesDetailsDrawer,
    handleSaveGoodsServicesDetailsDrawer,
    handleDeleteDetailGoodsServices,
  } = useGoodsServicesDetailsDrawerHook();

  const shippingInfoDetailColumns: ColumnProps<unknown>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="component__title p-b--xs">
            <div className="d-flex justify-content-start text-nowrap">
              {translate("CT.shipping_date")}
              <span className="text-danger">&nbsp;*</span>
            </div>
          </div>
        ),
        dataIndex: ColumnKey.SHIPPING_DATE,
        key: ColumnKey.SHIPPING_DATE,
        width: columnsWidth.shippingDate,
        render: (shippingDate, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.shippingDate`
                )}
              >
                <DatePicker
                  isRequired={true}
                  isSmall={true}
                  size={"middle"}
                  className="payment-label_none"
                  value={shippingDate ? dayjs(shippingDate) : undefined}
                  placeholder={translate(
                    "CT.create_contract.placeholder.valid_date"
                  )}
                  format={STANDARD_DATE_FORMAT_SLASH}
                  minDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                  onChange={(value: Dayjs) =>
                    handleChangeItemTable(
                      {
                        shippingDate: value,
                      },
                      rowData?.id,
                      [`shippingInfo.${rowData?.id}.shippingDate`]
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
          <div>
            <label className={"component__title p-b--xs"}>
              {translate("CT.received_quantity")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.QUANTITY,
        dataIndex: ColumnKey.QUANTITY,
        width: columnsWidth.quantity,
        render: (quantity, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.quantity`
                )}
              >
                <InputNumber
                  isRequired
                  allowClear={false}
                  placeHolder={translate("CT.placeholder_enter_quantity")}
                  numberType={currencyCode !== VND_CURRENCY ? "DECIMAL" : null}
                  value={quantity}
                  max={modelDetailGoodsServices?.quantity}
                  onChange={(value: number) =>
                    handleChangeItemTable(
                      {
                        quantity: value,
                      },
                      rowData?.id,
                      [`shippingInfo.${rowData?.id}.quantity`]
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
          <div className="">
            <label className="component__title p-b--xs">
              {translate("CT.received_organization")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.RECEIVED_ORGANIZATION,
        dataIndex: ColumnKey.RECEIVED_ORGANIZATION,
        width: columnsWidth.receivedOrganization,
        render: (receivedOrganization, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.receivedOrganization`
                )}
              >
                <Select
                  isRequired
                  placeHolder={translate(
                    "CT.placeholder_received_organization"
                  )}
                  isSearch
                  valueFilter={{
                    name: "",
                  }}
                  searchType=""
                  searchProperty="name"
                  classFilter={CommonFilter}
                  getList={contractRepository.getListOrganization}
                  isEnumerable={false}
                  appendToBody
                  render={(t) => (t ? `${t?.name}` : "")}
                  value={receivedOrganization}
                  onChange={(_, value: Model) => {
                    handleChangeItemTable(
                      {
                        receivedOrganization: value,
                        receiver: null,
                      },
                      rowData?.id,
                      [
                        `shippingInfo.${rowData?.id}.receivedOrganization`,
                        `shippingInfo.${rowData?.id}.receiver`,
                      ]
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
          <div className="">
            <label className="component__title p-b--xs">
              {translate("CT.receiver")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.RECEIVER,
        dataIndex: ColumnKey.RECEIVER,
        width: columnsWidth.receiver,
        render: (receiver, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.receiver`
                )}
              >
                <Select
                  disabled={isEmpty(rowData?.receivedOrganization)}
                  isRequired
                  classFilter={CommonFilter}
                  isSearch
                  searchType=""
                  valueFilter={{
                    name: "",
                    organizationId: rowData?.receivedOrganization?.id,
                  }}
                  getList={contractRepository.getListUser}
                  isEnumerable={false}
                  appendToBody
                  render={(t) => (t ? `${t?.email} - ${t?.name}` : "")}
                  value={receiver}
                  onChange={(_, value: Model) => {
                    handleChangeItemTable({ receiver: value }, rowData?.id, [
                      `shippingInfo.${rowData?.id}.receiver`,
                    ]);
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className={"component__title p-b--xs"}>
              {translate("CT.phone_number")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: columnsWidth.phoneNumber,
        render: (phoneNumber, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.phoneNumber`
                )}
              >
                <InputText
                  isTableCell
                  isRequired
                  allowClear={false}
                  placeHolder={translate("CT.enter_phone_number")}
                  value={phoneNumber ?? null}
                  onChange={(value: string) =>
                    handleChangeItemTable({ phoneNumber: value }, rowData?.id, [
                      `shippingInfo.${rowData?.id}.phoneNumber`,
                    ])
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className={"component__title p-b--xs"}>
              {translate("CT.address")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: columnsWidth.address,
        render: (address, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.address`
                )}
              >
                <InputText
                  isTableCell
                  isRequired
                  allowClear={false}
                  placeHolder={translate("CT.enter_address")}
                  value={address}
                  onChange={(value: string) =>
                    handleChangeItemTable({ address: value }, rowData?.id, [
                      `shippingInfo.${rowData?.id}.address`,
                    ])
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className={"component__title p-b--xs"}>
              {translate("CT.note")}
            </label>
          </div>
        ),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        width: columnsWidth.note,
        render: (note, rowData: ShippingInfo) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  modelDetailGoodsServices,
                  `shippingInfo.${rowData?.id}.note`
                )}
              >
                <InputText
                  isTableCell
                  allowClear={false}
                  placeHolder={translate("CT.enter_note")}
                  value={note}
                  onChange={(value: string) =>
                    handleChangeItemTable({ note: value }, rowData?.id, [
                      `shippingInfo.${rowData?.id}.note`,
                    ])
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, rowData: ShippingInfo) {
          return (
            <LayoutCell>
              <button
                className={styles["delete-shipping-row"]}
                onClick={() => handleDeleteShippingRow(rowData?.id)}
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
      handleDeleteShippingRow,
      modelDetailGoodsServices,
      translate,
    ]
  );

  const shippingInfoViewColumns: ColumnProps<unknown>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="component__title">
            <div className="d-flex justify-content-start text-nowrap">
              {translate("CT.shipping_date")}
            </div>
          </div>
        ),
        dataIndex: ColumnKey.SHIPPING_DATE,
        key: ColumnKey.SHIPPING_DATE,
        width: columnsWidth.shippingDate,
        render: (shippingDate) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(shippingDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            <label className={"component__title"}>
              {translate("CT.received_quantity")}
            </label>
          </div>
        ),
        key: ColumnKey.QUANTITY,
        dataIndex: ColumnKey.QUANTITY,
        align: "right",
        width: columnsWidth.quantity,
        render: (quantity) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(quantity)} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className="component__title">
              {translate("CT.received_organization")}
            </label>
          </div>
        ),
        key: ColumnKey.RECEIVED_ORGANIZATION,
        dataIndex: ColumnKey.RECEIVED_ORGANIZATION,
        width: columnsWidth.receivedOrganization,
        render: (receivedOrganization) => {
          return (
            <LayoutCell>
              <OneLineText value={receivedOrganization?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className="component__title">
              {translate("CT.receiver")}
            </label>
          </div>
        ),
        key: ColumnKey.RECEIVER,
        dataIndex: ColumnKey.RECEIVER,
        width: columnsWidth.receiver,
        render: (receiver) => {
          return (
            <LayoutCell>
              <OneLineText value={receiver?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className={"component__title"}>
              {translate("CT.phone_number")}
            </label>
          </div>
        ),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        align: "right",
        width: columnsWidth.phoneNumber,

        render: (phoneNumber) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={phoneNumber} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="">
            <label className={"component__title"}>
              {translate("CT.address")}
            </label>
          </div>
        ),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: columnsWidth.address,
        render: (address) => {
          return (
            <LayoutCell>
              <OneLineText value={address} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const renderDetailFieldsGroup = () => {
    return (
      <>
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              isSmall={false}
              disabled
              label={translate("CT.create_contract.drawer_goods_code")}
              value={modelDetailGoodsServices?.code}
            />
          </Col>
          <Col lg={16}>
            <InputText
              isSmall={false}
              disabled
              label={translate("CT.create_contract.drawer_goods_name")}
              value={modelDetailGoodsServices?.name}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailGoodsServices,
                "branch"
              )}
            >
              <InputText
                isSmall={false}
                isRequired
                disabled
                label={translate(
                  "CT.create_contract.drawer_manufacturer_or_category"
                )}
                value={modelDetailGoodsServices?.branch?.name}
              />
            </FormItem>
          </Col>
          <Col lg={16}>
            <FormItem>
              <InputText
                isSmall={false}
                label={translate("CT.description_of_goods_and_services")}
                placeHolder={translate(
                  "CT.enter_description_of_goods_and_services"
                )}
                maxLength={500}
                translate={translate}
                value={modelDetailGoodsServices?.description}
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={24}>
            <FormItem>
              <InputText
                isSmall={false}
                label={translate("CT.note")}
                placeHolder={translate("CT.enter_note")}
                translate={translate}
                maxLength={500}
                value={modelDetailGoodsServices?.note}
                onChange={handleChangeSingleField({
                  fieldName: "note",
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailGoodsServices,
                "quantity"
              )}
            >
              <InputNumber
                isRequired
                isSmall={false}
                disabled={!isWithoutAssessment}
                label={translate("CT.quantity")}
                value={modelDetailGoodsServices?.quantity}
                onChange={handleChangeSingleField({
                  fieldName: "quantity",
                })}
                numberType={
                  currencyCode !== VND_CURRENCY ? "DECIMAL" : "NUMBER"
                }
              />
            </FormItem>
          </Col>
          <Col lg={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailGoodsServices,
                "unit"
              )}
            >
              <InputText
                isRequired
                isSmall={false}
                disabled
                label={translate("CT.unit")}
                value={modelDetailGoodsServices?.unit?.name}
              />
            </FormItem>
          </Col>
          <Col lg={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailGoodsServices,
                "unitPrice"
              )}
            >
              <InputNumber
                isRequired
                isSmall={false}
                disabled={!isWithoutAssessment}
                label={translate("CT.unit_price")}
                suffix={currencyCode}
                numberType={
                  currencyCode !== VND_CURRENCY ? "DECIMAL" : "NUMBER"
                }
                value={modelDetailGoodsServices?.unitPrice}
                onChange={handleChangeSingleField({
                  fieldName: "unitPrice",
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={8}>
            <Select
              label={translate("CT.create_contract.drawer_tax_rate")}
              placeHolder={translate("CT.select_tax_rate")}
              getList={contractRepository.getTaxList}
              classFilter={CommonFilter}
              isSmall={false}
              isSearch
              render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
              searchProperty="name"
              appendToBody
              isEnumerable={false}
              value={modelDetailGoodsServices?.tax}
              onChange={(id: number, value: Model) => {
                handleChangeSelectField({
                  fieldName: "tax",
                })(id, value);
                handleChangeSingleField({
                  fieldName: "taxAmount",
                })(
                  getTaxAmount(
                    modelDetailGoodsServices?.unitPrice,
                    modelDetailGoodsServices?.quantity,
                    value
                  )
                );
              }}
            />
          </Col>
          <Col lg={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailGoodsServices,
                "taxAmount"
              )}
            >
              <InputNumber
                isSmall={false}
                disabled={!modelDetailGoodsServices?.tax?.id}
                isRequired={!!modelDetailGoodsServices?.tax?.id}
                label={translate("CT.create_contract.drawer_tax_amount")}
                placeHolder={translate(
                  "CT.create_contract.drawer_enter_tax_amount"
                )}
                suffix={currencyCode}
                max={NUMBER_MAX_13}
                min={numberConstants.ZERO}
                numberType={
                  isEqual(currencyCode, VND_CURRENCY_UNIT) ||
                  isEqual(currencyCode, JPY_CURRENCY_UNIT)
                    ? "LONG"
                    : "DECIMAL"
                }
                value={modelDetailGoodsServices?.taxAmount}
                onChange={handleChangeSingleField({
                  fieldName: "taxAmount",
                })}
              />
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  const renderViewFieldsGroup = () => {
    return (
      <div className={styles["goods-services-detail-table"]}>
        <table>
          <tr>
            <th colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.create_contract.drawer_goods_code")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.code}
                </span>
              </div>
            </th>
            <th colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.create_contract.drawer_goods_name")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.name}
                </span>
              </div>
            </th>
            <th colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate(
                    "CT.create_contract.drawer_manufacturer_or_category"
                  )}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.branch?.name}
                </span>
              </div>
            </th>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.description_of_goods_and_services")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.description}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.note")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.note}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.quantity")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {formatNumber(modelDetailGoodsServices?.quantity)}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.unit")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.unit?.name}
                </span>
              </div>
            </td>
            <td colSpan={2}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.unit_price")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {formatNumber(modelDetailGoodsServices?.unitPrice)}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.create_contract.drawer_tax_rate")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {modelDetailGoodsServices?.tax?.name}
                </span>
              </div>
            </td>
            <td colSpan={3}>
              <div className={styles["goods-services-detail__cell"]}>
                <span className={styles["goods-services-detail__cell-label"]}>
                  {translate("CT.create_contract.drawer_tax_amount")}
                </span>
                <span className={styles["goods-services-detail__cell-value"]}>
                  {formatNumberToCurrency(
                    modelDetailGoodsServices?.taxAmount,
                    detectIntegerCurrency(currencyCode) ? 0 : 4
                  )}
                </span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  };

  const renderDetailShippingInfo = () => {
    return (
      <div className={styles["shipping-information"]}>
        <p className={styles["shipping-information__title"]}>
          {translate("CT.create_contract.title.shipping_information")}
        </p>

        {!isEmpty(modelDetailGoodsServices?.shippingInfo) ? (
          <div className={styles["shipping-information__list"]}>
            <Button
              iconPlace="left"
              icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
              type="secondary"
              size="lg"
              onClick={handleAddShippingRow}
            >
              {translate("CT.create_contract.add_shipping_row")}
            </Button>
            <StandardTable
              rowKey={TABLE_ROW_KEY}
              isDragable
              columns={shippingInfoDetailColumns}
              dataSource={modelDetailGoodsServices?.shippingInfo}
              locale={{
                emptyText: (
                  <EmptyData
                    message={translate("CM.txt_search_no_data")}
                    height={WIDTH_400}
                  />
                ),
              }}
            />
          </div>
        ) : (
          <div className={styles["empty-shipping-information"]}>
            <div className={styles["empty-shipping-information__wrapper"]}>
              <Budget width={140} height={140} />
              <div className={styles["empty-shipping-information__container"]}>
                <span className={styles["no-shipping-information-text"]}>
                  {translate("CM.message_empty_data")}
                </span>
                <Button
                  iconPlace="left"
                  icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                  type="secondary"
                  size="lg"
                  onClick={handleAddShippingRow}
                >
                  {translate("CT.create_contract.add_shipping_row")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderViewShippingInfo = () => {
    return (
      <div className={styles["shipping-information"]}>
        <p className={styles["shipping-information__title"]}>
          {translate("CT.create_contract.title.shipping_information")}
        </p>
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          columns={shippingInfoViewColumns}
          dataSource={modelDetailGoodsServices?.shippingInfo}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Drawer
        visible={!!selectedDetailGoodsServicesId}
        size={"2xl"}
        loading={false}
        isHaveCloseIcon={true}
        hasOverlay={true}
        visibleFooter={!!isDetailPage}
        className={styles["goods-services-detail__container"]}
        title={
          <div>
            <span className={styles["goods-services-detail__title"]}>
              {translate(
                "CT.create_contract.title.drawer_title_detail_goods_services"
              )}
            </span>
          </div>
        }
        titleButtonCancel={translate(
          "CT.create_contract.drawer_btn_delete_goods"
        )}
        titleButtonApply={translate("CT.create_contract.drawer_btn_save")}
        handleClose={handleCloseGoodsServicesDetailsDrawer}
        handleCancel={() => setIsOpenModalConfirmDelete(true)}
        handleSave={handleSaveGoodsServicesDetailsDrawer}
      >
        <div className={styles["goods-services-detail__content"]}>
          <div className={styles["fields-group"]}>
            {isDetailPage ? renderDetailFieldsGroup() : renderViewFieldsGroup()}
          </div>

          <div className={styles["total-amount-section"]}>
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_pre_tax_amount")}
              price={formatNumberToCurrency(getAmountBeforeTax(), roundNumber)}
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(getAmountBeforeTax(), currentRate).display
              }
            />
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_tax")}
              price={
                formatNumberToCurrency(
                  modelDetailGoodsServices?.taxAmount,
                  detectIntegerCurrency(currencyCode) ? 0 : 4
                ) || "0"
              }
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(
                  modelDetailGoodsServices?.taxAmount || 0,
                  currentRate
                ).display
              }
            />
            <TotalBoxItem
              title={translate("CT.create_contract.drawer_total_amount")}
              price={formatNumberToCurrency(
                getTotalAmount(),
                detectIntegerCurrency(currencyCode) ? 0 : 4
              )}
              currency={currencyCode}
              covertPrice={
                convertPriceToVND(getTotalAmount(), currentRate).display
              }
            />
          </div>

          {shouldShowShippingInformation()
            ? isDetailPage
              ? renderDetailShippingInfo()
              : renderViewShippingInfo()
            : null}
        </div>
      </Drawer>
      <ModalConfirm
        open={isOpenModalConfirmDelete}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_goods_services")}
        content={translate("CT.delete_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => handleDeleteDetailGoodsServices()}
        handleCancel={() => setIsOpenModalConfirmDelete(false)}
      />
    </>
  );
};

export default GoodsServicesDetailsDrawer;
