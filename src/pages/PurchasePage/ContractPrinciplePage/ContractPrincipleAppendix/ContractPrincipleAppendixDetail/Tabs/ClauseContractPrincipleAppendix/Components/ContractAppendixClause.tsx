import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { ICON_SIZE_MEDIUM } from "core/config/icon-size";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { useContractPrincipleAppendixDetailContext } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/context";
import ClauseContractAppendixModal from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/Tabs/ClauseContractPrincipleAppendix/Components/Modal/ClauseContractAppendixModal";
import { useContractPrincipleAppendixViewContext } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixView/context";
import { useMemo } from "react";
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
import styles from "./ContractAppendixClause.module.scss";
import { useContractAppendixClause } from "./useContractAppendixClause";

const ICON_SIZE = 12;
const ICON_SIZE_72 = 72;
const ROW_KEY_GUARANTEE = "id";

const ContractAppendixClause = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } =
    useContractPrincipleAppendixDetailContext();
  const { model: modelView } = useContractPrincipleAppendixViewContext();

  const {
    canAddAppendixTerms,
    isTableEmpty,
    isDetailMode,
    contractTerms,
    isShowModelAdd,
    recordEdit,
    isOpenModelConfirmDeleteRow,
    openModalConfirmDeleteAll,
    selectedRowKeys,
    handleEditRow,
    handleDeleteRowConfirm,
    handleDeleteRow,
    handleBulkDelete,
    handleBulkDeleteRow,
    handleCancelModal,
    setIsShowModelAdd,
    setIsOpenModelConfirmDeleteRow,
    setOpenModalConfirmDeleteAll,
    setSelectedRowKeys,
    handleCheckboxChange,
    handleRowSelectionChange,
  } = useContractAppendixClause({ model, handleChangeSingleField, modelView });

  const rowSelection = useMemo(
    () => ({
      onChange: handleRowSelectionChange,
      selectedRowKeys,
      type: "checkbox" as RowSelectionType,
      renderCell: (value: boolean, record: ContractTermsModel) => (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => handleCheckboxChange(e, record.id)}
          />
        </div>
      ),
    }),
    [handleCheckboxChange, handleRowSelectionChange, selectedRowKeys]
  );
  const columns: ColumnProps<ContractTermsModel>[] = useMemo(
    () => [
      {
        title: translate("CPA.txt_name_term"),
        key: "name",
        dataIndex: "name",
        width: 300,
        ellipsis: true,
        render: (_, record) => (
          <LayoutCell>
            <OneLineText value={record.name} />
          </LayoutCell>
        ),
      },
      {
        title: translate("CPA.txt_description_term"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render: (_, record) => (
          <LayoutCell>
            <OneLineText value={record?.description} />
          </LayoutCell>
        ),
      },
      {
        title: "",
        key: "action",
        fixed: "right" as const,
        width: 80,
        render: (_, record) =>
          !isDetailMode && (
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
                  onClick={() => handleDeleteRowConfirm(record?.id)}
                />
              </div>
            </LayoutCell>
          ),
      },
    ],
    [handleDeleteRowConfirm, handleEditRow, isDetailMode, translate]
  );

  const renderAddButton = () => (
    <Button
      type="secondary"
      iconPlace="left"
      className={styles["terms_button"]}
      icon={
        <img src={PlusIcon} alt="img" width={ICON_SIZE} height={ICON_SIZE} />
      }
      onClick={() => setIsShowModelAdd(true)}
    >
      {translate("CPA.txt_add_term")}
    </Button>
  );

  return (
    <>
      {isTableEmpty ? (
        <CloudyEmpty>{canAddAppendixTerms && renderAddButton()}</CloudyEmpty>
      ) : (
        <div className={styles["contract-terms_container"]}>
          {!isDetailMode && renderAddButton()}
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
              rowSelection={!isDetailMode ? rowSelection : undefined}
              dataSource={contractTerms}
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
        title={translate("CPA.txt_title_delete_terms")}
        content={translate("CPA.txt_contetn_delete_terms")}
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
        title={translate("CPA.txt_title_delete_terms")}
        content={translate("CPA.txt_contetn_delete_terms")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={handleBulkDeleteRow}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />

      {isShowModelAdd && (
        <ClauseContractAppendixModal
          open={isShowModelAdd}
          recordEdit={recordEdit}
          handleCancel={handleCancelModal}
        />
      )}
    </>
  );
};

export default ContractAppendixClause;
