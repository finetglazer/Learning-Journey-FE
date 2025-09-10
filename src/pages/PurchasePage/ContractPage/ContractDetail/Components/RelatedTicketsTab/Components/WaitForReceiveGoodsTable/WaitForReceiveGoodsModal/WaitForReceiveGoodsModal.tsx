import { useMemo } from "react";
import {
  DEBOUNCE_TIME_300,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { Model } from "react-3layer-common";
import { ColumnProps } from "antd/lib/table";
import { useDebounceFn } from "ahooks";

import { numberConstants, TABLE_ROW_KEY, WIDTH_1000 } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";
import { formatNumber } from "core/helpers/number";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import CommonFilter from "models/CommonFilter";
import {
  WaitForReceiveGoodsByUser,
  WaitForReceiveGoodsModalFilter,
} from "models/Contract";
import { useWaitForReceiveGoodsTableHook } from "../WaitForReceiveGoodsTableHook";

import { IcSearchSVG } from "assets/icons";
import styles from "./WaitForReceiveGoodsModal.module.scss";

const ICON_SIZE = 12;

enum ColumnKey {
  NAME = "name",
  BRANCH = "branch",
  UNIT = "unit",
  EXPECTED_QUANTITY = "expectedQuantity",
  ACTUAL_QUANTITY = "actualQuantity",
  REMAINING_QUANTITY = "remainingQuantity",
  DESCRIPTION = "description",
}

const columnsWidth = {
  name: 180,
  branch: 180,
  unit: 110,
  expectedQuantity: 110,
  actualQuantity: 110,
  remainingQuantity: 110,
};

const WaitForReceiveGoodsModal = () => {
  const {
    translate,
    waitForReceiveGoodsListByUser,
    modelFilter,
    loadingWaitForReceiveGoodsListByUser,
    selectedUserEmailWaitForReceiveGoods,
    contractId,
    dispatchFilter,
    handleLoadWaitForReceiveGoodsListByUser,
    handleCloseWaitForReceiveGoodsModal,
  } = useWaitForReceiveGoodsTableHook();

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = trimText(search);
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadWaitForReceiveGoodsListByUser({
        search: trimmedText,
        pageIndex: numberConstants.ONE,
        receipter: selectedUserEmailWaitForReceiveGoods,
      });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleSelectPurchaseCategory = (
    value: WaitForReceiveGoodsModalFilter["purchaseCategory"]
  ) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        purchaseCategory: value,
      },
    });

    handleLoadWaitForReceiveGoodsListByUser({
      purchaseCategory: value,
      receipter: selectedUserEmailWaitForReceiveGoods,
    });
  };

  const waitForReceiveGoodsColumns: ColumnProps<WaitForReceiveGoodsByUser>[] =
    useMemo(
      () => [
        {
          title: translate("PR.goods_services"),
          key: ColumnKey.NAME,
          dataIndex: ColumnKey.NAME,
          width: columnsWidth.name,
          render(_, rowData: WaitForReceiveGoodsByUser) {
            return (
              <LayoutCell>
                <div className={styles["wait-for-receive-goods-cell"]}>
                  <OneLineText value={rowData?.name} />
                  <OneLineText
                    className={styles["wait-for-receive-goods-code"]}
                    value={rowData?.code}
                  />
                </div>
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CT.manufacture_categories"),
          key: ColumnKey.BRANCH,
          dataIndex: ColumnKey.BRANCH,
          ellipsis: true,
          width: columnsWidth.branch,
          render(_, rowData: WaitForReceiveGoodsByUser) {
            return (
              <LayoutCell>
                <OneLineText value={rowData?.branch?.name} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PP.text_unit"),
          key: ColumnKey.UNIT,
          dataIndex: ColumnKey.UNIT,
          ellipsis: true,
          width: columnsWidth.unit,
          render(_, rowData: WaitForReceiveGoodsByUser) {
            return (
              <LayoutCell>
                <OneLineText value={rowData?.unit?.name} />
              </LayoutCell>
            );
          },
        },

        {
          title: translate("CT.need_receive_quantity"),
          key: ColumnKey.EXPECTED_QUANTITY,
          dataIndex: ColumnKey.EXPECTED_QUANTITY,
          ellipsis: true,
          width: columnsWidth.expectedQuantity,
          render(expectedQuantity) {
            return (
              <LayoutCell>
                <OneLineText value={formatNumber(expectedQuantity)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CT.receive_quantity"),
          key: ColumnKey.ACTUAL_QUANTITY,
          dataIndex: ColumnKey.ACTUAL_QUANTITY,
          ellipsis: true,
          width: columnsWidth.actualQuantity,
          render(actualQuantity) {
            return (
              <LayoutCell>
                <OneLineText value={formatNumber(actualQuantity)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CT.remaining_quantity"),
          key: ColumnKey.REMAINING_QUANTITY,
          dataIndex: ColumnKey.REMAINING_QUANTITY,
          ellipsis: true,
          width: columnsWidth.remainingQuantity,
          render(remainingQuantity) {
            return (
              <LayoutCell>
                <OneLineText value={formatNumber(remainingQuantity)} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("CM.txt_description"),
          key: ColumnKey.DESCRIPTION,
          dataIndex: ColumnKey.DESCRIPTION,
          ellipsis: true,
          render(_, rowData: WaitForReceiveGoodsByUser) {
            return (
              <LayoutCell>
                <OneLineText value={rowData?.description} />
              </LayoutCell>
            );
          },
        },
      ],
      [translate]
    );

  return (
    <Modal
      open={!!selectedUserEmailWaitForReceiveGoods}
      maskClosable={false}
      isShowIconBack={false}
      isShowButtonCancel={false}
      size={WIDTH_1000}
      title={translate("CT.wait_for_receive_goods_by_user", {
        value: selectedUserEmailWaitForReceiveGoods,
      })}
      titleButtonApply={translate("CM.btn_close")}
      className={styles["wait-for-receive-goods-modal"]}
      handleSave={handleCloseWaitForReceiveGoodsModal}
      handleCancel={handleCloseWaitForReceiveGoodsModal}
    >
      <div className={styles["wait-for-receive-goods-wrapper"]}>
        <div className={styles["filter-fields-group"]}>
          <InputText
            prefix={
              <img src={IcSearchSVG} alt="Search Icon" width={ICON_SIZE} />
            }
            placeHolder={translate("CT.search_code_name_goods_services")}
            type={numberConstants.ONE}
            className={styles["search-field"]}
            value={modelFilter.search}
            onChange={run}
          />
          <Select
            placeHolder={translate("PP.modal_plh_category")}
            getList={(filter) =>
              contractRepository.getWaitReceivePurchaseCategoryList(
                filter,
                contractId
              )
            }
            classFilter={CommonFilter}
            isSearch
            render={(item) => (item ? `${item?.name}` : "")}
            searchProperty="name"
            appendToBody
            isEnumerable={false}
            className={styles["select-field"]}
            value={modelFilter?.purchaseCategory}
            onChange={(_id: number, value: Model) =>
              handleSelectPurchaseCategory(
                value as WaitForReceiveGoodsModalFilter["purchaseCategory"]
              )
            }
          />
        </div>
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingWaitForReceiveGoodsListByUser}
          columns={waitForReceiveGoodsColumns}
          dataSource={waitForReceiveGoodsListByUser}
          className={styles["wait-for-receive-goods-modal-table"]}
          scroll={{ y: "calc(100vh - 670px)" }}
          locale={{
            emptyText: (
              <div className={styles["empty-wait-for-receive-goods"]}>
                {translate("CM.txt_search_no_data")}
              </div>
            ),
          }}
        />
      </div>
    </Modal>
  );
};

export default WaitForReceiveGoodsModal;
