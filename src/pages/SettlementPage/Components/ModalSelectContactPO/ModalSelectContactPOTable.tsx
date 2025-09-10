import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatCurrency } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import React, { useContext, useMemo } from "react";
import {
  LayoutCell,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ModalSelectContactPO.scss";
import { Modal, ModalContext } from "./ModalSelectContactPOHook";
import { contactDetailInListModel, VND_CURRENCY } from "models/Settlement";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { Tooltip } from "antd";
import { isEqual } from "lodash";

export const ModalSelectContactPOTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<Modal>(ModalContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<contactDetailInListModel>[] = useMemo(
    () => [
      {
        title: (
          <UnitTitle
            title={translate("CT.txt_code_contract")}
            isShowUnit={false}
          />
        ),

        key: "code",
        dataIndex: "code",
        width: 133,
        sorter: false,
        render(value) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={value}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"h-custom-20"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_name_contract")}
            unit={translate("AC.txt_contract_number")}
          />
        ),
        key: "name",
        dataIndex: "name",
        width: 198,
        sorter: false,
        render(_, record) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={record?.name}
                valueLine2={record?.contractNo}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"pl-color-sub-text"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PM.label_supplier")}
            unit={translate("settlement.type_settlement_txt")}
          />
        ),
        key: "total",
        dataIndex: "total",
        sorter: false,
        width: 156,
        render(_, record) {
          return (
            <LayoutCell position="left">
              <TwoLineText
                valueLine1={record?.supplierName}
                valueLine2={record?.contractType}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"pl-color-sub-text"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.filter_purchase_plan_cost_group"),
        key: "costGroup",
        dataIndex: "costGroup",
        width: 141,
        sorter: false,
        render(value) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={value}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"h-custom-20"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="d-flex justify-content-end">
            {translate("PL.total_value_header_table")}
          </div>
        ),
        key: "total",
        dataIndex: "total",
        sorter: false,
        width: 145,
        render(value, record) {
          return (
            <LayoutCell position={"right"}>
              <TwoLineText
                valueLine1={
                  isEqual(record?.currency, VND_CURRENCY)
                    ? formatCurrency({
                        value,
                      })
                    : formatCurrency({
                        value,
                        code: record?.currency,
                      })
                }
                classNameFirstLine={"table_text justify-content-end d-flex"}
                classNameSecondLine={"h-custom-20"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.table_purchase_plan_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        sorter: false,
        width: 96,
        render(value) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
                classNameFirstLine={"table_text"}
                classNameSecondLine={"h-custom-20"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.filter_creator"),
        key: "creator",
        dataIndex: "creator",
        sorter: false,
        width: 150,
        render(creator) {
          return (
            <LayoutCell className={"d-flex align-items-start custom-pt"}>
              <Tooltip
                title={`${creator?.email} - ${creator?.name}`}
                placement="top"
              >
                <div className="d-flex text-truncate">
                  <span className="text-truncate">{creator?.email}</span>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div className="modal-select__contact">
      <div className="m-t--2xs table-custom__baseline">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          idContainer={"modal-select-contract"}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: 390 }}
          rowSelection={rowSelection}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={576}
              >
                <></>
              </EmptyData>
            ),
          }}
        />
      </div>
      <div>
        <Pagination
          total={count}
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </div>
  );
};
