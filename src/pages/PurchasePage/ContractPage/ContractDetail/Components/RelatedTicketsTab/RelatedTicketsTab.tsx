import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import RelatedTicketsTable from "./Components/RelatedTicketsTable/RelatedTicketsTable";
import WaitForReceiveGoodsTable from "./Components/WaitForReceiveGoodsTable/WaitForReceiveGoodsTable";
import TicketsReceiveGoodsTable from "./Components/TicketsReceiveGoodsTable/TicketsReceiveGoodsTable";
import AcceptanceTable from "./Components/AcceptanceTable/AcceptanceTable";

import styles from "./RelatedTicketsTab.module.scss";

enum RelatedTicketsCollapseKey {
  RELATED_TICKETS = "1",
  WAIT_FOR_RECEIVE_GOODS = "2",
  TICKETS_RECEIVE_GOODS = "3",
  ACCEPTANCE = "4",
}

const RelatedTicketsTab = () => {
  const [translate] = useTranslation();

  const items: CollapseItem[] = useMemo(() => {
    return [
      {
        key: RelatedTicketsCollapseKey.RELATED_TICKETS,
        label: translate("CT.related_tickets"),
        children: <RelatedTicketsTable />,
      },
      {
        key: RelatedTicketsCollapseKey.WAIT_FOR_RECEIVE_GOODS,
        label: translate("CT.wait_for_receive_goods"),
        children: <WaitForReceiveGoodsTable />,
      },
      {
        key: RelatedTicketsCollapseKey.TICKETS_RECEIVE_GOODS,
        label: translate("CT.tickets_receive_goods"),
        children: <TicketsReceiveGoodsTable />,
      },
      {
        key: RelatedTicketsCollapseKey.ACCEPTANCE,
        label: translate("CT.acceptance"),
        children: <AcceptanceTable />,
      },
    ];
  }, [translate]);

  return (
    <CollapseView
      items={items}
      className={styles["related-tickets-tab"]}
      defaultActiveKey={[
        RelatedTicketsCollapseKey.RELATED_TICKETS,
        RelatedTicketsCollapseKey.WAIT_FOR_RECEIVE_GOODS,
        RelatedTicketsCollapseKey.TICKETS_RECEIVE_GOODS,
        RelatedTicketsCollapseKey.ACCEPTANCE,
      ]}
    />
  );
};

export default RelatedTicketsTab;
