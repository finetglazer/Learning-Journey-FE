import TableInformationDetail, {
  TableRowType,
} from "pages/PurchasePage/PurchasingPlanPage/Components/TableInfomationDetail/TableInfomationDetail";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

const BaseContract = ({ data }: { data: any }) => {
  const [translate] = useTranslation();
  const rows: TableRowType[] = [
    {
      isHeader: true,
      items: [
        {
          title: translate("TIA.txt_contract_code"),
          value: data?.code || "",
        },
        {
          title: translate("TIA.txt_contract_number"),
          value: data?.contractNo || "",
          href: `/portal/purchase/contract/contract-view/${data?.id}`,
          className: "text--primary",
        },
        {
          title: translate("TIA.txt_contract_name"),
          value: data?.name || "",
        },
      ],
    },
    {
      items: [
        {
          title: translate("TIA.txt_code_tax_supplier"),
          value: data?.taxCode || "",
        },
        {
          title: translate("TIA.txt_supplier"),
          value: data?.supplierName || "",
        },
        {
          title: translate("TIA.txt_currency"),
          value: data?.currency || "",
        },
      ],
    },
  ];

  return (
    <div>
      <TableInformationDetail rows={rows} />
    </div>
  );
};

export default BaseContract;
