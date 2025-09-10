import { IcEmptySearchSvg } from "assets/icons";
import { PaymentTypeApplicationModel } from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React from "react";
import { StandardTable } from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
// eslint-disable-next-line import/no-unresolved

type props = {
  columns: ColumnProps<PaymentTypeApplicationModel>[];
  translate: (key: string) => string;
  list: PaymentTypeApplicationModel[];
  idContainer: string;
};
const PaymentApplicationTableView = ({
  columns,
  translate,
  list,
  idContainer,
}: props) => {
  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={[
          ...list,
          {
            isTotal: true,
          },
        ]}
        idContainer={idContainer}
        isDragable={true}
        rowClassName="payment-custom_row_table"
        scroll={{ y: "calc(100vh - 320px)" }}
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={500}
            />
          ),
        }}
      />
    </div>
  );
};

export default PaymentApplicationTableView;
