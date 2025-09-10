import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import { convertUTCTimeToVietnamTimezone } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { BaseModel } from "models/ProjectSettlement";
import { useCalculatorContract } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useCaculatorContract";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import { useMemo } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useContractPrincipleAppendixDetailContext } from "../../../context";
import styles from "./styles.module.scss";

const SPACING = {
  gutter: [16, 12] as [Gutter, Gutter],
  span_4: 4,
  span_8: 8,
  span_16: 16,
  span_24: 24,
};

export const ContractInformation = () => {
  const { model, dispatch } = useContractPrincipleAppendixDetailContext();
  const history = useHistory();
  const [translate] = useTranslation();

  const { contractValue } = useCalculatorContract({
    contractValueOrigin: model?.contractInfo?.contractValue,
    goodServices: model?.contractAppendixGoodsItems,
  });

  const data = useMemo(() => {
    if (isNil(model?.contractInfo)) return null;

    const {
      contractNo,
      name,
      contractValue,
      currency,
      rate,
      effectiveDate,
      endDate,
      contractType,
      contractMethod,
      createUserInformation,
      isContractTermination,
      managerOrganizationUnit,
      managerOrganizationBranch,
      managerOrganizationId,
      managerPerson,
      managerOrganization,
    } = model.contractInfo;

    return {
      contractNo,
      name,
      contractValue,
      currency,
      rate,
      effectiveDate,
      endDate,
      contractType,
      contractMethod,
      createUserInformation,
      isContractTermination,
      managerOrganizationUnit,
      managerOrganizationBranch,
      managerOrganizationId,
      managerPerson,
      managerOrganization,
    };
  }, [model?.contractInfo]);

  const handleChangeManagerOrganization = (id: number, select: BaseModel) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractInfo: {
          ...model.contractInfo,
          managerOrganizationBranch: combineText(
            select?.businessBranch?.code,
            select?.businessBranch?.name
          ),
          managerOrganizationUnit: combineText(
            select?.businessUnit?.code,
            select?.businessUnit?.name
          ),
          managerOrganization: {
            id: select?.id,
            name: select.name,
          },
          managerPerson: undefined,
        },
      },
    });
  };

  const handleChangeApplicableOrganization = (
    id: number,
    select: BaseModel
  ) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractInfo: {
          ...model.contractInfo,
          applicableOrganization: {
            id: select?.id,
            name: select.name,
          },
        },
      },
    });
  };

  const handleChangeApplicableBranch = (id: number, select: BaseModel) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractInfo: {
          ...model.contractInfo,
          applicableBranch: {
            id: select?.id,
            name: select.name,
          },
        },
      },
    });
  };

  const handleChangeApplicableUnit = (id: number, select: BaseModel) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractInfo: {
          ...model.contractInfo,
          applicableUnit: {
            id: select?.id,
            name: select.name,
          },
        },
      },
    });
  };

  const handleChangeManagerPerson = (id: number, select: BaseModel) => {
    updateModel("managerPerson", {
      id,
      name: select?.name,
      email: select?.email,
    });
  };

  const updateModel = (fieldName: string, value: unknown) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        contractInfo: {
          ...model.contractInfo,
          [fieldName]: value,
        },
      },
    });
  };

  const makeContractNo = () => {
    return (
      <Link
        to={`${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${model?.contractInfo?.id}`}
        className={`${styles["contract-no"]} hyperlink`}
        target="_blank"
      >
        <div className={styles["contract-no__label"]}>
          {translate("CPA.txt_contract_principle_code")}
        </div>
        <div className={styles["contract-no__value"]}>
          {model?.contractInfo?.code}
        </div>
      </Link>
    );
  };

  const makeFirstRow = () => {
    return (
      <>
        {/* No */}
        <Col span={SPACING.span_8}>
          <FormItem>{makeContractNo()}</FormItem>
        </Col>
        {/* No */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_contract_principle_no")}
              value={data?.contractNo}
            />
          </FormItem>
        </Col>
        {/* Name */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_contract_principle_name")}
              value={data?.name}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeSecondRow = () => {
    return (
      <>
        {/* Type */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_contract_principle_type")}
              value={model?.contractInfo?.contractType?.name}
            />
          </FormItem>
        </Col>
        {/* Effective date */}
        <Col span={SPACING.span_4}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "effectiveDate")}
          >
            <DatePicker
              isRequired
              isSmall={false}
              label={translate("CPA.txt_contract_principle_effective_date")}
              value={
                data?.effectiveDate
                  ? convertUTCTimeToVietnamTimezone(data?.effectiveDate)
                  : undefined
              }
              onChange={(value) => {
                dispatch({
                  type: GeneralActionEnum.UPDATE,
                  payload: {
                    ...model,
                    contractInfo: {
                      ...model.contractInfo,
                      effectiveDate: value?.toISOString(),
                    },
                  },
                });
              }}
            />
          </FormItem>
        </Col>
        {/* End date */}
        <Col span={SPACING.span_4}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "endDate")}
          >
            <DatePicker
              isSmall={false}
              label={translate("CPA.txt_contract_principle_end_date")}
              value={
                data?.endDate
                  ? convertUTCTimeToVietnamTimezone(data?.endDate)
                  : undefined
              }
              onChange={(value) => {
                dispatch({
                  type: GeneralActionEnum.UPDATE,
                  payload: {
                    ...model,
                    contractInfo: {
                      ...model.contractInfo,
                      endDate: value?.toISOString(),
                    },
                  },
                });
              }}
              minDate={dayjs(data?.effectiveDate)}
            />
          </FormItem>
        </Col>
        {/* Currency type */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_contract_principle_currency_type")}
              value={model?.contractInfo?.currency}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeThirdRow = () => {
    return (
      <>
        {/* Management unit */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "managerOrganizationId"
            )}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={undefined}
              valueFilter={{
                name: "",
              }}
              searchType=""
              getList={contractAnnexRepository.getIncludeSegment}
              label={translate("CPA.txt_contract_principle_management_unit")}
              value={data?.managerOrganization}
              render={(item) => item?.name}
              placeHolder={translate(
                "CPA.placeholder_contract_principle_management_unit"
              )}
              onChange={handleChangeManagerOrganization}
            />
          </FormItem>
        </Col>
        {/* Manager */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "managerName")}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              label={translate("CPA.txt_contract_principle_manager")}
              classFilter={CommonFilter}
              value={data?.managerPerson}
              getList={(value) => {
                return contractAnnexRepository.getManagerPersonList({
                  name: value?.name?.contain,
                  organizationId: data?.managerOrganization?.id,
                });
              }}
              render={(item) => combineText(item?.email, item?.name)}
              placeHolder={translate(
                "CPA.placeholder_contract_principle_manager"
              )}
              onChange={handleChangeManagerPerson}
            />
          </FormItem>
        </Col>
        {/* Department */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate(
                "CPA.txt_contract_principle_management_department"
              )}
              value={data?.managerOrganizationUnit || "---"}
            />
          </FormItem>
        </Col>
        {/* Organization */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_contract_principle_organization")}
              value={data?.managerOrganizationBranch || "---"}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeFourthRow = () => {
    return (
      <>
        {/* Unit */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "applicableOrganizationId"
            )}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={undefined}
              valueFilter={{
                name: "",
              }}
              searchType=""
              label={translate("CPA.txt_contract_principle_management_apply")}
              value={model?.contractInfo?.applicableOrganization}
              render={(item) => item?.name}
              placeHolder={translate(
                "CPA.placeholder_contract_principle_management_apply"
              )}
              getList={contractAnnexRepository.getIncludeSegment}
              onChange={handleChangeApplicableOrganization}
            />
          </FormItem>
        </Col>
        {/* Department */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "applicableUnitId"
            )}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={CommonFilter}
              label={translate("CPA.txt_contract_principle_apply_department")}
              render={(item) => item?.name}
              value={model?.contractInfo?.applicableUnit}
              placeHolder={translate(
                "CPA.placeholder_contract_principle_apply_department"
              )}
              getList={contractPrincipleRepository.getBusinessUnit}
              onChange={handleChangeApplicableUnit}
            />
          </FormItem>
        </Col>
        {/* Organization */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "applicableBranchId"
            )}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={CommonFilter}
              label={translate("CPA.txt_contract_principle_apply_organization")}
              value={model?.contractInfo?.applicableBranch}
              render={(item) => item?.name}
              placeHolder={translate(
                "CPA.placeholder_contract_principle_apply_organization"
              )}
              getList={contractPrincipleRepository.getBusinessBranch}
              onChange={handleChangeApplicableBranch}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeLastRow = () => {
    return (
      <>
        {/* Creator */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_creator")}
              value={combineText(
                model?.contractInfo?.createUserInfo?.createUser,
                model?.contractInfo?.createUserInfo?.createFullname
              )}
            />
          </FormItem>
        </Col>
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_unit_create")}
              value={model?.contractInfo?.createUserInfo?.createOrganization}
            />
          </FormItem>
        </Col>
        {/* Department */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              disabled
              isSmall={false}
              label={translate("CPA.txt_position")}
              value={model?.contractInfo?.createUserInfo?.createPosition}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  return (
    <Row gutter={SPACING.gutter}>
      {makeFirstRow()}
      {makeSecondRow()}
      {makeThirdRow()}
      {makeFourthRow()}
      {makeLastRow()}
    </Row>
  );
};
