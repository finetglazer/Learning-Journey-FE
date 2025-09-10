import { Col, Row } from "antd";
import { TableProps } from "antd/lib";
import { Gutter } from "antd/lib/grid/row";
import { TrashIcon } from "assets/icons";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  VIETNAMESE_TIME_ZONE_OFFSET,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ReceiverInfo } from "models/ContractAnnex";
import {
  combineText,
  receivedType,
} from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  LayoutCell,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractAnnexDetailContext } from "../../../context";
import { AddButton } from "./AddButton";
import { EmptyView } from "./EmptyView";
import styles from "./styles.module.scss";

const SPACING = {
  gutter: [12, 24] as [Gutter, Gutter],
  span_6: 6,
  span_24: 24,
};

enum DeliveryLineTableColumns {
  Date = "shippingDate",
  Address = "address",
  Note = "note",
  DeleteAction = "deleteAction",
}

enum DeliveryLineTableWidths {
  Date = 140,
  Address = 500,
  Delete = 40,
}

const DeliveryLineTable = () => {
  const { model, dispatch } = useContractAnnexDetailContext();
  const [translate] = useTranslation();
  const [data, setData] = useState<ReceiverInfo[]>([]);

  useEffect(() => {
    setData([...(model?.receiverInfos || [])]);
  }, [model?.receiverInfos]);

  const addNewLine = () => {
    // append new record in receiverInfos
    const newReceiverInfos = [
      ...(model?.receiverInfos || []),
      {
        shippingDate: undefined,
        address: "",
        note: "",
      },
    ];

    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        receiverInfos: newReceiverInfos,
      },
    });
  };

  const handleChangeDatePicker = useCallback(
    (index: number, value: dayjs.Dayjs) => {
      const newReceiverInfos = [...data];
      newReceiverInfos[index].shippingDate = value.toISOString();
      setData(newReceiverInfos);

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          receiverInfos: newReceiverInfos,
        },
      });
    },
    [data, dispatch, model]
  );

  const handleChangeInputText = useCallback(
    (index: number, fieldName: string, value: string) => {
      const newReceiverInfos = [...data];
      newReceiverInfos[index][fieldName] = value;
      setData(newReceiverInfos);

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          receiverInfos: newReceiverInfos,
        },
      });
    },
    [data, dispatch, model]
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      const newReceiverInfos = data.filter((_, cursor) => cursor !== index);
      setData(newReceiverInfos);

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          receiverInfos: newReceiverInfos,
        },
      });
    },
    [data, dispatch, model]
  );

  const shouldDisableRow = useCallback((record: ReceiverInfo) => {
    if (!record?.shippingDate) return false;

    const now = dayjs().utc();
    const shippingDate = dayjs(record.shippingDate).add(
      VIETNAMESE_TIME_ZONE_OFFSET,
      "hour"
    );

    if (shippingDate.isBefore(now)) {
      if (
        shippingDate.year() === now.year() &&
        shippingDate.month() === now.month() &&
        shippingDate.date() === now.date()
      ) {
        return false;
      }
      return !isNil(record?.person);
    }

    return false;
  }, []);

  const makeRequireTitle = useCallback(
    (titleKey: string) => {
      const REQUIRED_TEXT = "*";
      return (
        <div className={styles["required-title__wrapper"]}>
          <span>{translate(titleKey)}</span>
          <span className={styles["required"]}>{REQUIRED_TEXT}</span>
        </div>
      );
    },
    [translate]
  );

  const makeDisableFiled = (value: string, className?: string) => {
    return (
      <div className={`${styles["disable-field"]} ${styles[className]}`}>
        <div className={styles["disable-field__value"]}>{value}</div>
      </div>
    );
  };

  const columns: TableProps["columns"] = useMemo(
    () => [
      // Delivery date
      {
        title: makeRequireTitle("CA.table_delivery_date"),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string, record: ReceiverInfo, index: number) => {
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
                  model,
                  `receiverInfos.receiverItems[${index}].shippingDate`
                )}
                isTableCell
              >
                <DatePicker
                  value={date ? dayjs(date) : undefined}
                  isRequired
                  format={STANDARD_DATE_FORMAT_SLASH}
                  minDate={dayjs().utc()}
                  onChange={(value) => {
                    handleChangeDatePicker(index, value);
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // Delivery address
      {
        title: makeRequireTitle("CA.table_delivery_address"),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string, record: ReceiverInfo, index: number) => {
          const shouldDisable = shouldDisableRow(record);

          if (shouldDisable) {
            return makeDisableFiled(address);
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.receiverItems[${index}].address`
                )}
                isTableCell
              >
                <InputText
                  value={address}
                  isRequired
                  onChange={(value) =>
                    handleChangeInputText(index, "address", value)
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
        render: (note: string, record: ReceiverInfo, index) => {
          const shouldDisable = shouldDisableRow(record);

          if (shouldDisable) {
            return makeDisableFiled(note || "");
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos.receiverItems[${index}].note`
                )}
                isTableCell
              >
                <InputText
                  isTableCell
                  value={note}
                  onChange={(value) => {
                    handleChangeInputText(index, "note", value);
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
        width: DeliveryLineTableWidths.Delete,
        render: (_, record: ReceiverInfo, index) => {
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
      handleChangeDatePicker,
      handleChangeInputText,
      handleDeleteRow,
      makeRequireTitle,
      model,
      shouldDisableRow,
      translate,
    ]
  );

  return (
    <div className={styles["delivery-table__wrapper"]}>
      <div>
        <AddButton
          title={translate("CA.btn_add_delivery_line")}
          onClick={addNewLine}
        />
      </div>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export const DeliveryInformation = () => {
  const { model, dispatch } = useContractAnnexDetailContext();
  const [translate] = useTranslation();

  const addNewLine = () => {
    // append new record in receiverInfos
    const newReceiverInfos = [
      ...(model?.receiverInfos || []),
      {
        shippingDate: undefined,
        address: "",
        note: "",
      },
    ];

    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        receiverInfos: newReceiverInfos,
      },
    });
  };

  const makeDeliveryLine = () => {
    if (!isEqual(model?.received?.id, numberConstants.ONE)) {
      if (isEmpty(model?.receiverInfos)) {
        return (
          <EmptyView>
            <AddButton
              title={translate("CA.btn_add_delivery_line")}
              onClick={addNewLine}
            />
          </EmptyView>
        );
      }

      return <DeliveryLineTable />;
    }

    return null;
  };

  const isDisableInfo = () => {
    return (
      isEqual(model?.receivedType, numberConstants.ZERO) &&
      model?.isGoodsReceiptRequestExists
    );
  };

  return (
    <Row gutter={SPACING.gutter}>
      {/* Type */}
      <Col span={SPACING.span_6}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "receivedType")}
        >
          <Select
            isRequired
            appendToBody
            disabled={model?.isGoodsReceiptRequestExists}
            isSmall={false}
            isEnumerable={false}
            classFilter={CommonFilter}
            label={translate("CA.txt_delivery_type")}
            placeHolder={translate("CA.placeholder_delivery_type")}
            getList={receivedType}
            value={model?.received}
            onChange={(id, value) => {
              let newReceiverInfos: ReceiverInfo[] = [
                ...(model?.receiverInfos || []),
              ];
              if (
                isEqual(value?.id, numberConstants.ZERO) &&
                isEmpty(model?.receiverInfos)
              ) {
                // append new record in receiverInfos
                newReceiverInfos = [
                  ...(model?.receiverInfos || []),
                  {
                    shippingDate: "",
                    address: "",
                    note: "",
                  },
                ];
              }

              dispatch({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...model,
                  receiverInfos: newReceiverInfos,
                  received: value,
                },
              });
            }}
          />
        </FormItem>
      </Col>
      {isEqual(model?.received?.id, numberConstants.ZERO) ? (
        <>
          {/* Department */}
          <Col span={SPACING.span_6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.organizationId"
              )}
            >
              <Select
                isRequired
                appendToBody
                isSearch
                isEnumerable={false}
                classFilter={CommonFilter}
                isSmall={false}
                disabled={isDisableInfo()}
                label={translate("CA.txt_delivery_department")}
                placeHolder={translate("CA.placeholder_delivery_department")}
                value={model?.receivedDepartment}
                onChange={(id, value) => {
                  dispatch({
                    type: GeneralActionEnum.UPDATE,
                    payload: {
                      ...model,
                      receivedDepartment: value,
                    },
                  });
                }}
                getList={contractAnnexRepository.getManagerOrganizationList}
              />
            </FormItem>
          </Col>
          {/* Receiver */}
          <Col span={SPACING.span_6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.person"
              )}
            >
              <Select
                isRequired
                appendToBody
                isSearch
                disabled={isNil(model?.receivedDepartment) || isDisableInfo()}
                isEnumerable={false}
                classFilter={CommonFilter}
                isSmall={false}
                label={translate("CA.txt_delivery_receiver")}
                placeHolder={translate("CA.placeholder_delivery_receiver")}
                value={model?.receivedPerson}
                onChange={(id, value) => {
                  dispatch({
                    type: GeneralActionEnum.UPDATE,
                    payload: {
                      ...model,
                      receivedPhoneNumber: value?.phoneNumber,
                      receivedPerson: value,
                    },
                  });
                }}
                getList={(value) => {
                  return contractAnnexRepository.getManagerPersonList({
                    name: value?.name?.contain,
                  });
                }}
                render={(item) => combineText(item?.email, item?.name)}
              />
            </FormItem>
          </Col>
          {/* Phone number */}
          <Col span={SPACING.span_6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.phone"
              )}
            >
              <InputText
                isRequired
                isSmall={false}
                label={translate("CA.txt_delivery_phone_number")}
                placeHolder={translate("CA.placeholder_seller_phone_number")}
                value={model?.receivedPhoneNumber}
                disabled={isDisableInfo()}
                onChange={(value) => {
                  dispatch({
                    type: GeneralActionEnum.UPDATE,
                    payload: {
                      ...model,
                      receivedPhoneNumber: value,
                    },
                  });
                }}
              />
            </FormItem>
          </Col>
        </>
      ) : null}
      {/* Add View */}
      <Col span={SPACING.span_24}>{makeDeliveryLine()}</Col>
    </Row>
  );
};
