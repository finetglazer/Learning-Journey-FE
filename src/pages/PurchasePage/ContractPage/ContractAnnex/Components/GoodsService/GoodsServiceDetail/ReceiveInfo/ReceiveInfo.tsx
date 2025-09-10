import { TableProps } from "antd/lib";
import { Budget, IcPlusSVG, TrashIcon } from "assets/icons";
import { isNullOrUndef } from "chart.js/helpers";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { cloneDeep, isEmpty } from "lodash";
import {
  ReceiverInfo,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { AddButton } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/AddButton";
import styles from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/styles.module.scss";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Model, ModelFilter } from "react-3layer-common";
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
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../../../core/helpers/date-time";
import "./ReceiveInfo.scss";

interface Props {
  model: SelectAdjustableGoodsServicesModel;
  handleChangeAllFieldGoodsService: (data: any) => void;
  isEdit?: boolean;
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
  Date = 158,
  Address = 300,
  Quantity = 134,
  Organization = 200,
  Person = 200,
  Phone = 150,
  Note = 200,
  Delete = 56,
}

export const ReceiveInfo: React.FC<Props> = ({
  model,
  handleChangeAllFieldGoodsService,
  isEdit,
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
      rowId: dayjs().valueOf().toString(),
    };

    handleChangeAllFieldGoodsService({
      ...model,
      receiverInfos: [...data, newReceiverInfo],
    });
  };

  const makeRequireTitle = useCallback(
    (titleKey: string) => {
      const REQUIRED_TEXT = "*";
      return (
        <div className={styles["required-title__wrapper"]}>
          <span>{translate(titleKey)}</span>
          <span className="text-danger">{REQUIRED_TEXT}</span>
        </div>
      );
    },
    [translate]
  );

  const handleChangeDatePicker = useCallback(
    (index: number, value: dayjs.Dayjs) => {
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index].shippingDate = isNullOrUndef(value)
        ? ""
        : value.toISOString();
      setData(newReceiverInfos);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
        errors: {
          ...model.errors,
          [`receiverInfos.${newReceiverInfos[index].rowId}.shippingDate`]: null,
        },
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleChangeInputText = useCallback(
    (index: number, fieldName: string, value: string) => {
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index][fieldName] = value;
      setData(newReceiverInfos);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
        errors: {
          ...model.errors,
          [`receiverInfos.${newReceiverInfos[index].rowId}.${fieldName}`]: null,
        },
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );
  const handleChangeSelectOrganization = useCallback(
    (index: number, fieldName: string, value: Model) => {
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index][`${fieldName}` + `Id`] = value.id;
      newReceiverInfos[index][`${fieldName}` + `Name`] = value.name;
      newReceiverInfos[index][`${fieldName}` + `Email`] = value.email;
      newReceiverInfos[index][`${fieldName}`] = value.name;
      newReceiverInfos[index]["person"] = null;
      newReceiverInfos[index]["personId"] = null;
      setData(newReceiverInfos);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
        errors: {
          ...model.errors,
          [`receiverInfos.${newReceiverInfos[index].rowId}.${fieldName}`]: null,
        },
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );
  const handleChangeInputNumber = useCallback(
    (index: number, fieldName: string, value: number) => {
      const newReceiverInfos = [...data];
      newReceiverInfos[index][fieldName] = value;
      setData(newReceiverInfos);
      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
        errors: {
          ...model.errors,
          [`receiverInfos.${newReceiverInfos[index].rowId}.${fieldName}`]: null,
        },
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleChangeSelectPerson = useCallback(
    (index: number, fieldName: string, value: Model) => {
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index][`${fieldName}` + `Id`] = value.id;
      newReceiverInfos[index][`${fieldName}` + `Name`] = value.name;
      newReceiverInfos[index][`${fieldName}` + `Email`] = value.email;
      newReceiverInfos[index][`${fieldName}`] = value.name;
      newReceiverInfos[index]["phone"] = value.phoneNumber;
      setData(newReceiverInfos);
      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
        errors: {
          ...model.errors,
          [`receiverInfos.${newReceiverInfos[index].rowId}.${fieldName}`]: null,
        },
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      const newReceiverInfos = data.filter((item) => item?.rowId !== rowId);
      setData(newReceiverInfos);

      handleChangeAllFieldGoodsService({
        ...model,
        receiverInfos: newReceiverInfos,
      });
    },
    [data, handleChangeAllFieldGoodsService, model]
  );

  const columns: TableProps["columns"] = useMemo(
    () => [
      // Shipping date
      {
        title: makeRequireTitle("RG.receive_table.shipping_date"),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string, record: ReceiverInfo, index: number) => {
          // Comment vì chờ confirm từ BA
          // const shouldDisable = shouldDisableRow(record);
          // if (shouldDisable) {
          //   return makeDisableFiled(
          //     dayjs(date).format(STANDARD_DATE_FORMAT_SLASH),
          //     "no-margin-left"
          //   );
          // }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.shippingDate`
                )}
                isTableCell
              >
                <DatePicker
                  isRequired
                  value={date ? dayjs(date) : undefined}
                  format={STANDARD_DATE_FORMAT_SLASH}
                  isSmall={true}
                  minDate={dayjs().utc()}
                  onChange={(value) => {
                    handleChangeDatePicker(index, value);
                  }}
                  placeholder={translate(
                    "CA.annex_create.placeholder.receive_info_date"
                  )}
                  disabled={!isEdit}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // quantity
      {
        title: makeRequireTitle("RG.receive_table.quantity"),
        key: DeliveryLineTableColumns.Quantity,
        dataIndex: DeliveryLineTableColumns.Quantity,
        width: DeliveryLineTableWidths.Quantity,
        render: (quantity: number, record: ReceiverInfo, index: number) => {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.quantity`
                )}
                isTableCell
              >
                <InputNumber
                  isSmall={true}
                  onChange={(value) =>
                    handleChangeInputNumber(index, "quantity", value)
                  }
                  placeHolder={translate(
                    "RG.receive_table.placeholder.quantity"
                  )}
                  translate={translate}
                  numberType={"DECIMAL"}
                  allowNegative
                  value={quantity}
                  allowClear={false}
                  isRequired
                  disabled={!isEdit}
                  isTableCell
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      //Organization
      {
        title: makeRequireTitle("RG.receive_table.organization"),
        key: DeliveryLineTableColumns.Organization,
        dataIndex: DeliveryLineTableColumns.Organization,
        width: DeliveryLineTableWidths.Organization,
        render: (organization: Model, record: ReceiverInfo, index: number) => {
          // const shouldDisable = shouldDisableRow(record);
          // if (shouldDisable) {
          //   return makeDisableFiled(organization?.name);
          // }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.organizationId`
                )}
                isTableCell
              >
                <Select
                  isRequired
                  placeHolder={translate(
                    "RG.receive_table.placeholder.organization"
                  )}
                  getList={(filter) => {
                    if (
                      model?.errors?.[
                        `receiverInfos.${record.rowId}.organizationId`
                      ]
                    ) {
                      handleChangeAllFieldGoodsService({
                        ...model,
                        errors: {
                          ...model.errors,
                          [`receiverInfos.${record.rowId}.organizationId`]:
                            null,
                        },
                      });
                    }
                    return contractAnnexRepository.getManagerOrganizationList(
                      filter
                    );
                  }}
                  classFilter={ModelFilter}
                  value={
                    record?.organizationId
                      ? {
                          id: record.organizationId,
                          name: record.organizationName,
                        }
                      : null
                  }
                  onChange={(_, value) =>
                    handleChangeSelectOrganization(index, "organization", value)
                  }
                  disabled={!isEdit}
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
        title: makeRequireTitle("RG.receive_table.person"),
        key: DeliveryLineTableColumns.Person,
        dataIndex: DeliveryLineTableColumns.Person,
        width: DeliveryLineTableWidths.Person,
        render: (person: Model, record: ReceiverInfo, index: number) => {
          // const shouldDisable = shouldDisableRow(record);
          // const personName =
          //   record?.email && record?.name
          //     ? `${record.email} - ${record.name}`
          //     : record?.name || record?.email;
          // if (shouldDisable) {
          //   return makeDisableFiled(personName);
          // }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.person`
                )}
                isTableCell
              >
                <Select
                  isRequired
                  getList={(filter) => {
                    if (
                      model?.errors?.[`receiverInfos.${record.rowId}.person`]
                    ) {
                      handleChangeAllFieldGoodsService({
                        ...model,
                        errors: {
                          ...model.errors,
                          [`receiverInfos.${record.rowId}.person`]: null,
                        },
                      });
                    }
                    return contractAnnexRepository.getListUser(filter);
                  }}
                  placeHolder={translate("RG.receive_table.placeholder.person")}
                  classFilter={ModelFilter}
                  value={
                    record?.personId
                      ? {
                          id: record.personId,
                          name: record.person,
                          email: record.personEmail,
                        }
                      : null
                  }
                  disabled={!isEdit || !record.organizationId}
                  valueFilter={{
                    organizationId: record.organizationId,
                  }}
                  render={(record) =>
                    record?.email && record?.name
                      ? `${record.email} - ${record.name}`
                      : record?.name || record?.email
                  }
                  appendToBody
                  isSearch
                  isEnumerable={null}
                  isShowTooltip
                  className={"input-text--read-only"}
                  searchType={null}
                  searchProperty="search"
                  onChange={(_, value) =>
                    handleChangeSelectPerson(index, "person", value)
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: makeRequireTitle("RG.receive_table.phone"),
        key: DeliveryLineTableColumns.Phone,
        dataIndex: DeliveryLineTableColumns.Phone,
        width: DeliveryLineTableWidths.Phone,
        render: (phone: string, record: ReceiverInfo, index: number) => {
          // const shouldDisable = shouldDisableRow(record);

          // if (shouldDisable) {
          //   return makeDisableFiled(phone);
          // }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.phone`
                )}
                isTableCell
              >
                <InputText
                  value={phone}
                  placeHolder={translate("RG.receive_table.placeholder.phone")}
                  onChange={(value) =>
                    handleChangeInputText(index, "phone", value)
                  }
                  disabled={!isEdit}
                  allowClear={false}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: makeRequireTitle("CA.table_delivery_address"),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string, record: ReceiverInfo, index: number) => {
          // const shouldDisable = shouldDisableRow(record);

          // if (shouldDisable) {
          //   return makeDisableFiled(address);
          // }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.address`
                )}
                isTableCell
              >
                <InputText
                  value={address}
                  placeHolder={translate(
                    "RG.receive_table.placeholder.address"
                  )}
                  onChange={(value) =>
                    handleChangeInputText(index, "address", value)
                  }
                  disabled={!isEdit}
                  allowClear={false}
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
        render: (note: string, record: ReceiverInfo, index) => {
          // const shouldDisable = shouldDisableRow(record);

          // if (shouldDisable) {
          //   return makeDisableFiled(note || "");
          // }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.${record?.rowId}.note`
                )}
                isTableCell
              >
                <InputText
                  isTableCell
                  value={note}
                  onChange={(value) => {
                    handleChangeInputText(index, "note", value);
                  }}
                  allowClear={false}
                  disabled={!isEdit}
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
        width: DeliveryLineTableWidths.Delete,
        className: isEdit ? "stand-sticky" : "",
        fixed: isEdit ? "right" : "left",
        render: (_, record: ReceiverInfo) => {
          if (!isEdit) return null;
          // const shouldDisable = shouldDisableRow(record);
          // if (shouldDisable) {
          //   return null;
          // }

          return (
            <LayoutCell
              position="center"
              className={classNames(isEdit ? "stand-sticky" : "")}
            >
              <div
                className="cursor-pointer"
                onClick={() => handleDeleteRow(record?.rowId)}
              >
                <TrashIcon fillColor="#DA3E33" />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [
      handleChangeAllFieldGoodsService,
      handleChangeDatePicker,
      handleChangeInputNumber,
      handleChangeInputText,
      handleChangeSelectOrganization,
      handleChangeSelectPerson,
      handleDeleteRow,
      isEdit,
      makeRequireTitle,
      model,
      translate,
    ]
  );

  const columnsView: TableProps["columns"] = useMemo(
    () => [
      // Shipping date
      {
        title: translate("RG.receive_table.shipping_date"),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(date, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      // quantity
      {
        title: translate("RG.receive_table.quantity"),
        key: DeliveryLineTableColumns.Quantity,
        dataIndex: DeliveryLineTableColumns.Quantity,
        width: DeliveryLineTableWidths.Quantity,
        align: "right",
        render: (_: number, record: ReceiverInfo) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={String(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      //Organization
      {
        title: translate("RG.receive_table.organization"),
        key: DeliveryLineTableColumns.Organization,
        dataIndex: DeliveryLineTableColumns.Organization,
        width: DeliveryLineTableWidths.Organization,
        render: (_: Model, record: ReceiverInfo) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.organizationName} useTooltip />
            </LayoutCell>
          );
        },
      },
      //Person
      {
        title: translate("RG.receive_table.person"),
        key: DeliveryLineTableColumns.Person,
        dataIndex: DeliveryLineTableColumns.Person,
        width: DeliveryLineTableWidths.Person,
        render: (_: string, record: ReceiverInfo) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.person} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.receive_table.phone"),
        key: DeliveryLineTableColumns.Phone,
        dataIndex: DeliveryLineTableColumns.Phone,
        align: "right",
        width: DeliveryLineTableWidths.Phone,
        render: (phone: string) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={phone} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.table_delivery_address"),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={address} useTooltip />
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
        render: (note: string) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={note} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
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
                <Button
                  iconPlace="left"
                  icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                  type="secondary"
                  size="lg"
                  onClick={addNewLine}
                >
                  {translate("CA.btn_add_delivery_line")}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {isEdit && (
            <div className="mb-1 pb-2">
              <AddButton
                title={translate("CA.btn_add_delivery_line")}
                onClick={addNewLine}
              />
            </div>
          )}
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            columns={isEdit ? columns : columnsView}
            dataSource={data}
            scroll={{ x: "max-content" }}
          />
        </>
      )}
      <FormItem
        validateObject={utilService.getValidateObj(model, `receiverInfos`)}
      >
        <div></div>
      </FormItem>
    </div>
  );
};
