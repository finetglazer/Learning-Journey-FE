import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";
import { EMPTY_STRING } from "core/config/consts";
import { combineTextExtra } from "core/helpers/text";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { TypeFilterModel } from "models/Payment";
import { Account } from "models/Profile";
import {
  PurchasingPlanTypeModel,
  EvaluationCriteria,
  ColumnKey,
  EvaluationTeam,
  EvaluationUserRoleEnum,
  EvaluationMethod,
  CriteriaType,
} from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useCallback, useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputText,
  InputNumber,
  LayoutCell,
  Select,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { map, of } from "rxjs";

type helperColumnsProps = {
  model: PurchasingPlanTypeModel;
  handleChangeAllField: (data: PurchasingPlanTypeModel) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleDeleteRowConfirm: (id: string) => void;
  requiredInTable?: boolean;
  isScore?: boolean;
  fieldNameWrap?: string;
  fieldTable?: string;
  isDetail?: boolean;
};

interface changeItemProps {
  model: PurchasingPlanTypeModel;
  handleChangeAllField: (data: PurchasingPlanTypeModel) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  fieldName: string;
  value: FieldValue;
  id: string;
  fieldNameWrap: string;
  fieldNameError?: string;
  objectUpdateFollow?: EvaluationCriteria;
  isInput?: boolean;
  isDetail?: boolean;
}

const useColumnScoreMethod = ({
  model,
  handleChangeAllField,
  handleChangeSingleField,
  handleDeleteRowConfirm,
  requiredInTable = false,
  isScore = false,
  fieldNameWrap = "",
  fieldTable,
  isDetail = false,
}: helperColumnsProps): ColumnProps<EvaluationCriteria>[] => {
  const [translate] = useTranslation();
  const history = useHistory();

  const CRITERIA_TYPE_BY_FIELD_NAME_WRAP = [
    { key: "evaluationFinancial", value: CriteriaType.Finance },
    { key: "evaluationScore", value: CriteriaType.TechnicalCompetence },
    { key: "evaluationPassFail", value: CriteriaType.TechnicalCompetence },
  ];

  const currentCriteriaType = CRITERIA_TYPE_BY_FIELD_NAME_WRAP.find(
    (el) => el.key === fieldNameWrap
  );

  const isAdjustBid = useMemo(() => {
    return history.location.pathname.includes(PURCHASE_PLAN_ADJUST_BID_ROUTE);
  }, [history.location.pathname]);

  const isCreatePage = !model?.id && isAdjustBid;

  const ticketStatus = useMemo(
    () => (isCreatePage ? model?.status : model?.oldOriginalPurchasePlanStatus),
    [isCreatePage, model?.oldOriginalPurchasePlanStatus, model?.status]
  );

  const isApprovedStatus =
    ticketStatus === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED;

  const getFieldError = (fieldName: string, index: number) => {
    return `evaluationCriteriaSummary.${fieldTable}.evaluationCriterias[${index}].${fieldName}`;
  };

  const getError = useCallback(
    (field: string) => {
      return utilService.getValidateObj(model, field);
    },
    [model]
  );

  const getListEvaluationTeam = useCallback(
    (filter: TypeFilterModel) => {
      const fieldEvaluationTeam = isAdjustBid
        ? ColumnKey.EVALUATION_TEAM_DETAILS
        : ColumnKey.EVALUATION_TEAM;

      const listUser =
        model?.[fieldEvaluationTeam]
          ?.filter((item: EvaluationTeam) => item.user)
          ?.map((item: EvaluationTeam) => {
            // Nếu isActive không null thì không check trường hợp false
            if (!isNil(item.isActive) && !item.isActive) return null;
            if (fieldNameWrap === "evaluationFinancial") {
              return (
                [
                  EvaluationUserRoleEnum.FinancialLeader,
                  EvaluationUserRoleEnum.FinancialEvaluator,
                ].includes(item?.role?.id as EvaluationUserRoleEnum) &&
                item.user
              );
            }

            if (
              fieldNameWrap === "evaluationScore" ||
              fieldNameWrap === "evaluationPassFail"
            ) {
              return (
                [
                  EvaluationUserRoleEnum.TechnicalLeader,
                  EvaluationUserRoleEnum.TechnicalEvaluator,
                ].includes(item?.role?.id as EvaluationUserRoleEnum) &&
                item.user
              );
            }

            return null;
          })
          ?.filter((item: EvaluationTeam) => Boolean(item)) || [];

      return of(listUser).pipe(
        map((user: Account[]) => {
          if (!Array.isArray(user)) {
            return [];
          }

          const trimmedQuery = filter?.name?.trim();
          if (!trimmedQuery) {
            return user;
          }

          return user.filter(
            (period) =>
              period?.name?.includes(trimmedQuery as string) ||
              period?.fullName?.includes(trimmedQuery as string) ||
              period?.email?.includes(trimmedQuery as string)
          );
        })
      );
    },
    [fieldNameWrap, isAdjustBid, model]
  );

  const handleChangeItemTable = useCallback((props: changeItemProps) => {
    const {
      model,
      handleChangeAllField,
      fieldName,
      value,
      id,
      fieldNameWrap,
      fieldNameError,
      objectUpdateFollow = {},
      isInput = false,
    } = props;
    if (!model) return;
    const dataWrapClone = [...model[fieldNameWrap]];
    const itemChange = dataWrapClone.find((item: EvaluationCriteria) => {
      return id === item?.id;
    });
    itemChange[fieldName] = value;

    for (const [key, value] of Object.entries(objectUpdateFollow)) {
      itemChange[key] = value;
    }

    if (!isInput) {
      handleChangeAllField({
        ...model,
        [fieldNameWrap]: dataWrapClone,
        errors: {
          ...model.errors,
          [fieldNameError]: undefined,
        },
      });
      return;
    }
  }, []);

  return [
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_criteria_name")}
          {!isDetail && requiredInTable && (
            <span className="text-danger">&nbsp;*</span>
          )}
        </div>
      ),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        const errorField = getFieldError(ColumnKey.NAME, index);
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );

        if ((isAdjustBid && isApprovedStatus) || !isAdjustBid) {
          return (
            <LayoutCell position="left">
              <FormItem isTableCell validateObject={getError(errorField)}>
                <InputText
                  isTableCell
                  value={text}
                  placeHolder={translate("PL.txt_enter_criteria")}
                  onChange={(e) => {
                    handleChangeItemTable({
                      handleChangeAllField,
                      model,
                      fieldName: ColumnKey.NAME,
                      value: e,
                      id: record?.id,
                      fieldNameWrap,
                      fieldNameError: errorField,
                    });
                  }}
                  isSmall={true}
                  maxLength={255}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        }

        return (
          <LayoutCell>
            <FormItem isTableCell validateObject={getError(errorField)}>
              <Select
                placeHolder={translate("PPA.select_criteria")}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={(filter) =>
                  purchasingPlanRepository.getAllEvaluationCriteriaWithDescription(
                    model?.originalPurchasePlanId,
                    isScore
                      ? EvaluationMethod.Scoring
                      : EvaluationMethod.PassFail,
                    currentCriteriaType.value,
                    filter
                  )
                }
                value={record}
                onChange={(_, value: Model) => {
                  if (value?.id === record?.id) return;
                  handleChangeItemTable({
                    handleChangeAllField,
                    model,
                    fieldName: ColumnKey.NAME,
                    value: value?.name,
                    id: record?.id,
                    fieldNameWrap,
                    objectUpdateFollow: {
                      note: EMPTY_STRING,
                      criteria: {},
                      criteriaItems: value.criteriaItems,
                    },
                  });
                }}
                isEnumerable={false}
                appendToBody
                isRequired
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_technical_requirements")}
        </div>
      ),
      key: ColumnKey.DESCRIPTION,
      dataIndex: ColumnKey.DESCRIPTION,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );

        const errorField = getFieldError(ColumnKey.DESCRIPTION, index);
        if ((isAdjustBid && isApprovedStatus) || !isAdjustBid) {
          return (
            <LayoutCell>
              <FormItem isTableCell validateObject={getError(errorField)}>
                <InputText
                  isTableCell
                  value={text}
                  placeHolder={translate("PL.plh_technical_requirements")}
                  onChange={(e) => {
                    handleChangeItemTable({
                      handleChangeAllField,
                      model,
                      fieldName: ColumnKey.DESCRIPTION,
                      value: e,
                      id: record?.id,
                      fieldNameWrap,
                      fieldNameError: errorField,
                    });
                  }}
                  isSmall={true}
                  maxLength={500}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        }

        if (!record.criteria) return <></>;

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                placeHolder={translate("PPA.technical_requirement")}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={() =>
                  of(
                    record?.criteriaItems
                      ? record?.criteriaItems.map((el) => ({
                          ...el,
                          name: el.description,
                        }))
                      : record?.criteria?.descriptionSelected
                      ? [record?.criteria?.descriptionSelected]
                      : []
                  )
                }
                value={record?.criteria?.descriptionSelected}
                onChange={(e, value: EvaluationCriteria) => {
                  const dataUpdate = value?.evaluationUser?.find(
                    (el: EvaluationCriteria) => {
                      return el.id === record?.evaluationUserId;
                    }
                  );

                  let note = EMPTY_STRING;
                  if (dataUpdate?.note) {
                    note = dataUpdate.note;
                  }

                  handleChangeItemTable({
                    handleChangeAllField,
                    model,
                    fieldName: ColumnKey.CRITERIA,
                    value: {
                      ...record.criteria,
                      descriptionSelected: value,
                      description: value.description,
                      maximumPointScales: value.maximumPointScales,
                    },
                    id: record?.id,
                    fieldNameWrap,
                    objectUpdateFollow: {
                      note,
                      description: value?.description,
                    },
                  });
                }}
                render={(item) => item?.name}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_max_score")}
          {!isDetail && requiredInTable && (
            <span className="text-danger">&nbsp;*</span>
          )}
        </div>
      ),
      key: ColumnKey.MAX_POINT_SCALE,
      dataIndex: ColumnKey.MAX_POINT_SCALE,
      ellipsis: true,
      width: 129,
      hidden: !isScore,
      render: (text, record, index) => {
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );

        const errorField = getFieldError(ColumnKey.MAX_POINT_SCALE, index);

        if ((isAdjustBid && isApprovedStatus) || !isAdjustBid) {
          return (
            <LayoutCell>
              {isDetail ? (
                <OneLineText value={text} />
              ) : (
                <FormItem isTableCell validateObject={getError(errorField)}>
                  <InputNumber
                    isTableCell
                    value={text}
                    max={100}
                    min={0}
                    placeHolder={translate("PL.plh_score")}
                    onChange={(e) => {
                      handleChangeItemTable({
                        handleChangeAllField,
                        model,
                        fieldName: ColumnKey.MAX_POINT_SCALE,
                        value: e,
                        id: record?.id,
                        fieldNameWrap,
                        fieldNameError: errorField,
                      });
                    }}
                    isSmall={true}
                    translate={translate}
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        }
        if (!record.criteria) return <></>;

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                placeHolder={translate("PPA.select_score")}
                valueFilter={{
                  name: "",
                }}
                classFilter={undefined}
                getList={() => {
                  return of(
                    record?.criteria?.maximumPointScales
                      ? record?.criteria?.maximumPointScales
                      : record?.criteria?.maximumPointScaleSelected
                      ? [record?.criteria?.maximumPointScaleSelected]
                      : []
                  );
                }}
                value={record?.criteria?.maximumPointScaleSelected}
                onChange={(e, value: Model) => {
                  handleChangeItemTable({
                    handleChangeAllField,
                    model,
                    fieldName: ColumnKey.CRITERIA,
                    value: {
                      ...record.criteria,
                      maximumPointScaleSelected: value,
                      minimumPointScales: value.minimumPointScales,
                    },
                    id: record?.id,
                    fieldNameWrap,
                  });
                }}
                render={(item) => `${item?.score ?? ""}`}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_min_score")}
          {!isDetail && requiredInTable && (
            <span className="text-danger">&nbsp;*</span>
          )}
        </div>
      ),
      key: ColumnKey.MIN_POINT_SCALE,
      dataIndex: ColumnKey.MIN_POINT_SCALE,
      ellipsis: true,
      width: 129,
      hidden: !isScore,
      render: (text, record, index) => {
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );

        const errorField = getFieldError(ColumnKey.MIN_POINT_SCALE, index);

        if ((isAdjustBid && isApprovedStatus) || !isAdjustBid) {
          return (
            <LayoutCell>
              {isDetail ? (
                <OneLineText value={text} />
              ) : (
                <FormItem isTableCell validateObject={getError(errorField)}>
                  <InputNumber
                    isTableCell
                    value={text}
                    placeHolder={translate("PL.plh_score")}
                    max={100}
                    min={0}
                    onChange={(e) => {
                      handleChangeItemTable({
                        handleChangeAllField,
                        model,
                        fieldName: ColumnKey.MIN_POINT_SCALE,
                        value: e,
                        id: record?.id,
                        fieldNameWrap,
                        fieldNameError: errorField,
                      });
                    }}
                    isSmall={true}
                    translate={translate}
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        }
        if (!record.criteria) return <></>;

        return (
          <LayoutCell>
            <FormItem validateObject={getError(errorField)} isTableCell>
              <Select
                isRequired
                valueFilter={{
                  name: "",
                }}
                placeHolder={translate("PPA.select_score")}
                classFilter={undefined}
                getList={() => {
                  return of(
                    record?.criteria?.minimumPointScales
                      ? record?.criteria?.minimumPointScales
                      : record?.criteria?.minimumPointScaleSelected
                      ? [record?.criteria?.minimumPointScaleSelected]
                      : []
                  );
                }}
                value={record?.criteria?.minimumPointScaleSelected}
                onChange={(e, value: Model) => {
                  handleChangeItemTable({
                    handleChangeAllField,
                    model,
                    fieldName: ColumnKey.CRITERIA,
                    value: {
                      ...record.criteria,
                      minimumPointScaleSelected: value,
                    },
                    id: record?.id,
                    fieldNameWrap,
                  });
                }}
                readOnly={!record?.criteria?.maximumPointScaleSelected}
                render={(item) => `${item?.score ?? ""}`}
                isEnumerable={false}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_evaluator")}
          {!isDetail && requiredInTable && (
            <span className="text-danger">&nbsp;*</span>
          )}
        </div>
      ),
      key: ColumnKey.USER,
      dataIndex: ColumnKey.USER,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text?.name} />
            </LayoutCell>
          );
        const errorField = getFieldError(ColumnKey.USER, index);

        return (
          <LayoutCell position="left">
            <FormItem isTableCell validateObject={getError(errorField)}>
              <Select
                placeHolder={translate("PL.plh_reviewer")}
                isRequired
                isSearch
                searchProperty="name"
                searchType=""
                valueFilter={{
                  name: "",
                }}
                isEnumerable={false}
                onChange={(e, value) => {
                  const dataUpdate = record?.criteria?.descriptionSelected
                    ? record?.criteriaItems
                        ?.find(
                          (el: EvaluationCriteria) =>
                            el.id === record.criteria.descriptionSelected.id
                        )
                        ?.evaluationUser?.find(
                          (el: EvaluationCriteria) => el.id === value.id
                        )
                    : {};

                  let note = EMPTY_STRING;
                  if (dataUpdate?.note) {
                    note = dataUpdate.note;
                  }

                  handleChangeItemTable({
                    handleChangeAllField,
                    model,
                    fieldName: ColumnKey.USER,
                    value,
                    id: record?.id,
                    fieldNameWrap,
                    fieldNameError: errorField,
                    isInput: false,
                    objectUpdateFollow: isAdjustBid
                      ? {
                          note,
                          evaluationUserId: value.id,
                        }
                      : {},
                  });
                }}
                getList={getListEvaluationTeam}
                render={(valueRender) => {
                  if (record?.user?.id === valueRender?.id) {
                    return combineTextExtra(
                      valueRender?.fullName
                        ? valueRender?.fullName
                        : valueRender?.name
                    );
                  }
                  return combineTextExtra(
                    valueRender?.fullName
                      ? valueRender?.fullName
                      : valueRender?.name,
                    valueRender?.email,
                    valueRender?.position?.name
                  );
                }}
                value={record?.user}
                classFilter={CommonFilter}
                appendToBody
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">{translate("PL.txt_email")}</div>
      ),
      key: ColumnKey.EMAIL,
      dataIndex: ColumnKey.EMAIL,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        return (
          <LayoutCell>
            <OneLineText value={record?.user?.email ?? EMPTY_STRING} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">{translate("PL.txt_note")}</div>
      ),
      key: ColumnKey.NOTE,
      dataIndex: ColumnKey.NOTE,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        const errorField = getFieldError(ColumnKey.NOTE, index);
        if (isDetail || (isAdjustBid && !isApprovedStatus)) {
          return (
            <LayoutCell>
              <OneLineText value={text || EMPTY_STRING} />
            </LayoutCell>
          );
        }

        if (!isDetail || (isAdjustBid && isApprovedStatus)) {
          return (
            <LayoutCell>
              <FormItem isTableCell validateObject={getError(errorField)}>
                <InputText
                  isTableCell
                  value={text}
                  placeHolder={translate("PL.plh_note")}
                  onChange={(e) => {
                    handleChangeItemTable({
                      handleChangeAllField,
                      model,
                      fieldName: ColumnKey.NOTE,
                      value: e,
                      id: record?.id,
                      fieldNameWrap,
                      fieldNameError: errorField,
                      isInput: true,
                    });
                  }}
                  isSmall={true}
                  maxLength={500}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        }
      },
    },
    {
      title: "",
      key: ColumnKey.ACTION,
      dataIndex: ColumnKey.ACTION,
      hidden: isDetail,
      width: 40,
      render: (_, record) => (
        <LayoutCell>
          <div className="payment-red cursor-pointer btn">
            <TrashCan
              size={20}
              onClick={() => handleDeleteRowConfirm(record.id)}
            />
          </div>
        </LayoutCell>
      ),
    },
  ];
};

export default useColumnScoreMethod;
