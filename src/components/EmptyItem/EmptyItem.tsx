import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./EmptyItem.module.scss";

interface EmptyItemTableProps {
  children?: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  containerClassName?: string;
  className?: string;
}

const EmptyItemTable = ({
  content,
  icon,
  children,
  className,
  containerClassName,
}: EmptyItemTableProps) => {
  return (
    <div className={classNames(styles["empty-container"], containerClassName)}>
      {icon}
      <div className={classNames(styles["empty-content"], className)}>
        <div>{content}</div>
        {children}
      </div>
    </div>
  );
};

export { EmptyItemTable };

export type { EmptyItemTableProps };
