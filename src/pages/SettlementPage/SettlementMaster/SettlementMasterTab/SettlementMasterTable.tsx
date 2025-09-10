import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { listSettlementContractEnum } from "config/const";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import dayjs from "dayjs";
import { isNull } from "lodash";
import { ActionRowType } from "models/Settlement";
import { ConfirmModalType, Settlement } from "models/Settlement/Settlement";
import React, { useCallback, useContext } from "react";
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
  SettlementMaster,
  SettlementMasterContext,
} from "../SettlementMasterHook";
import EmptyDataCM from "./components/EmptyDataCM";

import ModalActionConfirm from "./components/ModalActionConfirm";
import { TicketCode } from "components";

const SettlementMasterTable = () => {
  const [translate] = useTranslation();
  const appUserMaster = useContext<SettlementMaster>(SettlementMasterContext);
  const {
    list,
    modelFilter,
    modelSelected,
    setModelSelected,
    count,
    loadingList,
    loadingModal,
    loadingButtonConfirm,
    dispatchFilter,
    handleLoadList,
    handleOnClickRow,
    handleApplyButtonInConfirmModal,
    getLinkClickRow,
  } = appUserMaster;

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (settlement: Settlement) => {
      const list = [
        // View

        {
          title: translate("CM.txt_view"),
          action: () => {
            handleOnClickRow(settlement, ActionRowType.VIEW);
          },
          isShow: settlement?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(settlement, ActionRowType.EDIT);
          },
          isShow: settlement?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: settlement,
            });
          },
          isShow: settlement?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: settlement,
            });
          },
          isShow: settlement.canDelete,
        },
        // View Approval
        {
          title: translate("CM.txt_view_approval"),
          action: () => {
            handleOnClickRow(settlement, ActionRowType.VIEW);
          },
          isShow: settlement?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [setModelSelected, translate]
  );

  const columns: ColumnProps<Settlement>[] = React.useMemo(
    () => [
      {
        title: translate("settlement.table_code_settlement"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "136px",
        fixed: "left",
        render(item, row: Settlement) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(row, ActionRowType.VIEW_FROM_MASTER)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_number_contract_settlement"),
        key: "contract",
        dataIndex: "contract",
        ellipsis: true,
        width: "180px",
        render(value, row) {
          return (
            <LayoutCell>
              <TicketCode
                content={value?.contractNo}
                href={getLinkClickRow(row, ActionRowType.VIEW_CONTRACT)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_name_contract_settlement"),
        key: "contract",
        dataIndex: "contract",
        ellipsis: true,
        width: "180px",
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_cost_items"),
        key: "costGroup",
        dataIndex: "costGroup",
        ellipsis: true,
        width: "180px",
        render(items) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={items} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_name_supplier"),
        key: "supplierName",
        dataIndex: "supplierName",
        ellipsis: true,
        width: "170px",
        render(name, row) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${row?.supplierTaxCode} - ${name}`}
              >
                <div className="d-inline-block text-in-table-cell text-truncate">
                  {name}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_creator"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: "160px",
        render(_: string, row: Settlement) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${row?.createUser} ${
                  row?.createUserFullName ? "- " + row?.createUserFullName : ""
                }`}
              >
                <div className="d-inline-block text-in-table-cell text-truncate">
                  {row?.createUser}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_creation_unit"),
        key: "organization",
        dataIndex: "organization",
        ellipsis: true,
        width: "160px",
        render(items) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={items?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_date_created"),
        key: "createdDate",
        data: "createdDate",
        ellipsis: true,
        width: "96px",
        render(items) {
          return (
            <LayoutCell>
              <OneLineText
                useTooltip
                value={dayjs(items?.createdDate).format("DD/MM/YYYY")}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_values_settlement"),
        key: "totalPrice",
        data: "totalPrice",
        ellipsis: true,
        width: "150px",
        align: "right",
        render(items) {
          const totalPrice = formatNumber(items?.totalPrice);
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={totalPrice} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("settlement.table_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "102px",
        render(id) {
          const item = listSettlementContractEnum.find(
            (type) => type.id === id
          );
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={item?.name}
                status={item?.code}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },
      // menu
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: "40px",
        align: "center",
        render(id: number, record: Settlement) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate, modelFilter, handleOnClickRow]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          className="settlement-contract-master"
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 320px)" }}
          idContainer="settlement-contract-master"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={340}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>

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

export default SettlementMasterTable;
