import { Col } from "antd";
import { PropsWithChildren } from "react";

const Left = (props: PropsWithChildren<{ lg?: number }>) => {
  const { lg = 4 } = props;
  return (
    <Col lg={lg} className="filter-panel__left p-l--sm">
      {props?.children}
    </Col>
  );
};

export default Left;
