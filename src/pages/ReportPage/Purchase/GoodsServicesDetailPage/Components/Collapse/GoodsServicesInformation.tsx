import { OrderContractDetailInformationModel } from "models/OrderContract/OrderContract";
import ContractInforCommon from "pages/ReportPage/Components/ContractInforCommon/ContractInforCommon";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { getStatus } from "core/helpers/status";
import React from "react";
import { isEqual } from "lodash";

interface GoodsServicesInformationProps {
  data?: OrderContractDetailInformationModel;
}

export default function GoodsServicesInformation({
  data,
}: GoodsServicesInformationProps) {
  const [translate] = useTranslation();

  const contractData = [
    {
      title: translate("report.purchase.goods_services_detail.table.code"),
      text: <OneLineText value={data?.code} />,
    },
    {
      title: translate("report.purchase.goods_services_detail.table.name"),
      text: <OneLineText value={data?.name} />,
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.isImported"
      ),
      text: (
        <OneLineText
          value={
            data?.isImported ? translate("CL.yes_txt") : translate("CL.no_txt")
          }
        />
      ),
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.categoryName"
      ),
      text: <OneLineText value={data?.goodsServicesCategory?.name} />,
    },
    {
      title: translate("report.purchase.goods_services_detail.table.isActive"),
      text: (
        <OneLineText value={translate(getStatus(data?.isActive).keyI18n)} />
      ),
    },
    {
      title: translate(
        "report.purchase.goods_services_detail.table.assetTypeDescription"
      ),
      text: (
        <OneLineText
          value={
            isEqual(data?.assetType, 0)
              ? translate("goodsServices.visible")
              : translate("goodsServices.invisible")
          }
        />
      ),
    },
  ];
  return (
    <div>
      <ContractInforCommon contractData={contractData} column={3} />
    </div>
  );
}
