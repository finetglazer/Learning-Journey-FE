import classNames from "classnames";
import { AnchorHTMLAttributes } from "react";
import { OneLineText } from "react-components-design-system";
import { NavLink } from "react-router-dom";

interface TicketCodeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  content: string;
  contentClassName?: string;
}

const TicketCode = ({
  content,
  className,
  contentClassName,
  href,
  ...props
}: TicketCodeProps) => {
  return (
    <NavLink
      to={href}
      className={classNames("text-decoration-none w-100", className)}
      {...props}
    >
      <OneLineText
        className={classNames("text-table-content-primary", contentClassName)}
        value={content}
      />
    </NavLink>
  );
};

export default TicketCode;
