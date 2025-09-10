import { Tooltip } from "antd";
import classNames from "classnames";
import { GoodServiceExtend } from "models/Proposal/GoodService";

type CellCustomProps<T> = {
  onClick?: (data: T) => void;
  record?: T;
};

const CellCustom = ({
  onClick,
  record,
}: CellCustomProps<GoodServiceExtend>) => {
  const handleOnclick = () => {
    onClick?.(record);
  };

  const styleClass = classNames(onClick ? "cursor-pointer" : "");

  return (
    <Tooltip
      placement="topLeft"
      className="w-100"
      title={
        <>
          <div>{record?.name}</div>
          <div>{record?.code}</div>
        </>
      }
    >
      <div onClick={handleOnclick} className={styleClass}>
        <div className="table__cell-blue fw-semibold text-ellipsis">
          {record?.name}
        </div>
        <div className="table__cell_text_below">{record?.code}</div>
      </div>
    </Tooltip>
  );
};

export default CellCustom;
