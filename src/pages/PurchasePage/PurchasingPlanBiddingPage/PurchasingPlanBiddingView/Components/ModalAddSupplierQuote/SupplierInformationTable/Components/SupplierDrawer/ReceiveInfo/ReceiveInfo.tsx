import React from "react";
import { useTranslation } from "react-i18next";
import { AddButton } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/AddButton";
import {
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { TABLE_ROW_KEY } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { emptyCloudIcon, emptyIcon } from "assets/icons";
import { cloneDeep, isEqual, size } from "lodash";
import { v4 as uuidv4 } from "uuid";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { ColumnProps } from "antd/lib/table";
import {
  EmailReceiverInformation,
  HandleChangeAllField,
  ParamsChangeItemTable,
  SupplierModel,
} from "models/PurchasingPlan";
import classNames from "classnames";
import { TrashCan } from "@carbon/icons-react";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";

interface Props {
  currentItem: SupplierModel;
  isView?: boolean;
  handleChangeAllFieldSupplier: HandleChangeAllField;
}

export const ReceiveInfo: React.FC<Props> = ({
  currentItem,
  handleChangeAllFieldSupplier,
  isView = false,
}) => {
  const [translate] = useTranslation();

  const addNewLine = () => {
    // append new record in receiverInfos
    const newReceiverInfo = {
      ...new EmailReceiverInformation(),
      id: uuidv4(),
    };
    const list = cloneDeep(currentItem?.emailReceiverInfo || []);
    handleChangeAllFieldSupplier({
      ...currentItem,
      emailReceiverInfo: [...list, newReceiverInfo],
    });
  };

  const handleChangeItemTable = ({
    fieldName,
    value,
    objectValue,
    id,
    fieldNameError,
  }: ParamsChangeItemTable) => {
    const list = cloneDeep(currentItem?.emailReceiverInfo || []);
    handleChangeAllFieldSupplier({
      ...currentItem,
      emailReceiverInfo: list?.map((item) => {
        if (isEqual(item?.id, id)) {
          return {
            ...item,
            [fieldName]: value,
            errors: {
              ...item?.errors,
              [fieldNameError]: null,
            },
          };
        }
        return item;
      }),
    });
  };

  const handleDeleteRow = (id: string) => {
    const list = cloneDeep(currentItem?.emailReceiverInfo || []);
    const index = list?.findIndex((item) => isEqual(item?.id, id));
    if (index !== -1) {
      list.splice(index, 1);
      handleChangeAllFieldSupplier({
        ...currentItem,
        emailReceiverInfo: list,
      });
    }
  };

  const columns: ColumnProps<EmailReceiverInformation>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_email")}
              {!isView && <span className="text-danger">&nbsp;*</span>}
            </label>
          </div>
        ),
        key: "email",
        dataIndex: "email",
        render: (_text_, record, index) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={record?.email} />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(record, "email")}
              >
                <InputText
                  isTableCell
                  isRequired
                  allowClear={true}
                  placeHolder={translate(
                    "PL.purchasing_plan_email_placeholder"
                  )}
                  value={record?.email}
                  onChange={(value) => {
                    handleChangeItemTable({
                      fieldName: "email",
                      value,
                      id: record.id,
                      fieldNameError: "email",
                    });
                  }}
                  isByteCheck
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_full_name")}
            </label>
          </div>
        ),
        key: "name",
        dataIndex: "name",
        render: (_text_, record) => {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText useTooltip={true} value={record?.name} />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(record, "name")}
              >
                <InputText
                  isTableCell
                  placeHolder={translate(
                    "PL.purchasing_plan_full_name_placeholder"
                  )}
                  value={record?.name}
                  onChange={(value: string) => {
                    handleChangeItemTable({
                      fieldName: "name",
                      value,
                      id: record.id,
                      fieldNameError: "name",
                    });
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: isView ? 1 : 40,
        render: (_, record, index) => {
          if (isView) return null;
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
    [translate, currentItem?.emailReceiverInfo]
  );

  return (
    <div className={"delivery-table__wrapper"}>
      {isEqual(size(currentItem?.emailReceiverInfo), 0) ? (
        <>
          {isView ? (
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("CM.empty.no_data_recorded")}
            />
          ) : (
            <EmptyInitializeTable
              textButton={translate("PL.purchasing_plane_add_email_receiver")}
              content={
                <div className="">
                  {translate(
                    "PL.purchasing_plan_add_information_receiver_email"
                  )}
                </div>
              }
              icon={<img src={emptyIcon} alt="" />}
              onHandleClickAdd={addNewLine}
            />
          )}
        </>
      ) : (
        <>
          {!isView && (
            <div>
              <AddButton
                title={translate("PL.purchasing_plane_add_email_receiver")}
                onClick={addNewLine}
              />
            </div>
          )}
          <div className={"m-t--xs"}>
            <StandardTable
              rowKey={TABLE_ROW_KEY}
              columns={columns}
              dataSource={currentItem?.emailReceiverInfo}
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
