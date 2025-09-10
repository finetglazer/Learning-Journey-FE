import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { PersonnelByUnit } from "models/PersonnelByUnit/PersonnelByUnit";
import { PersonnelByUnitFilter } from "models/PersonnelByUnit/PersonnelByUnitFilter";
import { BusinessDepartment } from "models/Profile";
import { BusinessBranch, BusinessUnit } from "models/Project/Project";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  PersonnelByUnitMasterContext,
  PersonnelByUnitModal,
} from "../PersonnelByUnitMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  BUSINESS_UNIT = "businessUnit",
  BUSINESS_BRANCH = "businessBranch",
  BUSINESS_DEPARTMENT = "businessDepartment",
  EMPLOYEE_COUNT = "employeeCount",
  CONTACT = "contractCode",
  ACTION = "action",
}

const columnsWidth = {
  overflowMenu: 40,
  contact: 280,
  employeeCount: 192,
};

const WIDTH_400 = 400;

export const PersonnelByUnitTable = () => {
  const {
    count,
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleActionPersonnelByUnit,
    validAction,
  } = useContext(PersonnelByUnitMasterContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<PersonnelByUnit>[] = useMemo(
    () => [
      {
        title: translate("PBU.txt_nhcd_cost_center"),
        key: ColumnKey.BUSINESS_UNIT,
        dataIndex: ColumnKey.BUSINESS_UNIT,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<PersonnelByUnit, PersonnelByUnitFilter>(
          modelFilter,
          ColumnKey.BUSINESS_UNIT
        ),
        render(businessUnit: BusinessUnit) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={businessUnit?.name}
                valueLine2={businessUnit?.code}
                classNameFirstLine="table_text"
                classNameSecondLine="table_sub_text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PBU.txt_cn_pgd_cost_center"),
        key: ColumnKey.BUSINESS_BRANCH,
        dataIndex: ColumnKey.BUSINESS_BRANCH,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<PersonnelByUnit, PersonnelByUnitFilter>(
          modelFilter,
          ColumnKey.BUSINESS_BRANCH
        ),
        render(businessBranch: BusinessBranch) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={businessBranch?.name}
                valueLine2={businessBranch?.code}
                classNameFirstLine="table_text"
                classNameSecondLine="table_sub_text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PBU.txt_tt_pb_cost_center"),
        key: ColumnKey.BUSINESS_DEPARTMENT,
        dataIndex: ColumnKey.BUSINESS_DEPARTMENT,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<PersonnelByUnit, PersonnelByUnitFilter>(
          modelFilter,
          ColumnKey.BUSINESS_DEPARTMENT
        ),
        render(businessDepartment: BusinessDepartment) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={businessDepartment?.name}
                valueLine2={businessDepartment?.code}
                classNameFirstLine="table_text"
                classNameSecondLine="table_sub_text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-end">
            {translate("PBU.txt_number_of_employee")}
          </div>
        ),
        key: ColumnKey.EMPLOYEE_COUNT,
        dataIndex: ColumnKey.EMPLOYEE_COUNT,
        ellipsis: true,
        width: columnsWidth.employeeCount,
        render(value: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.overflowMenu,
        render(_, { id, isUsed }: PersonnelByUnit) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () =>
                handleActionPersonnelByUnit({
                  modal: PersonnelByUnitModal.DETAIL,
                  id,
                }),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () =>
                handleActionPersonnelByUnit({
                  modal: PersonnelByUnitModal.EDIT,
                  id,
                }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () =>
                handleActionPersonnelByUnit({
                  modal: PersonnelByUnitModal.DELETE,
                  id,
                }),
              isShow: isUsed || !validAction("DELETE") ? false : true,
            },
          ];
          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelFilter, validAction]
  );

  return (
    <>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() =>
            handleActionPersonnelByUnit({
              modal: PersonnelByUnitModal.DELETE,
            })
          }
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>

      <div className="page-master__table personnel-by-unit__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingList}
          columns={columns}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </>
  );
};
