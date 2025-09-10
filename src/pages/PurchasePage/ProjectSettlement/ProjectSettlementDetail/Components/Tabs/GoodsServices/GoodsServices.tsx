import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { useTranslation } from "react-i18next";
import { Table } from "./Components/Table/Table";

const KEY = "GoodsServicesTable";

const GoodsServices = () => {
  const [translate] = useTranslation();

  const items: CollapseItem[] = [
    {
      key: KEY,
      label: translate("PS.txt_goods_services_detail_settlement"),
      children: <Table />,
    },
  ];

  return (
    <CollapseView
      isShowTopDivider={false}
      items={items}
      defaultActiveKey={KEY}
    />
  );
};

export default GoodsServices;
