import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import dayjs from "dayjs";
import { ContractDetailModel, Guarantee } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import React, { Key, useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  STANDARD_DATE_FORMAT_INVERSE_DEFAULT,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import GuaranteeModel from "../GuaranteeModel/GuaranteeModel";
import "./GuaranteeView.scss";
import { formatNumber } from "core/helpers/number";

const GuaranteeView = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const typeRowSelection: RowSelectionType = "checkbox";
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [isShowModelAdd, setIsShowModelAdd] = useState(false);
  const [recordEdit, setRecordEdit] = useState<Guarantee | null>(null);

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: Guarantee) => {
      if (record.isTotal) return null;
      return (
        <div className="pt-2 d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.id)
                );
              }
            }}
          />
        </div>
      );
    },
  };

  const columns: ColumnProps<Guarantee>[] = React.useMemo(
    () => [
      {
        title: () => (
          <UnitTitle title={translate("CT.guarantee_type")} unit={" "} />
        ),
        key: "guaranteeType",
        dataIndex: "guaranteeType",
        width: 300,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.guaranteeType?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CT.guarantee_amount")}
            unit={model?.currency}
          />
        ),
        key: "amount",
        dataIndex: "amount",
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(record?.amount?.toString())} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.guarantee_duration")} unit={" "} />
        ),
        key: "guarantee_duration",
        dataIndex: "guarantee_duration",
        width: 300,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={`${dayjs(record?.fromDate).format(
                  STANDARD_DATE_FORMAT_INVERSE_DEFAULT
                )} - ${dayjs(record?.toDate).format(
                  STANDARD_DATE_FORMAT_INVERSE_DEFAULT
                )}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <UnitTitle title={translate("CT.note")} unit={" "} />,
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.description} />
            </LayoutCell>
          );
        },
      },
      model?.isDetail
        ? {
            width: 0,
          }
        : {
            title: "",
            key: "action",
            fixed: "right",
            dataIndex: "action",
            width: 80,
            render: (_, record) => {
              return (
                <LayoutCell>
                  <div
                    className="cursor-pointer payment-red btn m-l--xs"
                    onClick={() => handleEditRow(record)}
                  >
                    <img
                      src={IcPencilSvg}
                      alt="edit"
                      width={20}
                      height={20}
                      className="m-r--sm"
                    />
                  </div>
                  <div className="cursor-pointer payment-red btn">
                    <TrashCan
                      size={20}
                      onClick={() => handleDeleteRowConfirm(record.id)}
                    />
                  </div>
                </LayoutCell>
              );
            },
          },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const handleEditRow = (record: Guarantee) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const guaranteesEdit = model.guarantees.filter(
      (item: Guarantee) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "guarantees",
    })(guaranteesEdit);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const guaranteesEdit = model.guarantees.filter(
      (item: Guarantee) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "guarantees",
    })(guaranteesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  return (
    <div className="guarantee_container">
      {!model?.isDetail && (
        <Button
          type="secondary"
          iconPlace="left"
          className="guarantee_button"
          icon={<img src={PlusIcon} alt="img" width={12} height={12} />}
          onClick={() => setIsShowModelAdd(true)}
          disabled={!model?.originalPurchasePlanId}
        >
          {translate("CT.add_guarantee_info")}
        </Button>
      )}

      <div className="guarantee_content">
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button type="secondary" size="sm" onClick={handleBulkDelete}>
            {translate("CL.delete_btn")}
          </Button>
        </ActionBarComponent>
        <StandardTable
          rowKey={"id"}
          columns={columns}
          rowSelection={model?.isDetail ? null : rowSelection}
          dataSource={model?.guarantees}
          isDragable={true}
          idContainer="table-id"
          rowClassName="cost-allocation-row"
          scroll={{ y: "calc(100vh - 320px)" }}
          className="cost-allocation-row_selection"
        />
        <ModalConfirm
          open={isOpenModelConfirmDeleteRow}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("CT.confirm_delete_guarantee_info")}
          content={translate("CT.confirm_delete_guarantee_info_message")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={() => {
            handleDeleteRow();
          }}
          handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
        />
        <ModalConfirm
          open={openModalConfirmDeleteAll}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("CT.confirm_delete_guarantee_info")}
          content={translate("CT.confirm_delete_guarantee_info_message")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={() => {
            handleBulkDeleteRow();
          }}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
        {isShowModelAdd && (
          <GuaranteeModel
            open={isShowModelAdd}
            recordEdit={recordEdit}
            handleCancel={() => {
              setIsShowModelAdd(false);
              setRecordEdit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GuaranteeView;
