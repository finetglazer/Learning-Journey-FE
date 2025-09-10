import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";
import { Warranty } from "models/Contract";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./WarrantyInformation.module.scss";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { listWarrantyCalculationTime } from "config/const";

interface WarrantyInformationProps {
  data?: Warranty[];
}

const WarrantyInformation = ({ data }: WarrantyInformationProps) => {
  const [translate] = useTranslation();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        key: "warrantyType",
        title: translate("PL.drawer_type_warranty"),
        dataIndex: "warrantyType",
        width: 200,
        ellipsis: true,
        render: (_, record: Warranty) => (
          <LayoutCell>
            <OneLineText value={record?.warrantyType?.name} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PPA.txt_warranty_period")}
            className="align-items-end"
            unit={translate("PPA.txt_months")}
          />
        ),
        key: "warrantyPeriod",
        dataIndex: "warrantyPeriod",
        width: 150,
        ellipsis: true,
        render: (_, record: Warranty) => (
          <LayoutCell position="right">
            <OneLineText value={record?.warrantyPeriod?.toString()} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PPA.txt_time_of_warranty"),
        key: "warrantyCalculationTime",
        dataIndex: "warrantyCalculationTime",
        width: 250,
        ellipsis: true,
        render: (value) => (
          <LayoutCell>
            <OneLineText
              value={
                listWarrantyCalculationTime?.find((item) => item?.id === value)
                  ?.name
              }
            />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.warranty_terms_label"),
        ellipsis: true,
        key: "warrantyTerms",
        dataIndex: "warrantyTerms",
        width: 250,
        render: (record: Warranty) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_notes"),
        key: "description",
        width: 296,
        render(value: Warranty) {
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
    <div className={styles["warranty-information__container"]}>
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

export default WarrantyInformation;
