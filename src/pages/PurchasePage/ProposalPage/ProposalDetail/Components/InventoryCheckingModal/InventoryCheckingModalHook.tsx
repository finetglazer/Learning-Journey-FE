/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { AxiosError } from "axios";
import { formatNumber } from "core/helpers/number";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { Proposal } from "models/Proposal";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { createContext, Dispatch, useCallback, useMemo, useState } from "react";
import { ModelFilter } from "react-3layer-common";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";

export interface InventoryCheckingContent {
  CATEGORY_CODE: string;
  CATEGORY_NAME: string;
  QUANTITY_REQUEST: number;
  QUANTITY_AVAILABLE: number;
  STATUS_AVAILABLE: number;
}

export class InventoryCheckingContentfilter extends ModelFilter {
  public categoryInfos: any[];
}

export interface InventoryCheckingContextModel {
  visible: boolean;
  modelFilter: InventoryCheckingContentfilter;
  dispatchFilter: Dispatch<FilterAction<InventoryCheckingContentfilter>>;
  loadingList: boolean;
  listContent: InventoryCheckingContent[];
  countContent: number;
  columns: ColumnProps<InventoryCheckingContent>[];
  handleLoadListContent: (
    goodService?: any,
    filterParam?: InventoryCheckingContentfilter
  ) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}

export const InventoryCheckingContext =
  createContext<InventoryCheckingContextModel>({
    visible: undefined,
    modelFilter: undefined,
    dispatchFilter: undefined,
    loadingList: undefined,
    listContent: undefined,
    countContent: undefined,
    columns: undefined,
    handleLoadListContent: undefined,
    handleOpenModal: undefined,
    handleCloseModal: undefined,
  });

export function useInventoryCheckingModal(model: Proposal) {
  const [visible, setVisible] = useState<boolean>(false);
  const { modelFilter, dispatchFilter } = filterService.useModelFilter(
    InventoryCheckingContentfilter,
    {
      ...new InventoryCheckingContentfilter(),
      pageIndex: 1,
      pageSize: 10,
    }
  );

  const [listContent, setListContent] = useState<InventoryCheckingContent[]>(
    []
  );

  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [countContent, setCountContent] = useState<number>(0);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleOpenModal = useCallback(() => {
    if (!visible) {
      setVisible(true);
    }
  }, [visible]);

  const handleLoadListContent = useCallback(
    (goodService?: any, filterParam?: InventoryCheckingContentfilter) => {
      if (goodService?.categoryCode) {
        filterParam.categoryInfos = [...[], goodService];
        filterParam.pageIndex = 1;
        filterParam.pageSize = 10;
      } else {
        const categoryInfos = model?.selectedListGoodsServices
          ?.filter((current: { isChecked: any }) => {
            return current?.isChecked;
          })
          ?.map((item: any) => {
            return {
              categoryCode: item.code,
              quantity: item.quantity || 0,
            };
          });
        if (categoryInfos && categoryInfos.length > 0) {
          filterParam.categoryInfos = categoryInfos;
        }
      }

      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: {
          ...filterParam,
        },
      });

      setLoadingList(true);
      proposalRepository.checkInventory(filterParam).subscribe(
        (res) => {
          if (res?.data?.message && res?.data?.status === "01") {
            notifyToast({
              type: "error",
              message: res?.data?.message,
            });
          } else {
            handleOpenModal();
            if (res?.data?.pagination) {
              setListContent(res?.data?.pagination?.items);
              setCountContent(res?.data?.pagination?.totalRecords);
            }
          }
          setLoadingList(false);
        },
        (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setLoadingList(false);
        }
      );
    },
    [
      dispatchFilter,
      handleOpenModal,
      model?.selectedListGoodsServices,
      notifyToast,
    ]
  );

  const handleCloseModal = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new InventoryCheckingContentfilter(),
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setVisible(false);
  }, [dispatchFilter]);

  const [translate] = useTranslation();

  const columns: ColumnProps<InventoryCheckingContent>[] = useMemo(
    () => [
      {
        title: translate("inventoryCheckings.goodService"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, InventoryCheckingContent, number]) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={
                  <>
                    <div>{params[1]?.CATEGORY_NAME}</div>
                    <div>{params[1]?.CATEGORY_CODE}</div>
                  </>
                }
              >
                <div>
                  <div className="table__cell-blue fw-semibold">
                    {params[1]?.CATEGORY_NAME}
                  </div>
                  <div className="table__cell_text_below">
                    {params[1]?.CATEGORY_CODE}
                  </div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("inventoryCheckings.requestNumber"),
        key: "QUANTITY_REQUEST",
        dataIndex: "QUANTITY_REQUEST",
        sorter: true,
        render(...params: [number, InventoryCheckingContent, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("inventoryCheckings.statusAvailable"),
        key: "STATUS_AVAILABLE",
        dataIndex: "STATUS_AVAILABLE",
        sorter: true,
        render(...params: [number, InventoryCheckingContent, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0] === 1
                    ? translate("inventoryCheckings.available")
                    : translate("inventoryCheckings.notAvailable")
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("inventoryCheckings.availableNumber"),
        key: "QUANTITY_AVAILABLE",
        dataIndex: "QUANTITY_AVAILABLE",
        sorter: true,
        render(...params: [number, InventoryCheckingContent, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return {
    visible,
    modelFilter,
    dispatchFilter,
    loadingList,
    listContent,
    countContent,
    columns,
    handleLoadListContent,
    handleOpenModal,
    handleCloseModal,
  };
}
