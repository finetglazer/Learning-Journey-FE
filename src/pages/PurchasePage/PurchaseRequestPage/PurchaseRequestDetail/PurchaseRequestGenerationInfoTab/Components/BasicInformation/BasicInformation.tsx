import { Col, Row } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { LIST_TYPE_PURCHASE_FROM } from "config/const";
import { DEFAULT_DATETIME_VALUE } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import CommonFilter from "models/CommonFilter";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import BasicInformationView from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestView/Components/BasicInformationView/BasicInformationView";
import { useContext, useState } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./BasicInformation.scss";

const BasicInformation = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeAllField,
    handleClickOriginalCode,
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  if (model.isDetail) return <BasicInformationView />;
  return (
    <div className="purchase_request_basic_info_wrapper ">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PR.basic_info")}</div>
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
              <Col span={16}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "description"
                  )}
                >
                  <InputText
                    label={translate(
                      "PR.adjusted_description_purchasing_requirements"
                    )}
                    placeHolder={translate(
                      "PR.adjusted_description_purchasing_requirements"
                    )}
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
              <Col span={8}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    handleClickOriginalCode(model?.originalPurchaseRequestId);
                  }}
                >
                  <InputText
                    label={translate(
                      "PR.originaled_purchasing_requirements_code"
                    )}
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "name",
                    })}
                    value={model?.originalPurchaseRequestCode}
                    readOnly
                    className="purchase_request_code"
                  />
                </div>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={16}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  label={translate("PR.request_name")}
                  placeHolder={translate("PR.enter_request_name")}
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
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "expectedReceiveDate"
                )}
              >
                <DatePicker
                  label={translate("PP.expected_receipt_date")}
                  value={
                    model?.expectedReceiveDate
                      ? dayjs(model.expectedReceiveDate)
                      : undefined
                  }
                  placeholder={"dd/mm/yyyy"}
                  isSmall={false}
                  size={"middle"}
                  onChange={handleChangeDateField({
                    fieldName: "expectedReceiveDate",
                  })}
                  minDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "purchasingMethod"
                )}
              >
                <Select
                  isRequired
                  label={translate("PR.purchase_form")}
                  placeHolder={translate("PR.select_purchase_form")}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch={false}
                  getList={() => of(LIST_TYPE_PURCHASE_FROM)}
                  onChange={(_, value) => {
                    handleChangeAllField({
                      ...model,
                      purchasingMethod: value,
                      purchaseOrganization: null,
                      errors: {
                        ...model.errors,
                        purchaseOrganization: null,
                        purchasingMethod: null,
                      },
                    });
                  }}
                  value={model.purchasingMethod}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "purchaseOrganizationId"
                )}
              >
                <Select
                  disabled={!model.purchasingMethod}
                  label={translate("PR.filter_purchase_purchase_unit")}
                  placeHolder={translate("PR.filter_plh_enter_purchase_unit")}
                  value={model.purchaseOrganization}
                  getList={(filter) =>
                    contractRepository.getListOrganization({
                      name: filter?.name?.contain?.trim(),
                      purchasingMethod: model.purchasingMethod?.id,
                    })
                  }
                  classFilter={CommonFilter}
                  searchProperty="name"
                  onChange={handleChangeSelectField({
                    fieldName: "purchaseOrganization",
                    errorName: "purchaseOrganizationId",
                  })}
                  isRequired={!isEmpty(model.purchasingMethod)}
                  isEnumerable={false}
                  isSmall={false}
                  isSearch
                />
              </FormItem>
            </Col>
            <Col span={8}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <InputText
                label={translate("PR.branch_create")}
                isSmall={false}
                value={model?.businessBranch?.name || "---"}
                readOnly
              />
            </Col>
            <Col span={8}>
              <InputText
                label={translate("PP.creating_unit")}
                isSmall={false}
                value={model?.organization?.name || "---"}
                readOnly
              />
            </Col>
            <Col span={8}>
              <InputText
                label={translate("PP.position")}
                isSmall={false}
                value={model?.position?.name || "---"}
                readOnly
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default BasicInformation;
