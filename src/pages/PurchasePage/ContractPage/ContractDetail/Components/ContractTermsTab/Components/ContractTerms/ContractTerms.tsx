import { useMemo } from "react";
import { isEmpty } from "lodash";
import { ColumnProps } from "antd/lib/table";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";

import {
  ContractTermsContext,
  ContractTermsContextProps,
  ContractTermsModalType,
  useContractTermsHook,
} from "./ContractTermsHook";
import { ContractTerm } from "models/Contract";
import DetailContractTermModal from "../DetailContractTermModal/DetailContractTermModal";

import {
  DeleteRoundIcon,
  IcEmptyGoodsServices,
  IcPencilSvg,
  IcPlusSVG,
  TrashIcon,
} from "assets/icons";
import styles from "./ContractTerms.module.scss";

enum ColumnKey {
  NAME = "name",
  DESCRIPTION = "description",
}

const columnsWidth = {
  name: 400,
  actionIcon: 40,
};

const ContractTerms = () => {
  const { isDetail, translate, modelMaster, ...contextValue } =
    useContractTermsHook();

  const contractTermsViewColumns: ColumnProps<ContractTerm>[] = useMemo(
    () => [
      {
        title: translate("CT.terms_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(name: ContractTerm["name"]) {
          return (
            <LayoutCell>
              <OneLineText value={name} useTooltip={false} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(description: ContractTerm["description"]) {
          return (
            <LayoutCell>
              <OneLineText value={description} useTooltip={false} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const contractTermsDetailColumns: ColumnProps<ContractTerm>[] = useMemo(
    () => [
      ...contractTermsViewColumns,
      {
        title: "",
        width: columnsWidth.actionIcon,
        render(_, contractTerm: ContractTerm) {
          return (
            <LayoutCell>
              <button
                className={styles["contract-terms__list-action-icon"]}
                onClick={() =>
                  contextValue.handleEditContractTerm(contractTerm)
                }
              >
                <img
                  src={IcPencilSvg}
                  alt="Pencil Icon"
                  width={24}
                  height={24}
                />
              </button>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        width: columnsWidth.actionIcon,
        render(_, contractTerm: ContractTerm) {
          return (
            <LayoutCell>
              <button
                className={styles["contract-terms__list-action-icon"]}
                onClick={() =>
                  contextValue.handleConfirmDeleteContractTerm(contractTerm)
                }
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [contextValue, contractTermsViewColumns]
  );

  return (
    <ContractTermsContext.Provider
      value={contextValue as ContractTermsContextProps}
    >
      <div className={styles["contract-terms-container"]}>
        {!isEmpty(modelMaster?.contractTerms) ? (
          <div className={styles["contract-terms__list"]}>
            {!isDetail && (
              <Button
                iconPlace="left"
                icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                type="secondary"
                size="lg"
                onClick={() =>
                  contextValue.setContractTermsModalType(
                    ContractTermsModalType.Detail
                  )
                }
              >
                {translate("CT.add_contract_terms")}
              </Button>
            )}

            <div>
              <ActionBarComponent
                selectedRowKeys={contextValue?.selectedRowKeys}
                setSelectedRowKeys={contextValue?.setSelectedRowKeys}
              >
                <Button
                  type="secondary"
                  size="sm"
                  onClick={contextValue.handleConfirmBulkDeleteContractTerms}
                >
                  {translate("CM.txt_delete")}
                </Button>
              </ActionBarComponent>
              <StandardTable
                rowKey="id"
                isDragable
                columns={
                  !isDetail
                    ? contractTermsDetailColumns
                    : contractTermsViewColumns
                }
                dataSource={modelMaster?.contractTerms}
                rowSelection={!isDetail ? contextValue.rowSelection : null}
                scroll={{ y: "calc(100vh - 430px)" }}
              />
            </div>
          </div>
        ) : (
          <div className={styles["empty-contract-terms"]}>
            <div className={styles["empty-contract-terms__wrapper"]}>
              <img
                src={IcEmptyGoodsServices}
                alt="img"
                width={140}
                height={140}
              />

              <div className={styles["empty-contract-terms__container"]}>
                <span className={styles["no-contract-terms-text"]}>
                  {translate("CM.message_empty_data")}
                </span>
                {!isDetail && (
                  <Button
                    iconPlace="left"
                    icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                    type="secondary"
                    size="lg"
                    onClick={() =>
                      contextValue.setContractTermsModalType(
                        ContractTermsModalType.Detail
                      )
                    }
                  >
                    {translate("CT.add_contract_terms")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {contextValue.contractTermsModalType ===
        ContractTermsModalType.Detail && <DetailContractTermModal />}

      <ModalConfirm
        open={
          contextValue.contractTermsModalType === ContractTermsModalType.Delete
        }
        maskClosable={false}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_term")}
        content={translate("CT.warning_delete_term")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.txt_delete")}
        handleCancel={contextValue.handleCloseDeleteModal}
        handleSave={contextValue.handleDeleteContractTerm}
      />
    </ContractTermsContext.Provider>
  );
};

export default ContractTerms;
