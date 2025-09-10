import React, { Key, useContext, useState } from "react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import "./WarrantyView.scss";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import { ContractDetailModel, Warranty } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { TrashCan } from "@carbon/icons-react";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import WarrantyModel from "../WarrantyModel/WarrantyModel";
import { formatNumber } from "core/helpers/number";

const WarrantyView = () => {
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
  const [recordEdit, setRecordEdit] = useState<Warranty | null>(null);

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: Warranty) => {
      if (record.isTotal) return null;
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
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

  const columns: ColumnProps<Warranty>[] = React.useMemo(
    () => [
      {
        title: () => (
          <UnitTitle title={translate("CT.warranty_type")} unit={" "} />
        ),
        key: "warrantyType",
        dataIndex: "warrantyType",
        width: 280,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyType?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CT.warranty_duration")}
            unit={`(${translate("CT.month")})`}
          />
        ),
        key: "warranty_duration",
        dataIndex: "warranty_duration",
        ellipsis: true,
        width: 200,
        align: "right",
        render: (_, record) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(record?.warrantyPeriod)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CT.warranty_duration_calculation")}
            unit={" "}
          />
        ),
        key: "warrantyCalculationTime",
        dataIndex: "warrantyCalculationTime",
        width: 300,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyCalculationTime?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.warranty_method")} unit={" "} />
        ),
        key: "warrantyTerms",
        dataIndex: "warrantyTerms",
        width: 210,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyTerms?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <UnitTitle title={translate("CT.note")} unit={" "} />,
        key: "description",
        dataIndex: "description",
        width: 210,
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
                    className="payment-red cursor-pointer btn m-l--xs"
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
                  <div className="payment-red cursor-pointer btn">
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

  const handleEditRow = (record: Warranty) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const warrantiesEdit = model.warranties.filter(
      (item: Warranty) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "warranties",
    })(warrantiesEdit);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const warrantiesEdit = model.warranties.filter(
      (item: Warranty) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "warranties",
    })(warrantiesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  return (
    <div className="warranty_container">
      {!model?.isDetail && (
        <Button
          className="warranty_button"
          type="secondary"
          iconPlace="left"
          icon={<img src={PlusIcon} alt="img" width={12} height={12} />}
          onClick={() => setIsShowModelAdd(true)}
        >
          {translate("CT.add_warranty_info")}
        </Button>
      )}

      <div className="warranty_content">
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
          dataSource={model?.warranties}
          isDragable={true}
          idContainer="table-id"
          rowClassName="cost-allocation-row"
          scroll={{ y: "calc(100vh - 320px)" }}
          className="cost-allocation-row_selection"
        />
        <ModalConfirm
          open={isOpenModelConfirmDeleteRow}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("CT.confirm_delete_warranty_info")}
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
          title={translate("CT.confirm_delete_warranty_info")}
          content={translate("CT.confirm_delete_guarantee_info_message")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={() => {
            handleBulkDeleteRow();
          }}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
        {isShowModelAdd && (
          <WarrantyModel
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

export default WarrantyView;
