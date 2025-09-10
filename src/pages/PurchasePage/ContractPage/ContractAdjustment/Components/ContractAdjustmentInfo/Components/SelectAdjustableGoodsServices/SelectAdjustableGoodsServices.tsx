import type { ColumnProps } from "antd/es/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  WIDTH_1100,
  WIDTH_400,
} from "core/config/consts";
import {
  dividedWithFixed,
  multiplyWithFixed,
  sumWithFixed,
  toFixedByCurrency,
} from "core/helpers/calculator";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { isEmpty, isNil } from "lodash";
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
  selectedFilter?: {
    goodsId: string;
    unitId: string;
  }[];
  onClose: () => void;
  onSelected: (list: SelectAdjustableGoodsServicesModel[]) => void;
}

export default function SelectAdjustableGoodsServicesModal({
  isContract,
  contractId,
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
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: value,
                  code: record?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
    ];

    if (isContract) {
      columnBase.push({
        title: translate("CT.quantity"),
        key: "unitQuantity",
        dataIndex: "unitQuantity",
        width: 80,
        align: "right",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value ? Number(value) : 0)} />
            </LayoutCell>
          );
        },
      });
    }

    return columnBase;
  }, [isContract, translate]);

  const handleSelected = () => {
    const selectedRowFlatten = selectedRow?.flatMap((item) => {
      if (item?.childrens && item.childrens.length > 0) {
        return [...(item?.childrens || [])];
      }
      return item;
    });

    const goodServices = selectedRowFlatten?.map((goodInfo) => {
      const currency = goodInfo?.currency;
      const goodService: SelectAdjustableGoodsServicesModel = {
        ...goodInfo,
        code: goodInfo?.code,
        id: `${goodInfo?.id}_${goodInfo?.goodUnit?.code}_${goodInfo?.goodBranch?.code}`,
        name: goodInfo?.name,
        unit: goodInfo?.unit,
        unitPrice: goodInfo?.unitPrice,
        quantity: isNil(goodInfo?.contractGoodsItemId) ? null : 0,
        currencyRate: goodInfo?.currencyRate,
        receiverInfos: goodInfo?.receiverInfos?.map((item: any) => ({
          ...item,
          isActiveReceive: goodInfo?.isActiveReceive,
          personEmail: item?.person,
          organization: item?.organizationName,
        })),
      };
      const taxValue = goodInfo?.taxModel;

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
    });

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
