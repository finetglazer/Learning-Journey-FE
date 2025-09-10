import { ColumnProps } from "antd/lib/table";
import { EmptyData, TicketCode } from "components";
import { RECEIVING_GOODS_CREATE_ROUTE } from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { isNil } from "lodash";
import {
  OriginalPurchaseRequest,
  ReceivedWaitingModel,
  SupplierWaiting,
} from "models/ReceivingGood";
import { LOCAL_STORAGE_ACTION_STATE } from "pages/PurchasePage/constants";
import {
  ActionRowType,
  ReceivingGoodsContext,
  ReceivingGoodsContextType,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { useCallback, useContext, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./WaitingReceivedGoods.scss";
import { authorizationService } from "core/services/common-services/authorization-service";

const TABLE_ID_CONTAINER = "waiting-received-goods-id";

enum ColumnKey {
  ID = "code",
  CODE_PURCHASE = "originalPurchaseRequest",
  NUMBER_CONTRACT = "contractNo",
  NAME_CONTRACT = "name",
  EFFECTIVE_DATE = "effectiveDate",
  SUPPLIER = "supplier",
  MANAGER = "manager",
}

const columnsWidth = {
  id: 140,
  codePurchase: 140,
  numberContract: 200,
  effectiveDate: 110,
  supplier: 200,
  manager: 180,
  overflowMenu: 110,
};

const WaitingReceivedGoodsTabTable = () => {
  const {
    modelFilter,
    list,
    dispatchFilter,
    handleLoadList,
    count,
    loadingList,
    getLinkClickRow,
  } = useContext<ReceivingGoodsContextType>(ReceivingGoodsContext);
  const [translate] = useTranslation();
  const history = useHistory();

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_GOODS_RECEIPT"
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const goToReceiveGoods = useCallback(
    (id?: string) => {
      if (isNil(id)) return;
      localStorage.setItem(LOCAL_STORAGE_ACTION_STATE, "CREATE");
      history.push(`${RECEIVING_GOODS_CREATE_ROUTE}/${id}`);
    },
    [history]
  );

  const columns: ColumnProps<ReceivedWaitingModel>[] = useMemo(
    () => [
      {
        title: translate("RG.tab_label_code_contract"),
        key: ColumnKey.ID,
        dataIndex: ColumnKey.ID,
        ellipsis: true,
        width: columnsWidth.id,
        render(code: string, row) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(row, ActionRowType.VIEW_CONTRACT_WAITING)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_purchase_request"),
        key: ColumnKey.CODE_PURCHASE,
        dataIndex: ColumnKey.CODE_PURCHASE,
        ellipsis: true,
        width: columnsWidth.codePurchase,
        render(originalPurchaseRequest: OriginalPurchaseRequest, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={originalPurchaseRequest?.code}
                href={getLinkClickRow(
                  record,
                  ActionRowType.VIEW_PURCHASE_REQUEST
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_number_contract"),
        key: ColumnKey.NUMBER_CONTRACT,
        dataIndex: ColumnKey.NUMBER_CONTRACT,
        ellipsis: true,
        width: columnsWidth.numberContract,
        render(_, contractItem: ReceivedWaitingModel) {
          return (
            <LayoutCell>
              <OneLineText value={contractItem?.contractNo} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_name_contract"),
        key: ColumnKey.NAME_CONTRACT,
        dataIndex: ColumnKey.NAME_CONTRACT,
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_effective_date"),
        key: ColumnKey.EFFECTIVE_DATE,
        dataIndex: ColumnKey.EFFECTIVE_DATE,
        ellipsis: true,
        width: columnsWidth.effectiveDate,
        render(endDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  endDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_supplier"),
        key: ColumnKey.SUPPLIER,
        dataIndex: ColumnKey.SUPPLIER,
        ellipsis: true,
        width: columnsWidth.supplier,
        render(contractNo: SupplierWaiting) {
          return (
            <LayoutCell>
              <OneLineText value={contractNo?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("RG.tab_label_manager"),
        key: ColumnKey.MANAGER,
        dataIndex: ColumnKey.MANAGER,
        ellipsis: true,
        width: columnsWidth.manager,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },

      // Menu Actions
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, row) {
          return (
            <LayoutCell>
              {validAction("CREATE") && (
                <Button
                  type="secondary"
                  onClick={() => goToReceiveGoods(row?.id)}
                >
                  {translate("CM.menu_title_receiving_goods")}
                </Button>
              )}
            </LayoutCell>
          );
        },
      },
    ],
    [getLinkClickRow, goToReceiveGoods, translate, validAction]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={list}
          isDragable={true}
          scroll={{ y: "calc(100vh - 350px)" }}
          idContainer={TABLE_ID_CONTAINER}
          loading={loadingList}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
          onChange={handleTableChange}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter?.pageIndex}
            pageSize={modelFilter?.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </>
  );
};

export default WaitingReceivedGoodsTabTable;
