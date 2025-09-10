import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import { ICON_SIZE_MEDIUM } from "core/config/icon-size";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import { useContractAnnexDetailContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/context";
import GuaranteeContractModal from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/Components/Modal/GuaranteeContractModal/GuaranteeContractModal";
import { Key, useMemo, useState } from "react";
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
import "./ContractAnnexGuarantee.scss";
import { isEqual } from "lodash";
import { ContractGuarantee } from "models/ContractAnnex";
import { useCheckStateContractAnnex } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useCheckStateContractAnnex";
import { useContractAnnexViewContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexView/context";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";

const ICON_SIZE = 12;
const ICON_SIZE_72 = 72;
const ROW_KEY_GUARANTEE = "guaranteeTypeId";

const columnsWidth = {
  guaranteeType: 200,
  amount: 145,
  guaranteeDuration: 150,
  description: 300,
  action: 80,
};

const ContractAnnexGuarantee = () => {
  const [translate] = useTranslation();
  const { state } = useCheckStateContractAnnex();
  const { model, handleChangeSingleField } = useContractAnnexDetailContext();
  const { model: modelView } = useContractAnnexViewContext();
  const [isShowModelAdd, setIsShowModelAdd] = useState(false);
  const [recordEdit, setRecordEdit] = useState<ContractGuarantee | null>(null);
  const [idDelete, setIdDelete] = useState<string>("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState<boolean>(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState<boolean>(false);
  const typeRowSelection: RowSelectionType = "checkbox";
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: ContractGuarantee) => {
      if (record.isTotal) return null;
      return (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([
                  ...selectedRowKeys,
                  record?.guaranteeTypeId,
                ]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter(
                    (key) => key !== record?.guaranteeTypeId
                  )
                );
              }
            }}
          />
        </div>
      );
    },
  };

  const columns: ColumnProps<ContractGuarantee>[] = useMemo(
    () => [
      {
        title: () => (
          <UnitTitle title={translate("CT.guarantee_type")} unit={" "} />
        ),
        key: "guaranteeType",
        dataIndex: "guaranteeType",
        width: columnsWidth.guaranteeType,
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
            unit={model?.contractInfo?.currency}
          />
        ),
        key: "amount",
        dataIndex: "amount",
        ellipsis: true,
        width: columnsWidth.amount,
        align: "right",
        render: (_, record) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(record?.amount?.toString())} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle title={translate("CA.txt_time_guarantee")} unit={" "} />
        ),
        key: "guarantee_duration",
        dataIndex: "guarantee_duration",
        width: columnsWidth.guaranteeDuration,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={`${formatDateTimeToVietnamTimezone(
                  record?.fromDate,
                  STANDARD_DATE_FORMAT_INVERSE_DEFAULT
                )} - ${formatDateTimeToVietnamTimezone(
                  record?.toDate,
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
        width: columnsWidth.description,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        fixed: "right",
        width: columnsWidth.action,
        render: (_, record) => {
          return (
            <>
              {!isEqual(state, "DETAIL") && (
                <LayoutCell>
                  <div
                    className="cursor-pointer payment-red btn m-l--xs"
                    onClick={() => handleEditRow(record)}
                  >
                    <img
                      src={IcPencilSvg}
                      alt="edit"
                      width={ICON_SIZE_MEDIUM}
                      height={ICON_SIZE_MEDIUM}
                      className="m-r--sm"
                    />
                  </div>
                  <div className="cursor-pointer payment-red btn">
                    <TrashCan
                      size={ICON_SIZE_MEDIUM}
                      onClick={() =>
                        handleDeleteRowConfirm(record?.guaranteeTypeId)
                      }
                    />
                  </div>
                </LayoutCell>
              )}
            </>
          );
        },
      },
    ],
    [translate]
  );

  const handleEditRow = (record: ContractGuarantee) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (guaranteeTypeId: string) => {
    setIdDelete(guaranteeTypeId);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const guaranteesEdit = model?.contractAppendixGuarantees.filter(
      (item: ContractGuarantee) => item?.guaranteeTypeId !== idDelete
    );
    handleChangeSingleField({
      fieldName: "contractAppendixGuarantees",
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
    const guaranteesEdit = model?.contractAppendixGuarantees.filter(
      (item: ContractGuarantee) =>
        !selectedRowKeys.includes(item?.guaranteeTypeId)
    );
    handleChangeSingleField({
      fieldName: "contractAppendixGuarantees",
    })(guaranteesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const addGuarantee = () => {
    return (
      <Button
        type="secondary"
        iconPlace="left"
        className="guarantee_button"
        icon={
          <img src={PlusIcon} alt="img" width={ICON_SIZE} height={ICON_SIZE} />
        }
        onClick={() => setIsShowModelAdd(true)}
      >
        {translate("CA.txt_add_guarantee_info")}
      </Button>
    );
  };

  const checkEmptyGuarantees = useMemo(() => {
    const guarantees = isEqual(state, "DETAIL")
      ? modelView?.contractAppendixGuarantees
      : model?.contractAppendixGuarantees;
    return isEqual(guarantees?.length, numberConstants.ZERO);
  }, [
    state,
    modelView?.contractAppendixGuarantees,
    model?.contractAppendixGuarantees,
  ]);

  const canAddGuarantee = ["EDIT", "CREATE"].includes(state);

  return (
    <>
      {checkEmptyGuarantees ? (
        <CloudyEmpty>{canAddGuarantee && addGuarantee()}</CloudyEmpty>
      ) : (
        <div className="guarantee_container">
          {!isEqual(state, "DETAIL") && addGuarantee()}

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
              rowKey={ROW_KEY_GUARANTEE}
              columns={columns}
              rowSelection={
                !isEqual(state, "DETAIL") ? rowSelection : undefined
              }
              dataSource={
                model?.contractAppendixGuarantees ||
                modelView?.contractAppendixGuarantees
              }
              isDragable={true}
              rowClassName="cost-allocation-row"
              scroll={{ y: "calc(100vh - 320px)" }}
              className="cost-allocation-row_selection"
            />
          </div>
        </div>
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={
          <img
            src={DeleteRoundIcon}
            alt="img"
            width={ICON_SIZE_72}
            height={ICON_SIZE_72}
          />
        }
        title={translate("CT.confirm_delete_guarantee_info")}
        content={translate("CT.confirm_delete_guarantee_info_message")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={handleDeleteRow}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />

      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={
          <img
            src={DeleteRoundIcon}
            alt="img"
            width={ICON_SIZE_72}
            height={ICON_SIZE_72}
          />
        }
        title={translate("CT.confirm_delete_guarantee_info")}
        content={translate("CT.confirm_delete_guarantee_info_message")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={handleBulkDeleteRow}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />

      {isShowModelAdd && (
        <GuaranteeContractModal
          open={isShowModelAdd}
          recordEdit={recordEdit}
          handleCancel={() => {
            setIsShowModelAdd(false);
            setRecordEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ContractAnnexGuarantee;
