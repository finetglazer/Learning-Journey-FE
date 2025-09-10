import { LayoutCell, OneLineText } from "react-components-design-system";
import type { ColumnProps } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { PurchaseSummary } from "models/Report/Summary";

export function useColumns({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}): ColumnProps<PurchaseSummary>[] {
  const [translate] = useTranslation();
  return [
    {
      title: translate("report.purchase.change_supplier_info.table.index"),
      width: 55,
      key: "index",
      dataIndex: "index",
      render(_, __, index: number) {
        return (
          <LayoutCell position={"center"}>
            <OneLineText
              value={((pageIndex - 1) * pageSize + (index + 1)).toString()}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.change_date"
      ),
      key: "updatedDate",
      dataIndex: "updatedDate",
      width: 120,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.change_supplier_info.table.tax_code"),
      width: 170,
      key: "taxCode",
      dataIndex: "taxCode",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.supplier_name"
      ),
      width: 250,
      key: "name",
      dataIndex: "name",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.supplier_address"
      ),
      width: 350,
      key: "address",
      dataIndex: "address",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.representative"
      ),
      width: 200,
      key: "authorizedPerson",
      dataIndex: "authorizedPerson",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.change_supplier_info.table.position"),
      width: 200,
      key: "authorizedPersonPosition",
      dataIndex: "authorizedPersonPosition",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.contact_info"
      ),
      width: 300,
      key: "contactName",
      dataIndex: "contactName",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText
              value={record?.contactName + " - " + record?.contactEmail}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.bank_account"
      ),
      width: 350,
      key: "supplierPaymentHistoriesStr",
      dataIndex: "supplierPaymentHistoriesStr",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.change_supplier_info.table.updated_by"),
      width: 180,
      key: "updateUser",
      dataIndex: "updateUser",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.management_unit"
      ),
      width: 250,
      key: "manageOrganization",
      dataIndex: "manageOrganization",
      render(value: string, record) {
        return (
          <LayoutCell>
            <OneLineText
              value={
                record?.manageOrganization
                  ? record.manageOrganization.code +
                    " - " +
                    record.manageOrganization.name
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.change_supplier_info.table.status.label"
      ),
      width: 180,
      key: "isDelete",
      dataIndex: "isDelete",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={translate(
                "report.purchase.change_supplier_info.table.status." + value
              )}
            />
          </LayoutCell>
        );
      },
    },
  ];
}
