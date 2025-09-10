import dayjs from "dayjs";
import TableInformationDetail from "pages/PurchasePage/PurchasingPlanPage/Components/TableInfomationDetail/TableInfomationDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type TableItemType = {
  title: string;
  value?: string;
  type?: "text" | "tooltip";
  colSpan?: number;
  twoLine?: boolean;
};

type TableRowType = {
  isHeader?: boolean;
  items: TableItemType[];
};

const GeneralInformation = ({ data }: { data: { [key: string]: string } }) => {
  const [translate] = useTranslation();
  const rows: TableRowType[] = [
    {
      isHeader: true,
      items: [
        {
          title: translate("TIA.txt_creator"),
          value: data?.creatorName || "",
        },
        {
          title: translate("TIA.txt_unit_create"),
          value: data?.organizationName || "",
        },
        { title: translate("TIA.txt_position"), value: data?.position || "" },
      ],
    },
    {
      items: [
        {
          title: translate("TIA.txt_branch"),
          value: data?.orgBusinessBranch || "",
        },
        {
          title: translate("TIA.txt_branch_unit"),
          value: data?.orgBusinessDepartment || "",
          colSpan: 2,
        },
      ],
    },
    {
      items: [
        {
          title: translate("TIA.txt_description"),
          value: data?.description || "",
          colSpan: 3,
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

export default GeneralInformation;
