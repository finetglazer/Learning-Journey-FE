import { CollapseProps } from "antd/lib/collapse";
import { Collapse } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { useMemo } from "react";
import styles from "./AdvancedCollapseView.module.scss";

type AdvancedCollapseItem = CollapseProps["items"][number] & {
  rightTitle?: string;
};

interface AdvancedCollapseViewItemProps extends Omit<CollapseProps, "items"> {
  isFullView?: boolean;
  showAll?: boolean;
  items?: AdvancedCollapseItem[];
}

const AdvancedCollapseView = ({
  items,
  defaultActiveKey: defaultActive,
  ghost = true,
  isFullView,
  showAll = true,
  rootClassName,
  ...props
}: AdvancedCollapseViewItemProps) => {
  const defaultActiveKey = useMemo(() => {
    if (showAll) {
      return items?.map((item) => item?.key);
    }
    return defaultActive;
  }, [defaultActive, items, showAll]);

  const enhancedItems = () => {
    return items?.map((item) => ({
      ...item,
      label: (
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="flex-grow-1">{item?.label}</span>
          {Boolean(item?.rightTitle) && (
            <span className={styles["item-right-title"]}>
              {item.rightTitle}
            </span>
          )}
        </div>
      ),
    }));
  };

  return (
    <Collapse
      defaultActiveKey={defaultActiveKey}
      items={enhancedItems()}
      expandIcon={({ isActive }) => (
        <div
          className={classNames(styles["collapse-icon"], {
            [styles["collapse-icon--expend"]]: isActive,
          })}
        >
          <img src={IcArrowDown} alt="" width={10} height={5} />
        </div>
      )}
      rootClassName={classNames(
        styles["collapse-container"],
        {
          [styles["collapse-container--border"]]: !isFullView,
          [styles["collapse-container--full"]]: isFullView,
        },
        rootClassName
      )}
      ghost={ghost}
      {...props}
    />
  );
};

export default AdvancedCollapseView;
