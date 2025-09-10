import React, { useCallback, useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";

import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { TicketCode } from "components";
import { listContractLiquidationEnum } from "config/const";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import dayjs from "dayjs";
import { isNull } from "lodash";
import {
  ConfirmModalType,
  ContractLiquidation,
} from "models/ContractLiquidation";
import { ActionRowType } from "models/ContractTermination";
import EmptyDataCM from "pages/PurchasePage/ProjectSettlement/Components/EmptyDataCM";
import { useTranslation } from "react-i18next";
import ModalActionConfirm from "../../Components/ModalActionConfirm/ModalActionConfirm";
import {
  ContractTerminationMaster,
  ContractTerminationMasterHookContext,
} from "../ContractTerminationMasterHook";

const ContractTerminationMasterTable = () => {
  const [translate] = useTranslation();
  const appUserMaster = useContext<ContractTerminationMaster>(
    ContractTerminationMasterHookContext
  );

  const {
    list,
    modelFilter,
    count,
    loadingList,
    modelSelected,
    loadingButtonConfirm,
    loadingModal,
    setModelSelected,
    handleOnClickRow,
    handleApplyButtonInConfirmModal,
    dispatchFilter,
    handleLoadList,
    getLinkClickRow,
  } = appUserMaster;

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (contractLiquidation: ContractLiquidation) => {
      const list = [
        // View

        {
          title: translate("CM.txt_view"),
          action: () => {
            handleOnClickRow(contractLiquidation, ActionRowType.VIEW);
          },
          isShow: contractLiquidation?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => {
            handleOnClickRow(contractLiquidation, ActionRowType.EDIT);
          },
          isShow: contractLiquidation?.canEdit,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.CANCEL,
              model: contractLiquidation,
            }),
          isShow: contractLiquidation?.canCancel,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({
              type: ConfirmModalType.DELETE,
              model: contractLiquidation,
            }),
          isShow: contractLiquidation.canDelete,
        },
        // View Approval
        {
          title: translate("CM.txt_view_approval"),
          action: () => {
            handleOnClickRow(contractLiquidation, ActionRowType.VIEW);
          },
          isShow: contractLiquidation?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [handleOnClickRow, setModelSelected, translate]
  );

  const columns: ColumnProps<ContractLiquidation>[] = React.useMemo(
    () => [
      {
        title: translate("CLQ.label_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "136px",
        render(value, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={value}
                href={getLinkClickRow(record, ActionRowType.VIEW)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CLQ.label_number_contract"),
        key: "contract",
        dataIndex: "contract",
        ellipsis: true,
        width: "180px",
        render(value, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={value?.contractNo}
                href={getLinkClickRow(record, ActionRowType.VIEW_CONTRACT)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CLQ.label_supplier"),
        key: "supplierName",
        dataIndex: "supplierName",
        ellipsis: true,
        width: "200px",
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
        title: translate("CLQ.label_creator"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: "150px",
        render(_: string, row) {
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
        title: translate("CLQ.label_date_create"),
        key: "createdDate",
        data: "createdDate",
        ellipsis: true,
        width: "120px",
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
        title: translate("CLQ.label_description"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.table_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: "105px",
        render(id) {
          const item = listContractLiquidationEnum.find(
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
        render(id: number, record: ContractLiquidation) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [translate, getLinkClickRow, menu]
  );

  return (
    <>
      <div className="page-master__table m-t--xs">
        <StandardTable
          className="table_temporary-import-asset"
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 330px)" }}
          idContainer="table_temporary-import-asset"
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

export default ContractTerminationMasterTable;
