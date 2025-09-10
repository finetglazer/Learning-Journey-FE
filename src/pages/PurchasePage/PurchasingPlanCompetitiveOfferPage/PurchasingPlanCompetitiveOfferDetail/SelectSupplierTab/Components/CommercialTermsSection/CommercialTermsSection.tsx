import type { ColumnProps } from "antd/es/table";
import { isEmpty } from "lodash";
import { CommercialTerms } from "models/Contract";
import { ColumnKey } from "models/PurchasingPlan";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import EmptyDocuments from "pages/PurchasePage/PurchasingPlanPage/Components/EmptyDocuments/EmptyDocuments";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/SelectSupplierTab/SelectSupplierTab.module.scss";
import { Supplier } from "models/Supplier/Supplier";

interface CommercialTermsSectionProperties
  extends SelectSupplierTabDefaultProps {
  data?: CommercialTerms[];
  isHaveSupplier?: boolean;
}

const CommercialTermsSection = ({
  data,
  isHaveSupplier = true,
}: CommercialTermsSectionProperties) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<CommercialTerms>[] = useMemo(
    () =>
      [
        isHaveSupplier && {
          title: translate("PL.purchasing_plan_supplier_tab"),
          ellipsis: true,
          width: 300,
          key: ColumnKey.SUPPLIER,
          dataIndex: ColumnKey.SUPPLIER,
          render: (value: Supplier, record: CommercialTerms) => {
            return (
              <LayoutCell className="">
                <OneLineText value={record?.supplierName} />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.purchasing_plan_commercial_terms_name"),
          ellipsis: true,
          width: 300,
          key: ColumnKey.NAME,
          dataIndex: ColumnKey.NAME,
          render: (value: string) => {
            return (
              <LayoutCell>
                <OneLineText
                  className="commercial_terms_name vertical_baseline"
                  value={value}
                />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("PL.purchasing_plan_description_label"),
          ellipsis: false,
          key: ColumnKey.DESCRIPTION,
          dataIndex: ColumnKey.DESCRIPTION,
          render: (value: string) => (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          ),
        },
      ].filter((el) => Boolean(el)),
    [isHaveSupplier, translate]
  );

  return isEmpty(data) ? (
    <EmptyDocuments isNewVersion />
  ) : (
    <StandardTable
      rowKey="id"
      id={styles["commercial-terms-table-purchasing-plan"]}
      isDragable
      columns={columns}
      dataSource={data}
      scroll={{ y: "calc(100vh - 320px)" }}
    />
  );
};

export default CommercialTermsSection;
