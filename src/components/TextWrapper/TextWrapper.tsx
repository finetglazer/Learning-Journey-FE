import { ReactNode } from "react";
import classNames from "classnames";
import styles from "./TextWrapper.module.scss";

interface TextWrapperProps {
  children: ReactNode;
  className?: string;
}
const TextWrapper = ({ children, className }: TextWrapperProps) => {
  return (
    <span className={classNames(styles["text-wrapper"], className)}>
      {children}
    </span>
  );
};

export default TextWrapper;
