import type { ColumnProps } from "antd/es/table";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  EMPTY_WIDTH_400,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import {
  AcceptancePersonRequest,
  PositionPerson,
  OrganizationPerson,
} from "models/Acceptance";
import { ProjectModalEmptySearchData } from "pages/BudgetPage/BudgetSettlementCreate/Components/ProjectModal/ProjectModalEmptySearchData";
import {
  AcceptanceSelectHooks,
  AcceptanceSelectHooksContext,
} from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceSelect/context";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

enum ColumnsKey {
  EMAIL = "email",
  FULL_NAME = "fullName",
  UNIT = "organization",
  POSITION = "position",
}

const columnsWidth = {
  position: 100,
};

const AcceptanceTableModal = () => {
  const [translate] = useTranslation();
  const {
    list,
    count,
    modelFilter,
    rowSelection,
    loadingList,
    dispatchFilter,
    handleLoadList,
  } = useContext<AcceptanceSelectHooks>(AcceptanceSelectHooksContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<AcceptancePersonRequest>[] = useMemo(
    () => [
      {
        title: translate("PL.drawer_email"),
        dataIndex: ColumnsKey.EMAIL,
        key: ColumnsKey.EMAIL,
        render(email: string) {
          return (
            <LayoutCell>
              <OneLineText value={email} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.fullname"),
        dataIndex: ColumnsKey.FULL_NAME,
        key: ColumnsKey.FULL_NAME,
        render(fullName: string) {
          return (
            <LayoutCell>
              <OneLineText value={fullName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_unit_select"),
        key: ColumnsKey.UNIT,
        dataIndex: ColumnsKey.UNIT,
        render(organization: OrganizationPerson) {
          return (
            <LayoutCell>
              <OneLineText value={organization?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_position"),
        key: ColumnsKey.POSITION,
        dataIndex: ColumnsKey.POSITION,
        width: columnsWidth.position,
        render(position: PositionPerson) {
          return (
            <LayoutCell>
              <OneLineText value={position?.name} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelFilter]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          loading={loadingList}
          rowKey={TABLE_ROW_KEY}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          scroll={{ y: EMPTY_WIDTH_400 }}
          locale={{
            emptyText: <ProjectModalEmptySearchData />,
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
    </>
  );
};

export default AcceptanceTableModal;
