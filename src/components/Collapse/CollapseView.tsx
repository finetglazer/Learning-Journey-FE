import { CollapseProps } from "antd/lib/collapse";
import { CSSProperties, ReactNode, useMemo } from "react";

import { Collapse } from "antd";
import { ExpandIconPosition } from "antd/lib/collapse/Collapse";
import { CollapsibleType } from "antd/lib/collapse/CollapsePanel";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { isNil } from "lodash";
import "./CollapseView.scss";

export interface CollapseItem {
  key: string;
  label: string | ReactNode;
  children: ReactNode;
}

interface PanelProps {
  isActive?: boolean;
  header?: ReactNode;
  className?: string;
  style?: CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  extra?: ReactNode;
  collapsible?: CollapsibleType;
}

interface CollapseViewProps {
  items: CollapseItem[];
  defaultActiveKey?: string | number | (string | number)[];
  className?: string;
  expandIconPosition?: ExpandIconPosition;
  expandIcon?: (panelProps: PanelProps) => ReactNode;
  isShowTopDivider?: boolean;
}

const CollapseView = ({
  items,
  defaultActiveKey,
  className,
  expandIconPosition = "end",
  expandIcon,
  isShowTopDivider = true,
}: CollapseViewProps) => {
  // Items
  const collapseItems: CollapseProps["items"] = useMemo(() => {
    return items.map((item) => {
      return {
        key: item.key,
        label: <div className="collapse__header-title">{item.label}</div>,
        children: item.children,
      };
    });
  }, [items]);

  const handleExpandIcon = ({ isActive }: PanelProps) => (
    <div>
      <img
        src={IcArrowDown}
        alt=""
        className="collapse__expend-icon"
        style={{ transform: isActive ? "rotate(180deg)" : "" }}
      />
    </div>
  );

  return (
    <Collapse
      ghost
      className={classNames("collapse__container", className)}
      defaultActiveKey={defaultActiveKey}
      prefixCls={isShowTopDivider ? "" : "ant-collapse-header"}
      items={collapseItems}
      expandIconPosition={expandIconPosition}
      expandIcon={isNil(expandIcon) ? handleExpandIcon : expandIcon}
    />
  );
};

export default CollapseView;
