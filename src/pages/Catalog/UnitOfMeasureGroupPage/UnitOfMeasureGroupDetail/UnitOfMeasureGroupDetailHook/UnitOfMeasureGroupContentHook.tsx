/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnitOfMeasureGroup } from "models/UnitOfMeasureGroup";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";
import { UnitOfMeasureGroupContent } from "models/UnitOfMeasureGroupContent";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import { formatNumber } from "core/helpers/number";
import unitOfMeasure from "locales/vi/unit-of-measure";
import { Close } from "@carbon/icons-react";
import { unitOfMeasureGroupRepository } from "../../UnitOfMeasureGroupRepository";
import { utilService } from "core/services/common-services/util-service";

export default function useUnitOfMeasureGroupContentHook(
  unitOfMeasureGroup: UnitOfMeasureGroup,
  handleChangeAllField: (data: UnitOfMeasureGroup) => void,
  mode: "edit" | "view"
) {
  const uomGroupContents = useMemo(() => {
    return unitOfMeasureGroup?.unitOfMeasureGroupContents || [];
  }, [unitOfMeasureGroup]);

  const [translate] = useTranslation();

  const setUomGroupContents = React.useCallback(
    (contents: UnitOfMeasureGroupContent[]) => {
      handleChangeAllField({
        ...unitOfMeasureGroup,
        unitOfMeasureGroupContents: contents,
      });
    },
    [handleChangeAllField, unitOfMeasureGroup]
  );

  const handleChangeConvertUOM = React.useCallback(
    (index: number) => (id: number, T?: UnitOfMeasure) => {
      const newContents = uomGroupContents;
      newContents[index]["conversionUnitName"] = T?.name;
      newContents[index]["conversionUnit"] = T?.id;
      setUomGroupContents(newContents);
    },
    [setUomGroupContents, uomGroupContents]
  );

  const handleChangeSimpleField = React.useCallback(
    (fieldName: string, index: number) => (value: any) => {
      const newContents = uomGroupContents;
      newContents[index][`${fieldName}`] = value;
      setUomGroupContents(newContents);
    },
    [setUomGroupContents, uomGroupContents]
  );

  const handleAddNewContent = React.useCallback(() => {
    const newContent = new UnitOfMeasureGroupContent();
    newContent.unitOfMeasureGroupId = unitOfMeasureGroup.id || undefined;
    newContent.baseUnit = unitOfMeasureGroup?.unitOfMeasureName;
    setUomGroupContents([...uomGroupContents, newContent]);
  }, [
    setUomGroupContents,
    unitOfMeasureGroup.id,
    unitOfMeasureGroup?.unitOfMeasureName,
    uomGroupContents,
  ]);

  const handleRemoveContent = React.useCallback(
    (index: number) => () => {
      const newContents = uomGroupContents;
      newContents.splice(index, 1);
      setUomGroupContents(newContents);
    },
    [setUomGroupContents, uomGroupContents]
  );

  const uomGroupContentColumns: ColumnProps<UnitOfMeasureGroupContent>[] =
    useMemo(
      () => [
        {
          title: translate("CM.txt_numerical_order"),
          key: "number",
          dataIndex: "number",
          sorter: false,
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                <OneLineText value={formatNumber(params[2] + 1)} useTooltip />
              </LayoutCell>
            );
          },
        },

        {
          key: "operation",
          dataIndex: "operation",
          sorter: false,
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                <OneLineText value={"1"} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("unitOfMeasureGroups.content.conversionUnit"),
          key: "conversionUnit",
          dataIndex: "conversionUnit",
          sorter: false,
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                {mode === "view" || params[2] === 0 ? (
                  <OneLineText
                    value={params[1]?.conversionUnitName}
                    useTooltip
                  />
                ) : (
                  <Select
                    placeHolder={translate(
                      "unitOfMeasureGroups.contentPlaceholder.conversionUnit"
                    )}
                    isRequired
                    getList={
                      unitOfMeasureGroupRepository.getDropdownUnitOfMeasure
                    }
                    value={
                      params[1]?.conversionUnit
                        ? {
                            id: params[1]?.conversionUnit,
                            name: params[1]?.conversionUnitName,
                          }
                        : undefined
                    }
                    classFilter={UnitOfMeasureFilter}
                    onChange={handleChangeConvertUOM(params[2])}
                    isSearch
                    searchProperty="search"
                    searchType={null}
                    isEnumerable={false}
                    appendToBody
                  />
                )}
              </LayoutCell>
            );
          },
        },
        {
          title: "=",
          key: "operation",
          dataIndex: "operation",
          sorter: false,
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                <OneLineText value={"="} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          title: translate("unitOfMeasureGroups.content.coefficientValue"),
          key: "coefficientValue",
          dataIndex: "coefficientValue",
          sorter: false,
          render(...params: [number, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                {mode === "view" || params[2] === 0 ? (
                  <OneLineText value={formatNumber(params[0])} useTooltip />
                ) : (
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      params[1],
                      "CoefficientValue"
                    )}
                  >
                    <InputNumber
                      isRequired
                      placeHolder={translate(
                        "unitOfMeasureGroups.contentPlaceholder.coefficientValue"
                      )}
                      value={params[1].coefficientValue}
                      onChange={handleChangeSimpleField(
                        "coefficientValue",
                        params[2]
                      )}
                      numberType={"DECIMAL"}
                    />
                  </FormItem>
                )}
              </LayoutCell>
            );
          },
        },
        {
          title: translate("unitOfMeasureGroups.content.baseUnit"),
          key: "baseUnit",
          dataIndex: "baseUnit",
          sorter: false,
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return (
              <LayoutCell>
                <OneLineText value={params[0]} useTooltip />
              </LayoutCell>
            );
          },
        },
        {
          key: "action",
          dataIndex: "id",
          fixed: "right",
          width: 80,
          align: "center",
          render(...params: [string, UnitOfMeasureGroupContent, number]) {
            return params[2] === 0 ? null : (
              <div className="d-flex justify-content-center button-action-table">
                <Button
                  type="icon-primary"
                  icon={<Close size={16} />}
                  size="sm"
                  onClick={handleRemoveContent(params[2])}
                ></Button>
              </div>
            );
          },
        },
      ],
      [
        handleChangeConvertUOM,
        handleChangeSimpleField,
        handleRemoveContent,
        mode,
        translate,
      ]
    );

  return {
    uomGroupContents,
    setUomGroupContents,
    uomGroupContentColumns,
    handleAddNewContent,
  };
}
