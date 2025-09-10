import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { listStatusEnum, listTypeEnum } from "config/const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";

import { TicketCode } from "components";
import { isEqual, isNull } from "lodash";
import { Budget } from "models/Budget/Budget";
import { BudgetFilter } from "models/Budget/BudgetFilter";
import React, { useCallback, useContext } from "react";
import {
  LayoutCell,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import {
  BudgetConfirmModal,
  ConfirmModalType,
} from "../BudgetConfirmModal/BudgetConfirmModal";
import { BudgetMaster, BudgetMasterContext } from "../BudgetMasterHook";
import { CustomText } from "./component/CustomText";
import EmptyDataCM from "./component/EmptyDataCM";

const ZERO = 0;
const ONE = 1;

export interface ListOverflowMenu {
  title: string;
  action: (params?: any) => void;
  isShow: boolean;
}

const BudgetMasterTabTable = () => {
  const history = useHistory();
  const appUserMaster = useContext<BudgetMaster>(BudgetMasterContext);

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleOnClickRow,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    loadingModal,
    navigateToEdit,
    getLinkClickRow,
  } = appUserMaster;
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (budget: Budget) => {
      const IN_PROGRESS_TAB_KEY = 2;
      const MINE_TAB_KEY = ONE;
      const TAB_KEY = "tabKey";
      const queryLocationParams = new URLSearchParams(history.location.search);
      const isTabMine = isEqual(
        queryLocationParams.get(TAB_KEY),
        `${MINE_TAB_KEY}`
      );
      const isDraft = isEqual(budget?.status, ZERO);
      const isTabInProgress = isEqual(
        queryLocationParams.get(TAB_KEY),
        `${IN_PROGRESS_TAB_KEY}`
      );

      const list: ListOverflowMenu[] = [
        // View
        {
          title: translate(
            isTabInProgress ? "CM.txt_view_approval" : "CM.txt_view"
          ),
          action: () => handleOnClickRow(budget),
          isShow: true,
        },
        // Edit
        {
          title: translate("CM.txt_editable"),
          action: () => navigateToEdit(budget),
          isShow: isDraft && isTabMine && budget?.canEdit,
        },
        // Delete
        {
          title: translate("CM.txt_delete"),
          action: () =>
            setModelSelected({ type: ConfirmModalType.DELETE, model: budget }),
          isShow:
            isDraft &&
            isTabMine &&
            isEqual(budget?.isReturn, false) &&
            budget?.canDelete,
        },
        // Cancel
        {
          title: translate("CM.txt_cancel"),
          action: () =>
            setModelSelected({ type: ConfirmModalType.CANCEL, model: budget }),
          isShow: isDraft && isTabMine && budget?.canCancel,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [
      history.location.search,
      translate,
      handleOnClickRow,
      navigateToEdit,
      setModelSelected,
    ]
  );

  const columns: ColumnProps<Budget>[] = React.useMemo(
    () => [
      {
        title: translate("BG.table_coupon_code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(modelFilter, "code"),
        ellipsis: true,
        render(item, row: Budget) {
          return (
            <LayoutCell>
              <TicketCode content={item} href={getLinkClickRow(row)} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("BG.table_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(
          modelFilter,
          "createdDate"
        ),
        ellipsis: true,
        width: "100px",
        render(createdDate: string) {
          const dateOnly = formatDate(createdDate, STANDARD_DATE_FORMAT_SLASH);

          return (
            <LayoutCell>
              <CustomText value={dateOnly} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_request_type"),
        key: "type",
        dataIndex: "type",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(modelFilter, "type"),
        ellipsis: true,
        width: "200px",
        render(id: number) {
          const item = listTypeEnum.find((type) => type.id === id);
          return (
            <LayoutCell>
              <CustomText value={item.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("BG.table_proponent"),
        key: "requester",
        dataIndex: "requester",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(
          modelFilter,
          "requester"
        ),
        ellipsis: true,
        render(requester) {
          return (
            <LayoutCell>
              <CustomText value={requester} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("BG.table_remember_block"),
        key: "businessDepartment",
        dataIndex: "businessDepartment",
        sorter: false,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(
          modelFilter,
          "businessDepartment"
        ),
        width: "19%",
        ellipsis: true,
        render(item) {
          if (!item) return null;
          return (
            <LayoutCell>
              <CustomText
                value={`${item?.businessUnitCode} - ${item?.businessUnitName}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("BG.table_interpertation"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(modelFilter, "name"),
        ellipsis: true,
        width: "23%",
        render(item) {
          return (
            <LayoutCell>
              <CustomText value={item} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("BG.table_status"),
        key: "status",
        dataIndex: "status",
        sorter: true,
        sortOrder: getAntOrderType<Budget, BudgetFilter>(modelFilter, "status"),
        width: "105px",
        ellipsis: true,
        render(id: number) {
          const item = listStatusEnum.find((type) => type.id === id);

          return (
            <LayoutCell>
              <Tag
                size="md"
                value={item?.name}
                status={item.code}
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
        width: 40,
        align: "center",
        render(id: number, record: Budget) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleOnClickRow, menu, modelFilter, translate]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={list}
          isDragable={true}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 314px)" }}
          idContainer="table-id"
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={376}
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
      </div>

      {!isNull(modelSelected) ? (
        <BudgetConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={loadingModal}
        />
      ) : null}
    </>
  );
};

export default BudgetMasterTabTable;
