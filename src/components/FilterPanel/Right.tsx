import { Col } from "antd";
import { PropsWithChildren } from "react";

const Right = (
  props: PropsWithChildren<{ lg?: number; hasLeft?: boolean }>
) => {
  const { children, hasLeft = true, lg = 20 } = props;

  return (
    <Col lg={hasLeft ? lg : 24} className="filter-panel__right">
      <div className="filter-panel__right-children">{children}</div>
    </Col>
  );
};

export default Right;
