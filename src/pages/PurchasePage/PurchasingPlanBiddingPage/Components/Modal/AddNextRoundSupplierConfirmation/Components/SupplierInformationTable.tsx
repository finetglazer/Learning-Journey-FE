import type { TableColumnsType } from "antd";
import { AddIcon, TrashIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { SupplierGenerals, SupplierModel } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IProps {
  onSelectSupplier: () => void;
  onSelectedSupplier: (suppliers: SupplierModel[]) => void;
  suppliers: SupplierModel[];
}

export default function SupplierInformationTable({
  suppliers,
  onSelectSupplier,
  onSelectedSupplier,
}: IProps) {
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
      title: translate("PL.purchasing_plan_supplier_tab"),
      key: "name",
      dataIndex: "name",
      width: 306,
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
      key: "taxCode",
      dataIndex: "taxCode",
      width: 150,
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
      key: "address",
      dataIndex: "address",
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
      key: "quoteName",
      dataIndex: "quoteName",
      width: 200,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate(
        "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price"
      ),
      key: "quoteEmail",
      dataIndex: "quoteEmail",
      width: 200,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
    },
    {
      title: translate("PL.drawer_phone_number_supplier"),
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      width: 150,
      render: (value: string) => (
        <LayoutCell>
          <OneLineText value={value} />
        </LayoutCell>
      ),
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
      list={suppliers}
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
