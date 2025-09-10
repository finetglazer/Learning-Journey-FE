import type { ColumnProps } from "antd/es/table";
import { emptyApplicationIcon, IcTrashRed, PlusIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { TABLE_ROW_KEY } from "core/config/consts";
import { isEmpty, isEqual } from "lodash";
import {
  AcceptancePersonRequest,
  OrganizationPerson,
  PositionPerson,
} from "models/Acceptance";
import { OptionBaseModel } from "models/Common/Common";
import { useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../../Components/Acceptance.module.scss";
import {
  AcceptanceModal,
  useAcceptanceMembersHooks,
} from "./AcceptanceMembersHooks";
import { AcceptanceSelectModal } from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceSelect/AcceptanceSelect";
import { DeleteRecordModal } from "../../DeleteRecord/DeleteRecordModal";

interface AcceptanceMembersProps {
  isEdit?: boolean;
}

enum ColumnKey {
  EMAIL = "email",
  NAME = "fullName",
  ORGANIZATION = "organization",
  POSITION = "position",
  BRANCH = "businessBranch",
  UNIT = "businessUnit",
  ACTION = "id",
}

const columnsWidth = {
  action: 40,
};

export const AcceptanceMembers = ({ isEdit }: AcceptanceMembersProps) => {
  const [translate] = useTranslation();
  const {
    modal,
    memberList,
    rowSelection,
    selectedRowKeys,
    setModal,
    setSelectedRowKeys,
    handleAddMember,
    handleDeleteMember,
    memberListSelected,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
  } = useAcceptanceMembersHooks();

  // hide selected data
  const goodItemSelectCurrent = useMemo(
    () => memberList?.map((item) => item?.id),
    [memberList]
  );

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const addAcceptanceMemberButton = () => (
    <Button
      icon={<img src={PlusIcon} alt="" />}
      iconPlace="left"
      type="secondary"
      onClick={() => setModal(AcceptanceModal.LIST)}
    >
      {translate("AC.txt_add_acceptance_member")}
    </Button>
  );

  const columns: ColumnProps<AcceptancePersonRequest>[] = useMemo(() => {
    const items: ColumnProps[] = [
      {
        title: translate("AC.txt_approver_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: "calc((100% - 80px) / 6)",
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_approver_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: "calc((100% - 80px) / 6)",
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_department"),
        key: ColumnKey.ORGANIZATION,
        dataIndex: ColumnKey.ORGANIZATION,
        width: "calc((100% - 80px) / 6)",
        render(value: OrganizationPerson) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_branch"),
        key: ColumnKey.BRANCH,
        dataIndex: ColumnKey.BRANCH,
        width: "calc((100% - 80px) / 6)",
        render(value: OptionBaseModel) {
          const textContent = `${value?.code || ""} - ${value?.name || ""}`;

          return (
            <LayoutCell>
              <OneLineText value={textContent} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_nhcd_block"),
        key: ColumnKey.UNIT,
        dataIndex: ColumnKey.UNIT,
        width: "calc((100% - 80px) / 6)",
        render(value: OptionBaseModel) {
          const textContent = `${value?.code || ""} - ${value?.name || ""}`;
          return (
            <LayoutCell>
              <OneLineText value={textContent} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_position"),
        key: ColumnKey.POSITION,
        dataIndex: ColumnKey.POSITION,
        width: "calc((100% - 80px) / 6)",
        render(value: PositionPerson) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
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
                className={styles["icon-row"]}
                onClick={() => {
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
  }, [translate, isEdit, handleDeleteMember]);

  const isEmptyList = useMemo(() => isEmpty(memberList), [memberList]);

  return (
    <>
      {isEqual(isEdit, true) ? (
        <>
          {isEmptyList ? (
            <EmptyItemTable
              icon={<img src={emptyApplicationIcon} alt="" />}
              content={translate("AC.txt_select_new_item")}
            >
              {addAcceptanceMemberButton()}
            </EmptyItemTable>
          ) : (
            <div className="pb-3">{addAcceptanceMemberButton()}</div>
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
            rowSelection={isEdit ? rowSelection : undefined}
            dataSource={memberList}
          />
        </div>
      )}

      {isEqual(AcceptanceModal.LIST, modal) ? (
        <AcceptanceSelectModal
          open
          receivedId={undefined}
          handleApply={handleAddMember}
          handleCancel={() => setModal(null)}
          goodItemSelectCurrent={memberListSelected}
          selectedItems={goodItemSelectCurrent}
        />
      ) : null}

      {isOpenModelConfirmDeleteRow && (
        <DeleteRecordModal
          open
          loading={undefined}
          handleConfirm={() => {
            if (selectedRecordId) {
              handleDeleteMember([selectedRecordId]);
            } else {
              handleDeleteMember(selectedRowKeys as string[]);
            }
          }}
          handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
          title={translate("AC.title_confirm_delete_acceptance_member")}
          content={translate("AC.content_confirm_delete_acceptance_member")}
        />
      )}
    </>
  );
};
