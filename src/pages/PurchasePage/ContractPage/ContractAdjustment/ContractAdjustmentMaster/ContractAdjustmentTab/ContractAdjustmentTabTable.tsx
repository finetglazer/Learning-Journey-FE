import { useCallback, useContext, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import EmptyData from "components/EmptyData/EmptyData";
import { tableService } from "core/services/page-services/table-service";
import {
  ActionRowType,
  ConfirmModalType,
  listContractAdjustmentStatus,
  TagFilterEnum,
} from "../../constants";
import { isEqual, isNull } from "lodash";
import Tooltip from "antd/es/tooltip";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import AddContractAdjustment from "../../Components/AddContractAdjustment/AddContractAdjustment";
import { ContractAdjustment } from "models/ContractAdjustment";
import {
  ContractAdjustmentMaster,
  ContractAdjustmentMasterContext,
} from "../context";
import EmptyIcon from "assets/icons/empty_data_settlement.svg";
import { NavLink } from "react-router-dom";
import {
  CONTRACT_ADJUSTMENT_VIEW_ROUTE,
  CONTRACT_ROUTE_VIEW,
} from "config/route-const";
import ModalActionConfirm from "./Components/ModalActionConfirm/ModalActionConfirm";
interface ListOverflowMenu {
  title: string;
  action: () => void;
  isShow: boolean;
}

const ContractAdjustmentTabTable = () => {
  const {
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    count,
    handleLoadList,
    handleOnClickRow,
    setModelSelected,
    modelSelected,
    loadingButtonConfirm,
    loadingModal,
    handleApplyButtonInConfirmModal,
  } = useContext<ContractAdjustmentMaster>(ContractAdjustmentMasterContext);
  const [translate] = useTranslation();
  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (request: ContractAdjustment) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW),
          isShow: request?.canView,
        },
        //edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(request, ActionRowType.EDIT);
          },
          isShow: request?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: request,
            }),
          isShow: request?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: request,
            }),
          isShow: request.canDelete,
        },
        // View Approve
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW_APPROVE),
          isShow: request?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleOnClickRow, translate]
  );

  const isWaitingApproveTab = isEqual(
    modelFilter?.tab,
    TagFilterEnum.IN_PROGRESS.toString()
  );

  const columns: ColumnProps<ContractAdjustment>[] = [
    {
      title: translate("contractAdjustment.list.title.adjustment_code"),
      key: "code",
      dataIndex: "code",
      width: 140,
      render(value, record) {
        return (
          <LayoutCell>
            <NavLink
              className="hyperlink text-truncate"
              to={`${CONTRACT_ADJUSTMENT_VIEW_ROUTE}/${
                record?.id
              }/?isView=${!isWaitingApproveTab}`}
            >
              <OneLineText
                className="text-table-content-primary hyperlink"
                value={value}
              />
            </NavLink>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.list.title.contract_number"),
      key: "contractNo",
      dataIndex: "contractNo",
      width: 180,
      render(value, record) {
        return (
          <LayoutCell>
            <NavLink
              className="hyperlink text-truncate"
              to={`${CONTRACT_ROUTE_VIEW}/${record?.contractId}`}
            >
              <OneLineText
                className="text-table-content-primary hyperlink"
                value={value}
              />
            </NavLink>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.list.title.contract_name"),
      key: "name",
      dataIndex: "name",
      width: 180,
      render(value) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.txt_adjustment_create"),
      key: "createUser",
      dataIndex: "createUser",
      width: 140,
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={`${value || ""} - ${record?.createUserName || ""}`}
              overlayStyle={{ maxWidth: 500 }}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.txt_adjustment_unit_create"),
      key: "organizationName",
      dataIndex: "organizationName",
      width: 140,
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.organizationName}
            >
              <OneLineText value={value} />
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.table_grounds_created_date"),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 112,
      render(effectiveDate: string) {
        const dateOnly = formatDateTimeToVietnamTimezone(
          effectiveDate,
          STANDARD_DATE_FORMAT_SLASH
        );

        return (
          <LayoutCell>
            <OneLineText value={dateOnly} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.txt_adjustment_note"),
      key: "desciption",
      dataIndex: "desciption",
      width: 300,
      render(value) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.list.title.expense_item"),
      key: "costGroup",
      dataIndex: "costGroup",
      width: 180,
      render(value) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.list.title.status"),
      key: "status",
      dataIndex: "status",
      width: 108,
      render(id: string) {
        const item = listContractAdjustmentStatus().find((type) =>
          isEqual(type?.id, id)
        );
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      },
    },
    {
      key: "id",
      fixed: "right",
      width: 40,
      align: "center",
      render(record: ContractAdjustment) {
        return <LayoutCell>{menu(record)}</LayoutCell>;
      },
    },
  ];

  return (
    <>
      <div className="page-master__table">
        {!loadingList && list?.length <= 0 && !modelFilter?.search ? (
          <EmptyData
            message={translate("CM.message_empty_data")}
            height={WIDTH_400}
            icon={EmptyIcon}
          >
            <AddContractAdjustment type="secondary" showIcon />
          </EmptyData>
        ) : (
          <>
            <StandardTable
              rowKey={TABLE_ROW_KEY}
              columns={columns}
              dataSource={loadingList ? [] : list}
              loading={loadingList}
              onChange={handleTableChange}
              scroll={{ y: "calc(100vh - 350px)" }}
              tableLayout="fixed"
              locale={{
                emptyText: (
                  <EmptyData
                    message={translate("CM.message_empty_data")}
                    height={WIDTH_400}
                    icon={EmptyIcon}
                  >
                    <AddContractAdjustment type="secondary" showIcon />
                  </EmptyData>
                ),
              }}
            />

            <div className="page-master__pagination">
              <Pagination
                total={count}
                pageIndex={modelFilter?.pageIndex}
                pageSize={modelFilter?.pageSize}
                onChange={handlePagination}
                pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
              />
            </div>
          </>
        )}

        {!isNull(modelSelected) ? (
          <ModalActionConfirm
            type={modelSelected?.type}
            model={modelSelected?.model}
            loadingButton={loadingButtonConfirm}
            isLoading={loadingModal}
            errorMessage={modelSelected?.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
          />
        ) : null}
      </div>
    </>
  );
};

export default ContractAdjustmentTabTable;
