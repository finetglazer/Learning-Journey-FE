import type { TableColumnsType } from "antd";
import { AddIcon, TrashIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { SupplierGenerals } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IProps {
  onSelectSupplier: () => void;
}

export default function SupplierInformationTable({ onSelectSupplier }: IProps) {
  const [translate] = useTranslation();

  const buttonAddSupplier = () => (
    <Button
      icon={<img src={AddIcon} alt="img" width={14} height={14} />}
      iconPlace="left"
      type="secondary"
      className="w-fit"
      onClick={onSelectSupplier}
    >
      {translate("PPA.add_supplier")}
    </Button>
  );

  const columns: TableColumnsType<SupplierGenerals> = [
    {
      title: translate("PL.purchasing_plan_supplier_name"),
      width: 202,
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
      title: translate("PL.purchasing_plan_supplier_tax_code"),
      width: 120,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("PL.purchasing_plan_supplier_address"),
      width: 120,
      render: (value) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.txt_originalCurrencyTotal"),
      width: 165,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PR.currency_type"),
      width: 100,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PR.total_converted_amount"),
      width: 165,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
      hidden: false,
    },
    {
      key: "id",
      width: 40,
      fixed: "right",
      render() {
        return (
          <LayoutCell>
            <button>
              <TrashIcon fillColor="#C03629" />
            </button>
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <TableWithEmpty
      list={[]}
      columns={columns}
      emptyExtra={<CloudyEmpty>{buttonAddSupplier()}</CloudyEmpty>}
      actionBarComponent={
        <>
          {buttonAddSupplier()}
          <ActionBarComponent>
            <Button type="secondary" size="sm">
              {translate("CM.txt_delete")}
            </Button>
          </ActionBarComponent>
        </>
      }
    />
  );
}
