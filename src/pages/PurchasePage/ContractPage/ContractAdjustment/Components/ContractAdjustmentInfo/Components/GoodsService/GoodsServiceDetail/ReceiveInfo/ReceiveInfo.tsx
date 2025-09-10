import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReceiverInfo,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { useTranslation } from "react-i18next";
import styles from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/styles.module.scss";
import { AddButton } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/AddButton";
import {
  Button,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { utilService } from "core/services/common-services/util-service";
import { Budget, IcPlusSVG, TrashIcon } from "assets/icons";
import { cloneDeep, isEmpty, isEqual } from "lodash";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { Model, ModelFilter } from "react-3layer-common";
import "./ReceiveInfo.scss";
import { v4 as uuidv4 } from "uuid";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { NUMBER_MAX_13 } from "config/const";

interface Props {
  model: SelectAdjustableGoodsServicesModel;
  handleChangeAllFieldGoodsService: (data: any) => void;
  isView?: boolean;
}

enum DeliveryLineTableColumns {
  Date = "shippingDate",
  Address = "address",
  Quantity = "quantity",
  Organization = "organization",
  Person = "person",
  Phone = "phone",
  Note = "note",
  DeleteAction = "deleteAction",
}

enum DeliveryLineTableWidths {
  Date = 134,
  Address = 134,
  Quantity = 134,
  Organization = 184,
  Person = 184,
  Phone = 134,
  Note = 200,
  Delete = 50,
}

export const ReceiveInfo: React.FC<Props> = ({
  model,
  handleChangeAllFieldGoodsService,
  isView = false,
}) => {
  const [translate] = useTranslation();
  const [data, setData] = useState<ReceiverInfo[]>([]);

  useEffect(() => {
    const defaultReceiverInfos = Array.isArray(model?.receiverInfos)
      ? [...model.receiverInfos]
      : [];
    setData(defaultReceiverInfos);
  }, [model, model.quantity, model.receiverInfos]);

  const addNewLine = () => {
    // append new record in receiverInfos
    const newReceiverInfo = {
      ...new ReceiverInfo(),
      id: uuidv4(),
    };

    handleChangeAllFieldGoodsService({
      ...model,
      receiverInfos: [...data, newReceiverInfo],
    });
  };

  const makeRequireTitle = useCallback(
    (titleKey: string, isView = false) => {
      const REQUIRED_TEXT = "*";
      return (
        <div className={styles["required-title__wrapper"]}>
          <span>{translate(titleKey)}</span>
          {!isView && <span className="text-danger">{REQUIRED_TEXT}</span>}
        </div>
      );
    },
    [translate, isView]
  );

  const handleChangeDatePicker = useCallback(
    (index: number, value: dayjs.Dayjs, record: ReceiverInfo) => {
      const newReceiverInfos = cloneDeep(data);
      const newReceiverInfosConvert = newReceiverInfos.map((item) => {
        if (item?.id === record?.id) {
          return {
            ...item,
            shippingDate: value,
            errors: {
              ...item?.errors,
              shippingDate: null as unknown,
            },
          };
        }
        return item;
      });
      setData(newReceiverInfos as any);
      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfosConvert,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleChangeInputText = useCallback(
    (index: number, fieldName: string, value: string, record: ReceiverInfo) => {
      const newReceiverInfos = cloneDeep(data);
      const newReceiverInfosConvert = newReceiverInfos.map((item, cursor) => {
        if (item?.id === record?.id) {
          return {
            ...item,
            [fieldName]: value,
            errors: {
              ...item?.errors,
              [fieldName]: null,
            },
          };
        }
        return item;
      });
      setData(newReceiverInfosConvert);
      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfosConvert,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );
  const handleChangeSelectField = useCallback(
    (index: number, fieldName: string, value: Model, record: ReceiverInfo) => {
      const newReceiverInfos = cloneDeep(data);
      const newReceiverInfosConvert = newReceiverInfos.map((item) => {
        if (item?.id === record?.id) {
          // Create base update with common field properties
          const baseUpdate = {
            ...item,
            [`${fieldName}Id`]: value.id,
            [`${fieldName}Name`]: value.name,
            [`${fieldName}Email`]: value.email,
            [fieldName]: value.name,
            errors: {
              ...item?.errors,
              [fieldName]: null,
            } as { [key: string]: string | null },
          };

          // Add organization-specific logic to clear person data
          if (fieldName === DeliveryLineTableColumns.Organization) {
            return {
              ...baseUpdate,
              personId: null,
              personName: null,
              personEmail: null,
            };
          }
          if (fieldName === DeliveryLineTableColumns.Person) {
            return {
              ...baseUpdate,
              phone: value?.phoneNumber,
            };
          }

          return baseUpdate;
        }
        return item;
      });
      setData(newReceiverInfosConvert);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfosConvert,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleChangeInputNumber = useCallback(
    (index: number, fieldName: string, value: number, record: ReceiverInfo) => {
      const newReceiverInfos = cloneDeep(data);
      const totalQuantity = model?.quantity;
      const totalReceivedQuantity =
        model?.receiverInfos?.reduce(
          (acc: number, item: ReceiverInfo) => acc + (item?.quantity || 0),
          0
        ) + value;
      const isValidQuantity = isEqual(totalQuantity, totalReceivedQuantity);
      const newReceiverInfosConvert = newReceiverInfos.map((item, cursor) => {
        if (item?.id === record?.id) {
          return {
            ...item,
            [fieldName]: value,
            errors: {
              ...item?.errors,
              [fieldName]: null,
            },
          };
        }
        if (fieldName === "quantity" && isValidQuantity) {
          return {
            ...item,
            errors: {
              ...item?.errors,
              quantity: null,
            },
          };
        }
        return item;
      });

      setData(newReceiverInfosConvert);
      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfosConvert,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      const newReceiverInfos = data.filter((_, cursor) => cursor !== index);
      setData(newReceiverInfos);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const shouldDisableRow = useCallback((record: ReceiverInfo) => {
    // If no shipping date exists, row is not disabled
    if (!record?.shippingDate) return false;
    const now = dayjs();
    const shippingDate = dayjs(record?.shippingDate);
    // If shipping date is today, row is not disabled
    const isToday = shippingDate.isSame(now, "day");
    if (isToday) return false;
    // If shipping date is in the past (and not today),
    // disable only if there's a person assigned
    const isPastDate = shippingDate.isBefore(now);
    if (isPastDate || record?.isActiveReceive) {
      return true;
    }

    // Future dates are not disabled
    return false;
  }, []);

  const makeDisableFiled = (value: string, className?: string) => {
    return (
      <div className={`${styles["disable-field"]} ${styles[className]}`}>
        <div className={styles["disable-field__value"]}>{value}</div>
      </div>
    );
  };

  const columns: TableProps["columns"] = useMemo(
    () => [
      // Shipping date
      {
        title: makeRequireTitle("RG.receive_table.shipping_date", isView),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText
                  useTooltip={true}
                  value={formatDate(date, STANDARD_DATE_FORMAT_SLASH)}
                />
              </LayoutCell>
            );
          }
          const shouldDisable = shouldDisableRow(record);
          if (shouldDisable) {
            return makeDisableFiled(
              dayjs(date).format(STANDARD_DATE_FORMAT_SLASH),
              "no-margin-left"
            );
          }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  record,
                  `shippingDate`
                )}
                isTableCell
              >
                <DatePicker
                  placeholder={translate(
                    "UEI.placeholder_use_electronic_invoice_date"
                  )}
                  value={date ? dayjs(date) : undefined}
                  format={STANDARD_DATE_FORMAT_SLASH}
                  minDate={dayjs().utc()}
                  onChange={(value) => {
                    handleChangeDatePicker(index, value, record);
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // quantity
      {
        title: makeRequireTitle("RG.receive_table.quantity", isView),
        key: DeliveryLineTableColumns.Quantity,
        dataIndex: DeliveryLineTableColumns.Quantity,
        width: DeliveryLineTableWidths.Quantity,
        render: (quantity: number, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={formatNumber(quantity)} />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(record, `quantity`)}
                isTableCell
              >
                <InputNumber
                  readOnly={shouldDisableRow(record)}
                  isSmall={true}
                  onChange={(value) =>
                    handleChangeInputNumber(index, "quantity", value, record)
                  }
                  placeHolder={translate("CT.placeholder_enter_quantity")}
                  numberType={"DECIMAL"}
                  value={quantity}
                  allowClear={false}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  allowNegative={true}
                  isRequired
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      //Organization
      {
        title: makeRequireTitle("RG.receive_table.organization", isView),
        key: DeliveryLineTableColumns.Organization,
        dataIndex: DeliveryLineTableColumns.Organization,
        width: DeliveryLineTableWidths.Organization,
        render: (organization: Model, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText
                  useTooltip={true}
                  value={record?.organizationName}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  record,
                  "organization"
                )}
                isTableCell
              >
                <Select
                  readOnly={shouldDisableRow(record)}
                  isRequired
                  placeHolder={translate(
                    "CT.placeholder_received_organization"
                  )}
                  getList={(filter) => {
                    if (record?.errors?.organization) {
                      record.errors.organization = null;
                      setData(
                        [...data].map((el) =>
                          el.id === record.id ? record : el
                        )
                      );
                    }
                    return contractAnnexRepository.getManagerOrganizationList(
                      filter
                    );
                  }}
                  classFilter={ModelFilter}
                  value={
                    record?.organizationId
                      ? {
                          id: record?.organizationId,
                          name: record?.organizationName,
                        }
                      : null
                  }
                  onChange={(_, value) =>
                    handleChangeSelectField(
                      index,
                      "organization",
                      value,
                      record
                    )
                  }
                  isSearch
                  appendToBody
                  searchType={null}
                  searchProperty="search"
                  isEnumerable={false}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      //Person
      {
        title: makeRequireTitle("RG.receive_table.person", isView),
        key: DeliveryLineTableColumns.Person,
        dataIndex: DeliveryLineTableColumns.Person,
        width: DeliveryLineTableWidths.Person,
        render: (person: Model, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={record?.personName} />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(record, "person")}
                isTableCell
              >
                <Select
                  readOnly={shouldDisableRow(record) || !record?.organizationId}
                  isRequired
                  getList={(filter) => {
                    if (record?.errors?.person) {
                      record.errors.person = null;
                      setData(
                        [...data].map((el) =>
                          el.id === record.id ? record : el
                        )
                      );
                    }
                    return contractAnnexRepository.getListUser(filter);
                  }}
                  placeHolder={translate("RG.receive_table.placeholder.person")}
                  classFilter={ModelFilter}
                  value={
                    record?.personId
                      ? {
                          id: record.personId,
                          name: combineText(
                            record?.personName,
                            record?.personEmail
                          ),
                        }
                      : null
                  }
                  valueFilter={{
                    organizationId: record?.organizationId,
                  }}
                  appendToBody
                  isSearch
                  isEnumerable={null}
                  isShowTooltip
                  searchType={null}
                  searchProperty="search"
                  onChange={(_, value) => {
                    handleChangeSelectField(index, "person", value, record);
                  }}
                  render={(item) => combineText(item?.email, item?.name)}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: makeRequireTitle("RG.receive_table.phone", isView),
        key: DeliveryLineTableColumns.Phone,
        dataIndex: DeliveryLineTableColumns.Phone,
        width: DeliveryLineTableWidths.Phone,
        render: (phone: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={phone} />
              </LayoutCell>
            );
          }
          const shouldDisable = shouldDisableRow(record);

          if (shouldDisable) {
            return makeDisableFiled(phone);
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(record, "phone")}
                isTableCell
              >
                <InputText
                  value={phone}
                  placeHolder={translate("CT.enter_phone_number")}
                  onChange={(value) =>
                    handleChangeInputText(index, "phone", value, record)
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: makeRequireTitle("CA.table_delivery_address", isView),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={address} />
              </LayoutCell>
            );
          }
          const shouldDisable = shouldDisableRow(record);

          if (shouldDisable) {
            return makeDisableFiled(address);
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(record, "address")}
                isTableCell
              >
                <InputText
                  value={address}
                  placeHolder={translate("CT.enter_address")}
                  onChange={(value) =>
                    handleChangeInputText(index, "address", value, record)
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // Delivery note
      {
        title: translate("CA.table_delivery_note"),
        key: DeliveryLineTableColumns.Note,
        dataIndex: DeliveryLineTableColumns.Note,
        width: DeliveryLineTableWidths.Note,
        render: (note: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={note} />
              </LayoutCell>
            );
          }
          const shouldDisable = shouldDisableRow(record);

          if (shouldDisable) {
            return makeDisableFiled(note || "");
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(record, "note")}
                isTableCell
              >
                <InputText
                  isTableCell
                  placeHolder={translate("PL.purchasing_plan_note_placeholder")}
                  value={note}
                  onChange={(value) => {
                    handleChangeInputText(index, "note", value, record);
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // Delete
      {
        title: "",
        key: DeliveryLineTableColumns.DeleteAction,
        dataIndex: DeliveryLineTableColumns.DeleteAction,
        fixed: !isView ? "right" : undefined,
        width: DeliveryLineTableWidths.Delete,
        render: (_, record: ReceiverInfo, index) => {
          if (isView) {
            return null;
          }
          const shouldDisable = shouldDisableRow(record);
          if (shouldDisable) {
            return null;
          }
          return (
            <LayoutCell>
              <div
                className="cursor-pointer"
                onClick={() => handleDeleteRow(index)}
              >
                <TrashIcon fillColor="#DA3E33" />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [
      makeRequireTitle,
      isView,
      translate,
      shouldDisableRow,
      handleChangeDatePicker,
      handleChangeInputNumber,
      data,
      handleChangeSelectField,
      handleChangeInputText,
      handleDeleteRow,
    ]
  );

  return (
    <div className={"delivery-table__wrapper"}>
      {isEmpty(model?.receiverInfos) ? (
        <>
          <div className={"empty-shipping-information"}>
            <div className={"empty-shipping-information__wrapper"}>
              <Budget width={140} height={140} />
              <div className={"empty-shipping-information__container"}>
                <span className={"no-shipping-information-text"}>
                  {translate("CM.message_empty_data")}
                </span>
                {!isView && (
                  <Button
                    iconPlace="left"
                    icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                    type="secondary"
                    size="lg"
                    onClick={addNewLine}
                  >
                    {translate("CA.btn_add_delivery_line")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {!isView && (
            <div>
              <AddButton
                title={translate("CA.btn_add_delivery_line")}
                onClick={addNewLine}
              />
            </div>
          )}
          <div className={"m-t--xs"}>
            <StandardTable
              rowKey={TABLE_ROW_KEY}
              columns={columns}
              dataSource={data}
              scroll={{ y: "calc(100vh - 320px)" }}
              idContainer={"receive-info-table"}
              isDragable={true}
            />
          </div>
        </>
      )}
    </div>
  );
};
