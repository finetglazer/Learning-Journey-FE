import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import { Dayjs } from "dayjs";
import React, { useContext } from "react";
import {
  DateRangePicker,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ModalSelectPurchaseRequest.scss";
import {
  ProposalModal,
  ProposalModalContext,
} from "./ModalSelectPurchaseRequestHook";
import { fieldType, NUMBER_MAX_13 } from "config/const";

const Header = () => {
  const [translate] = useTranslation();
  const { modelFilter, dispatchFilter, handleLoadList } =
    useContext<ProposalModal>(ProposalModalContext);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = (search || "").replace(/\s+/g, " ").trim();
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const { run: handleChangeDateRangeFilter } = useDebounceFn(
    (value: [Dayjs, Dayjs]) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          createdDateRange: value,
          pageIndex: 1,
        },
      });

      handleLoadList({
        ...modelFilter,
        createdDateRange: value,
        pageIndex: 1,
      });
    },
    {
      wait: 300,
    }
  );

  const { run: handleChangeInputFilter } = useDebounceFn(
    (field: { fieldName: string; value: number }) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          [field.fieldName]: field.value,
          pageIndex: 1,
        },
      });
      handleLoadList({
        ...modelFilter,
        [field.fieldName]: field.value,
        pageIndex: 1,
      });
    },
    {
      wait: 300,
    }
  );

  return (
    <div className="search-bar-purchasing-plan-proposal d-flex gap-x--sm pl">
      <div className="flex-1">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
          value={modelFilter.search}
          placeHolder={translate("PL.purchasing_plan_enter_code_or_name")}
          onChange={run}
          isSmall={false}
          label={translate("PR.search")}
        />
      </div>
      <div className="pl-w-496">
        <div className="d-flex align-items-end">
          <InputNumber
            isSmall={false}
            value={modelFilter?.totalRangeFrom}
            label={translate("PP.filter_label_total_range")}
            placeHolder={translate("PP.filter_plh_from")}
            numberType={fieldType.DECIMAL}
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
            onChange={(value) => {
              handleChangeInputFilter({
                fieldName: "totalRangeFrom",
                value,
              });
            }}
          />
          <div className="separate__item_purchase_plan">-</div>
          <InputNumber
            isSmall={false}
            value={modelFilter?.totalRangeTo}
            label={undefined}
            placeHolder={translate("PP.filter_plh_to")}
            numberType={fieldType.DECIMAL}
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
            onChange={(value) => {
              handleChangeInputFilter({
                fieldName: "totalRangeTo",
                value,
              });
            }}
          />
        </div>
      </div>
      <div className="pl-w-240">
        <DateRangePicker
          className="pl-overide_range__picker"
          value={modelFilter.createdDateRange || [null, null]}
          onChange={(value) => {
            handleChangeDateRangeFilter(value);
          }}
          label={translate("PR.filter_label_time_created")}
          isSmall={false}
          placeholder={[
            translate("PM.payment_date_from_input_label"),
            translate("PM.payment_date_to_input_label"),
          ]}
        />
      </div>
    </div>
  );
};

export default Header;
