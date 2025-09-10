import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { gt } from "lodash";
import { Fragment, useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import AdvanceFilter from "./AdvanceFilter";
import {
  PurchaseRequestWaitingForPlanContext,
  PurchaseRequestWaitingForPlanContextType,
} from "./PurchaseRequestWaitingForPlanHook";

const ICON_SIZE = 16;
const TAG_BG_COLOR = "#FFD4BC";
const TAG_TEXT_COLOR = "#0C2042";

const ActionsBar = () => {
  const buttonFilterRef = useRef<HTMLDivElement>(null);

  const {
    translate,
    modelFilter,
    countFilter,
    onSearchingPaymentRequest,
    handleResetList,
  } = useContext<PurchaseRequestWaitingForPlanContextType>(
    PurchaseRequestWaitingForPlanContext
  );

  return (
    <Fragment>
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

      <div className="search_input_wrapper">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
          value={modelFilter?.search}
          placeHolder={translate(
            "PL.purchase_request_waiting_for_plan_search_input_placeholder"
          )}
          onChange={onSearchingPaymentRequest}
          type={numberConstants.ONE}
          isSmall
        />
      </div>

      <div className="filter_wrapper">
        <Dropdown
          dropdownRender={() => (
            <AdvanceFilter
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

export default ActionsBar;
