import type { ColumnProps } from "antd/es/table";
import { IcSearchSVG } from "assets/icons";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { SupplierModel } from "models/PurchasingPlan";
import {
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAddSupplierHook } from "./useAddSupllierHook";
interface IProps {
  onCancel: () => void;
  onSelect: (suppliers: SupplierModel[]) => void;
}

export default function AddSupplier({ onSelect, onCancel }: IProps) {
  const [translate] = useTranslation();
  const {
    list,
    count,
    loadingList,
    modelFilter,
    selectedRow,
    rowSelection,
    handleSearch,
    handlePagination,
  } = useAddSupplierHook();

  const columns: ColumnProps<SupplierModel>[] = [
    {
      title: translate("PL.purchasing_plan_tax_code_supplier"),
      key: "taxCode",
      dataIndex: "taxCode",
      width: 144,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.purchasing_plan_name_supplier"),
      key: "name",
      dataIndex: "name",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.purchasing_plan_supplier_address"),
      key: "address",
      dataIndex: "address",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.purchasing_plan_type_supplier"),
      key: "type",
      dataIndex: "type",
      width: 208,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
  ];

  const handleSelectedSupplier = () => {
    return onSelect(selectedRow as unknown as SupplierModel[]);
  };

  return (
    <Modal
      open
      title={translate("PM.payment_select_supplier_title")}
      size={1100}
      className="payment-minHeight-500"
      handleSave={handleSelectedSupplier}
      disableButtonApply={!selectedRow?.length}
      handleCancel={onCancel}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate(
        "PM.payment_modal_select_supplier_button_label"
      )}
      isShowIconBack={false}
      closeIcon
    >
      <InputText
        label={translate("CM.btn_search")}
        prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
        value={modelFilter.search}
        placeHolder={translate("PL.purchasing_plan_search_modal_supplier")}
        onChange={handleSearch}
        isSmall={false}
        className="pb-2"
      />
      <TableWithEmpty
        list={list}
        columns={columns}
        rowSelection={rowSelection}
        loading={loadingList}
      />
      <Pagination
        pageIndex={modelFilter.pageIndex}
        pageSize={modelFilter.pageSize}
        total={count}
        onChange={handlePagination}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
      />
    </Modal>
  );
}
