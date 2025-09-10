import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import { GuaranteeInformationModel } from "models/PurchasingPlan";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./GuaranteeInformation.module.scss";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import dayjs from "dayjs";
import { formatCurrency } from "core/helpers/currency";

interface GuaranteeInformationProps {
  data?: GuaranteeInformationModel[];
  currency?: string;
}

const TYPE_DATE = "DD/MM/YYYY";

const GuaranteeInformation = ({
  data,
  currency,
}: GuaranteeInformationProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<GuaranteeInformationModel>[] = useMemo(
    () => [
      {
        title: translate("CA.txt_guarantee_type"),
        key: "name",
        width: 200,
        render(value: GuaranteeInformationModel) {
          return (
            <LayoutCell>
              <OneLineText value={value?.guaranteeType?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PPA.txt_amount_guarantee")}
            className="align-items-end"
            unit={currency}
          />
        ),
        key: "amount",
        dataIndex: "amount",
        width: 200,
        render(value: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={value && formatCurrency(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PPA.txt_time_for_guarantee"),
        width: 250,
        render(record: GuaranteeInformationModel) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  (record?.fromDate
                    ? dayjs(record.fromDate).format(TYPE_DATE)
                    : "") +
                  (record?.fromDate && record?.toDate ? " - " : "") +
                  (record?.toDate ? dayjs(record.toDate).format(TYPE_DATE) : "")
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_notes"),
        key: "description",
        width: 270,
        render(value: GuaranteeInformationModel) {
          return (
            <LayoutCell>
              <OneLineText value={value?.description} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div className={styles["guarantee-information__container"]}>
      {isEmpty(data) ? (
        <EmptyDocuments isNewVersion />
      ) : (
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 546px)" }}
        />
      )}
    </div>
  );
};

export default GuaranteeInformation;
