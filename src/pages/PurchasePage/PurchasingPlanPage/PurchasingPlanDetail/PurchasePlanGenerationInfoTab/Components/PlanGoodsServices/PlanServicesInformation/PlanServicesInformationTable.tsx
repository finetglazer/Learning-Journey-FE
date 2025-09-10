import { ExpandableConfig, TableRowSelection } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { listService } from "core/services/page-services/list-service";
import {
  difference,
  endsWith,
  isEmpty,
  isEqual,
  isUndefined,
  size,
  uniq,
} from "lodash";
import { GoodServiceByCategory, GoodsServices } from "models/PurchaseRequest";
import { useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./PlanServicesInformationTable.scss";
import UseColumnPlanServicesInformation from "./useColumnPlanServicesInformation";
import {
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import { convertData } from "../../Helper";
import PlanGoodServicesDrawer from "../PlanGoodServicesDrawer/PlanGoodServicesDrawer";
import PlanGoodServicesDrawerView from "pages/PurchasePage/PurchasingPlanPage/Components/PlanGoodServicesDrawerView/PlanGoodServicesDrawerView";
import {
  childText,
  PURCHASING_PLAN_STATUS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { PURCHASING_PLAN_DETAIL_ROUTE } from "config/route-const";
import { ConfigField } from "core/services/service-types";

type Props = {
  isView?: boolean;
  model?: PurchasingPlanTypeModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  path?: string;
  pathEdit?: string;
  contextValue?: PurchasingPlanModel;
};

const PlanServicesInformationTable = ({
  isView = false,
  model,
  handleChangeSingleField,
  path,
  pathEdit = PURCHASING_PLAN_DETAIL_ROUTE,
  contextValue,
}: Props) => {
  const [translate] = useTranslation();
  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<GoodsServices>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [recordEdit, setRecordEdit] = useState<GoodServiceByCategory>();

  const [idDelete, setIdDelete] = useState("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const editSelectedGoods = model?.purchaseItems?.filter(
      (item) => item.id !== idDelete
    );
    const ids = selectedRowKeys.filter((id) => id !== idDelete);
    setSelectedRowKeys(ids);
    handleChangeSingleField({
      fieldName: "purchaseItems",
    })(editSelectedGoods);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const { columns } = UseColumnPlanServicesInformation({
    model,
    setOpenDrawer,
    setRecordEdit,
    handleDeleteRowConfirm,
    isView,
  });

  const rowSelections: TableRowSelection<GoodServiceByCategory> = {
    ...rowSelection,
    columnWidth: isView ? 8 : 40,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(
        selectedRows.filter(
          (item) => item?.id && isUndefined(item?.category?.id)
        )
      );
    },
    hideSelectAll: isView,
    renderCell: (value: boolean, record: GoodServiceByCategory) => {
      if (isView) return null;
      return (
        <Checkbox
          readOnly={record.isTotal}
          checked={value}
          onChange={(e) => {
            if (isEmpty(record?.children) || size(record?.children) === 0) {
              const lsIdSelected = e
                ? [...selectedRowKeys, record?.id]
                : difference(selectedRowKeys, [record?.id]);
              const parent = convertDataByCategory.find((item) =>
                item.children?.some((i) => i.id === record?.id)
              );
              if (
                parent?.children?.every((child) =>
                  lsIdSelected.includes(child.id)
                )
              ) {
                setSelectedRowKeys([...lsIdSelected, parent?.id]);
              } else {
                const checkParentSelected = selectedRowKeys.includes(
                  parent?.id
                );
                setSelectedRowKeys(
                  checkParentSelected
                    ? difference(lsIdSelected, [parent.id])
                    : lsIdSelected
                );
              }
            } else {
              const idChildSelected = record.children.map((i) => i.id);
              if (e) {
                setSelectedRowKeys(
                  uniq([...selectedRowKeys, ...idChildSelected, record?.id])
                );
              } else {
                setSelectedRowKeys(
                  difference(selectedRowKeys, [...idChildSelected, record?.id])
                );
              }
            }
          }}
        />
      );
    },
  };

  const expandable: ExpandableConfig<GoodServiceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (!record.children || record.children.length === 0) {
        return <div className="table__width-8" style={{ width: 2 }} />;
      }
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onExpand(record, e);
          }}
          className="d-flex justify-content-center"
        >
          <img
            className={classNames("cursor-pointer m-x--3xs", {
              "rotate-180": expanded,
              "rotate-0": !expanded,
            })}
            src={IcArrowDown}
            alt="img"
            width={10}
            height={10}
          />
        </div>
      );
    },
  };

  const handleBulkDeleteRow = () => {
    const editSelectedGoods = model?.purchaseItems?.filter(
      (item) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "purchaseItems",
    })(editSelectedGoods);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const convertDataByCategory = convertData(model?.purchaseItems ?? []);

  const handleSaveDrawerGoodsServices = () => {
    const maxLength = 500;
    const maxLenghhGoodsNode = 1024;
    if (
      model?.remainingRequestQuantity &&
      (model?.goodsDescriptions?.length || 0) <= maxLength &&
      (model?.goodsNote?.length || 0) <= maxLenghhGoodsNode
    ) {
      const dataPurchase = model?.purchaseItems?.map((item) => {
        if (item?.id === recordEdit?.id) {
          return {
            ...item,
            manufacturer: model?.manufacturers,
            remainingRequestQuantity: model?.remainingRequestQuantity,
            note: model?.goodsNote,
            description: model?.goodsDescriptions,
          };
        }
        return item;
      });
      handleChangeSingleField({
        fieldName: "purchaseItems",
      })(dataPurchase);
      setOpenDrawer(false);
    }
  };

  const isShowOpenDrawerView =
    path !== pathEdit &&
    (isView || !isEqual(model?.status, PURCHASING_PLAN_STATUS.DRAFT));

  return (
    <div>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys?.filter((item) =>
          endsWith(item as string, childText)
        )}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => {
            setOpenModalConfirmDeleteAll(true);
          }}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>

      <StandardTable
        rowKey="id"
        isDragable
        idContainer={"plan-services-information-table-kkjd8382923"}
        columns={columns}
        dataSource={[...convertDataByCategory]}
        scroll={{ y: 480 }}
        rowSelection={isView ? null : rowSelections}
        expandable={expandable}
        rowClassName={(record) => {
          const classes = [];
          if (model.isDetail) classes.push("detail-row");
          if (record.isTotal) classes.push("total-row");
          if (record.id === recordEdit?.id && openDrawer)
            classes.push("editable-row");
          return classes.join(" ");
        }}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row"
        )}
        content={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row_warning"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm")}
        handleSave={handleBulkDeleteRow}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row"
        )}
        content={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row_warning"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />

      {openDrawer &&
        (isShowOpenDrawerView ? (
          <PlanGoodServicesDrawerView
            visible={openDrawer}
            handleClose={() => setOpenDrawer(false)}
            handleSave={handleSaveDrawerGoodsServices}
            recordGoodServices={recordEdit}
          />
        ) : (
          <PlanGoodServicesDrawer
            visible={openDrawer}
            handleClose={() => setOpenDrawer(false)}
            handleSave={handleSaveDrawerGoodsServices}
            recordGoodServices={recordEdit}
            contextValue={contextValue}
          />
        ))}
    </div>
  );
};

export default PlanServicesInformationTable;
