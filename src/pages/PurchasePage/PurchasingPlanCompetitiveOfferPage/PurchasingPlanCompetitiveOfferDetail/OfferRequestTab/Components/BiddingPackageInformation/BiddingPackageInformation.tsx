import { Row } from "antd";
import classNames from "classnames";
import { ColumnKey, PurchasingPlanModel } from "models/PurchasingPlan";
import "./BiddingPackageInformation.scss";
import BiddingDayByKey from "./Components/BiddingDayByKey";

const BiddingPackageInformation = ({
  isDetail = false,
  contextValue,
}: {
  isDetail?: boolean;
  contextValue: PurchasingPlanModel;
}) => {
  const { translate, model, dispatchModel } = contextValue;

  const items = [
    {
      key: "1",
      columnKey: ColumnKey.RELEASE_DAYS,
      label: translate("PL.competitive_offer.title.bidding_start_time"),
    },
    {
      key: "2",
      columnKey: ColumnKey.BID_END_DAYS,
      label: translate("PL.competitive_offer.title.bidding_end_time"),
    },
    {
      key: "3",
      columnKey: ColumnKey.BID_START_DAYS,
      label: translate(
        "PL.competitive_offer.title.time_of_release_of_document"
      ),
    },
    {
      key: "4",
      columnKey: ColumnKey.OPEN_BID_DAYS,
      label: translate("PL.competitive_offer.title.bid_closing_time"),
    },
  ];

  return (
    <div className="bidding-package-information">
      <Row className={classNames("align-center")} align="middle" gutter={184}>
        {items.map((item) => {
          return (
            <BiddingDayByKey
              key={item.key}
              columnKey={item.columnKey}
              columnKeyParent={ColumnKey.OFFER_REQUEST}
              model={model}
              label={item.label}
              isDetail={isDetail}
              dispatchModel={dispatchModel}
            />
          );
        })}
      </Row>
    </div>
  );
};

export default BiddingPackageInformation;
