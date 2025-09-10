import { IcEmptySearchSvg } from "assets/icons";
import { CostAllocation, PaymentTypeApplicationModel } from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React, { Key } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  StandardTable,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
// eslint-disable-next-line import/no-unresolved

type props = {
  columns: ColumnProps<PaymentTypeApplicationModel>[];
  translate: (key: string) => string;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  handleBulkDelete: () => void;
  list: PaymentTypeApplicationModel[];
  rowSelection: TableRowSelection<PaymentTypeApplicationModel>;
  idContainer: string;
};
const PaymentApplicationTable = ({
  columns,
  translate,
  selectedRowKeys,
  setSelectedRowKeys,
  handleBulkDelete,
  list,
  rowSelection,
  idContainer,
}: props) => {
  return (
    <div className="page-master__table">
      {/*Action control*/}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys?.filter(Boolean)}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>

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
        rowSelection={{
          ...rowSelection,
          getCheckboxProps: (record: CostAllocation) => ({
            disabled: record?.isTotal,
          }),
          renderCell: (value: boolean, record: CostAllocation) => {
            if (record.isTotal) return null;
            return (
              <div className="d-flex justify-content-center align-items-center payment-height_40">
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    if (e) {
                      setSelectedRowKeys([...selectedRowKeys, record.id]);
                    } else {
                      setSelectedRowKeys(
                        selectedRowKeys.filter((key) => key !== record.id)
                      );
                    }
                  }}
                />
              </div>
            );
          },
        }}
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

export default PaymentApplicationTable;
