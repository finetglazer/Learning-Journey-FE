import { VIETNAMESE_TIME_ZONE_OFFSET } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import { SupplierModel } from "models/PurchasingPlan";
import TableInformationDetail from "pages/PurchasePage/PurchasingPlanPage/Components/TableInfomationDetail/TableInfomationDetail";
import { useTranslation } from "react-i18next";

type TableItemType = {
  title: string;
  value: string;
  type?: "text" | "tooltip";
  twoLine?: boolean;
};

type TableRowType = {
  isHeader?: boolean;
  items: TableItemType[];
};

const SupplierQuoteInformationTable = ({
  values,
}: {
  values: SupplierModel;
}) => {
  const [translate] = useTranslation();

  const dataQuotation = values?.quotationRoundDetail?.quotations?.[0];

  const RowsData: TableRowType[] = [
    {
      isHeader: true,
      items: [
        {
          title: translate("PL.drawer_tax_code_supplier"),
          value: values?.taxCode,
        },
        {
          title: translate("PL.drawer_name_supplier"),
          value: values?.name,
        },
        {
          title: translate("PL.drawer_address_supplier"),
          value: values?.address,
        },
      ],
    },
    {
      items: [
        {
          title: translate("PL.drawer_effective_date_quote_table"),
          value: dataQuotation?.effectivePeriod
            ? dayjs(dataQuotation?.effectivePeriod)
                .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
                .format("DD/MM/YYYY")
            : "",
        },
        {
          title: translate("PL.drawer_time_delivery_table"),
          // wait for data
          value: dataQuotation?.deliveryTime
            ? dayjs(dataQuotation?.deliveryTime)
                .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
                .format("DD/MM/YYYY")
            : "",
        },
        {
          title: translate("PL.drawer_time_sent_quote_table"),
          value: dataQuotation?.submissionPeriod
            ? dayjs(dataQuotation?.submissionPeriod)
                .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
                .format("DD/MM/YYYY HH:mm:ss")
            : "",
        },
      ],
    },
    {
      items: [
        {
          title: translate("PL.drawer_type_currency_table"),
          value: dataQuotation?.currency,
        },
        {
          title: translate("PL.drawer_exchange_rate_table"),
          value: formatNumber(dataQuotation?.exchangeRate),
        },
        {
          title: translate("PL.drawer_email_contact_person_table"),
          value: values?.quoteEmail,
        },
      ],
    },
    {
      items: [
        {
          title: translate("PL.drawer_explanation_table"),
          // wait for data
          value: dataQuotation?.description,
          twoLine: true,
        },
        {
          title: translate("PL.drawer_notes_table"),
          // wait for dataF
          value: dataQuotation?.note,
          twoLine: true,
        },
      ],
    },
  ];

  return <TableInformationDetail rows={RowsData} />;
};

export default SupplierQuoteInformationTable;
