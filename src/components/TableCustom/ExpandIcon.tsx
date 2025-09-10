import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { isEmpty } from "lodash";
import { RenderExpandIconProps } from "rc-table/lib/interface";
import { ReactNode } from "react";
import styles from "./ExpandIcon.module.scss";

type ExpandIconProps<T> = RenderExpandIconProps<T> & {
  renderTitleExpandable: (
    params: Pick<RenderExpandIconProps<T>, "expandable" | "record" | "expanded">
  ) => ReactNode;
  renderCondition?: (
    params: Pick<RenderExpandIconProps<T>, "expandable" | "record" | "expanded">
  ) => boolean;
  className?: string;
  iconClassName?: string;
};

function ExpandIcon<T>({
  expanded,
  expandable,
  record,
  renderCondition,
  onExpand,
  className,
  iconClassName,
  renderTitleExpandable,
}: ExpandIconProps<T>) {
  if (isEmpty(expandable)) return null;

  if (renderCondition({ expanded, expandable, record })) {
    return (
      <div className={styles["header-expand"]}>
        {renderTitleExpandable({ expanded, expandable, record })}
      </div>
    );
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    onExpand(record, e);
  };

  return (
    <div
      onClick={handleClick}
      className={classNames(
        styles["collapse-button"],
        {
          [styles["collapse-button--expandable"]]: expanded,
        },
        className
      )}
    >
      <div
        className={classNames(styles["collapse-button__icon"], iconClassName)}
      >
        <img
          src={IcArrowDown}
          alt=""
          width={ICON_SIZE_SMALL}
          height={ICON_SIZE_SMALL}
        />
      </div>
      <div className={styles["collapse-button__label"]}>
        {renderTitleExpandable({ expanded, expandable, record })}
      </div>
    </div>
  );
}

export { ExpandIcon };
