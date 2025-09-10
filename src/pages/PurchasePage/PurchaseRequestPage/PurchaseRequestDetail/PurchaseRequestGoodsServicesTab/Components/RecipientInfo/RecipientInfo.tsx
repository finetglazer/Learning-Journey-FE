import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import RecipientInfoView from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestView/Components/RecipientInfoView/RecipientInfoView";
import { useContext, useState } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./RecipientInfo.scss";
import { DEFAULT_PAGE_SIZE_30, PHONE_NUMBER_REGEX } from "core/config/consts";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";

const MAX_LENGTH_PHONE_NUMBER = 20;

const MAX_LENGTH_ADDRESS = 255;

const MAX_LENGTH_NOTE = 500;

const RecipientInfo = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const { model, handleChangeSelectField, handleChangeSingleField } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  if (model.isDetail) return <RecipientInfoView />;
  return (
    <div className="purchase_request_recipient_info_wrapper ">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PR.recipient_information")}</div>
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
          <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "receiveBusinessDepartmentId"
                )}
              >
                <Select
                  isRequired
                  label={translate("PR.receiving_unit")}
                  valueFilter={{
                    name: "",
                    pageSize: DEFAULT_PAGE_SIZE_30,
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  searchType=""
                  searchProperty="name"
                  isEnumerable={false}
                  getList={contractRepository.getListOrganization}
                  onChange={handleChangeSelectField({
                    fieldName: "receiveBusinessDepartmentId",
                  })}
                  value={model?.receiveBusinessDepartmentId}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "receiveUser"
                )}
              >
                <Select
                  isRequired
                  searchType=""
                  label={translate("PR.receiver")}
                  valueFilter={{
                    name: "",
                  }}
                  isEnumerable={false}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  onChange={handleChangeSelectField({
                    fieldName: "receiveUser",
                  })}
                  value={model?.receiveUser}
                  render={(t) => (t ? `${t?.name} - ${t?.email}` : "")}
                  getList={proposalRepository.listMasterUser}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "recipientInforJson.phoneNumber"
                )}
              >
                <InputText
                  isRequired
                  label={translate("PR.telephone_number")}
                  placeHolder={translate("PR.plh_telephone_number")}
                  isSmall={false}
                  value={model?.phoneNumber}
                  onChange={handleChangeSingleField({
                    fieldName: "phoneNumber",
                    errorName: "recipientInforJson.phoneNumber",
                  })}
                  regexInput={PHONE_NUMBER_REGEX}
                  translate={translate}
                  maxLength={MAX_LENGTH_PHONE_NUMBER}
                />
              </FormItem>
            </div>
          </div>
          <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "recipientInforJson.address"
                )}
              >
                <InputText
                  isRequired
                  label={translate("PR.address")}
                  placeHolder={translate("PR.plh_address")}
                  isSmall={false}
                  value={model?.address}
                  onChange={handleChangeSingleField({
                    fieldName: "address",
                    errorName: "recipientInforJson.address",
                  })}
                  maxLength={MAX_LENGTH_ADDRESS}
                  translate={translate}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_6">
              <InputText
                label={translate("PR.note")}
                placeHolder={translate("PR.enter_note")}
                isSmall={false}
                value={model?.note}
                onChange={handleChangeSingleField({
                  fieldName: "note",
                })}
                maxLength={MAX_LENGTH_NOTE}
                translate={translate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientInfo;
