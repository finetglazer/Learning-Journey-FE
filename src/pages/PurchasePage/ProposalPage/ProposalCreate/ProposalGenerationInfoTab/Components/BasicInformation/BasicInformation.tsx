import { Col, Row, Tooltip } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { LIST_TYPE_PROPOSAL } from "config/const";
import { DEFAULT_DATETIME_VALUE } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isEmpty, isEqual } from "lodash";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import BasicInformationDetail from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/BasicInformationDetail/BasicInformationDetail";
import { FundamentalWrap } from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/FundamentalInfoDetail/FundamentalInfoDetail";
import React, { useContext, useState } from "react";
import {
  DatePicker,
  DateRangePicker,
  FormItem,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import "./BasicInformation.scss";
import ProcurementPurpose from "./Components/ProcurementPurpose";
import TotalProposal from "./Components/TotalProposal";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import OutlinedInfoIcon from "assets/icons/Common/OutlinedInfoIcon";
import CommonFilter from "models/CommonFilter";

const BasicInformation = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const {
    model,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    handleChangeMultipleSelectField,
    handleClickOriginalCode,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  const isDirectPayment = isEqual(model?.type?.id, LIST_TYPE_PROPOSAL[1].id);

  if (model.isDetail) return <BasicInformationDetail />;

  return (
    <div className="proposal_basic_info_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PP.general_information")}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="body">
          {model?.isAdjust && (
            <Row gutter={16}>
              <Col span={8}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    handleClickOriginalCode(model?.originalPurchaseProposalId);
                  }}
                >
                  <InputText
                    label={translate("PP.original_code")}
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "name",
                    })}
                    value={model?.originalCode}
                    readOnly
                    className="proposal_code"
                  />
                </div>
              </Col>
              <Col span={16}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "description"
                  )}
                >
                  <InputText
                    label={translate("PP.adjust_description_proposal")}
                    placeHolder={translate("PP.description_proposal_adjust")}
                    isRequired
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "description",
                    })}
                    value={model.description}
                    maxLength={500}
                    translate={translate}
                  />
                </FormItem>
              </Col>
            </Row>
          )}
          <div className="item_row">
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(model, "type")}
              >
                <Select
                  isRequired
                  label={translate("PP.proposal_type")}
                  placeHolder={translate("PP.select_proposal_type")}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch={false}
                  getList={() => of(LIST_TYPE_PROPOSAL)}
                  onChange={handleChangeSelectField({
                    fieldName: "type",
                  })}
                  value={model.type}
                  readOnly={
                    model.isAdjust || !isEmpty(model?.selectedListGoodsServices)
                  }
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(model, "startDate")}
              >
                <FormItem
                  validateObject={utilService.getValidateObj(model, "endDate")}
                >
                  <DateRangePicker
                    allowEmpty={[true, true]}
                    value={model.startDate || [null, null]}
                    onChange={handleChangeDateField({
                      fieldName: "startDate",
                    })}
                    label={translate("PP.implementation_time")}
                    isSmall={false}
                    isRequired={true}
                    placeholder={[
                      translate("PM.payment_date_from_input_label"),
                      translate("PM.payment_date_to_input_label"),
                    ]}
                  />
                </FormItem>
              </FormItem>
            </div>
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "receivedDate"
                )}
              >
                <DatePicker
                  label={translate("PP.expected_receipt_date")}
                  value={model.receivedDate}
                  placeholder={"dd/mm/yyyy"}
                  isSmall={false}
                  size={"middle"}
                  onChange={handleChangeDateField({
                    fieldName: "receivedDate",
                  })}
                  minDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                />
              </FormItem>
            </div>
          </div>
          <React.Fragment>
            <FundamentalWrap isShow={isDirectPayment} />
          </React.Fragment>
          <div>
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                label={
                  model.isAdjust
                    ? translate("PP.adjustment_name")
                    : translate("PP.proposal_name")
                }
                placeHolder={
                  model.isAdjust
                    ? translate("PP.enter_adjustment_name")
                    : translate("PP.enter_proposal_name")
                }
                isRequired
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
                value={model.name}
                maxLength={500}
                translate={translate}
              />
            </FormItem>
          </div>

          <Row gutter={16}>
            <Col span={16}>
              <InputText
                label={translate("PP.proposal_description")}
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: !model?.isAdjust
                    ? "description"
                    : "originalDescription",
                })}
                placeHolder={translate("PP.enter_description")}
                value={
                  !model?.isAdjust
                    ? model.description
                    : model.originalDescription
                }
                maxLength={!model?.isAdjust ? 500 : 1000}
                translate={translate}
              />
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "positionApproveId"
                )}
              >
                {!model?.isAdjust && (
                  <MultipleSelect
                    label={translate("PP.backup_use_approver")}
                    placeHolder={translate("PP.select_approval")}
                    isRequired
                    values={model.positionApproves || []}
                    isUsingSearch
                    valueFilter={{
                      name: "",
                    }}
                    searchType=""
                    getList={proposalRepository.approvalPosition}
                    isSmall={false}
                    classFilter={CommonFilter}
                    isEnumerable={false}
                    onChange={handleChangeMultipleSelectField({
                      fieldName: "positionApproves",
                      errorName: "positionApproveId",
                    })}
                    render={(item) => `${item?.code} - ${item?.name}`}
                    action={{
                      name: (
                        <Tooltip
                          title={translate("PP.information_position_approved")}
                        >
                          <div>
                            <OutlinedInfoIcon />
                          </div>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
                {model?.isAdjust && (
                  <Select
                    label={translate("PP.backup_use_approver")}
                    placeHolder={translate("PP.select_approval")}
                    isRequired
                    value={model.positionApprove}
                    isSearch
                    valueFilter={{
                      name: "",
                      originalPurchaseProposalId:
                        model?.originalPurchaseProposalId,
                    }}
                    searchType=""
                    getList={proposalRepository.approvalPositionForAdjust}
                    isSmall={false}
                    classFilter={CommonFilter}
                    isEnumerable={false}
                    onChange={handleChangeSelectField({
                      fieldName: "positionApprove",
                      errorName: "positionApproveId",
                    })}
                    render={(item) =>
                      item && item.code && item.name
                        ? `${item.code} - ${item.name}`
                        : ""
                    }
                    action={{
                      name: (
                        <Tooltip
                          title={translate("PP.information_position_approved")}
                        >
                          <div>
                            <OutlinedInfoIcon />
                          </div>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {model?.isAdjust && <TotalProposal />}
          <ProcurementPurpose />
          <div className="item_row">
            <div className="flex-1">
              <InputText
                label={translate("PP.user_create")}
                isSmall={false}
                value={
                  !isEmpty(model.user)
                    ? `${model.user?.email} - ${model.user?.name}`
                    : "---"
                }
                readOnly
              />
            </div>
            <div className="flex-1">
              <InputText
                label={translate("PP.creating_unit")}
                isSmall={false}
                value={model?.organization?.name || "---"}
                readOnly
              />
            </div>
            <div className="flex-1">
              <InputText
                label={translate("PP.position")}
                isSmall={false}
                value={model?.position?.name || "---"}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformation;
