import { detailService } from "core/services/page-services/detail-service";
import { SupplierEvaluationConfig } from "models/SupplierEvaluationConfig";
import React, { useMemo } from "react";
import { supplierEvaluationConfigRepository } from "../SupplierEvaluationConfigRepository";
import { useHistory } from "react-router";
import { SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE } from "config/route-const";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { EvaluationResult } from "models/EvaluationResult";
import { useTranslation } from "react-i18next";
import { ColumnProps } from "antd/lib/table";
import { EvaluationItem } from "models/EvaluationItem";
import { formatNumber } from "core/helpers/number";

export function useSupplierEvaluationConfigPreviewHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<SupplierEvaluationConfig>(SupplierEvaluationConfig);
  const [translate] = useTranslation();
  const history = useHistory();

  const { isDetail } = detailService.useGetIsDetail(
    supplierEvaluationConfigRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleGoMaster = React.useCallback(() => {
    history.push(SUPPLIER_EVALUATION_CONFIG_MASTER_ROUTE);
  }, [history]);

  const evaluationItemColumns: ColumnProps<EvaluationItem>[] = useMemo(
    () => [
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,

        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,

        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.weight"),
        key: "weight",
        dataIndex: "weight",
        sorter: true,

        render(...params: [number, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationItems.standard"),
        key: "standard",
        dataIndex: "standard",
        sorter: true,
        render(...params: [string, EvaluationItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const evaluationResultColumns: ColumnProps<EvaluationResult>[] = useMemo(
    () => [
      {
        title: translate(
          "supplierEvaluationConfigs.evaluationResults.fromScore"
        ),
        key: "fromScore",
        dataIndex: "fromScore",
        sorter: true,

        render(...params: [number, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierEvaluationConfigs.evaluationResults.toScore"),
        key: "toScore",
        dataIndex: "toScore",

        sorter: true,
        render(...params: [number, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "supplierEvaluationConfigs.evaluationResults.conclude"
        ),
        key: "conclude",
        dataIndex: "conclude",
        sorter: true,
        render(...params: [string, EvaluationResult, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return {
    model,
    isDetail,
    loading,
    setLoading,
    handleGoMaster,
    evaluationItemColumns,
    evaluationResultColumns,
  };
}
