import { emptyCloudIcon } from "assets/icons";
import {
  EmptyItemTable,
  EmptyItemTableProps,
} from "components/EmptyItem/EmptyItem";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface CloudyEmptyProps extends Omit<EmptyItemTableProps, "content"> {
  content?: ReactNode;
}

export default function CloudyEmpty({
  content,
  children,
  ...props
}: CloudyEmptyProps) {
  const [translate] = useTranslation();

  return (
    <EmptyItemTable
      icon={<img src={emptyCloudIcon} alt="" />}
      content={
        content ||
        translate("PM.payment_advance_payment_application_content_empty")
      }
      {...props}
    >
      {children}
    </EmptyItemTable>
  );
}
