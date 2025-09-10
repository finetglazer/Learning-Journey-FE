import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, emptyCloudIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { listService } from "core/services/page-services/list-service";
import { size } from "lodash";
import { Account } from "models/Profile";
import {
  EvaluationTeam,
  EvaluationUserRoleEnum,
  PurchasingPlanModel,
  SearchingFilterModel,
} from "models/PurchasingPlan";
import { Key, useContext, useState } from "react";
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
import { PurchasingPlanBiddingDetailHookContext } from "../../PurchasingPlanBiddingDetailHook";
import { of } from "rxjs";
import { LIST_ROLE_EVALUATION } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { useAppSelector } from "rtk/useRedux";

type Props = {
  addNewEvaluator?: () => void;
};

const EvaluationTable = ({ addNewEvaluator }: Props) => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useContext<PurchasingPlanModel>(
    PurchasingPlanBiddingDetailHookContext
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
  const handleChangeTableField = (
    id: string | number,
    field: string,
    value: unknown
  ) => {
    const newData = model?.evaluationTeam?.map((item: EvaluationTeam) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    handleChangeSingleField({
      fieldName: "evaluationTeam",
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
    const newData = model?.evaluationTeam?.filter(
      (item: EvaluationTeam) => item.id !== idDelete
    );
    setSelectedRowKeys(selectedRowKeys?.filter((key) => key !== idDelete));
    handleChangeSingleField({
      fieldName: "evaluationTeam",
    })(newData);
  };

  const profile = useAppSelector((state) => state.profile);
  const currentUserId = profile?.account?.id;
  const userIgnoreIds = [
    currentUserId, // Thêm ID user hiện tại
    ...(model?.evaluationTeam
      ?.map((item: EvaluationTeam) => item?.user?.id)
      ?.filter(Boolean) || []),
    ...(model?.organizationGeneral?.personInChargeInfos?.map(
      (item) => item?.picId
    ) || []),
  ].filter(Boolean);

  const handleGetListRole = () => {
    const listRoleIds = model?.evaluationTeam?.map(
      (el: EvaluationTeam) => el.role?.id
    );

    const listRemainRole = LIST_ROLE_EVALUATION.filter(
      (item) =>
        !listRoleIds?.includes(item.id) ||
        item.id === EvaluationUserRoleEnum.FinancialEvaluator ||
        item.id === EvaluationUserRoleEnum.TechnicalEvaluator
    );

    return of(listRemainRole);
  };

  const columns: ColumnProps<EvaluationTeam>[] = [
    {
      title: () => (
        <div className="">
          {translate("PL.competitive_offer.title.txt_evaluator")}
          {!model?.isDetail && <span className="text-danger">&nbsp;*</span>}
        </div>
      ),
      key: "user",
      dataIndex: "user",
      sorter: false,
      width: 200,
      render(_, value, index) {
        if (model?.isDetail) {
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
        return (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `evaluationTeam[${index}].user`
              )}
            >
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
                    userIgnoreIds: userIgnoreIds, // Sử dụng danh sách userIgnoreIds đã bao gồm user hiện tại
                  } as SearchingFilterModel);
                }}
                onChange={(_, data) => {
                  handleChangeTableField(value?.id, "user", data as Account);
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
            </FormItem>
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
      width: 150,
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
      title: () => (
        <div className="">
          {translate("PL.txt_role")}
          {!model?.isDetail && <span className="text-danger">&nbsp;*</span>}
        </div>
      ),
      key: "role",
      dataIndex: "role",
      sorter: false,
      width: 200,
      render(_, value, index) {
        if (model?.isDetail) {
          return (
            <LayoutCell>
              <OneLineText
                className="text-first__style"
                value={
                  LIST_ROLE_EVALUATION?.find((item) => item?.id === value?.role)
                    ?.name
                }
                useTooltip
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `evaluationTeam[${index}].role`
              )}
            >
              <Select
                placeHolder={translate("PL.plh_role")}
                isRequired
                searchProperty="name"
                searchType=""
                valueFilter={{
                  name: "",
                }}
                isSmall={true}
                classFilter={undefined}
                getList={() => handleGetListRole()}
                onChange={(_, data) => {
                  handleChangeTableField(value?.id, "role", data);
                }}
                isEnumerable={false}
                render={(valueRender) => {
                  const roleName = LIST_ROLE_EVALUATION?.find(
                    (item) => item?.id === valueRender?.id
                  )?.name;

                  return roleName;
                }}
                value={value?.role}
                readOnly={model.isDetail}
                allowClear={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.competitive_offer.title.position"),
      key: "position",
      dataIndex: "user",
      sorter: false,
      width: 150,
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
      width: 150,
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
      width: 150,
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
        return (
          <LayoutCell>
            <div className="red cursor-pointer btn">
              <TrashCan
                size={24}
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
      model?.evaluationTeam?.filter((item: EvaluationTeam) => {
        return !selectedRowKeys.includes(item.id);
      }) || [];

    handleChangeSingleField({
      fieldName: "evaluationTeam",
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
      {size(model?.evaluationTeam) > 0 ? (
        <StandardTable
          rowKey="id"
          isDragable
          idContainer="evaluation-table"
          columns={columns}
          dataSource={model?.evaluationTeam || []}
          rowSelection={model?.isDetail ? undefined : rowSelection}
          scroll={{ y: "calc(100vh - 326px)" }}
        />
      ) : !model?.isDetail ? (
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
