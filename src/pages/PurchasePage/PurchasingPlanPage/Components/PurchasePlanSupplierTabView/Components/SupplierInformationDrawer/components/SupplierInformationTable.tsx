import { SupplierRequest } from "models/PurchasingPlan";
import TableInformationDetail from "pages/PurchasePage/PurchasingPlanPage/Components/TableInfomationDetail/TableInfomationDetail";
import { useTranslation } from "react-i18next";

type TableItemType = {
  title: string;
  value: string;
  type?: "text" | "tooltip";
  colSpan?: number;
  twoLine?: boolean;
};

type TableRowType = {
  isHeader?: boolean;
  items: TableItemType[];
};

const SupplierInformationTable = ({ data }: { data: SupplierRequest }) => {
  const [translate] = useTranslation();

  const rows: TableRowType[] = [
    {
      isHeader: true,
      items: [
        {
          title: translate("PL.drawer_tax_code_supplier"),
          value: data?.taxCode,
        },
        {
          title: translate("PL.drawer_name_supplier"),
          value: data?.name,
        },
        { title: translate("PL.drawer_type_supplier"), value: data?.type },
      ],
    },
    {
      items: [
        {
          title: translate("PL.drawer_address_supplier"),
          value: data?.address,
        },
        {
          title: translate("PL.drawer_email_person_quoting_price"),
          value: data?.quoteEmail,
        },
        {
          title: translate("PL.drawer_name_person_quoting_price"),
          value: data?.quoteName,
        },
      ],
    },
    {
      items: [
        {
          title: translate("PL.drawer_phone_number_supplier"),
          value: data?.phoneNumber,
        },
        {
          title: translate("PL.drawer_content_supplier"),
          value: data?.content,
          type: "tooltip",
          colSpan: 2,
          twoLine: true,
        },
      ],
    },
  ];

  return <TableInformationDetail rows={rows} />;
};

export default SupplierInformationTable;
