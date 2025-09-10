import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
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

import { formatDateToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import {
  AreaUnitCode,
  BusinessBranch,
  BusinessDepartment,
  BusinessUnit,
} from "models/AreaUnitCode/AreaUnitCode";
import { AreaUnitCodeFilter } from "models/AreaUnitCode/AreaUnitCodeFilter";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  AreaUnitCodeMasterContext,
  AreaUnitCodeModal,
} from "../AreaUnitCodeMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  BUSINESS_UNIT = "businessUnit",
  BUSINESS_BRANCH = "businessBranch",
  BUSINESS_DEPARTMENT = "businessDepartment",
  AREA = "value",
  CONTACT = "contractCode",
  ACTION = "action",
}

const columnsWidth = {
  overflowMenu: 40,
  contact: 280,
};

const WIDTH_400 = 400;

export const AreaUnitCodeTable = () => {
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
    handleActionAreaUnitCode,
    validAction,
  } = useContext(AreaUnitCodeMasterContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<AreaUnitCode>[] = useMemo(
    () => [
      {
        title: translate("AUC.txt_nhcd_cost_center"),
        key: ColumnKey.BUSINESS_UNIT,
        dataIndex: ColumnKey.BUSINESS_UNIT,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<AreaUnitCode, AreaUnitCodeFilter>(
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
        title: translate("AUC.txt_cn_pgd_cost_center"),
        key: ColumnKey.BUSINESS_BRANCH,
        dataIndex: ColumnKey.BUSINESS_BRANCH,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<AreaUnitCode, AreaUnitCodeFilter>(
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
        title: translate("AUC.txt_tt_pb_cost_center"),
        key: ColumnKey.BUSINESS_DEPARTMENT,
        dataIndex: ColumnKey.BUSINESS_DEPARTMENT,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<AreaUnitCode, AreaUnitCodeFilter>(
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
        title: <div className="text-end">{translate("AUC.txt_area_m2")}</div>,
        key: ColumnKey.AREA,
        dataIndex: ColumnKey.AREA,
        ellipsis: true,
        render(value: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AUC.txt_contract"),
        key: ColumnKey.CONTACT,
        dataIndex: ColumnKey.CONTACT,
        width: columnsWidth.contact,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<AreaUnitCode, AreaUnitCodeFilter>(
          modelFilter,
          ColumnKey.CONTACT
        ),
        render(contact: string, areaUnitCode: AreaUnitCode) {
          const contractValidityPeriod =
            areaUnitCode?.startTime && areaUnitCode?.expireTime
              ? `${formatDateToVietnamTimezone(
                  areaUnitCode?.startTime,
                  STANDARD_DATE_FORMAT_SLASH
                )} - ${formatDateToVietnamTimezone(
                  areaUnitCode?.expireTime,
                  STANDARD_DATE_FORMAT_SLASH
                )}`
              : null;

          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={contact}
                valueLine2={contractValidityPeriod}
                classNameFirstLine="table_text"
                classNameSecondLine="table_sub_text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.overflowMenu,
        render(_, { id, isUsed }: AreaUnitCode) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () =>
                handleActionAreaUnitCode({
                  modal: AreaUnitCodeModal.DETAIL,
                  id,
                }),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () =>
                handleActionAreaUnitCode({
                  modal: AreaUnitCodeModal.EDIT,
                  id,
                }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () =>
                handleActionAreaUnitCode({
                  modal: AreaUnitCodeModal.DELETE,
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
    [translate, modelFilter, validAction, handleActionAreaUnitCode]
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
            handleActionAreaUnitCode({
              modal: AreaUnitCodeModal.DELETE,
            })
          }
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>

      <div className="page-master__table area-unit-code__table">
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
