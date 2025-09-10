import React, { useEffect } from "react";
import { ColumnProps } from "antd/lib/table";
import { SupplierModel } from "models/PurchasingPlan";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { ColumnKey } from "models/PurchasingPlan/PurchasingPlanBidder";
import styles from "./PrioritySupplierTable.module.scss";
import { SupplierInformationProps } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/SupplierInformation/SupplierInformation";
import { usePrioritySupplierTableHook } from "./usePrioritySupplierTableHook";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { emptyCloudIcon } from "assets/icons";
import { isArray } from "lodash";

const PrioritySupplierTable = ({
  contextValue,
  idContainer,
}: SupplierInformationProps) => {
  const { model } = contextValue;
  const { translate, rowSelection, selectedRowKeys, selectedRow } =
    usePrioritySupplierTableHook(contextValue);

  const renderTextCell = (value: any) => (
    <LayoutCell>
      <OneLineText value={value} />
    </LayoutCell>
  );

  useEffect(() => {
    contextValue.handleChangeSingleField({
      fieldName: "masterPrioritySupplierSelectedKey",
    })(selectedRow?.map((item) => item?.supplierId ?? ""));
  }, [selectedRowKeys]);

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(() => {
    return [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: 232,
        render: renderTextCell,
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        ellipsis: true,
        width: 200,
        render: (_: string, record: SupplierModel) =>
          renderTextCell(record?.address),
      },
      {
        title: translate("PL.drawer_name_person_quoting_price"),
        key: ColumnKey.QUOTATION_NAME,
        dataIndex: ColumnKey.QUOTATION_NAME,
        ellipsis: true,
        width: 180,
        render: (_: string, record: SupplierModel) =>
          renderTextCell(record?.quoteName),
      },
      {
        title: translate("PL.drawer_email_person_quoting_price"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: 180,
        ellipsis: true,
        render: (_: string, record: SupplierModel) =>
          renderTextCell(record?.quoteEmail),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: 120,
        ellipsis: true,
        render: (_: string, record: SupplierModel) =>
          renderTextCell(record?.phoneNumber),
      },
    ];
  }, [translate]);

  return (
    <div className={styles["supplier-information-table"]}>
      {!isArray(model?.masterPrioritySupplier?.listSupplierAddQuote) ||
      model?.masterPrioritySupplier?.listSupplierAddQuote?.length === 0 ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      ) : (
        <StandardTable
          isDragable={true}
          loading={false}
          rowKey={"id"}
          idContainer={idContainer ?? "table-supplier"}
          columns={columns}
          dataSource={model?.masterPrioritySupplier?.listSupplierAddQuote}
          rowSelection={{
            ...rowSelection,
          }}
          scroll={{ y: "calc(100vh - 500px)" }}
        />
      )}
    </div>
  );
};

export default PrioritySupplierTable;
