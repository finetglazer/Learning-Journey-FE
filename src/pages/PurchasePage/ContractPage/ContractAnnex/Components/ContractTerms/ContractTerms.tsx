import { Dispatch, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import type { ColumnProps } from "antd/es/table";
import { IcPencilSvg, IcPlusSVG, IcTrashRed } from "assets/icons";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { GeneralAction } from "core/services/service-types";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { AddContractTermsModal } from "../Modal/AddContractTermsModal/AddContractTermsModal";
import styles from "./ContractTerms.module.scss";
import useContractTermsHooks, { TypeAction } from "./ContractTermsHooks";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { isEqual } from "lodash";

enum ColumnKey {
  NAME = "name",
  DESCRIPTION = "description",
  ACTION = "action",
}

interface ContractTermsProps<T> {
  isEditMode?: boolean;
  model: T & { contractTerms?: ContractTermsModel[] };
  dispatch?: Dispatch<GeneralAction<T>>;
}

function ContractTerms<T>({
  isEditMode,
  model,
  dispatch,
}: ContractTermsProps<T>) {
  const [translate] = useTranslation();
  const {
    contractTerms,
    typeAction,
    detailModel,
    selectedRowKeys,
    rowSelection,
    handleClose,
    handleAction,
    setSelectedRowKeys,
    handleChangeSingleField,
    handleAddContractTerms,
    handleDeleteContractTerms,
  } = useContractTermsHooks<T>({ model, onDispatch: dispatch });

  const columns = useMemo(() => {
    const items: ColumnProps<ContractTermsModel>[] = [
      {
        title: translate("CT.terms_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: 300,
        render(name: string) {
          return <LayoutCell>{name}</LayoutCell>;
        },
      },
      {
        title: translate("CM.txt_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        render(description: string) {
          return (
            <LayoutCell className="text-break-line break-all">
              {description}
            </LayoutCell>
          );
        },
      },
    ];

    if (isEditMode) {
      items.push({
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: 88,
        render(_, record: ContractTermsModel) {
          const handleClick = (action: TypeAction) => {
            handleAction(action, record?.id);
          };

          return (
            <LayoutCell>
              <div className="action-row">
                <button onClick={() => handleClick(TypeAction.EDIT)}>
                  <img src={IcPencilSvg} alt="" />
                </button>
                <button onClick={() => handleClick(TypeAction.DELETE)}>
                  <img src={IcTrashRed} alt="" />
                </button>
              </div>
            </LayoutCell>
          );
        },
      });
    }
    return items;
  }, [translate, isEditMode, handleAction]);

  const addContractTerm = () => {
    if (!isEditMode) return;

    return (
      <Button
        icon={<img src={IcPlusSVG} alt="" />}
        iconPlace="left"
        className="w-fit"
        type="secondary"
        onClick={() => handleAction(TypeAction.CREATE, null)}
      >
        {translate("CT.add_contract_terms")}
      </Button>
    );
  };

  return (
    <>
      <div className={styles["content-collapse"]}>
        <AdvancedCollapseView
          items={[
            {
              key: 0,
              label: translate("CA.tab_terms"),
              children: (
                <div className="d-flex flex-column gap-2">
                  <TableWithEmpty
                    emptyExtra={<CloudyEmpty>{addContractTerm()}</CloudyEmpty>}
                    list={contractTerms}
                    className={styles["custom-table"]}
                    rowSelection={isEditMode ? rowSelection : undefined}
                    columns={columns}
                    scroll={{ y: "calc(100vh - 416px)" }}
                    actionBarComponent={
                      <>
                        {addContractTerm()}
                        <ActionBarComponent
                          selectedRowKeys={selectedRowKeys}
                          setSelectedRowKeys={setSelectedRowKeys}
                        >
                          <Button
                            type="secondary"
                            size="sm"
                            onClick={() =>
                              handleAction(TypeAction.DELETE, null)
                            }
                          >
                            {translate("CM.txt_delete")}
                          </Button>
                        </ActionBarComponent>
                      </>
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
      {[TypeAction.CREATE, TypeAction.EDIT].includes(typeAction) && (
        <AddContractTermsModal
          model={detailModel}
          onClose={handleClose}
          handleChangeSingleField={handleChangeSingleField}
          onAddContractTerms={handleAddContractTerms}
        />
      )}
      {isEqual(typeAction, TypeAction.DELETE) && (
        <DeleteRecordModal
          handleCancel={handleClose}
          handleConfirm={handleDeleteContractTerms}
          title={translate("CT.confirm_delete_term")}
          content={translate("CT.warning_delete_term")}
          loading={false}
          open
        />
      )}
    </>
  );
}

export default ContractTerms;
