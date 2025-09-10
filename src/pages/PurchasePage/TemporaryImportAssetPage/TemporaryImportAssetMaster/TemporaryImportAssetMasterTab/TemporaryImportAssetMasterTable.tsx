import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { listTemporaryImportAssetStatusEnum } from "config/const";
import { TEMPORARY_IMPORT_ASSET_VIEW_ROUTE } from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { isNull } from "lodash";
import {
  ConfirmModalType,
  TemporaryImportAsset,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { ActionRowType } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
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
import { useHistory, useLocation } from "react-router";
import {
  TemporaryImportAssetMaster,
  TemporaryImportAssetMasterContext,
} from "../TemporaryImportAssetMasterHook";
import EmptyDataCM from "./components/EmptyDataCM";
import ModalActionConfirm from "./components/ModalActionConfirm";
import { TicketCode } from "components";

const TemporaryImportAssetMasterTable = () => {
  const [translate] = useTranslation();
  const appUserMaster = useContext<TemporaryImportAssetMaster>(
    TemporaryImportAssetMasterContext
  );
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const tabCurrent = queryParams.get("tab");
  const history = useHistory();
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
    (temporaryImportAsset: TemporaryImportAsset) => {
      const list = [
        // View

        {
          title: translate("CM.txt_view"),
          action: () => {
            handleOnClickRow(temporaryImportAsset, ActionRowType.VIEW);
          },
          isShow: temporaryImportAsset?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(temporaryImportAsset, ActionRowType.EDIT);
          },
          isShow: temporaryImportAsset?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: temporaryImportAsset,
            });
          },
          isShow: temporaryImportAsset?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () => {
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: temporaryImportAsset,
            });
          },
          isShow: temporaryImportAsset.canDelete,
        },
        // View Approval
        {
          title: translate("CM.txt_view_approval"),
          action: () => {
            history.push(
              TEMPORARY_IMPORT_ASSET_VIEW_ROUTE +
                "/" +
                temporaryImportAsset.id +
                "?isViewWaitingApprove=true"
            );
          },
          isShow: temporaryImportAsset?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [handleOnClickRow, history, setModelSelected, translate]
  );

  const columns: ColumnProps<TemporaryImportAsset>[] = React.useMemo(
    () => [
      {
        title: translate("TIA.table_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "130px",
        render(item, record: TemporaryImportAsset) {
          return (
            <LayoutCell>
              <TicketCode
                content={item}
                href={getLinkClickRow(
                  record,
                  ActionRowType.VIEW_FROM_MASTER,
                  tabCurrent
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_contract_code"),
        key: "contract",
        dataIndex: "contract",
        ellipsis: true,
        width: "120px",
        render(value, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={value?.code}
                href={getLinkClickRow(record, ActionRowType.VIEW_CONTRACT)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_provider"),
        key: "contract",
        dataIndex: "contract",
        ellipsis: true,
        width: "180px",
        render(item: TemporaryImportAsset) {
          return (
            <LayoutCell>
              <OneLineText value={item?.supplierName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_created_user"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: "150px",
        render(_: string, row: TemporaryImportAsset) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${row?.createUser} ${
                  row?.createUserName ? "- " + row?.createUserName : ""
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
        title: translate("TIA.table_created_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: "100px",
        render(createdDate) {
          const dateOnly = formatDate(createdDate, STANDARD_DATE_FORMAT_SLASH);

          return (
            <LayoutCell>
              <OneLineText useTooltip value={dateOnly} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_description"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render(description) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={description} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_temporary_values"),
        key: "totalAmount",
        dataIndex: "totalAmount",
        ellipsis: true,
        width: "180px",
        align: "right",
        render(items) {
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(items)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_cost_item"),
        key: "costGroup",
        data: "costGroup",
        ellipsis: true,
        width: "145px",
        render(items) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={items?.costGroup} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "100px",
        render(id) {
          const item = listTemporaryImportAssetStatusEnum.find(
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
        render(id: number, record: TemporaryImportAsset) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate, modelFilter, handleOnClickRow, tabCurrent]
  );
  return (
    <>
      <div className="page-master__table">
        <StandardTable
          className="table_temporary-import-asset"
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 315px)" }}
          idContainer="table_temporary-import-asset"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={330}
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

export default TemporaryImportAssetMasterTable;
