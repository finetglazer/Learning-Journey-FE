import { Row } from "antd";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import React, { PropsWithChildren, ReactNode } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./FilterPanel.scss";
import Left from "./Left";
import Right from "./Right";

type PanelComponentProps = PropsWithChildren<{
  lg?: number;
  hasLeft?: boolean;
}>;

interface FilterPanelProps {
  children?: ReactNode;
  width?: number;
  buttonFilterId?: string;
  handleResetFilter?: () => void;
  handleApplyFilter?: () => void;
  handleClearModelFilter?: () => void;
  handleToggleFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  titleButtonCancel?: string;
  titleButtonApply?: string;
  exceptNodeIds?: string[];
  modelFilter?: unknown;
  handleClickOutside: () => void;
  listIgnoreCountField?: string[];
  className?: string;
}

const TAB_KEY = "Tab";

const FilterPanel: React.FC<FilterPanelProps> & {
  Left: React.FC<PanelComponentProps>;
} & {
  Right: React.FC<PanelComponentProps>;
} = (props: FilterPanelProps) => {
  const { t } = useTranslation();
  const filterPanelRef = React.useRef();
  const {
    handleClearModelFilter,
    handleResetFilter,
    titleButtonCancel,
    handleApplyFilter,
    titleButtonApply,
    buttonFilterId,
    handleToggleFilter,
    exceptNodeIds,
    modelFilter,
    listIgnoreCountField = ["orderBy", "orderType", "tabKey", "search", "tab"],
    handleClickOutside,
    className,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_size, setSize] = React.useState<number>(0);

  const handleCloseFilter = React.useCallback(() => {
    if (typeof handleToggleFilter === "function") {
      handleToggleFilter(false);
    }
  }, [handleToggleFilter]);

  const exceptNodes = React.useMemo(() => {
    return exceptNodeIds ? exceptNodeIds : [];
  }, [exceptNodeIds]);

  React.useLayoutEffect(() => {
    const element = buttonFilterId
      ? (document.getElementById(buttonFilterId) as HTMLElement)
      : (document.querySelector(".btn-filter") as HTMLElement);
    function updateSize() {
      if (element) {
        setSize(element.offsetLeft);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [buttonFilterId]);

  utilService.useClickOutside(
    filterPanelRef,
    () => {
      handleCloseFilter();
      handleClickOutside();
    },
    [...exceptNodes, "ant-picker-panel-layout"]
  );

  const getDisableButton = () => {
    const count = utilService.countValuedField(
      modelFilter,
      listIgnoreCountField
    );
    return count === 0;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEqual(event.key, TAB_KEY)) {
      event.stopPropagation();
    }
  };

  return (
    <div
      className={classNames("filter-panel-container", className)}
      ref={filterPanelRef}
      onKeyDown={handleKeyDown}
    >
      <div className="filter-panel__wrapper" data-filter-direction="bottom">
        <Row className="filter-panel__content">{props.children}</Row>
        <div style={{}}></div>
        <Row className="filter-panel__actions d-flex align-items-center justify-content-end ">
          {!getDisableButton() && (
            <Button
              type="text"
              className="btn-close-filter m-r--2xs"
              onClick={handleResetFilter}
            >
              <span>{t("CM.btn_reset")}</span>
            </Button>
          )}

          <Button
            type="secondary"
            className="m-r--2xs"
            onClick={handleClearModelFilter}
          >
            <span>
              {titleButtonCancel ? titleButtonCancel : "Reset Filters"}
            </span>
          </Button>

          <Button type="primary" onClick={handleApplyFilter}>
            <span>{titleButtonApply ? titleButtonApply : "Apply Filters"}</span>
          </Button>
        </Row>
      </div>
    </div>
  );
};

FilterPanel.Left = Left;
FilterPanel.Right = Right;

export default FilterPanel;
