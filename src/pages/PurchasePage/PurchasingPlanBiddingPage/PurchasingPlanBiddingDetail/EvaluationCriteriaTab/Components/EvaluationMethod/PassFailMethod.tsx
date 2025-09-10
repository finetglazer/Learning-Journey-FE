/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { TFunction } from "i18next";
import CommonFilter from "models/CommonFilter";
import {
  PurchasingPlanTypeModel,
  EvaluationCriteria,
  ColumnKey,
} from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import {
  FormItem,
  InputText,
  LayoutCell,
  Select,
} from "react-components-design-system";

type helperColumnsProps = {
  translate: TFunction<"translation", undefined>;
  model: PurchasingPlanTypeModel;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  handleDeleteRowConfirm: (id: string) => void;
  requiredInTable?: boolean;
};

export const PassFailColumns = ({
  translate,
  model,
  handleChangeSingleField,
  handleDeleteRowConfirm,
  requiredInTable,
}: helperColumnsProps): ColumnProps<EvaluationCriteria>[] => [
  {
    title: () => (
      <div className="payment-font-14">
        {translate("PL.txt_criteria_name")}
        {requiredInTable && <span className="text-danger">&nbsp;*</span>}
      </div>
    ),
    key: ColumnKey.NAME,
    dataIndex: ColumnKey.NAME,
    ellipsis: true,
    width: 400,
    render: (text, record, index) => {
      return (
        <LayoutCell position="center">
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationCriteriaBaseFlag.evaluationCriterias[${index}].name`
            )}
          >
            <InputText
              isTableCell
              value={text}
              placeHolder={translate("PL.plh_criteria_name")}
              onChange={(value) => {
                handleChangeItemTable(
                  model,
                  handleChangeSingleField,
                  ColumnKey.NAME,
                  value,
                  record?.id
                );
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
        {translate("PL.txt_technical_requirements")}
      </div>
    ),
    key: ColumnKey.TECHNICAL_REQUIREMENT,
    dataIndex: ColumnKey.TECHNICAL_REQUIREMENT,
    ellipsis: true,
    width: 300,
    render: (text, record, index) => {
      return (
        <LayoutCell position="center">
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationForm[${index}].technicalRequirement`
            )}
          >
            <InputText
              isTableCell
              value={text}
              placeHolder={translate("PL.plh_technical_requirements")}
              onChange={(value) => {
                handleChangeItemTable(
                  model,
                  handleChangeSingleField,
                  ColumnKey.TECHNICAL_REQUIREMENT,
                  value,
                  record?.id
                );
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
        {requiredInTable && <span className="text-danger">&nbsp;*</span>}
      </div>
    ),
    key: ColumnKey.EVALUATION_USER,
    dataIndex: ColumnKey.EVALUATION_USER,
    ellipsis: true,
    width: 200,
    render: (text, record, index) => {
      return (
        <LayoutCell position="center">
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationCriteriaBaseFlag.evaluationCriterias[${index}].user`
            )}
          >
            <Select
              placeHolder={translate("PL.plh_reviewer")}
              isRequired
              isSearch
              isEnumerable={false}
              onChange={(e, value) => {
                handleChangeItemTable(
                  model,
                  handleChangeSingleField,
                  ColumnKey.USER,
                  value,
                  record?.id
                );
              }}
              getList={purchasingPlanRepository.getListUserEvaluation}
              value={record?.user || text}
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
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationPassFail[${index}].user.email`
            )}
          >
            <InputText
              isTableCell
              value={record?.user?.email || text}
              placeHolder={translate("PL.plh_onlyRead")}
              isSmall={true}
              readOnly
            />
          </FormItem>
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
      return (
        <LayoutCell>
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationPassFail[${index}].note`
            )}
          >
            <InputText
              isTableCell
              value={text}
              placeHolder={translate("PL.plh_note")}
              onChange={(value) => {
                handleChangeItemTable(
                  model,
                  handleChangeSingleField,
                  ColumnKey.NOTE,
                  value,
                  record?.id
                );
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
    title: "",
    key: "action",
    dataIndex: "action",
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

export const handleChangeItemTable = (
  model: PurchasingPlanTypeModel,
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void,
  fieldName: string,
  value: FieldValue,
  id: string
) => {
  const evaluationPassFail = model?.evaluationPassFail.map(
    (item: EvaluationCriteria) => {
      if (id === item?.id) {
        return {
          ...item,
          [fieldName]: value,
        };
      }
      return item;
    }
  );
  handleChangeSingleField({
    fieldName: "evaluationPassFail",
  })(evaluationPassFail);
};
