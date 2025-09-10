import type { CollapseProps } from "antd";
import { ArrowSquareOutIcon, IcEmptySearchSvg } from "assets/icons";
import { AdvancedCollapseView } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { isEmpty } from "lodash";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import useReport from "../hooks/useReport";
import styles from "./CollapseResultReport.module.scss";

interface ResultReportProps
  extends Pick<ReturnType<typeof useReport>, "modelFilter" | "isShowResult"> {
  items: CollapseProps["items"];
  isShowUnit?: boolean;
  onExport: () => void;
  loadingExport?: boolean;
  isEmptyError?: boolean;
}

export default function CollapseResultReport({
  items,
  isShowResult,
  onExport,
  loadingExport,
  isEmptyError = true,
}: ResultReportProps) {
  const [translate] = useTranslation();

  const hasData = !isEmpty(items) && items.some((item) => item.children);

  return (
    <>
      {isShowResult && (
        <div className={styles["collapse-result-report"]}>
          <div className="d-flex justify-content-between align-items-center px-3">
            {isEmptyError && (
              <h6 className={styles["title"]}>
                {translate("report.txt_result")}
              </h6>
            )}
            {hasData && (
              <Button
                loading={loadingExport}
                type="secondary"
                iconPlace="left"
                icon={
                  <img src={ArrowSquareOutIcon} alt="" height={16} width={16} />
                }
                onClick={onExport}
              >
                {translate("report.txt_export")}
              </Button>
            )}
          </div>

          {!hasData ? (
            <EmptyItemTable
              content={translate("CM.txt_search_no_data")}
              containerClassName="flex-column border-0 bg-white"
              icon={
                <img src={IcEmptySearchSvg} alt="" width={200} height={200} />
              }
            />
          ) : (
            <AdvancedCollapseView items={items} />
          )}
        </div>
      )}
    </>
  );
}
