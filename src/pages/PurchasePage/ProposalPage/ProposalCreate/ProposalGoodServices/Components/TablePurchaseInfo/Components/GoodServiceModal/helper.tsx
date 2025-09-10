import { TableRowSelection } from "antd/lib/table/interface";
import { KeyType } from "core/services/service-types";
import { isEqual, union, unionBy } from "lodash";
import { ProposalRequestModel } from "models/Proposal";
import { GoodService, GoodServiceExtend } from "models/Proposal/GoodService";
import { Dispatch, SetStateAction } from "react";
import { Checkbox } from "react-components-design-system";

type RenderRowSelectionProps = {
  model: ProposalRequestModel;
  defaultRowSelection?: TableRowSelection<GoodService>;
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  setSelectedRow: Dispatch<SetStateAction<GoodService[]>>;
  selectedRow: GoodService[];
  selectedRowKeys: KeyType[];
};

export const renderRowSelection = ({
  model,
  defaultRowSelection,
  selectedRow,
  selectedRowKeys,
  setSelectedRow,
  setSelectedRowKeys,
}: RenderRowSelectionProps) => {
  return {
    ...defaultRowSelection,
    renderCell: (value: boolean, record: GoodService) => {
      return (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (e) {
                setSelectedRowKeys([...selectedRowKeys, record.uniqueId]);
                setSelectedRow([...selectedRow, record]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record.uniqueId)
                );
                setSelectedRow(
                  selectedRow.filter((item) => item.uniqueId !== record.uniqueId)
                );
              }
            }}
          />
        </div>
      );
    },
  };
};

export const handleSelectGoodServices = (
  currentSelectedGoods: GoodServiceExtend[],
  selectGoods: GoodService[]
) => {
  const mergeSelectGoods = currentSelectedGoods;
  selectGoods.forEach((item) => {
    const indexLast = mergeSelectGoods.findLastIndex((i) =>
      isEqual(item?.id, i?.id)
    );
    if (indexLast !== -1) {
      const renderId = mergeSelectGoods?.[indexLast]?.renderId;

      const surfix = parseInt(renderId?.split("@")?.[1]) + 1;

      mergeSelectGoods.push({
        ...item,
        renderId: `${item?.id}@${surfix}`,
      });
    } else {
      mergeSelectGoods.push({ ...item, renderId: `${item?.id}@0` });
    }
  });

  return mergeSelectGoods;
};
