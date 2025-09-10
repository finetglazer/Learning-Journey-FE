import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual } from "lodash";
import React from "react";
import { OneLineText } from "react-components-design-system";
import styles from "./TablePricesQuote.module.scss";
import { Tooltip } from "antd";

interface Data {
  key: string;
  label: React.ReactNode;
  primaryText?: string | number;
  secondaryText?: string | number;
  primarySubText?: string;
  secondarySubText: string;
}

interface Props {
  data: Data[];
}

interface ValuesType {
  text: string | number;
  subText: string;
}

interface StylesType {
  primaryText: string;
  secondaryText: string;
  primarySubText: string;
  secondarySubText: string;
}

const TwoLineTextCustom = ({
  values,
  styles: styleClasses,
}: {
  values: ValuesType[];
  styles: StylesType;
}) => {
  return (
    <>
      {values.map(
        (line, index) =>
          (line.text || isEqual(line?.text, 0)) && (
            <div key={index} className="d-flex align-items-center gap-1">
              <OneLineText
                useTooltip={false}
                className={
                  index === 0
                    ? styleClasses.primaryText
                    : styleClasses.secondaryText
                }
                value={formatNumber(line.text)}
              />
              <p
                className={`${
                  index === 0
                    ? styleClasses.primarySubText
                    : styleClasses.secondarySubText
                } m-0`}
              >
                {line.subText}
              </p>
            </div>
          )
      )}
    </>
  );
};

const TablePricesQuote = ({ data }: Props) => {
  return (
    <div className={styles["information_quote"]}>
      <div className={styles["information_quote-row"]}>
        {!isEmpty(data)
          ? data?.map((item) => (
              <div key={item?.key} className={styles["cell"]}>
                <Tooltip
                  placement={"topLeft"}
                  overlay={
                    <div>
                      <div>{item?.label}</div>
                      <div>
                        {formatNumber(item?.primaryText) +
                          " " +
                          formatNumber(item?.primarySubText)}
                      </div>
                      <div>
                        {formatNumber(item?.secondaryText) +
                          " " +
                          formatNumber(item?.secondarySubText)}
                      </div>
                    </div>
                  }
                >
                  <>
                    <h5 className={styles["information_quote_title"]}>
                      {item?.label}
                    </h5>
                    <TwoLineTextCustom
                      values={[
                        {
                          text: item?.primaryText,
                          subText: item?.primarySubText,
                        },
                        {
                          text: item?.secondaryText,
                          subText: item?.secondarySubText,
                        },
                      ]}
                      styles={{
                        primaryText: styles["text-first_money"],
                        secondaryText: styles["text-second_money"],
                        primarySubText: styles["sub-value_first"],
                        secondarySubText: styles["sub-value_second"],
                      }}
                    />
                  </>
                </Tooltip>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default TablePricesQuote;
