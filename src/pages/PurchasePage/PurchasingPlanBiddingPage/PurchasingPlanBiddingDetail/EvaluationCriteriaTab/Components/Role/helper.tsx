/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { LIST_ROLE_EVALUATION } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField, FieldValue } from "core/services/service-types";
import { TFunction } from "i18next";
import { isNumber } from "lodash";
import CommonFilter from "models/CommonFilter";
import {
  PurchasingPlanTypeModel,
  EvaluationRole,
  ColumnKey,
} from "models/PurchasingPlan";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputText,
  LayoutCell,
  Select,
} from "react-components-design-system";
import { of } from "rxjs";

type helperColumnsProps = {
  translate: TFunction<"translation", undefined>;
  model: PurchasingPlanTypeModel;
  handleChangeSingleField: (config: ConfigField) => (value: FieldValue) => void;
  handleDeleteRowConfirm: (id: string) => void;
};

export const columns = ({
  translate,
  model,
  handleChangeSingleField,
  handleDeleteRowConfirm,
}: helperColumnsProps): ColumnProps<EvaluationRole>[] => [
  {
    title: () => (
      <div className="payment-font-14">{translate("PL.txt_member")}</div>
    ),
    key: ColumnKey.NAME,
    dataIndex: ColumnKey.NAME,
    ellipsis: true,
    width: 400,
    render: (text, record, index) => {
      return (
        <LayoutCell>
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationRoles[${index}].user`
            )}
          >
            <Select
              placeHolder={translate("PL.plh_member")}
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
              getList={contractRepository.getListUser}
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
    width: 300,
    render: (text, record, index) => {
      return (
        <LayoutCell>
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationRoles[${index}].user.email`
            )}
          >
            <InputText
              isTableCell
              value={record?.user?.email}
              placeHolder={translate("PL.plh_onlyRead")}
              isSmall={true}
              readOnly
              maxLength={300}
              translate={translate}
            />
          </FormItem>
        </LayoutCell>
      );
    },
  },
  {
    title: () => (
      <div className="payment-font-14">{translate("PL.txt_role")}</div>
    ),
    key: ColumnKey.ROLE,
    dataIndex: ColumnKey.ROLE,
    ellipsis: true,
    width: 200,
    render: (text, record, index) => {
      let value = text;
      if (isNumber(value)) {
        value = LIST_ROLE_EVALUATION.find((item) => item.id === text);
      }
      return (
        <LayoutCell>
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationRoles[${index}].role`
            )}
          >
            <Select
              placeHolder={translate("PL.plh_role")}
              isRequired
              isSearch
              isEnumerable={false}
              onChange={(e, value) => {
                handleChangeItemTable(
                  model,
                  handleChangeSingleField,
                  ColumnKey.ROLE,
                  value,
                  record?.id
                );
              }}
              getList={() => of(LIST_ROLE_EVALUATION)}
              value={
                value || LIST_ROLE_EVALUATION.find((item) => item.id === text)
              }
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
      <div className="payment-font-14">{translate("PL.txt_note")}</div>
    ),
    key: ColumnKey.NOTE,
    dataIndex: ColumnKey.NOTE,
    ellipsis: true,
    width: 400,
    render: (text, record, index) => {
      return (
        <LayoutCell>
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `evaluationCriteriaSummary.evaluationRoles[${index}].note`
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
              maxLength={400}
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
  value: Model | string,
  id: string
) => {
  const evaluationRoles = model?.evaluationRoles.map((item: EvaluationRole) => {
    if (id === item?.id) {
      return {
        ...item,
        [fieldName]: value,
      };
    }
    return item;
  });
  handleChangeSingleField({
    fieldName: "evaluationRoles",
  })(evaluationRoles);
};
