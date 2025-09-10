import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import { Dayjs } from "dayjs";
import React, { useContext, useEffect } from "react";
import {
  DateRangePicker,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ProposalModal.scss";
import { ProposalModal, ProposalModalContext } from "./ProposalModalHook";
import appMessageService from "core/services/common-services/app-message-service";

const Header = () => {
  const [translate] = useTranslation();
  const { modelFilter, dispatchFilter, handleLoadList } =
    useContext<ProposalModal>(ProposalModalContext);
  const { notifyToast } = appMessageService.useCRUDMessage();

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

  const handleChangeDateRangeFilter = React.useCallback(
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
    [dispatchFilter, handleLoadList, modelFilter]
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
      wait: 500,
    }
  );

  useEffect(() => {
    if (modelFilter?.totalRangeFrom > modelFilter?.totalRangeTo) {
      notifyToast({
        type: "error",
        message: translate("CM.warning_total_range_filter_message"),
      });
    }
  }, [modelFilter?.totalRangeFrom, modelFilter?.totalRangeTo]);

  return (
    <div className="search-bar-proposal d-flex gap-x--sm">
      <div className="flex-6">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
          value={modelFilter.search}
          placeHolder={translate("PR.enter_policy_code_or_name")}
          onChange={run}
          isSmall={false}
          label={translate("PR.search")}
        />
      </div>
      <div className="flex-7">
        <div className="d-flex align-items-end">
          <InputNumber
            isSmall={false}
            value={modelFilter?.totalRangeFrom}
            label={translate("PP.filter_label_total_range")}
            placeHolder={translate("PP.filter_plh_from")}
            onChange={(value) => {
              handleChangeInputFilter({
                fieldName: "totalRangeFrom",
                value,
              });
            }}
          />
          <div className="separate__item">-</div>
          <InputNumber
            isSmall={false}
            value={modelFilter?.totalRangeTo}
            label={undefined}
            placeHolder={translate("PP.filter_plh_to")}
            onChange={(value) => {
              handleChangeInputFilter({
                fieldName: "totalRangeTo",
                value,
              });
            }}
          />
        </div>
      </div>
      <div className="flex-4">
        <DateRangePicker
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
