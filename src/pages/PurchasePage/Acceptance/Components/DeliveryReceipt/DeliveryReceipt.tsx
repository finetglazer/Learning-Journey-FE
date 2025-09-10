import type { ColumnProps } from "antd/es/table";
import { emptyApplicationIcon, IcTrashRed, PlusIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
} from "core/config/consts";
import {
  formatDate,
  formatDateTimeToVietnamTimezone,
} from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual } from "lodash";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../../Components/Acceptance.module.scss";
import { DeliveryReceiptModal } from "../DeliveryReceiptModal/DeliveryReceiptModal";
import { useDeliveryReceiptHooks } from "./DeliveryReceiptHooks";
import { RECEIVING_GOODS_DETAIL_ROUTE } from "config/route-const";
import classNames from "classnames";
import { DeleteRecordModal } from "../../DeleteRecord/DeleteRecordModal";

enum ColumnKey {
  CODE = "code",
  QUANTITY = "quantity",
  CREATOR = "receiptPerson",
  ORGANIZATION = "receiptOrganization",
  CREATE_DATE = "createDate",
  APPROVAL_DATE = "approveDate",
  ACTUAL_RECEIVED_DATE = "receiptDate",
  BRANCH = "businessUnitCode",
  APPROVAL_ACTION = "approvalAction",
  ACTION = "id",
}

const columnsWidth = {
  code: 120,
  quantity: 150,
  organization: 180,
  branch: 160,
  actual_received_date: 144,
  approval_date: 100,
  action: 40,
};

interface DeliveryReceiptProps {
  isEdit?: boolean;
}

export const DeliveryReceipt = ({ isEdit }: DeliveryReceiptProps) => {
  const [translate] = useTranslation();
  const {
    modal,
    rowSelection,
    deliveryReceiptList,
    selectedRowKeys,
    deliveryReceiptSelected,
    isOpenModelConfirmDeleteRow,
    setModal,
    setSelectedRowKeys,
    handleAddDeliveryReceipt,
    handleDeleteDeliveryReceipt,
    setIsOpenModelConfirmDeleteRow,
  } = useDeliveryReceiptHooks();

  const goodItemSelectCurrent = useMemo(
    () => deliveryReceiptList?.map((item) => item?.id),
    [deliveryReceiptList]
  );

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const addGoodReceiptButton = () => (
    <Button
      icon={<img src={PlusIcon} alt="" />}
      iconPlace="left"
      type="secondary"
      onClick={() => setModal(true)}
    >
      {translate("AC.txt_add_goods_receipt")}
    </Button>
  );

  const isHidden = isEqual(
    deliveryReceiptSelected?.length,
    numberConstants.ONE
  );

  const columns = useMemo(() => {
    const items: ColumnProps<GoodsReceiptModel>[] = [
      {
        title: translate("AC.txt_receipt_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: columnsWidth.code,
        render(code: string, record) {
          return (
            <LayoutCell>
              <Link
                to={`${RECEIVING_GOODS_DETAIL_ROUTE}/${record?.id}`}
                className="hyperlink"
                target="_blank"
              >
                {code}
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_receiver_and_in_charge"),
        key: ColumnKey.CREATOR,
        dataIndex: ColumnKey.CREATOR,
        render(value: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={`${value} - ${record?.receiptPersonName}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_receiving_unit_and_in_charge"),
        key: ColumnKey.ORGANIZATION,
        dataIndex: ColumnKey.ORGANIZATION,
        width: columnsWidth.organization,
        render(receiptOrganization: string) {
          return (
            <LayoutCell>
              <OneLineText value={receiptOrganization} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_branch_received"),
        key: ColumnKey.CREATE_DATE,
        dataIndex: ColumnKey.CREATE_DATE,
        width: columnsWidth.branch,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${record?.businessBranchCode} - ${record?.businessBranchName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_bank_branch_or_group_received"),
        key: ColumnKey.BRANCH,
        dataIndex: ColumnKey.BRANCH,
        render(value: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={`${value} - ${record?.businessUnitName}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_actual_receiving_date"),
        key: ColumnKey.ACTUAL_RECEIVED_DATE,
        dataIndex: ColumnKey.ACTUAL_RECEIVED_DATE,
        width: columnsWidth.actual_received_date,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_approval_date"),
        key: ColumnKey.APPROVAL_DATE,
        dataIndex: ColumnKey.APPROVAL_DATE,
        width: columnsWidth.approval_date,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
    ];

    if (isEdit) {
      items.push({
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.action,
        render(id: string) {
          return (
            <LayoutCell>
              <button
                className={classNames(styles["icon-row"], {
                  "d-none": isHidden,
                })}
                onClick={() => {
                  if (isHidden) return;

                  setSelectedRecordId(id);
                  setIsOpenModelConfirmDeleteRow(true);
                }}
              >
                <img src={IcTrashRed} alt="" />
              </button>
            </LayoutCell>
          );
        },
      });
    }

    return items;
  }, [deliveryReceiptSelected, handleDeleteDeliveryReceipt, isEdit, translate]);

  const isEmptyList = useMemo(
    () => isEmpty(deliveryReceiptList),
    [deliveryReceiptList]
  );

  return (
    <>
      {isEqual(isEdit, true) ? (
        <>
          {isEmptyList ? (
            <EmptyItemTable
              icon={<img src={emptyApplicationIcon} alt="" />}
              content={translate("AC.txt_select_new_item")}
            >
              {addGoodReceiptButton()}
            </EmptyItemTable>
          ) : (
            <div className="pb-3">{addGoodReceiptButton()}</div>
          )}
        </>
      ) : null}

      {isEqual(isEmptyList, false) && (
        <div>
          <ActionBarComponent
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          >
            <Button
              size="sm"
              onClick={() => {
                setIsOpenModelConfirmDeleteRow(true);
              }}
            >
              {translate("CM.txt_delete")}
            </Button>
          </ActionBarComponent>
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            columns={columns}
            rowSelection={isEdit && !isHidden ? rowSelection : undefined}
            scroll={{ y: 1000 }}
            dataSource={deliveryReceiptList}
          />
        </div>
      )}
      {isEqual(modal, true) ? (
        <DeliveryReceiptModal
          onClose={() => setModal(false)}
          onSelect={handleAddDeliveryReceipt}
          deliveryReceiptSelected={deliveryReceiptSelected}
          selectedItems={goodItemSelectCurrent}
          goodItemSelectCurrent={deliveryReceiptSelected}
        />
      ) : null}

      {isOpenModelConfirmDeleteRow && (
        <DeleteRecordModal
          open
          loading={undefined}
          handleConfirm={() => {
            if (selectedRecordId) {
              handleDeleteDeliveryReceipt([selectedRecordId]);
            } else {
              handleDeleteDeliveryReceipt(selectedRowKeys as string[]);
            }
          }}
          handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
          title={translate("AC.title_confirm_delete_goods_receipt")}
          content={translate("AC.content_confirm_delete_goods_receipt")}
        />
      )}
    </>
  );
};
