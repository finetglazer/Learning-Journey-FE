import type { TableColumnsType } from "antd";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { WIDTH_1000 } from "core/config/consts";
import { SupplierGenerals } from "models/PurchasingPlan";
import { LayoutCell, Modal, OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ConfirmSelectFinalSupplier({
  onCancel,
  onConfirm,
  isLoading,
}: IProps) {
  const [translate] = useTranslation();

  const columns: TableColumnsType<SupplierGenerals> = [
    {
      title: translate("PL.purchasing_plan_supplier_tab"),
      width: 232,
      render: (value: string) => {
        return (
          <LayoutCell>
            <div>
              <OneLineText
                className="text-table-content-primary"
                value={value}
              />
            </div>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.purchasing_plan_supplier_address"),
      width: 200,
      render: (value) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate(
        "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
      ),
      width: 180,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate(
        "PR.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
      ),
      width: 100,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PR.drawer_phone_number_supplier"),
      width: 165,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
      hidden: false,
    },
  ];

  return (
    <Modal
      title={translate("PL.txt_confirm_adding_negotiation_round")}
      size={WIDTH_1000}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={onCancel}
      handleSave={onConfirm}
      isShowIconBack={false}
      loading={isLoading}
      closeIcon
      open
    >
      <TableWithEmpty list={[]} columns={columns} />
    </Modal>
  );
}
