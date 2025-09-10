import { ReactNode } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./FilterReport.scss";

interface FilterReportProps {
  children?: ReactNode;
  onReset: () => void;
  onFilter: () => void;
  isDisabled?: boolean;
}

export default function FilterReport({
  children,
  onReset,
  onFilter,
  isDisabled,
}: FilterReportProps) {
  const [translate] = useTranslation();

  return (
    <div className="filter-report">
      <div className="form-container">{children}</div>
      <div className="action">
        <Button type="text" onClick={onReset}>
          {translate("CM.btn_reset")}
        </Button>
        <Button type="primary" onClick={onFilter} disabled={isDisabled}>
          {translate("CM.btn_apply")}
        </Button>
      </div>
    </div>
  );
}

export type { FilterReportProps };
