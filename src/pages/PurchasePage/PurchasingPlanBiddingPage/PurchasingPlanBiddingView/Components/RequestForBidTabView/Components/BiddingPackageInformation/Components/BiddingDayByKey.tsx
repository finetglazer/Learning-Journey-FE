import { Col, Row } from "antd";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { isNumber } from "lodash";
import {
  ColumnKey,
  getValueInModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import { ReactNode, useCallback, useMemo } from "react";
import { FormItem, InputNumber } from "react-components-design-system";
import { useTranslation } from "react-i18next";

type Props = {
  label?: ReactNode | string;
  columnKey?: ColumnKey | string;
  columnKeyParent?: ColumnKey | string;
  className?: string;
  isDetail?: boolean;
  model?: PurchasingPlanTypeModel;
  value?: number;
};

const BiddingDayByKey = ({
  label = "",
  columnKey,
  columnKeyParent = ColumnKey.TENDER_REQUESTS,
  className,
  isDetail = false,
  model,
  value,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <Col span={12} className={classNames("align-center mt-2", className)}>
      <Row align="middle">
        <Col span={18}>{label}</Col>
        <Col span={6}>
          <Row align="middle" justify="end" gutter={12}>
            <Col>+</Col>
            <Col>
              <FormItem
                isTableCell
                placeRight={true}
                validateObject={utilService.getValidateObj(
                  model,
                  `${columnKeyParent}.${columnKey}`
                )}
              >
                <InputNumber
                  allowClear={false}
                  isSmall={true}
                  placeHolder="--"
                  className="input-day"
                  max={1000}
                  min={0}
                  allowNegative={false}
                  readOnly={isDetail}
                  value={value}
                />
              </FormItem>
            </Col>
            <Col>{translate("PL.bidding.title.unit_day")}</Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default BiddingDayByKey;
