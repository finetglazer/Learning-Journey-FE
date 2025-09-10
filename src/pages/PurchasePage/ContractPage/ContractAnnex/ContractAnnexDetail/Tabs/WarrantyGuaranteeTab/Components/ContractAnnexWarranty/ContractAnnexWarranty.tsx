import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { ICON_SIZE_MEDIUM } from "core/config/icon-size";
import { formatNumber } from "core/helpers/number";
import WarrantyContractModal from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/Components/Modal/WarrantyContractModal/WarrantyContractModal";
import { Key, useMemo, useState } from "react";
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
import "./ContractAnnexWarranty.scss";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { useContractAnnexDetailContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/context";
import { isEqual } from "lodash";
import { ContractWarranty } from "models/ContractAnnex";
import { useCheckStateContractAnnex } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useCheckStateContractAnnex";
import { useContractAnnexViewContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexView/context";
import { numberConstants } from "core/config/consts";

const ICON_SIZE = 12;
const ICON_SIZE_72 = 72;
const ROW_KEY_WARRANTY = "warrantyTypeId";

const columnsWidth = {
  warrantyType: 200,
  warrantyDuration: 145,
  warrantyCalculationTime: 150,
  warrantyTerms: 100,
  description: 210,
  action: 80,
};

const ContractAnnexWarranty = () => {
  const [translate] = useTranslation();
  const typeRowSelection: RowSelectionType = "checkbox";
  const { state } = useCheckStateContractAnnex();
  const { model, handleChangeSingleField } = useContractAnnexDetailContext();
  const { model: modelView } = useContractAnnexViewContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isShowModelAdd, setIsShowModelAdd] = useState(false);
  const [recordEdit, setRecordEdit] = useState<ContractWarranty | null>(null);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: ContractWarranty) => {
      if (record.isTotal) return null;
      return (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.warrantyTypeId]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.warrantyTypeId)
                );
              }
            }}
          />
        </div>
      );
    },
  };

  const columns: ColumnProps<ContractWarranty>[] = useMemo(
    () => [
      {
        title: () => (
          <UnitTitle title={translate("CA.txt_type_warranty")} unit={" "} />
        ),
        key: "warrantyType",
        dataIndex: "warrantyType",
        width: columnsWidth.warrantyType,
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
            title={translate("CA.txt_warranty_time")}
            unit={`${translate("CA.txt_month")}`}
          />
        ),
        key: "warranty_duration",
        dataIndex: "warranty_duration",
        ellipsis: true,
        width: columnsWidth.warrantyDuration,
        align: "right",
        render: (_, record) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(record?.warrantyPeriod)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle title={translate("CA.txt_warranty_period")} unit={" "} />
        ),
        key: "warrantyCalculationTime",
        dataIndex: "warrantyCalculationTime",
        width: columnsWidth.warrantyCalculationTime,
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
          <UnitTitle title={translate("CA.txt_warranty_form")} unit={" "} />
        ),
        key: "warrantyTerm",
        width: columnsWidth.warrantyTerms,
        ellipsis: true,
        render: (record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.warrantyTerm?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <UnitTitle title={translate("CA.txt_note")} unit={" "} />,
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
                        handleDeleteRowConfirm(record?.warrantyTypeId)
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

  const handleEditRow = (record: ContractWarranty) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (warrantyTypeId: string) => {
    setIdDelete(warrantyTypeId);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const warrantiesEdit = model.contractAppendixWarranties.filter(
      (item: ContractWarranty) => item?.warrantyTypeId !== idDelete
    );
    handleChangeSingleField({
      fieldName: "contractAppendixWarranties",
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
    const warrantiesEdit = model?.contractAppendixWarranties.filter(
      (item: ContractWarranty) =>
        !selectedRowKeys.includes(item?.warrantyTypeId)
    );
    handleChangeSingleField({
      fieldName: "contractAppendixWarranties",
    })(warrantiesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const addWarranty = () => {
    return (
      <Button
        type="secondary"
        iconPlace="left"
        className="warranty_button"
        icon={
          <img src={PlusIcon} alt="img" width={ICON_SIZE} height={ICON_SIZE} />
        }
        onClick={() => setIsShowModelAdd(true)}
      >
        {translate("CA.txt_add_warranty_info")}
      </Button>
    );
  };

  const hasNoWarranties = useMemo(() => {
    const warranties = isEqual(state, "DETAIL")
      ? modelView?.contractAppendixWarranties
      : model?.contractAppendixWarranties;
    return isEqual(warranties?.length, numberConstants.ZERO);
  }, [
    state,
    modelView?.contractAppendixWarranties,
    model?.contractAppendixWarranties,
  ]);

  const isEditableState = ["EDIT", "CREATE"].includes(state);

  return (
    <>
      {hasNoWarranties ? (
        <CloudyEmpty>{isEditableState && addWarranty()}</CloudyEmpty>
      ) : (
        <div className="warranty_container">
          {isEqual(state, "DETAIL") ? null : addWarranty()}
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
              rowKey={ROW_KEY_WARRANTY}
              columns={columns}
              rowSelection={isEqual(state, "DETAIL") ? undefined : rowSelection}
              dataSource={
                model?.contractAppendixWarranties ||
                modelView?.contractAppendixWarranties
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
        title={translate("CT.confirm_delete_warranty_info")}
        content={translate("CA.txt_delete_confirm_warranty")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
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
        title={translate("CT.confirm_delete_warranty_info")}
        content={translate("CA.txt_delete_confirm_warranty")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
      {isShowModelAdd && (
        <WarrantyContractModal
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

export default ContractAnnexWarranty;
