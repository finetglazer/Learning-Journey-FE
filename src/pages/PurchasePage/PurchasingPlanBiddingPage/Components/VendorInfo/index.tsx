import type { TableColumnsType } from "antd";
import { AddIcon, TrashIcon } from "assets/icons";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { SupplierGenerals } from "models/PurchasingPlan/PurchasingPlanBidder";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

export default function VendorInfo() {
  const [translate] = useTranslation();

  const columns: TableColumnsType<SupplierGenerals> = [
    {
      title: translate("CT.txt_supplier"),
      key: "name",
      dataIndex: "name",
      ellipsis: true,
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
      width: 180,
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

  const renderButtonAddSupplier = () => {
    return (
      <Button
        icon={<img src={AddIcon} alt="img" width={14} height={14} />}
        iconPlace="left"
        type="secondary"
      >
        {translate("PPA.add_supplier")}
      </Button>
    );
  };

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.purchasing_plan_supplier_information"),
      children: (
        <TableWithEmpty
          list={[{}]}
          columns={columns}
          actionBarComponent={
            <>
              {renderButtonAddSupplier()}
              <div className="mt-2">
                <ActionBarComponent>
                  <Button type="secondary" size="sm">
                    {translate("CM.txt_delete")}
                  </Button>
                </ActionBarComponent>
              </div>
            </>
          }
          emptyExtra={
            <CloudyEmpty content={translate("CA.msg_empty_data_in_system")}>
              {renderButtonAddSupplier()}
            </CloudyEmpty>
          }
        />
      ),
    },
  ];

  return <AdvancedCollapseView items={collapseItems} />;
}
