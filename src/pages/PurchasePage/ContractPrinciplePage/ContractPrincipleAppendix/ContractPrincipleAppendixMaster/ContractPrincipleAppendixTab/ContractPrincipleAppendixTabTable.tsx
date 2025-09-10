import { Add } from "@carbon/icons-react";
import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { EmptyAssetIcon } from "assets/icons";
import EmptyData from "components/EmptyData/EmptyData";
import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { ConfirmModalType } from "core/helpers/enum";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, isNull } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { ContractPrincipleAppendixListModel } from "models/ContractPrincipleAppendix";
import { TAB_MASTER } from "models/Settlement/SettlementConstant";
import { listContractAnnexStatus } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useContractPrincipleAppendixActions } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/Components/hooks/useContractPrincipleAppendixActions";
import ModalContractPrincipleAppendix from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ModalContractPrincipleAppendix/ModalContractPrincipleAppendix";
import {
  ContractPrincipleAppendixMaster,
  ContractPrincipleAppendixMasterContext,
} from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/context";
import { CPAModalType } from "pages/PurchasePage/ContractPrinciplePage/constants";
import { useCallback, useContext, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CPAConfirmModal } from "../../Components/ConfirmModal/CPAConfirmModal";
import { ActionRowType, ListOverflowMenu } from "../../constants";
import styles from "./ContractPrincipleAppendixAdvancedFilter.module.scss";
import { TicketCode } from "components";

const columnsWith = {
  code: 128,
  nameHdnt: 140,
  supplierName: 140,
  manager: 140,
  dateAppendix: 112,
  expenseItem: 140,
  status: 108,
  action: 40,
};

const ContractPrincipleAppendixTabTable = () => {
  const {
    list,
    count,
    countFilter,
    modelFilter,
    loadingList,
    handleLoadList,
    dispatchFilter,
    handleOnClickRow,
    modal,
    handleModal,
    handleGoToContractPrincipleAppendixEdit,
    getLinkClickRow,
  } = useContext<ContractPrincipleAppendixMaster>(
    ContractPrincipleAppendixMasterContext
  );

  const {
    isLoadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useContractPrincipleAppendixActions();

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const isWaitingApproveTab = useMemo(
    () => isEqual(modelFilter?.tab, TAB_MASTER.IN_PROGRESS.toString()),
    [modelFilter?.tab]
  );

  const menu = useCallback(
    (request: ContractAnnex) => {
      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate("CM.txt_view"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW),
          isShow: request?.canView,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => handleGoToContractPrincipleAppendixEdit(request),
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
          isShow: request?.canDelete,
        },
        // View Approve
        {
          title: translate("CM.txt_view_approval"),
          action: () => handleOnClickRow(request, ActionRowType.VIEW, true),
          isShow: request?.canViewApprove,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [
      handleGoToContractPrincipleAppendixEdit,
      handleOnClickRow,
      setModelSelected,
      translate,
    ]
  );

  const columns: ColumnProps<ContractPrincipleAppendixListModel>[] = useMemo(
    () => [
      {
        title: translate("CPA.table.txt_code_appendix"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: columnsWith.code,
        render(code: string, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(record, isWaitingApproveTab)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_name_appendix"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_number_hdnt"),
        key: "contractNo",
        dataIndex: "contractNo",
        ellipsis: true,
        width: columnsWith.nameHdnt,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Link
                to={`${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${record?.contractId}`}
                target="_blank"
                className={styles["hyperlink"]}
              >
                <OneLineText
                  className={"text-table-content-primary"}
                  value={value}
                />
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_name_hdnt"),
        key: "contractName",
        dataIndex: "contractName",
        ellipsis: true,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_supllier"),
        key: "supplierName",
        dataIndex: "supplierName",
        ellipsis: true,
        width: columnsWith.supplierName,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                title={`${record?.taxCode} - ${record?.supplierName}`}
              >
                <span className={styles["hyperlink"]}>{value}</span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_manager"),
        key: "managerEmail",
        dataIndex: "managerEmail",
        ellipsis: true,
        width: columnsWith.manager,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={record?.managerEmail + " - " + record?.managerName}
              >
                <div className={styles["hyperlink"]}>{value}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPA.table.txt_date_appendix"),
        key: "appendixDate",
        dataIndex: "appendixDate",
        ellipsis: true,
        width: columnsWith.dateAppendix,
        render(value: string) {
          const dateOnly = formatDateTimeToVietnamTimezone(
            value,
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
        title: translate("CPA.table.txt_expense_item"),
        key: "costItem",
        dataIndex: "costItem",
        ellipsis: true,
        width: columnsWith.expenseItem,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.list.title.status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: columnsWith.status,
        render(id: string) {
          const item = listContractAnnexStatus().find((type) =>
            isEqual(type?.id, id)
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
      {
        key: "action",
        fixed: "right",
        width: columnsWith.action,
        align: "center",
        render(_, record: ContractAnnex) {
          return <LayoutCell>{menu(record)}</LayoutCell>;
        },
      },
    ],
    [handleOnClickRow, isWaitingApproveTab, menu, translate]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={list}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 365px)" }}
          locale={{
            emptyText:
              !countFilter ||
              !Number(modelFilter?.tab) ||
              !modelFilter?.search ? (
                <EmptyData
                  message={translate("CM.message_empty_data")}
                  height={WIDTH_400}
                  icon={EmptyAssetIcon}
                >
                  <Button
                    icon={<Add />}
                    iconPlace="left"
                    type="secondary"
                    size="lg"
                    onClick={() =>
                      handleModal(
                        CPAModalType.SelectionContractPrincipleAppendix
                      )
                    }
                  >
                    {translate("CM.btn_add")}
                  </Button>
                </EmptyData>
              ) : (
                <EmptyData
                  message={translate("CA.txt_no_data")}
                  height={WIDTH_400}
                />
              ),
          }}
        />

        <div className="page-master__pagination">
          <Pagination
            total={count}
            onChange={handlePagination}
            pageSize={modelFilter?.pageSize}
            pageIndex={modelFilter?.pageIndex}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>

        {isNull(modelSelected) ? null : (
          <CPAConfirmModal
            type={modelSelected.type}
            model={modelSelected.model}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            isLoading={isLoadingModal}
          />
        )}
      </div>
      {isEqual(modal, CPAModalType.SelectionContractPrincipleAppendix) ? (
        <ModalContractPrincipleAppendix onClose={() => handleModal(null)} />
      ) : null}
    </>
  );
};
export default ContractPrincipleAppendixTabTable;
