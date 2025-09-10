import type { ColumnProps } from "antd/es/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  VND_CURRENCY_UNIT,
  WIDTH_1100,
  WIDTH_400,
} from "core/config/consts";
import {
  dividedWithFixed,
  multiplyWithFixed,
  sumWithFixed,
  toFixedByCurrency,
} from "core/helpers/calculator";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isNil, size, uniqueId } from "lodash";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex/ContractAnnex";
import { useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import SelectAdjustableGoodsServicesFilter from "./Components/SelectAdjustableGoodsServicesFilter";
import { useSelectAdjustableGoodsServicesHooks } from "./useSelectAdjustableGoodsServicesHooks";

interface SelectAdjustableGoodsServicesProps {
  isContract: boolean;
  contractId: string | undefined;
  proposalId: string | undefined;
  selectedFilter?: {
    goodsId: string;
    unitId: string;
    isContract: boolean;
  }[];
  onClose: () => void;
  onSelected: (list: SelectAdjustableGoodsServicesModel[]) => void;
}

export default function SelectAdjustableGoodsServicesModal({
  isContract,
  contractId,
  proposalId,
  selectedFilter,
  onClose,
  onSelected,
}: SelectAdjustableGoodsServicesProps) {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRow,
    translate,
    handleLoadList,
    dispatchFilter,
    handleTableChange,
    handlePagination,
  } = useSelectAdjustableGoodsServicesHooks({
    isContract,
    contractId,
    proposalId,
    selectedFilter,
  });

  const columns = useMemo(() => {
    const columnBase: ColumnProps<SelectAdjustableGoodsServicesModel>[] = [
      {
        title: translate("RG.txt_goods_services_filter"),
        key: "id",
        render(record: SelectAdjustableGoodsServicesModel) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={record?.name}
                valueLine2={record?.code}
                classNameSecondLine="text-neutral-7"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_unit_of_measure"),
        key: "unit",
        dataIndex: "unit",
        width: 150,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_unit_price"),
        key: "unitPrice",
        dataIndex: "unitPrice",
        align: "right",
        width: 180,
        render(value: number, record) {
          const content = `${formatNumber(value)} ${
            record?.goodsInfos?.[0]?.currency || VND_CURRENCY_UNIT
          }`;
          return (
            <LayoutCell position="right">
              <OneLineText value={content} />
            </LayoutCell>
          );
        },
      },
    ];

    if (isContract) {
      columnBase.push({
        title: translate("CT.quantity"),
        key: "quantity",
        dataIndex: "quantity",
        width: 80,
        align: "right",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      });
    }

    return columnBase;
  }, [isContract, translate]);

  const handleFormatGoodServices = (
    goodItem: SelectAdjustableGoodsServicesModel
  ) => {
    const currency = goodItem?.currency;
    let quantityContract = goodItem?.quantity;

    if (goodItem?.quantityReceived) {
      quantityContract = goodItem?.quantity - goodItem?.quantityReceived;
    }

    const idContract = Boolean(goodItem?.contractGoodsItemId);
    const goodService: SelectAdjustableGoodsServicesModel = {
      ...goodItem,
      code: goodItem?.code,
      id: `${goodItem?.id}_${goodItem?.goodUnit?.code}_${
        goodItem?.goodBranch?.code
      }_${goodItem?.contractGoodsItemId || goodItem?.purchaseItemId}_${uniqueId(
        "good-service"
      )}`,
      name: goodItem?.name,
      unit: goodItem?.unit,
      unitPrice: goodItem?.unitPrice,
      unitQuantity: goodItem?.quantity || 0,
      quantity: idContract ? 0 : null,
      currencyRate: goodItem?.currencyRate,
      quantityContract,
      receiverInfo: null,
    };

    const taxValue = goodItem?.taxModel;

    goodService.amount =
      toFixedByCurrency(
        goodService?.quantity * goodService?.unitPrice,
        currency
      ) ?? undefined;
    if (taxValue) {
      goodService.taxAmount = dividedWithFixed(
        multiplyWithFixed(taxValue?.rate, goodService?.amount),
        100
      );
    }

    goodService.totalAmount = sumWithFixed([
      goodService?.amount,
      goodService?.taxAmount || 0,
    ]);
    goodService.totalAmountConvert = toFixedByCurrency(
      goodService?.totalAmount * goodService?.currencyRate,
      goodService?.currency
    );

    return goodService;
  };

  const handleSelected = () => {
    const goodServices = selectedRow
      ?.map((goodInfo) => {
        const child = goodInfo.childrens?.map(
          (goodInfoChild: SelectAdjustableGoodsServicesModel) => {
            return handleFormatGoodServices(goodInfoChild);
          }
        );

        if (size(child)) {
          return child;
        }

        if (isEmpty(child) || isNil(child)) {
          return handleFormatGoodServices(goodInfo);
        }
      })
      ?.flat()
      .filter(Boolean);

    onSelected(goodServices);
    onClose();
  };

  return (
    <Modal
      open
      title={translate(
        isContract
          ? "CA.txt_choose_items_to_adjust"
          : "CT.create_contract.table.add_goods_services"
      )}
      isShowIconBack={false}
      size={WIDTH_1100}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={onClose}
      handleSave={handleSelected}
      disableButtonApply={isEmpty(selectedRow)}
      closeIcon
    >
      <SelectAdjustableGoodsServicesFilter
        modelFilter={modelFilter}
        dispatchFilter={dispatchFilter}
        handleLoadList={handleLoadList}
      />

      <StandardTable
        loading={loadingList}
        rowKey={TABLE_ROW_KEY}
        rowSelection={rowSelection}
        onChange={handleTableChange}
        columns={columns}
        dataSource={list}
        scroll={{ y: WIDTH_400 }}
        locale={{
          emptyText: (
            <EmptyItemTable
              content={translate("CM.txt_search_no_data")}
              containerClassName="flex-column border-0 bg-white"
              icon={
                <img src={IcEmptySearchSvg} alt="" width={200} height={200} />
              }
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
    </Modal>
  );
}
