import { ExpandableConfig } from "antd/lib/table/interface";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import useColumnGoodServicesSection from "./useColumnGoodServicesSection";
import {
  PurchasePlanGoodsServicesModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";

import { ConfigField, FieldValue } from "core/services/service-types";
import { convertData } from "./Helper";
import styles from "./GoodServicesTable.module.scss";
import { useMemo } from "react";

type Props = {
  isHaveSupplier?: boolean;
  model?: PurchasingPlanTypeModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeAllField?: (value: PurchasingPlanTypeModel) => void;
  handleOpenDrawer?: () => void;
  data?: PurchasePlanGoodsServicesModel[];
  isDetail?: boolean;
};

const GoodServicesSectionTable = ({
  model,
  handleChangeSingleField,
  handleChangeAllField,
  data,
  handleOpenDrawer,
  isDetail = false,
}: Props) => {
  const [translate] = useTranslation();

  const convertDataByCategory = useMemo(() => {
    if (data?.length > 0) {
      return convertData(data);
    }

    return [];
  }, [data]);

  const dataSource = useMemo(() => {
    return [{ id: "0", isTotal: true }, ...convertDataByCategory];
  }, [convertDataByCategory]);

  const { columns } = useColumnGoodServicesSection({
    model,
    handleChangeSingleField,
    handleChangeAllField,
    data,
    handleOpenDrawer,
    isDetail,
  });

  const expandable: ExpandableConfig<GoodServiceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (!record.children || record.children.length === 0) {
        return <div className="table__width-8" style={{ width: 12 }} />;
      }

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onExpand(record, e);
          }}
          className="d-flex justify-content-center"
          style={{ width: 40 }}
        >
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": expanded,
              "rotate-0": !expanded,
            })}
            src={IcArrowDown}
            alt="img"
            width={10}
            height={10}
          />
        </div>
      );
    },
  };

  return (
    <div>
      <StandardTable
        rowKey="id"
        isDragable
        idContainer={"plan-services-information-table"}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: "calc(100vh - 320px)" }}
        rowSelection={null}
        expandable={expandable}
        rootClassName={styles["data-with-collapse-table"]}
        rowClassName={(record) => {
          return record?.isTotal ? "total-row" : "";
        }}
      />
    </div>
  );
};

export default GoodServicesSectionTable;
