import { Tooltip } from "antd";
import styles from "./TableInfomationDetail.module.scss";
import { OneLineText } from "react-components-design-system";

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

type ReusableTableType = {
  rows?: TableRowType[];
};

type ContentTableType = { value: string; className?: string };

const ContentTable = ({ value, className }: ContentTableType) => {
  return (
    <Tooltip placement={"topLeft"} title={value} className={className}>
      <p className={styles["information-detail_sub-title"]}>{value}</p>
    </Tooltip>
  );
};

const TableInformationDetail = ({ rows }: ReusableTableType) => {
  const TableRow = ({ items, isHeader }: TableRowType) => (
    <tr>
      {items.map((item, index) => {
        const CellTag = isHeader ? "th" : "td";
        return (
          <CellTag
            className="align-top"
            key={index}
            colSpan={item?.colSpan || 1}
          >
            <h5 className={styles["information-detail_title"]}>
              {item?.title}
            </h5>
            {item?.twoLine ? (
              <ContentTable
                className={`${styles["information-detail_content"]} mt-1`}
                value={item?.value}
              />
            ) : (
              <OneLineText
                className={`${styles["information-detail_values"]} mt-1`}
                value={item?.value}
              />
            )}
          </CellTag>
        );
      })}
    </tr>
  );

  return (
    <table className={styles["information-detail_table"]}>
      {rows?.map((row, index) => (
        <TableRow key={index} isHeader={row?.isHeader} items={row?.items} />
      ))}
    </table>
  );
};

export default TableInformationDetail;
