import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { gt } from "lodash";
import {
  LogTrackingContext,
  LogTrackingContextType,
} from "pages/LogTrackingPage/LogTrackingHook";
import { Fragment, useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import LogAdvanceFilter from "./LogAdvanceFilter";
import "./LogTrackingMasterContent.scss";

const ICON_SIZE = 16;
const TAG_BG_COLOR = "#FFD4BC";
const TAG_TEXT_COLOR = "#0C2042";

const LogTrackingActions = () => {
  const buttonFilterRef = useRef<HTMLDivElement>(null);

  const {
    translate,
    modelFilter,
    countFilter,
    onSearchingLogs,
    handleResetList,
  } = useContext<LogTrackingContextType>(LogTrackingContext);

  return (
    <Fragment>
      <div className="search_input_wrapper">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
          value={modelFilter?.search}
          placeHolder={translate("Search by message or request key")}
          onChange={onSearchingLogs}
          type={numberConstants.ONE}
          isSmall
        />
      </div>

      <div className="filter_wrapper">
        {gt(countFilter, numberConstants.ZERO) && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            backgroundColor={TAG_BG_COLOR}
            color={TAG_TEXT_COLOR}
            className="tag__container"
            isShowDot={false}
          />
        )}

        <Dropdown
          dropdownRender={() => (
            <LogAdvanceFilter
              setVisible={() => {
                buttonFilterRef?.current?.click();
              }}
            />
          )}
          trigger={["click"]}
        >
          <div ref={buttonFilterRef}>
            <Button
              type="tertiary"
              size="lg"
              icon={<FilterIcon />}
              isUseStrokeSvg
              iconPlace="left"
            >
              {translate("CM.btn_filter")}
            </Button>
          </div>
        </Dropdown>
      </div>
    </Fragment>
  );
};

export default LogTrackingActions;
