import { ColumnProps } from "antd/lib/table";
import { ColumnKey, ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useCallback, useContext, useMemo } from "react";
import {
  Button,
  DatePicker,
  FormItem,
  InputText,
  LayoutCell,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./DateReceivedTable.scss";

import { utilService } from "core/services/common-services/util-service";
import dayjs, { Dayjs } from "dayjs";
import { Add, TrashCan } from "@carbon/icons-react";
import { GeneralActionEnum } from "core/services/service-types";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";

interface ChangeItemProps {
  value?: string | Dayjs;
  id?: string | number;
  columnKey?: ColumnKey;
  index?: string | number;
}

const DateReceivedTable = () => {
  const [translate] = useTranslation();

  const { model, dispatchModel, listReceiverInfos, setListReceiverInfos } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  const handleChangeItemTable = useCallback(
    ({
      value,
      id = 0,
      columnKey = ColumnKey.SHIPPING_DATE,
    }: ChangeItemProps) => {
      // handle change item
      const newListData = [...listReceiverInfos];
      let validValue = value;

      if (columnKey === ColumnKey.SHIPPING_DATE) {
        validValue = dayjs(validValue);
      }

      const indexById = newListData.findIndex((_, idx) => idx === id);
      newListData[indexById][columnKey] = validValue;

      setListReceiverInfos(newListData);

      if (model?.errors?.[`receiverInfos[${id}].${columnKey}`]) {
        dispatchModel({
          type: GeneralActionEnum.UPDATE,
          payload: {
            errors: {
              [`receiverInfos[${id}].${columnKey}`]: null,
            },
          },
        });
      }
    },
    [dispatchModel, listReceiverInfos, model?.errors, setListReceiverInfos]
  );

  const onAddNewDeliveryDate = () => {
    const newListData = [...listReceiverInfos];
    const lastItem = listReceiverInfos[listReceiverInfos?.length - 1];
    const newDeliveryObject = {
      id: `New${lastItem?.id}`,
      shippingDate: dayjs(new Date()),
      address: "",
      note: "",
    };

    newListData.push(newDeliveryObject);

    setListReceiverInfos(newListData);
  };

  const handleDeleteRow = useCallback(
    (id: string | number) => {
      // handle delete row
      const newListData = [...listReceiverInfos];
      const indexById = newListData.findIndex((el) => el.id === id);

      newListData.splice(indexById, 1);
      setListReceiverInfos(newListData);
    },
    [listReceiverInfos, setListReceiverInfos]
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14 d-flex p-l--2xs">
            {translate("CT.create_contract.table.delivery_date")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        ),
        isRequired: true,
        ellipsis: true,
        width: 80,
        dataIndex: ColumnKey.SHIPPING_DATE,
        key: ColumnKey.SHIPPING_DATE,
        render: (value, { id }, index) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos[${id}].shippingDate`
                )}
              >
                <DatePicker
                  className="p-l--2xs"
                  isRequired
                  isSmall={true}
                  placeholder={"dd/mm/yyyy"}
                  size={"small"}
                  value={value}
                  minDate={dayjs(new Date())}
                  onChange={(val: Dayjs) => {
                    handleChangeItemTable({
                      value: val,
                      id: index,
                      columnKey: ColumnKey.SHIPPING_DATE,
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("PR.address")}
            <span className="text-danger">&nbsp;*</span>
          </div>
        ),
        ellipsis: true,
        width: 250,
        dataIndex: ColumnKey.ADDRESS,
        key: ColumnKey.ADDRESS,
        render: (value: string, _, index: number) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos[${index}].address`
                )}
              >
                <InputText
                  placeHolder={translate("CT.enter_address")}
                  isRequired
                  translate={translate}
                  isTableCell
                  value={value}
                  maxLength={255}
                  onChange={(val: string) => {
                    handleChangeItemTable({
                      value: val,
                      columnKey: ColumnKey.ADDRESS,
                      id: index,
                    });
                  }}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14 d-flex">{translate("PR.note")}</div>
        ),
        ellipsis: true,
        width: 250,
        dataIndex: ColumnKey.NOTE,
        key: ColumnKey.NOTE,
        render: (value: string, _, index) => {
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `receiverInfos[${index}].note`
                )}
              >
                <InputText
                  placeHolder={translate("CT.input_note")}
                  isTableCell
                  maxLength={500}
                  translate={translate}
                  value={value}
                  onChange={(val: string) => {
                    handleChangeItemTable({
                      value: val,
                      columnKey: ColumnKey.NOTE,
                      id: index,
                    });
                  }}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        fixed: "right",
        dataIndex: "action",
        width: 40,
        render: (_, record) => {
          if (listReceiverInfos?.length < 2) {
            return "";
          }

          return (
            <LayoutCell>
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => handleDeleteRow(record.id)}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [
      handleChangeItemTable,
      handleDeleteRow,
      listReceiverInfos?.length,
      model,
      translate,
    ]
  );

  return (
    <>
      <FormItem
        validateObject={utilService.getValidateObj(model, "shippingDate")}
      >
        <Button
          className="receiving_date_btn"
          type="secondary"
          size="lg"
          icon={<Add />}
          iconPlace="left"
          onClick={onAddNewDeliveryDate}
        >
          {translate("CT.create_contract.title.receiving_date_btn")}
        </Button>
      </FormItem>
      <StandardTable
        rowKey="id"
        isDragable
        dataSource={listReceiverInfos}
        columns={columns}
        scroll={{ y: "calc(100vh - 320px)" }}
        className="date_received_table"
      />
    </>
  );
};

export default DateReceivedTable;
