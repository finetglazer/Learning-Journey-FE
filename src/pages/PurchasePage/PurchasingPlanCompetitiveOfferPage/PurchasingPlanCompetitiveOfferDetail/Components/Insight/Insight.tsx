import React from "react";
import { Col, Row, Tooltip } from "antd";
import styles from "./Insight.module.scss";
import classNames from "classnames";
import { ContentInfoModel } from "models/ContractAdjustment";
import { Tag } from "react-components-design-system";

type props = {
  content: ContentInfoModel[];
};
const Insight = ({ content }: props) => {
  return (
    <div>
      <Row gutter={[24, 16]}>
        {content?.map((item, index) => (
          <Col
            span={item?.colSpan}
            key={index}
            className={classNames("pb-3", {
              [styles["border_custom"]]: !item?.isNotBorder,
            })}
          >
            {item?.isShow && (
              <div className="d-flex flex-column">
                <div className={`${styles["label"]}`}>{item?.label}</div>
                <div className={`${styles["limited-text"]} fw-medium d-flex`}>
                  {item?.isLink ? (
                    <div
                      onClick={item?.onClick}
                      style={{ cursor: "pointer" }}
                      className={`${styles["blue"]}`}
                    >
                      <Tooltip
                        placement="top"
                        title={item?.valueTooltip ?? item?.value}
                      >
                        <span className="text_blue text-truncate">
                          {item?.value}
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    <Tooltip placement="top" title={item?.value}>
                      <span>{item?.value}</span>
                    </Tooltip>
                  )}
                  {item?.isShowTag && (
                    <div className="d-flex align-center m-l--2xs">
                      <Tag
                        size="sm"
                        value={item?.textTag}
                        isShowDot={false}
                        isShowBorder={true}
                        backgroundColor={"#F4F5F7"}
                        color={"#5E6C84"}
                        colorBorder={"#B3BAC5"}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Insight;
