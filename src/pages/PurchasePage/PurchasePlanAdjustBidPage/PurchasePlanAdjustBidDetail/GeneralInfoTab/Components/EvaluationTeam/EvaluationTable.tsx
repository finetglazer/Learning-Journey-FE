import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, emptyCloudIcon, TrashIcon } from "assets/icons";
import { listService } from "core/services/page-services/list-service";
import { isNil, size, uniq } from "lodash";
import { Account } from "models/Profile";
import {
  ColumnKey,
  EvaluationRole,
  EvaluationTeam,
  EvaluationUserRoleEnum,
  PersonInChargeModel,
  SearchingFilterModel,
} from "models/PurchasingPlan";
import { useCallback, useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { combineTextExtra } from "core/helpers/text";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { of } from "rxjs";
import { LIST_ROLE_EVALUATION } from "config/const";
import CommonFilter from "models/CommonFilter";
import { ConfigField, FieldValue } from "core/services/service-types";
import SwitchStatus from "components/Switch/Switch";
import { Model } from "react-3layer-common";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import { utilService } from "core/services/common-services/util-service";

type Props = {
  isDetail?: boolean;
  addNewEvaluator?: () => void;
  contextValue: PurchasePlanAdjustBidDetailHookContextProps;
};

interface changeItemProps {
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  fieldName: string;
  value: FieldValue | string;
  id: string | EvaluationUserRoleEnum;
  errorName?: string;
}

const EvaluationTable = ({
  isDetail = false,
  addNewEvaluator,
  contextValue,
}: Props) => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = contextValue;

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<EvaluationTeam>("checkbox", [], true);
  const typeRowSelection: RowSelectionType = "checkbox";

  const rowSelections = {
    ...rowSelection,
    selectedRowKeys,
    type: typeRowSelection,
    getCheckboxProps: (record: EvaluationTeam) => {
      return {
        disabled:
          record?.isMe ||
          (!record?.id?.includes(childText) && !record?.isDraft) ||
          record?.isApproved,
      };
    },
    renderCell: (value: boolean, record: EvaluationTeam) => {
      if (
        record?.isMe ||
        (!record?.id?.includes(childText) && !record?.isDraft) ||
        record?.isApproved
      )
        return null;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeUserTable = (id: string | number, value: Account) => {
    const indexEvaluationTeam = model?.evaluationTeamDetails?.findIndex(
      (item: EvaluationTeam) => item.id === id
    );
    const newData = model?.evaluationTeamDetails?.map((item: EvaluationTeam) =>
      item.id === id ? { ...item, user: value } : item
    );

    handleChangeSingleField({
      fieldName: "evaluationTeamDetails",
      errorName: `evaluationTeams[${indexEvaluationTeam}].userId`,
    })(newData);
  };

  const [idDelete, setIdDelete] = useState("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    setIsOpenModelConfirmDeleteRow(false);
    const newData = model?.evaluationTeamDetails?.filter(
      (item: EvaluationTeam) => item.id !== idDelete
    );
    setSelectedRowKeys(selectedRowKeys?.filter((key) => key !== idDelete));
    handleChangeSingleField({
      fieldName: "evaluationTeamDetails",
    })(newData);
  };
  const isShowAddNewEvaluatorButton =
    !!(!model?.isView && model?.isEdit) ||
    isNil(!model?.isView && model?.isEdit);

  const userIgnoreIds = useMemo(() => {
    let mappingUserIgnore = model?.evaluationTeamDetails
      ?.map((item: EvaluationTeam) => item?.user?.id)
      ?.filter(Boolean);
    let personInChargeUserIgnore =
      model?.organizationGeneral?.personInChargeInfos?.map(
        (el: PersonInChargeModel) => el?.pic?.id
      );

    if (!mappingUserIgnore) mappingUserIgnore = [];
    if (!personInChargeUserIgnore) personInChargeUserIgnore = [];

    return uniq([
      ...mappingUserIgnore,
      ...personInChargeUserIgnore,
      model?.user?.id,
    ])?.filter(Boolean);
  }, [
    model?.evaluationTeamDetails,
    model?.organizationGeneral?.personInChargeInfos,
    model?.user?.id,
  ]);

  const handleChangeItemTable = useCallback(
    ({
      handleChangeSingleField,
      fieldName,
      value,
      id,
      errorName,
    }: changeItemProps) => {
      if (!model) return;
      const dataEvaluationClone = [...model.evaluationTeamDetails];
      const itemChange = dataEvaluationClone.find((item: EvaluationRole) => {
        return id === item?.id;
      });
      itemChange[fieldName] = value;

      handleChangeSingleField({
        fieldName: "evaluationTeamDetails",
        errorName,
      })(dataEvaluationClone);
    },
    [model]
  );

  const columns: ColumnProps<EvaluationTeam>[] = useMemo(() => {
    return [
      {
        title: (
          <div className="payment-font-14">
            {translate("PL.competitive_offer.title.txt_evaluator")}
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.USER,
        dataIndex: ColumnKey.USER,
        sorter: false,
        width: 206,
        render: (_, record, index) => {
          if (!isShowAddNewEvaluatorButton) {
            return (
              <LayoutCell>
                <OneLineText
                  className="text-first__style"
                  value={record?.user?.name}
                  useTooltip
                />
              </LayoutCell>
            );
          }
          if (!isDetail && !record?.isMe) {
            return (
              <LayoutCell>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `evaluationTeams[${index}].userId`
                  )}
                  isTableCell
                >
                  <Select
                    disabled={
                      (!record?.id?.includes(childText) && !record?.isDraft) ||
                      record?.isApproved
                    }
                    allowClear={true}
                    isSmall={true}
                    placeHolder={translate(
                      "PL.competitive_offer.title.pic_user_evaluator"
                    )}
                    classFilter={SearchingFilterModel}
                    searchProperty="searchText"
                    isSearch={true}
                    getList={(TModelFilter) => {
                      return purchasingPlanRepository.listMasterUserPost({
                        pageIndex: 1,
                        pageSize: 30,
                        searchText: TModelFilter?.searchText,
                        isActive: [true],
                        isSupplier: false,
                        userIgnoreIds,
                      });
                    }}
                    onChange={(_, data) => {
                      handleChangeUserTable(record?.id, data as Account);
                    }}
                    isEnumerable={false}
                    appendToBody
                    value={record?.user}
                    render={(valueRender) => {
                      if (record?.user?.id === valueRender?.id) {
                        return combineTextExtra(valueRender?.fullName);
                      }
                      return combineTextExtra(
                        valueRender?.fullName,
                        valueRender?.email,
                        valueRender?.position?.name
                      );
                    }}
                  />
                </FormItem>
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={record?.user?.name}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.competitive_offer.title.email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.USER,
        sorter: false,
        width: 106,
        render: (item: Account) => {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={item?.email}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.competitive_offer.title.phone_number"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.USER,
        sorter: false,
        width: 150,
        render: (item: Account) => {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={item?.phoneNumber}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="payment-font-14">
            {translate("PL.txt_role")}
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.ROLE,
        dataIndex: ColumnKey.ROLE,
        sorter: false,
        width: 200,
        render: (item: Model, record, index) => {
          const currentListRole = model?.evaluationTeamDetails
            ?.map((el: EvaluationTeam) => {
              return el.isActive && el.role;
            })
            ?.filter((el: EvaluationTeam) => Boolean(el));

          // Check danh sách còn lại có thể chọn thành viên nhưng không thể chọn tổ trưởng và giám đốc
          const listRemainRole = LIST_ROLE_EVALUATION.filter(
            (item) =>
              !currentListRole
                ?.map((el: EvaluationTeam) => el.id)
                .includes(item.id) ||
              item.id === EvaluationUserRoleEnum.FinancialEvaluator ||
              item.id === EvaluationUserRoleEnum.TechnicalEvaluator
          );

          return (
            <LayoutCell>
              {isDetail ? (
                <OneLineText value={item?.name} />
              ) : (
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `evaluationTeams[${index}].role`
                  )}
                  isTableCell
                >
                  <Select
                    placeHolder={translate("PL.plh_role")}
                    isRequired
                    isSearch
                    isEnumerable={false}
                    onChange={(e, value) => {
                      handleChangeItemTable({
                        handleChangeSingleField,
                        fieldName: ColumnKey.ROLE,
                        value,
                        id: record?.id,
                        errorName: `evaluationTeams[${index}].role`,
                      });
                    }}
                    getList={() => of(listRemainRole)}
                    value={
                      item ||
                      LIST_ROLE_EVALUATION.find((el) => el?.id === item?.id)
                    }
                    classFilter={CommonFilter}
                    appendToBody
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.competitive_offer.title.position"),
        key: ColumnKey.POSITION,
        dataIndex: ColumnKey.USER,
        sorter: false,
        width: 150,
        render: (item: EvaluationTeam) => {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={item?.position?.name}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.competitive_offer.title.unit"),
        key: ColumnKey.ORGANIZATION,
        dataIndex: ColumnKey.USER,
        sorter: false,
        width: 150,
        render: (item: EvaluationTeam) => {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={item?.organization?.name}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-center">
            {translate("PL.txt_review_summary_status")}
          </div>
        ),
        key: ColumnKey.IS_ACTIVE,
        dataIndex: ColumnKey.IS_ACTIVE,
        ellipsis: true,
        sorter: false,
        width: 100,
        render: (item: boolean, record) => {
          return (
            <LayoutCell position="center">
              <SwitchStatus
                checked={item}
                onChange={(value) => {
                  handleChangeItemTable({
                    handleChangeSingleField,
                    fieldName: ColumnKey.IS_ACTIVE,
                    value,
                    id: record?.id,
                  });
                }}
                disabled={isDetail}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.competitive_offer.title.criteria_count_short"),
        key: ColumnKey.CRITERIA_COUNT,
        dataIndex: ColumnKey.CRITERIA_COUNT,
        ellipsis: true,
        sorter: false,
        width: 150,
        render: (item: number) => {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={`${item ? item : 0}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: 40,
        hidden: isDetail,
        render: (_, record) => {
          if ((isNil(record?.isMe) && !record?.isDraft) || record?.isApproved)
            return null;
          return (
            <LayoutCell>
              <button
                className="delete-row-btn"
                onClick={() => handleDeleteRowConfirm(record?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ];
  }, [
    handleChangeItemTable,
    handleChangeSingleField,
    handleChangeUserTable,
    isDetail,
    isShowAddNewEvaluatorButton,
    model,
    translate,
    userIgnoreIds,
  ]);

  const handleDeleteItem = () => {
    setOpenModalConfirmDeleteAll(false);
    const newData =
      model?.evaluationTeamDetails?.filter((item: EvaluationTeam) => {
        return item?.isMe || !selectedRowKeys.includes(item.id);
      }) || [];
    handleChangeSingleField({
      fieldName: "evaluationTeamDetails",
    })(newData);
    setSelectedRowKeys([]);
  };

  return (
    <div>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => {
            handleBulkDelete();
          }}
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      {size(model?.evaluationTeamDetails) > 0 ? (
        <StandardTable
          rowKey="id"
          isDragable
          idContainer="evaluation-table"
          columns={columns}
          dataSource={model?.evaluationTeamDetails || []}
          rowSelection={isDetail ? undefined : rowSelections}
          scroll={{ y: "calc(100vh - 326px)" }}
        />
      ) : (
        <EmptyInitializeTable
          textButton={translate("PL.competitive_offer.title.add_reviewer")}
          content={
            <div className="text-break-line">
              {translate("PL.bidding.title.add_new_data")}
            </div>
          }
          icon={<img src={emptyCloudIcon} alt="" />}
          onHandleClickAdd={addNewEvaluator}
        />
      )}
      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate(
          "PL.competitive_offer.modal.confirm_delete_evaluation_team"
        )}
        content={translate(
          "PL.competitive_offer.modal.confirm_delete_evaluation_team_warning"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate(
          "PL.competitive_offer.modal.confirm_delete_evaluation_team"
        )}
        content={translate(
          "PL.competitive_offer.modal.confirm_delete_evaluation_team_warning"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={() => {
          handleDeleteItem();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default EvaluationTable;
