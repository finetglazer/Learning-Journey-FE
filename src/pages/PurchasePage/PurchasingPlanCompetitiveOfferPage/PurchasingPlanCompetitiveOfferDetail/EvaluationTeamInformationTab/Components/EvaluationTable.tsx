import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, emptyCloudIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { listService } from "core/services/page-services/list-service";
import { isNil, size } from "lodash";
import { Account } from "models/Profile";
import {
  EvaluationTeam,
  PurchasingPlanModel,
  SearchingFilterModel,
} from "models/PurchasingPlan";
import { Key, useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "../../PurchasingPlanCompetitiveOfferDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { combineTextExtra } from "core/helpers/text";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
type Props = {
  addNewEvaluator?: () => void;
};
const EvaluationTable = ({ addNewEvaluator }: Props) => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext<PurchasingPlanModel>(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const { selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<EvaluationTeam>("checkbox", [], true);
  const typeRowSelection: RowSelectionType = "checkbox";

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: EvaluationTeam) => {
      if (record?.isMe) return null;
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
    getCheckboxProps: (record: EvaluationTeam) => ({
      disabled: record?.isMe,
    }),
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeUserTable = (id: string | number, value: Account) => {
    const newData = model?.evaluationTeams?.map((item: EvaluationTeam) =>
      item.id === id ? { ...item, user: value } : item
    );
    handleChangeSingleField({
      fieldName: "evaluationTeams",
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
    const newData = model?.evaluationTeams?.filter(
      (item: EvaluationTeam) => item.id !== idDelete
    );
    setSelectedRowKeys(selectedRowKeys?.filter((key) => key !== idDelete));
    handleChangeSingleField({
      fieldName: "evaluationTeams",
    })(newData);
  };
  const isShowAddNewEvaluatorButton =
    !!(!model?.isView && model?.isEdit) ||
    isNil(!model?.isView && model?.isEdit);

  const userIgnoreIds = model?.evaluationTeams
    ?.map((item: EvaluationTeam) => item?.user?.id)
    ?.filter(Boolean);

  const columns: ColumnProps<EvaluationTeam>[] = [
    {
      title: translate("PL.competitive_offer.title.txt_evaluator"),
      key: "user",
      dataIndex: "user",
      sorter: false,
      width: 206,
      render(_, value) {
        if (!isShowAddNewEvaluatorButton) {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={value?.user?.name}
                useTooltip
              />
            </LayoutCell>
          );
        }
        if (!value?.isMe) {
          return (
            <LayoutCell>
              <Select
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
                    userIgnoreIds: userIgnoreIds,
                  } as SearchingFilterModel);
                }}
                onChange={(_, data) => {
                  handleChangeUserTable(value?.id, data as Account);
                }}
                isEnumerable={false}
                appendToBody
                value={value?.user}
                render={(valueRender) => {
                  if (value?.user?.id === valueRender?.id) {
                    return combineTextExtra(valueRender?.fullName);
                  }
                  return combineTextExtra(
                    valueRender?.fullName,
                    valueRender?.email,
                    valueRender?.position?.name
                  );
                }}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={value?.user?.name}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.email"),
      key: "email",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
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
      key: "phone_number",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
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
      title: translate("PL.competitive_offer.title.position"),
      key: "position",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
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
      key: "organization",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(item) {
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
      title: translate("PL.competitive_offer.title.criteria_count"),
      key: "criteria_count",
      dataIndex: "criteriaCount",
      ellipsis: true,
      sorter: false,
      width: 200,
      render(item) {
        return (
          <LayoutCell>
            <OneLineText
              className="text-first__style"
              value={item?.toString()}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: "",
      key: "action",
      dataIndex: "action",
      width: 40,
      render: (_, record) => {
        if (record?.isMe || !isShowAddNewEvaluatorButton) return null;
        return (
          <LayoutCell>
            <div className="red cursor-pointer btn">
              <TrashCan
                size={20}
                onClick={() => handleDeleteRowConfirm(record.id)}
              />
            </div>
          </LayoutCell>
        );
      },
    },
  ];

  const handleDeleteItem = () => {
    setOpenModalConfirmDeleteAll(false);
    const newData =
      model?.evaluationTeams?.filter((item: EvaluationTeam) => {
        return item?.isMe || !selectedRowKeys.includes(item.id);
      }) || [];
    handleChangeSingleField({
      fieldName: "evaluationTeams",
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
      {size(model?.evaluationTeams) > 0 ? (
        <StandardTable
          rowKey="id"
          isDragable
          idContainer="evaluation-table"
          columns={columns}
          dataSource={model?.evaluationTeams || []}
          rowSelection={model?.isView ? undefined : rowSelection}
          scroll={{ y: "calc(100vh - 326px)" }}
        />
      ) : model?.isEdit && !isNil(model?.isEdit) ? (
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
      ) : (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
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
        titleButtonApply={translate("PM.confirm_btn_label")}
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
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteItem();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default EvaluationTable;
