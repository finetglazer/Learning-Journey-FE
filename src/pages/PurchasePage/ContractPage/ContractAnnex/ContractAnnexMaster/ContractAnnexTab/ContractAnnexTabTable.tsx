import { Add } from "@carbon/icons-react";
import Tooltip from "antd/es/tooltip";
import { ColumnProps } from "antd/lib/table";
import { EmptyAssetIcon } from "assets/icons";
import EmptyData from "components/EmptyData/EmptyData";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
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
import { TAB_MASTER } from "models/Settlement/SettlementConstant";
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
import { useContractAnnexActions } from "../../Components/hooks/useContractAnnexActions";
import { ContractAnnexConfirmModal } from "../../Components/Modal/ContractAnnexConfirmModal/ContractAnnexConfirmModal";
import ModalSelectionContractAnnex from "../../Components/Modal/ModalSelectionContractAnnex/ModalSelectionContractAnnex";
import {
  ActionRowType,
  ContractAnnexModal,
  listContractAnnexStatus,
} from "../../constants";
import { ContractAnnexMaster, ContractAnnexMasterContext } from "../context";
import styles from "./ContractAnnexAdvancedFilter.module.scss";
import { TicketCode } from "components";
import { authorizationService } from "core/services/common-services/authorization-service";

interface ListOverflowMenu {
  title: string;
  action: () => void;
  isShow: boolean;
}

const columnsWidth = {
  code: 180,
  name: 300,
  contractNo: 180,
  typeContract: 200,
  supplier: 140,
  manager: 140,
  effectiveDate: 112,
  expenseItem: 140,
  status: 108,
  action: 40,
};

const ContractAnnexTabTable = () => {
  const {
    list,
    count,
    countFilter,
    modelFilter,
    loadingList,
    handleLoadList,
    dispatchFilter,
    handleOnClickRow,
    handleGoToContractAnnexEdit,
    modal,
    handleModal,
    getLinkClickRow,
  } = useContext<ContractAnnexMaster>(ContractAnnexMasterContext);

  const { validAction: validActionContract } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Contract");

  const { validAction: validActionOrder } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Order");

  const { validAction: validActionOrderHDNT } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "OrderHDNT");

  const {
    modelSelected,
    isLoadingModal,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useContractAnnexActions();

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
          action: () => handleGoToContractAnnexEdit(request),
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
    [handleGoToContractAnnexEdit, handleOnClickRow, setModelSelected, translate]
  );

  const columns: ColumnProps<ContractAnnex>[] = useMemo(
    () => [
      {
        title: translate("CA.list.title.annex_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: columnsWidth.code,
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
        title: translate("CA.txt_annex_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: columnsWidth.name,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.list.title.contract_number"),
        key: "contractNo",
        dataIndex: "contractNo",
        ellipsis: true,
        width: columnsWidth.contractNo,
        render(value, record) {
          return (
            <LayoutCell>
              <Link
                to={`${CONTRACT_ROUTE_VIEW}/${record?.contractId}`}
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
        title: translate("CA.list.title.contract_name"),
        key: "contractName",
        dataIndex: "contractName",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.list.title.txt_contract_type"),
        key: "contractType",
        dataIndex: "contractType",
        ellipsis: true,
        width: columnsWidth.typeContract,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.list.title.supplier"),
        key: "supplierName",
        dataIndex: "supplierName",
        ellipsis: true,
        width: columnsWidth.supplier,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.list.title.manager"),
        key: "managerEmail",
        dataIndex: "managerEmail",
        ellipsis: true,
        width: columnsWidth.manager,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Tooltip
                trigger={["hover"]}
                placement="top"
                title={record?.managerEmail + " - " + record?.managerName}
              >
                <div className={styles["text-three-dots"]}>{value}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CA.txt_effective_date"),
        key: "effectiveDate",
        dataIndex: "effectiveDate",
        ellipsis: true,
        width: columnsWidth.effectiveDate,
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
        title: translate("CA.list.title.expense_item"),
        key: "costItem",
        dataIndex: "costItem",
        ellipsis: true,
        width: columnsWidth.expenseItem,
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
        width: columnsWidth.status,
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
        dataIndex: "id",
        fixed: "right",
        width: columnsWidth.action,
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
          scroll={{ x: 1769, y: "calc(100vh - 350px)" }}
          locale={{
            emptyText:
              !countFilter &&
              !Number(modelFilter?.tab) &&
              !modelFilter?.search ? (
                <EmptyData
                  message={translate("CM.message_empty_data")}
                  height={WIDTH_400}
                  icon={EmptyAssetIcon}
                >
                  {(validActionContract("CREATE") ||
                    validActionOrder("CREATE") ||
                    validActionOrderHDNT("CREATE")) && (
                    <Button
                      icon={<Add />}
                      iconPlace="left"
                      type="secondary"
                      size="lg"
                      onClick={() =>
                        handleModal(
                          ContractAnnexModal.SelectionSettlementContractAnnex
                        )
                      }
                    >
                      {translate("CM.btn_add")}
                    </Button>
                  )}
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
            pageSize={modelFilter.pageSize}
            pageIndex={modelFilter.pageIndex}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>

        {isNull(modelSelected) ? null : (
          <ContractAnnexConfirmModal
            type={modelSelected.type}
            model={modelSelected.model}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            isLoading={isLoadingModal}
          />
        )}
      </div>

      {isEqual(modal, ContractAnnexModal.SelectionSettlementContractAnnex) && (
        <ModalSelectionContractAnnex onClose={() => handleModal(null)} />
      )}
    </>
  );
};

export default ContractAnnexTabTable;
