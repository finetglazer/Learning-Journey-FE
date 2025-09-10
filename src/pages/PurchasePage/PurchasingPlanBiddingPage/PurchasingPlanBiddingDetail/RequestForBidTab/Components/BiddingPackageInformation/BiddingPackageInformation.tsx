import { Col, Row } from "antd";
import "./BiddingPackageInformation.scss";
import { FormItem, Select } from "react-components-design-system";
import BiddingDayByKey from "./Components/BiddingDayByKey";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import { of } from "rxjs";
import {
  PURCHASING_PLAN_BIDDING_METHOD,
  PURCHASING_PLAN_BIDDING_PROCEDURE,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { ColumnKey, PurchasingPlanModel } from "models/PurchasingPlan";

const BiddingPackageInformation = ({
  isDetail = false,
  contextValue,
}: {
  isDetail?: boolean;
  contextValue: PurchasingPlanModel;
}) => {
  const { translate, model, handleChangeSelectField, dispatchModel } =
    contextValue;

  const items = [
    {
      key: "1",
      columnKey: ColumnKey.RELEASE_DAYS,
      label: translate("PL.bidding.title.bidding_package_release_time"),
    },
    {
      key: "2",
      columnKey: ColumnKey.OPEN_BID_DAYS,
      label: translate("PL.bidding.title.bidding_package_opening_time"),
    },
    {
      key: "3",
      columnKey: ColumnKey.BID_START_DAYS,
      label: translate("PL.bidding.title.bidding_package_start_time"),
    },
    {
      key: "4",
      columnKey: ColumnKey.EVALUATE_START_DAYS,
      label: translate("PL.bidding.title.bidding_package_evaluation_time"),
    },
    {
      key: "5",
      columnKey: ColumnKey.BID_END_DAYS,
      label: translate("PL.bidding.title.bidding_package_end_time"),
    },
    {
      key: "6",
      columnKey: ColumnKey.EVALUATE_END_DAYS,
      label: translate("PL.bidding.title.bidding_package_finish_time"),
    },
  ];

  return (
    <div>
      <div className="bidding-package-information">
        <Row className={classNames("align-center")} align="middle" gutter={184}>
          {items.map((item) => {
            return (
              <BiddingDayByKey
                key={item.key}
                columnKey={item.columnKey}
                model={model}
                label={item.label}
                isDetail={isDetail}
                dispatchModel={dispatchModel}
              />
            );
          })}
        </Row>
      </div>
      <Row gutter={12} className="mt-3">
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "tenderRequests.biddingMethod"
            )}
          >
            <Select
              label={translate("PL.bidding.title.bidding_method")}
              isRequired={true}
              placeHolder={translate("PL.bidding.placeholder.bidding_method")}
              isSmall={false}
              className="flex-2"
              value={model?.biddingMethodType}
              isEnumerable={false}
              classFilter={CommonFilter}
              getList={() => of(PURCHASING_PLAN_BIDDING_METHOD)}
              onChange={handleChangeSelectField({
                fieldName: "biddingMethodType",
              })}
              readOnly={isDetail}
              appendToBody
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "tenderRequests.biddingProcedure"
            )}
          >
            <Select
              label={translate("PL.bidding.title.bidding_procedure")}
              isRequired={true}
              placeHolder={translate(
                "PL.bidding.placeholder.bidding_procedure"
              )}
              isSmall={false}
              className="flex-2"
              value={model?.biddingProcedureType}
              isEnumerable={false}
              classFilter={CommonFilter}
              getList={() => of(PURCHASING_PLAN_BIDDING_PROCEDURE)}
              onChange={handleChangeSelectField({
                fieldName: "biddingProcedureType",
              })}
              readOnly={isDetail}
              appendToBody
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default BiddingPackageInformation;
