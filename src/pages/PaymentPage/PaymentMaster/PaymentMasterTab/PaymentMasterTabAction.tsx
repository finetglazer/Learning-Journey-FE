import { Dropdown } from "antd";
import React, { useContext } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import MasterAdvanceFilter from "./PaymentMasterTabAdvanceFilter";

import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/images";
import CaretDown from "assets/images/CaretDown.png";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { isNil } from "lodash";
import { TYPE_OF_PAYMENT_TYPE } from "models/Payment";
import { PaymentMaster, PaymentMasterContext } from "../PaymentMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

const PaymentMasterAction = () => {
  const appUserMaster = useContext<PaymentMaster>(PaymentMasterContext);
  const {
    list,
    modelFilter,
    countFilter,
    tabRepositories,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handlePressAdd,
  } = appUserMaster;

  const [translate] = useTranslation();
  const buttonRef = React.useRef(null);

  const buttonAddRef = React.useRef(null);

  const onPressAdd = (type: keyof typeof TYPE_OF_PAYMENT_TYPE) => {
    buttonRef.current.click();
    handlePressAdd(type);
  };

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
          // pageSize: 10,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const onPressTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tab: value,
        pageIndex: 1,
      },
    });
    handleLoadList({ tab: value, pageIndex: 1 });
  };

  const { validAction: validActionPayment } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST", "Payment");

  const { validAction: validActionPaymentAdvance } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST", "Advance");

  const { validAction: validActionExpenseProposal } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST", "PlanToSpend");

  const { validAction: validActionAccountingRequest } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST", "Accounting");

  const { validAction: validActionDeposit } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST", "Deposit");

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={tabRepositories}
            onClick={onPressTabFilter}
            value={modelFilter.tab ?? tabRepositories[0].value}
          />
        </div>
      </div>
      <div className="d-flex align-center gap-3">
        <div className="page-master__actions d-flex align-items-center">
          {countFilter > 0 && (
            <Tag
              value={translate("CM.tag_filter", { count: countFilter })}
              action={handleResetList}
              backgroundColor="#FFD4BC"
              color="#0c2042"
              className="tag__container m-r--xs"
              isShowDot={false}
            />
          )}
          <div className="w-300px m-r--xs">
            <InputText
              prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
              value={modelFilter.search}
              placeHolder={translate("BG.plh_search_coupon")}
              onChange={run}
              type={1}
              isSmall
            />
          </div>
          <Dropdown
            dropdownRender={() => (
              <MasterAdvanceFilter
                setVisible={() => {
                  buttonRef.current.click();
                }}
              />
            )}
            trigger={["click"]}
          >
            <div ref={buttonRef}>
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

        {(!isNil(list) || countFilter !== 0) &&
        (validActionPayment("CREATE") ||
          validActionPaymentAdvance("CREATE") ||
          validActionExpenseProposal("CREATE") ||
          validActionAccountingRequest("CREATE") ||
          validActionDeposit("CREATE")) ? (
          <Dropdown
            dropdownRender={() => (
              <div className="dropdown__content__create">
                {[
                  {
                    type: "PAYMENT",
                    text: "PM.txt_request_payment",
                    visible: validActionPayment("CREATE"),
                  },
                  {
                    type: "ADVANCE",
                    text: "PM.txt_request_an_advance",
                    visible: validActionPaymentAdvance("CREATE"),
                  },

                  {
                    type: "EXPENSE",
                    text: "PM.txt_request_expenditure",
                    visible: validActionExpenseProposal("CREATE"),
                  },
                  {
                    type: "ACCOUNTING_ENTRY",
                    text: "PM.txt_request_accounting",
                    visible: validActionAccountingRequest("CREATE"),
                  },
                ].map((item) =>
                  item.visible ? (
                    <div
                      key={item.type}
                      onClick={() =>
                        onPressAdd(
                          item.type as keyof typeof TYPE_OF_PAYMENT_TYPE
                        )
                      }
                      className="dropdown-item"
                    >
                      {translate(item.text)}
                    </div>
                  ) : null
                )}
              </div>
            )}
            trigger={["click"]}
          >
            <div ref={buttonAddRef}>
              <Button
                icon={<img src={CaretDown} alt="img" />}
                iconPlace="right"
                type="primary"
                size="lg"
              >
                {translate("PM.btn_add")}
              </Button>
            </div>
          </Dropdown>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default PaymentMasterAction;
