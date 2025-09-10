import { ChevronDown, ChevronRight } from "@carbon/icons-react";
import { emptyCloudIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import { CollapseItem } from "components/Collapse/CollapseView";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useMemo, useState } from "react";
import { StandardTable } from "react-components-design-system";
import UseColumnsContractSettlement, {
  convertDataWithChildren,
} from "../../ContractSettlementInfo/SettlementGoodsAndServices/UseColumnsContractSettlement/UseColumnsContractSettlement";
import { GoodsItemsType } from "models/Settlement";
import DrawerSettlementGoodsServices from "../DrawerSettlementGoodsServices/DrawerSettlementGoodsServices";

const ContractSettlementTable = () => {
  const { model, translate } = useContext(SettlementHookContext);
  const [recordEdit, setRecordEdit] = useState<GoodsItemsType>();
  const [
    openDrawerSettlementGoodsServices,
    setOpenDrawerSettlementGoodsServices,
  ] = useState<boolean>(false);

  const { columns } = UseColumnsContractSettlement({
    model,
    setRecordEdit,
    setOpenDrawerSettlementGoodsServices,
  });

  const tableData = convertDataWithChildren(model?.goodsItems);

  const itemsCollapse = useMemo<CollapseItem[]>(
    () => [
      {
        key: "1",
        label: translate("settlement.settlement_title_detail"),
        children: (
          <StandardTable
            rowKey={"id"}
            columns={columns}
            dataSource={tableData}
            isDragable={true}
            idContainer="table-id"
            scroll={{ y: "calc(100vh - 320px)" }}
            className="custom-table"
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) => {
                if (record.isTotal) {
                  return null;
                }
                if (record.children && record.children.length > 0) {
                  return (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpand(record, e);
                      }}
                    >
                      {expanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </span>
                  );
                }
                return null;
              },
              defaultExpandAllRows: true,
            }}
          />
        ),
      },
    ],
    [translate, model]
  );

  return (
    <>
      <div className="">
        {model?.goodsItems?.length === 0 ? (
          <div className="contract-settlement-tab-view-items p-y--lg p-x--sm m-y--lg m-x--sm">
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("settlement.settlement_empty_system")}
            />
          </div>
        ) : (
          <div>
            <AdvancedCollapseView
              items={itemsCollapse}
              className="collapse-container--border"
            />
          </div>
        )}
      </div>
      {openDrawerSettlementGoodsServices && (
        <DrawerSettlementGoodsServices
          visible={openDrawerSettlementGoodsServices}
          handleClose={() => setOpenDrawerSettlementGoodsServices(false)}
          recordGoodServices={recordEdit}
        />
      )}
    </>
  );
};

export default ContractSettlementTable;
