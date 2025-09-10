/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { TFunction } from "i18next";
import { isEqual } from "lodash";
import CommonFilter from "models/CommonFilter";
import { TypeFilterModel } from "models/Payment";
import { Account } from "models/Profile";
import {
  ColumnKey,
  EvaluationCriteria,
  EvaluationRound,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import {
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { map, of } from "rxjs";

type helperColumnsProps = {
  translate: TFunction<"translation", undefined>;
  model: PurchasingPlanTypeModel;
  columnKey: ColumnKey;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleDeleteRowConfirm?: (id: string) => void;
  isScoring?: boolean;
  isDetail?: boolean;
};

interface ChangeItemTableProps {
  model: PurchasingPlanTypeModel;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  fieldName: string;
  value: FieldValue;
  id: string;
  columnKey: ColumnKey;
  fieldError?: string;
}

export const ColumnByEvaluationMethod = ({
  translate,
  model,
  columnKey,
  handleChangeSingleField,
  handleDeleteRowConfirm,
  isScoring = false,
  isDetail = false,
}: helperColumnsProps): ColumnProps<EvaluationCriteria>[] => {
  const handleChangeItemTable = ({
    model,
    handleChangeSingleField,
    fieldName,
    value,
    id,
    columnKey,
    fieldError,
  }: ChangeItemTableProps) => {
    const dataChange = model?.[columnKey].map((item: EvaluationCriteria) => {
      if (id === item?.id) {
        return {
          ...item,
          [fieldName]: value,
        };
      }
      return item;
    });
    handleChangeSingleField({
      fieldName: columnKey,
      errorName: fieldError,
    })(dataChange);
  };

  const getListEvaluationTeam = (filter: TypeFilterModel) => {
    const listUser =
      model?.evaluationTeams
        ?.filter((item: EvaluationRound) => item.user)
        ?.map((item: EvaluationRound) => item.user) || [];

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
            period?.email?.includes(trimmedQuery as string)
        );
      })
    );
  };

  const columns: ColumnProps<EvaluationCriteria>[] = [
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.txt_criteria_name")}
          {!isDetail && <span className="text-danger">&nbsp;*</span>}
        </div>
      ),
      key: ColumnKey.NAME,
      dataIndex: ColumnKey.NAME,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        if (record?.isDefault) {
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );
        }
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );
        return (
          <LayoutCell position="center">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].name`
              )}
            >
              <InputText
                isTableCell
                isRequired
                value={text}
                placeHolder={translate("PL.plh_criteria_name")}
                onChange={(e) => {
                  handleChangeItemTable({
                    model,
                    handleChangeSingleField,
                    fieldName: ColumnKey.NAME,
                    value: e,
                    id: record?.id,
                    columnKey,
                    fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].name`,
                  });
                }}
                isSmall={true}
                maxLength={250}
                translate={translate}
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
      key: ColumnKey.TECHNICAL_REQUIREMENT,
      dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        if (record?.isDefault)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].technicalRequirement`
              )}
            >
              <InputText
                isTableCell
                value={text}
                placeHolder={translate("PL.plh_technical_requirements")}
                onChange={(e) => {
                  handleChangeItemTable({
                    model,
                    handleChangeSingleField,
                    fieldName: ColumnKey.TECHNICAL_REQUIREMENT,
                    value: e,
                    id: record?.id,
                    columnKey,
                    fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].technicalRequirement`,
                  });
                }}
                isSmall={true}
                maxLength={500}
                translate={translate}
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
          {!isDetail && <span className="text-danger">&nbsp;*</span>}
        </div>
      ),
      key: ColumnKey.USER,
      dataIndex: ColumnKey.USER,
      ellipsis: true,
      width: 200,
      render: (text, record, index) => {
        if (record?.isDefault) {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.user?.name} />
            </LayoutCell>
          );
        }
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.user?.name} />
            </LayoutCell>
          );
        return (
          <LayoutCell position="center">
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].user`
              )}
            >
              <Select
                placeHolder={translate("PL.plh_reviewer")}
                isRequired
                isSearch
                isEnumerable={false}
                onChange={(e, value) => {
                  handleChangeItemTable({
                    model,
                    handleChangeSingleField,
                    fieldName: ColumnKey.USER,
                    value,
                    id: record?.id,
                    columnKey,
                    fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].user`,
                  });
                }}
                getList={(search) => getListEvaluationTeam(search)}
                value={record?.user}
                render={(t) =>
                  t
                    ? isEqual(t?.id, record?.user?.id)
                      ? t?.name
                      : `${t?.name} - ${t?.email} - ${t?.position?.name}`
                    : ""
                }
                classFilter={CommonFilter}
                appendToBody
                searchType=""
                searchProperty="name"
                valueFilter={{
                  name: "",
                }}
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
            <OneLineText
              value={record?.user?.email ? record?.user?.email : "---"}
            />
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
        if (isDetail)
          return (
            <LayoutCell position="left">
              <OneLineText value={text} />
            </LayoutCell>
          );
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].note`
              )}
            >
              <InputText
                isTableCell
                value={text}
                placeHolder={translate("PL.plh_note")}
                onChange={(e) => {
                  handleChangeItemTable({
                    model,
                    handleChangeSingleField,
                    fieldName: ColumnKey.NOTE,
                    value: e,
                    id: record?.id,
                    columnKey,
                    fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].note`,
                  });
                }}
                isSmall={true}
                maxLength={500}
                translate={translate}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
  ];

  if (isScoring) {
    columns.splice(
      2,
      0,
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PL.txt_max_score")}
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.MAX_POINT_SCALE,
        dataIndex: ColumnKey.MAX_POINT_SCALE,
        ellipsis: true,
        width: isScoring ? 140 : 0,
        render: (text, record, index) => {
          if (record?.isDefault) {
            return (
              <LayoutCell position="left">
                <OneLineText value={text} />
              </LayoutCell>
            );
          }
          if (!isScoring) return null;
          if (isDetail)
            return (
              <LayoutCell position="left">
                <OneLineText value={text} />
              </LayoutCell>
            );
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].maximumPointScale`
                )}
              >
                <InputNumber
                  allowClear={false}
                  isTableCell
                  isRequired
                  value={text}
                  max={100}
                  min={0}
                  placeHolder={translate("PL.plh_score")}
                  onChange={(e) => {
                    handleChangeItemTable({
                      model,
                      handleChangeSingleField,
                      fieldName: ColumnKey.MAX_POINT_SCALE,
                      value: e,
                      id: record?.id,
                      columnKey,
                      fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].maximumPointScale`,
                    });
                  }}
                  isSmall={true}
                  translate={translate}
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
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.MIN_POINT_SCALE,
        dataIndex: ColumnKey.MIN_POINT_SCALE,
        ellipsis: true,
        width: isScoring ? 140 : 0,
        render: (text, record, index) => {
          if (record?.isDefault) {
            return (
              <LayoutCell position="left">
                <OneLineText value={text} />
              </LayoutCell>
            );
          }
          if (!isScoring) return null;
          if (isDetail)
            return (
              <LayoutCell position="left">
                <OneLineText value={text} />
              </LayoutCell>
            );
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].minimumPointScale`
                )}
              >
                <InputNumber
                  allowClear={false}
                  isTableCell
                  isRequired
                  value={text}
                  placeHolder={translate("PL.plh_score")}
                  max={100}
                  min={0}
                  onChange={(e) => {
                    handleChangeItemTable({
                      model,
                      handleChangeSingleField,
                      fieldName: ColumnKey.MIN_POINT_SCALE,
                      value: e,
                      id: record?.id,
                      columnKey,
                      fieldError: `offerRequest.evaluationCriteriaGroup.evaluationCriterias[${index}].minimumPointScale`,
                    });
                  }}
                  isSmall={true}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      }
    );
  }

  if (!isDetail) {
    columns.push({
      title: "",
      key: ColumnKey.ACTION,
      dataIndex: ColumnKey.ACTION,
      width: isDetail ? 0 : 40,
      render: (_, record) => {
        if (isDetail) return null;
        return (
          <LayoutCell>
            <div className="payment-red cursor-pointer btn">
              <TrashCan
                size={20}
                onClick={() => handleDeleteRowConfirm(record.id)}
              />
            </div>
          </LayoutCell>
        );
      },
    });
  }

  return columns;
};
