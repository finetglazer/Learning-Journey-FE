import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual } from "lodash";
import { GoodsServices } from "models/GoodsServices";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { goodsServicesRepository } from "../GoodsServicesRepository";
import { useHistory } from "react-router";
import { GOODS_SERVICES_MASTER_ROUTE } from "config/route-const";
import { ColumnProps } from "antd/lib/table";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { Currency } from "models/Currency";
import { formatNumber } from "core/helpers/number";

export function useGoodsServicesDetailHook() {
  const { model, dispatch: dispatchModel } =
    detailService.useModel<GoodsServices>(GoodsServices);

  const history = useHistory();

  const { isDetail } = detailService.useGetIsDetail(
    goodsServicesRepository.detail,
    dispatchModel
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
  } = fieldService.useField(model, dispatchModel);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const handleGoMaster = React.useCallback(() => {
    history.push(GOODS_SERVICES_MASTER_ROUTE);
  }, [history]);

  const handleSave = React.useCallback(() => {
    setLoading(true);

    const newModel = { ...model };

    goodsServicesRepository
      .saveGoodsServices(newModel)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CM.updateSuccess"),
            });
            handleGoMaster();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
              goodsServicesContents: newModel?.goodsServicesContents,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  }, [handleChangeAllField, handleGoMaster, model, notifyToast, translate]);

  const referencePriceColumn: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("goodsServices.txt_stt"),
        key: "index",
        dataIndex: "index",
        width: "80px",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[2] + 1)} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("goodsServices.referencePrice"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[1]?.referencePriceMin} - ${params[1]?.referencePriceMax}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("goodsServices.currency"),
        key: "currency",
        dataIndex: "currency",
        sorter: true,
        render(...params: [Currency, GoodsServices, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[1]?.currency?.code} useTooltip />
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
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeTreeField,
    handleChangeAllField,
    handleSave,
    referencePriceColumn,
  };
}
