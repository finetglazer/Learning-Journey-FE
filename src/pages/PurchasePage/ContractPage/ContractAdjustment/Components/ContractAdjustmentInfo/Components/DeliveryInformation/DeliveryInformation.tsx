import { Col, Row, Tooltip } from "antd";
import { TableProps } from "antd/lib";
import { Gutter } from "antd/lib/grid/row";
import { TrashIcon } from "assets/icons";
import {
  NOT_TAB_ENTER_REGEX,
  numberConstants,
  PHONE_NUMBER_REGEX,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { cloneDeep, get, isEmpty, isEqual, isObject, matches } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ReceiverInfo } from "models/ContractAnnex";
import {
  combineText,
  receivedType,
} from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./DeliveryInformation.module.scss";
import { ContractAdjustmentContext } from "pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { AddButton } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/AddButton";
import { EmptyView } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/EmptyView";
import { ReceivedType } from "models/Contract";
import { formatDate } from "core/helpers/date-time";
import { Model } from "react-3layer-common";
import classNames from "classnames";

const SPACING = {
  gutter: [12, 16] as [Gutter, Gutter],
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
  Note = 606,
  Delete = 40,
}

const DeliveryLineTable = () => {
  const { model, dispatch } = useContext(ContractAdjustmentContext);
  const isView = model?.isView;
  const [translate] = useTranslation();
  const [data, setData] = useState<ReceiverInfo[]>([]);

  const mapError = useCallback(
    (receiverInfos: ReceiverInfo[], model: any) => {
      const errorsModel = cloneDeep(model?.errors);
      const errorsByIndex: Record<
        number,
        { index: number; [key: string]: any }
      > = {};
      const processErrorPath = (path: string, value: any) => {
        // Extract the index using regex
        const indexMatch = path.match(/\[(\d+)\]/);
        if (!indexMatch) return;

        const index = parseInt(indexMatch[1], 10);

        // Get the field name - everything after the last dot
        const pathParts = path.split(".");
        const fieldName = pathParts[pathParts.length - 1];

        // Initialize the index object if it doesn't exist
        if (!errorsByIndex[index]) {
          errorsByIndex[index] = { index };
        }

        // Add the field error to the index object
        errorsByIndex[index][fieldName] = value;
      };

      if (isObject(errorsModel)) {
        for (const [key, value] of Object.entries(errorsModel)) {
          if (key.startsWith("receiverInfo.receiverInfoDetails")) {
            processErrorPath(key, value);
          }
        }
      }

      // Convert the map to an array
      return Object.values(errorsByIndex);
    },
    [model?.errors]
  );

  useEffect(() => {
    const receiverNew = cloneDeep(model?.receiverInfos);
    const receiverInfoDetailsError = mapError(receiverNew, model);
    const receiverInfosWithErrors = receiverNew.map(
      (receiverInfo: ReceiverInfo, index: number) => {
        const error = receiverInfoDetailsError.find(
          (error) => error.index === index
        );
        return {
          ...receiverInfo,
          errors: error ? error : {},
        };
      }
    );
    setData(receiverInfosWithErrors || []);
  }, [model?.errors]);

  useEffect(() => {
    const receiverNew = cloneDeep(model?.receiverInfos);
    setData(receiverNew || []);
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
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index].shippingDate = value as any;
      newReceiverInfos[index].errors = {
        ...newReceiverInfos[index].errors,
        shippingDate: null,
      };

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
      const newReceiverInfos = cloneDeep(data);
      newReceiverInfos[index][fieldName] = value;
      newReceiverInfos[index].errors = {
        ...newReceiverInfos[index].errors,
        [fieldName]: null,
      };
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

  const shouldDisableRow = (record: ReceiverInfo) => {
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
    if (isPastDate) {
      return true;
    }

    // Future dates are not disabled
    return false;
  };

  const makeRequireTitle = useCallback(
    (titleKey: string, isView = false) => {
      const REQUIRED_TEXT = "*";
      return (
        <div className={styles["required-title__wrapper"]}>
          <span>{translate(titleKey)}</span>
          {!isView && (
            <span className={styles["required"]}>{REQUIRED_TEXT}</span>
          )}
        </div>
      );
    },
    [translate, isView]
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
        title: makeRequireTitle("CA.table_delivery_date", isView),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText
                  useTooltip
                  value={formatDate(date, STANDARD_DATE_FORMAT_SLASH)}
                />
              </LayoutCell>
            );
          }
          const shouldDisable = shouldDisableRow(record);
          if (shouldDisable) {
            return makeDisableFiled(
              formatDate(date, STANDARD_DATE_FORMAT_SLASH),
              "no-margin-left"
            );
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  record,
                  "shippingDate"
                )}
                isTableCell
              >
                <DatePicker
                  className={styles["date-picker"]}
                  value={
                    isEmpty(date)
                      ? undefined
                      : (dayjs(date) as unknown as dayjs.Dayjs)
                  }
                  placeholder={translate(
                    "UEI.placeholder_use_electronic_invoice_date"
                  )}
                  format={STANDARD_DATE_FORMAT_SLASH}
                  minDate={dayjs().utc()}
                  onChange={(value) => {
                    handleChangeDatePicker(index, value);
                  }}
                  allowClear={false}
                  suffixIcon={null}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // Delivery address
      {
        title: makeRequireTitle("CA.table_delivery_address", isView),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string, record: ReceiverInfo, index: number) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip value={address} />
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
                  regexInput={NOT_TAB_ENTER_REGEX}
                  translate={translate}
                  isTableCell
                  maxLength={255}
                  placeHolder={translate("CT.enter_address")}
                  value={address}
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
        width: DeliveryLineTableWidths.Note,
        render: (note: string, record: ReceiverInfo, index) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip value={isEmpty(note) ? "---" : note} />
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
                  translate={translate}
                  regexInput={NOT_TAB_ENTER_REGEX}
                  isTableCell
                  maxLength={500}
                  placeHolder={translate("PL.purchasing_plan_note_placeholder")}
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
        fixed: "right",
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
      {!isView && (
        <div>
          <AddButton
            title={translate("CA.btn_add_delivery_line")}
            onClick={addNewLine}
          />
        </div>
      )}
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        idContainer={"delivery-table"}
        scroll={{ y: "calc(100vh - 300px)" }}
        dataSource={data}
        isDragable={true}
      />
    </div>
  );
};

export const DeliveryInformation = () => {
  const { model, dispatch } = useContext(ContractAdjustmentContext);
  const isView = model?.isView;
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
            {!isView && (
              <AddButton
                title={translate("CA.btn_add_delivery_line")}
                onClick={addNewLine}
              />
            )}
          </EmptyView>
        );
      }

      return <DeliveryLineTable />;
    }

    return null;
  };

  const clearReceiverError = (model: any, fieldName: string) => {
    const errorsModel = cloneDeep(model?.errors);
    return {
      ...errorsModel,
      [fieldName]: null,
    };
  };

  const renderDeliveryTypeView = () => {
    const isSingleReceiver = isEqual(
      model?.received?.id,
      ReceivedType.SingleReceiver
    );
    const content = [
      {
        label: translate("CA.txt_delivery_type"),
        value: model?.received?.name,
        show: true,
      },
      {
        label: translate("CA.txt_delivery_department"),
        value: model?.receivedDepartment?.name,
        show: isSingleReceiver,
      },
      {
        label: translate("CA.txt_delivery_receiver"),
        value: model?.receivedPerson?.email,
        show: isSingleReceiver,
      },
      {
        label: translate("CA.txt_delivery_phone_number"),
        value: model?.receivedPhoneNumber,
        show: isSingleReceiver,
      },
    ];
    return (
      <div className={styles["delivery-type__wrapper"]}>
        {content?.map((item, index) =>
          item?.show ? (
            <div key={index} className={styles["delivery-type__item"]}>
              <span className={styles["delivery-type__label"]}>
                {item?.label}
              </span>
              <span
                className={classNames(
                  styles["delivery-type__value"],
                  "text-truncate"
                )}
              >
                <Tooltip placement="top" title={item?.value}>
                  {item?.value}
                </Tooltip>
              </span>
            </div>
          ) : null
        )}
      </div>
    );
  };

  const handleChangeReceivedType = (_: number, value: Model) => {
    let newReceiverInfos: ReceiverInfo[] = [...(model?.receiverInfos || [])];
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
  };

  const isDisableInfo = () => {
    return (
      isEqual(model?.contract?.receivedType, numberConstants.ZERO) &&
      model?.contract?.isActiveReceive
    );
  };

  return (
    <Row gutter={SPACING.gutter}>
      {/* Type */}
      {!isView ? (
        <Col span={SPACING.span_6}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "receivedType")}
          >
            <Select
              isRequired
              appendToBody
              disabled={model?.contract?.isActiveReceive}
              isSmall={false}
              isEnumerable={false}
              classFilter={CommonFilter}
              label={translate("CA.txt_delivery_type")}
              placeHolder={translate("CA.placeholder_delivery_type")}
              getList={receivedType}
              value={model?.received}
              onChange={(id, value) => {
                handleChangeReceivedType(id, value);
              }}
            />
          </FormItem>
        </Col>
      ) : null}
      {/* Delivery information */}
      {isView ? renderDeliveryTypeView() : null}

      {isEqual(model?.received?.id, ReceivedType.SingleReceiver)
        ? !isView && (
            <>
              {/* Department */}
              <Col span={SPACING.span_6}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "receiverInfo.organizationId"
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
                    placeHolder={translate(
                      "CA.placeholder_delivery_department"
                    )}
                    value={model?.receivedDepartment}
                    onChange={(id, value) => {
                      dispatch({
                        type: GeneralActionEnum.UPDATE,
                        payload: {
                          ...model,
                          receivedDepartment: value,
                          errors: clearReceiverError(
                            model,
                            "receiverInfo.organizationId"
                          ),
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
                    "receiverInfo.person"
                  )}
                >
                  <Select
                    isRequired
                    appendToBody
                    isSearch
                    disabled={
                      isEmpty(model?.receivedDepartment?.id) || isDisableInfo()
                    }
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
                          errors: clearReceiverError(
                            model,
                            "receiverInfo.person"
                          ),
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
                    "receiverInfo.phone"
                  )}
                >
                  <InputText
                    isRequired
                    isSmall={false}
                    label={translate("CA.txt_delivery_phone_number")}
                    placeHolder={translate(
                      "CA.placeholder_seller_phone_number"
                    )}
                    disabled={isDisableInfo()}
                    value={model?.receivedPhoneNumber}
                    regexInput={PHONE_NUMBER_REGEX}
                    translate={translate}
                    maxLength={20}
                    onChange={(value) => {
                      dispatch({
                        type: GeneralActionEnum.UPDATE,
                        payload: {
                          ...model,
                          receivedPhoneNumber: value,
                          errors: clearReceiverError(
                            model,
                            "receiverInfo.phone"
                          ),
                        },
                      });
                    }}
                  />
                </FormItem>
              </Col>
            </>
          )
        : null}
      {/* Add View */}
      <Col span={SPACING.span_24}>{makeDeliveryLine()}</Col>
    </Row>
  );
};
