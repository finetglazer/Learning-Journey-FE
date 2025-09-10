import { useDebounceFn, useUpdateEffect } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcSearchSVG } from "assets/icons";
import classNames from "classnames";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, isNil } from "lodash";
import { CostGroup, ProposalCreateModel } from "models/Proposal";
import { GoodService, GoodServiceFilter } from "models/Proposal/GoodService";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { useContext, useEffect, useMemo } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import {
  BORDER_TYPE,
  InputText,
  LayoutCell,
  Modal,
  MultipleSelect,
  OneLineText,
  Pagination,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map, of } from "rxjs";
import { formatNumberToCurrency } from "../../../../helper";
import { handleSelectGoodServices, renderRowSelection } from "./helper";

type Props = {
  open: boolean;
  handleCancel: () => void;
};

const GoodServiceModal = ({ open, handleCancel }: Props) => {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const { handleChangeAllField, model } = useContext<ProposalCreateModel>(
    ProposalCreateHookContext
  );

  const baseFilter = useMemo(() => {
    return {
      ...new GoodServiceFilter(),
      pageIndex: 1,
      pageSize: 10,
      isGetForProposal: true,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodServiceFilter, baseFilter);

  const { count, list, handleLoadList } = listService.useList<
    GoodService,
    GoodServiceFilter
  >(
    proposalRepository.getGoodServicesList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<GoodService>("checkbox", [], false, "manual");

  const {
    handleChangeMultipleSelectFilter,
    handleChangeSelectFilter,
    handleChangeInputFilter,
    handleChangeAllFilter,
  } = filterService.useFilter<GoodServiceFilter>(modelFilter, dispatchFilter);

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useUpdateEffect(() => {
    handleLoadList(modelFilter);
  }, [modelFilter]);

  useEffect(() => {
    handleChangeAllFilter({
      ...modelFilter,
      costTypeValue: model?.costType,
      costTypeId: model?.costType?.id,
      costGroupValue: model?.costGroup,
      costGroupId: model?.costGroup?.id,
    });
  }, [model?.costType, model?.costGroup]);

  const getListCostGroup = (filter: ModelFilter) => {
    return of(modelFilter?.costTypeValue?.costGroups).pipe(
      map((costGroupList: CostGroup[]) => {
        if (!Array.isArray(costGroupList)) {
          return [];
        }

        const trimmedName = filter?.search?.trim()?.toLowerCase();
        if (!trimmedName) {
          return costGroupList;
        }

        return costGroupList.filter(
          (period) =>
            period?.code?.toLowerCase()?.includes(trimmedName) ||
            period?.name?.toLowerCase()?.includes(trimmedName)
        );
      })
    );
  };

  const handleSelectGood = () => {
    if (isValidSameCostGroup(selectedRow)) {
      handleChangeAllField({
        ...model,
        costType: selectedRow?.[0]?.costType,
        costGroup: selectedRow?.[0]?.costGroup,
        costTypeId: selectedRow?.[0]?.costType?.id,
        costGroupId: selectedRow?.[0]?.costGroup?.id,
        selectedListGoodsServices: handleSelectGoodServices(
          model?.selectedListGoodsServices ?? [],
          selectedRow
        ),
      });

      handleCancel();
    } else {
      notifyToast({
        message: translate("PP.error_not_same_category"),
        type: "error",
      });
    }
  };

  const { run } = useDebounceFn(
    (search: string) => {
      handleChangeInputFilter({ fieldName: "search" })(search);
    },
    {
      wait: 300,
    }
  );

  const isValidSameCostGroup = (selectedRow: GoodService[]) => {
    if (selectedRow.length > 0) {
      const costGroupId = selectedRow?.[0]?.costGroup?.id;
      const isSameCostGroup = selectedRow.every(
        (item) => item?.costGroup?.id === costGroupId
      );
      return isSameCostGroup;
    }
    return true;
  };

  const handleSelectCostType = (idValue: number, value: Model) => {
    if (!isEqual(modelFilter?.costGroupValue?.costTypeId, value?.id)) {
      handleChangeSelectFilter({
        fieldName: "costGroup",
      })(undefined, undefined);
    }
    handleChangeSelectFilter({
      fieldName: "costType",
    })(idValue, value);
  };

  const columns: ColumnProps<GoodService>[] = [
    {
      title: () => (
        <div className="payment-font-14 ">
          <label className={classNames("component__title text-nowrap")}>
            {translate("PP.text_goods_services")}
          </label>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <LayoutCell>
          <OneLineText value={text} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <label className={classNames("component__title text-nowrap")}>
            {translate("PP.text_unit")}
          </label>
        </div>
      ),
      dataIndex: "goodsServiceUnit.name",
      key: "goodsServiceUnit.name",
      render: (_, record) => (
        <LayoutCell>
          <OneLineText value={record?.goodsServiceUnit?.name} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <label className={classNames("component__title text-nowrap")}>
            {translate("PP.modal_columns_category")}
          </label>
        </div>
      ),
      dataIndex: "goodsServicesCategory.name",
      key: "goodsServicesCategory.name",
      render: (_, record) => (
        <LayoutCell>
          <OneLineText value={record?.goodsServicesCategory?.name} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <label className={classNames("component__title text-nowrap")}>
            {translate("PP.modal_plh_cost_type")}
          </label>
        </div>
      ),
      dataIndex: "costType.name",
      key: "costType.name",
      render: (_, record) => (
        <LayoutCell>
          <OneLineText
            value={
              record?.costType?.id
                ? `${record?.costType?.code} - ${record?.costType?.name}`
                : null
            }
            useTooltip
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14 ">
          <label className={classNames("component__title text-nowrap")}>
            {translate("PP.modal_plh_cost_group")}
          </label>
        </div>
      ),
      dataIndex: "costType.costItem",
      key: "costType.costItem",
      render: (_, record) => (
        <LayoutCell>
          <OneLineText value={record?.costItem?.name} useTooltip />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {translate("PP.modal_columns_reference_price")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {translate("PM.payment_currency_unit")}
          </div>
        </div>
      ),
      dataIndex: "referencePriceMin",
      key: "referencePriceMin",
      width: 200,
      align: "right",
      render: (_, record) => (
        <LayoutCell className="d-flex justify-content-end">
          <OneLineText
            value={`${formatNumberToCurrency(
              record?.referencePriceMin
            )} - ${formatNumberToCurrency(record?.referencePriceMax)}`}
            useTooltip
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="payment-font-14   d-flex justify-content-end flex-column">
          <div className="d-flex justify-content-end text-nowrap">
            {translate("PP.modal_columns_contract_price")}
          </div>
          <div className="fw-normal d-flex justify-content-end payment-label_font_10">
            {translate("PM.payment_currency_unit")}
          </div>
        </div>
      ),
      key: "goodsServiceUnit.name",
      width: 200,
      align: "right",
      render: (record) => (
        <LayoutCell className="d-flex justify-content-end">
          <OneLineText
            value={`${formatNumberToCurrency(
              record?.contractPriceMin
            )} - ${formatNumberToCurrency(record?.contractPriceMax)}`}
            useTooltip
          />
        </LayoutCell>
      ),
    },
  ];

  return (
    <Modal
      title={translate("PP.modal_title_add_goods_services")}
      size={1100}
      className="payment-minHeight-500"
      handleSave={handleSelectGood}
      isShowIconBack={false}
      handleCancel={handleCancel}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate("PR.btn_choice")}
      open={open}
      closeIcon
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-3">
            <div className="flex-2 pt-1">
              <InputText
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                value={modelFilter.search}
                placeHolder={translate("PP.txt_search_bar")}
                onChange={run}
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
              />
            </div>
            <div className="flex-1 pt-1 overflow-hidden">
              <MultipleSelect
                searchProperty="search"
                valueFilter={{
                  search: "",
                }}
                placeHolder={translate("PP.modal_plh_category")}
                appendToBody={true}
                classFilter={undefined}
                searchType=""
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                getList={proposalRepository.getGoodCategoryList}
                isEnumerable={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsServicesCategory",
                })}
                values={modelFilter?.goodsServicesCategoryValue ?? []}
              />
            </div>
            <div className="flex-1 pt-1">
              <Select
                readOnly={!isNil(model?.costType)}
                isSearch
                searchProperty="search"
                valueFilter={{
                  search: "",
                  isActive: true,
                }}
                placeHolder={translate("PP.modal_plh_cost_type")}
                appendToBody={true}
                classFilter={undefined}
                searchType=""
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                getList={proposalRepository.listCostType}
                onChange={handleSelectCostType}
                value={modelFilter?.costTypeValue}
                allowClear={false}
                isEnumerable={false}
              />
            </div>
            <div className="flex-1 pt-1">
              <Select
                readOnly={!isNil(model?.costGroup)}
                isSearch
                searchProperty="search"
                valueFilter={{
                  search: "",
                }}
                placeHolder={translate("PP.modal_plh_cost_group")}
                appendToBody={true}
                classFilter={undefined}
                searchType=""
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                getList={getListCostGroup}
                onChange={handleChangeSelectFilter({
                  fieldName: "costGroup",
                })}
                disabled={isNil(modelFilter?.costTypeValue)}
                value={modelFilter?.costGroupValue}
                allowClear={false}
                isEnumerable={false}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
              />
            </div>
          </div>
        </div>
        <div className="page-master__table">
          <StandardTable
            dataSource={list}
            columns={columns}
            rowKey="uniqueId"
            loading={false}
            pagination={false}
            scroll={{ x: "1100px", y: "calc(100vh - 320px)" }}
            rowSelection={renderRowSelection({
              model,
              defaultRowSelection: rowSelection,
              selectedRow,
              selectedRowKeys,
              setSelectedRow,
              setSelectedRowKeys,
            })}
          />
        </div>
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
    </Modal>
  );
};

export default GoodServiceModal;
