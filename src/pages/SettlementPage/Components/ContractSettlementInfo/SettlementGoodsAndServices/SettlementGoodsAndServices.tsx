import { ChevronDown, ChevronRight } from "@carbon/icons-react";
import { DownloadSimple, EmptyAssetIcon } from "assets/icons";
import uploadSimple from "assets/icons/uploadSimple.svg";
import EmptyInitTable from "components/EmptyInitTable/EmptyInitTable";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { addNumberRoundFour, addNumberRoundTwo } from "core/helpers/number";
import { GoodsItemsType, SettlementHookModel } from "models/Settlement";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useState } from "react";
import { Button, StandardTable } from "react-components-design-system";
import DrawerSettlementGoodsServices from "../DrawerSettlementGoodsServices/DrawerSettlementGoodsServices";
import "./SettlementGoodsAndServices.scss";
import UseColumnsContractSettlement, {
  convertDataWithChildren,
} from "./UseColumnsContractSettlement/UseColumnsContractSettlement";

const SettlementGoodsAndServices = () => {
  const { translate, model, handleChangeSingleField, handleChangeAllField } =
    useContext<SettlementHookModel>(SettlementHookContext);
  const [
    openDrawerSettlementGoodsServices,
    setOpenDrawerSettlementGoodsServices,
  ] = useState<boolean>(false);
  const [recordEdit, setRecordEdit] = useState<GoodsItemsType>();

  const handleCloseDrawer = () => {
    setOpenDrawerSettlementGoodsServices(false);
  };

  const { columns } = UseColumnsContractSettlement({
    model,
    setRecordEdit,
    setOpenDrawerSettlementGoodsServices,
  });

  const handleSaveDrawer = () => {
    const errors: Record<string, unknown> = {};
    if (!model?.noteSettlement) {
      errors["noteSettlement"] = translate("CM.input_require_validation");
    }
    handleChangeAllField({
      ...model,
      errors,
    });

    const note = model?.noteSettlement?.replaceAll("\n", "");

    if (
      model?.goodServicesDetails?.[0]?.quantity != null &&
      model?.goodServicesDetails?.[0]?.unitPrice != null &&
      model?.goodServicesDetails?.[0]?.reducedPrice != null &&
      model?.goodServicesDetails?.[0]?.taxAmount != null &&
      model?.goodServicesDetails?.[0]?.totalExchangeAmount != null &&
      note?.length <= 500
    ) {
      const dataGoodsServices = model?.goodsItems?.map(
        (item: GoodsItemsType) => {
          if (
            item?.contractGoodsItem?.id === recordEdit?.contractGoodsItem?.id
          ) {
            const totalAmountContract =
              model?.contactOrderInfo?.currency == VND_CURRENCY_UNIT
                ? model?.goodServicesDetails[1]?.contractTotalPrice +
                  model?.goodServicesDetails[1]?.contractTaxAmount
                : addNumberRoundFour(
                    model?.goodServicesDetails[1]?.contractTotalPrice +
                      model?.goodServicesDetails[1]?.contractTaxAmount
                  );
            const rawTotalAmount =
              Number(model?.goodServicesDetails?.[0]?.totalAmount) || 0;
            const rawTotalAmountContract = Number(totalAmountContract) || 0;
            const difference = rawTotalAmount - rawTotalAmountContract;

            const totalAmount =
              model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                ? difference
                : addNumberRoundFour(difference);

            return {
              ...item,
              quantity: model?.goodServicesDetails?.[0]?.quantity,
              unitPrice: model?.goodServicesDetails?.[0]?.unitPrice,
              totalPrice: model?.goodServicesDetails?.[0]?.totalPrice,
              reducedPrice: model?.goodServicesDetails?.[0]?.reducedPrice,
              tax: model?.goodServicesDetails?.[0]?.tax,
              taxAmount: model?.goodServicesDetails?.[0]?.taxAmount || 0,
              totalAmount: model?.goodServicesDetails?.[0]?.totalAmount,
              totalExchangeAmount:
                model?.goodServicesDetails?.[0]?.totalExchangeAmount || 0,
              note: model?.noteSettlement,
              diffQuantity:
                (model?.goodServicesDetails[0]?.quantity ?? 0) -
                (model?.goodServicesDetails[1]?.contractQuantity ?? 0),
              diffUnitPrice:
                model?.contactOrderInfo?.currency == VND_CURRENCY_UNIT
                  ? (model?.goodServicesDetails[0]?.unitPrice ?? 0) -
                    (model?.goodServicesDetails[1]?.contractUnitPrice ?? 0)
                  : addNumberRoundFour(
                      (model?.goodServicesDetails[0]?.unitPrice ?? 0) -
                        (model?.goodServicesDetails[1]?.contractUnitPrice ?? 0)
                    ),
              diffTotalPrice:
                model?.contactOrderInfo?.currency == VND_CURRENCY_UNIT
                  ? (model?.goodServicesDetails[0]?.totalPrice ?? 0) -
                    (model?.goodServicesDetails[1]?.contractTotalPrice ?? 0)
                  : addNumberRoundTwo(
                      (model?.goodServicesDetails[0]?.totalPrice ?? 0) -
                        (model?.goodServicesDetails[1]?.contractTotalPrice ?? 0)
                    ),
              diffReducedPrice:
                model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                  ? (model?.goodServicesDetails?.[0]?.reducedPrice ?? 0) -
                    (model?.goodServicesDetails?.[1]?.contractReducedPrice ?? 0)
                  : addNumberRoundFour(
                      (model?.goodServicesDetails?.[0]?.reducedPrice ?? 0) -
                        (model?.goodServicesDetails?.[1]
                          ?.contractReducedPrice ?? 0)
                    ),
              diffTaxAmount:
                (model?.goodServicesDetails?.[0]?.taxAmount ?? 0) -
                (model?.goodServicesDetails?.[1]?.contractTaxAmount ?? 0),
              diffTotalAmount: totalAmount,
              diffTotalExchangeAmount:
                model?.contactOrderInfo?.currency === VND_CURRENCY_UNIT
                  ? (model?.goodServicesDetails?.[0]?.totalExchangeAmount ??
                      0) -
                    (model?.goodServicesDetails?.[1]
                      ?.contractTotalExchangeAmount ?? 0)
                  : addNumberRoundFour(
                      (model?.goodServicesDetails?.[0]?.totalExchangeAmount ??
                        0) -
                        (model?.goodServicesDetails?.[1]
                          ?.contractTotalExchangeAmount ?? 0)
                    ),
            };
          }
          return item;
        }
      );

      handleChangeSingleField({
        fieldName: "goodsItems",
      })(dataGoodsServices);
      setOpenDrawerSettlementGoodsServices(false);
    }
  };

  const tableData = convertDataWithChildren(model.goodsItems);

  return (
    <div className="contract-settlement-info-tab p--sm">
      {!model.goodsItems || model.goodsItems?.length === 0 ? (
        <EmptyInitTable
          isSolid={false}
          textButtonLeft={translate("settlement.upload_file_settlement")}
          textButtonRight={translate(
            "settlement.download_sample_file_settlement"
          )}
          content={
            <div>
              {translate("settlement.empty_settlement_goods_and_services")}
            </div>
          }
          icon={<img src={EmptyAssetIcon} alt="" />}
          buttonIconLeft={<img src={uploadSimple} alt="" />}
          buttonIconRight={<img src={DownloadSimple} alt="" />}
          disableButtonLeft={false}
          disableButtonRight={false}
        />
      ) : (
        <div>
          <div className="d-flex m-b--xs">
            <Button
              className="m-r--2xs"
              icon={<img src={uploadSimple} alt="" />}
              iconPlace="left"
              type="secondary"
            >
              {translate("settlement.upload_file_settlement")}
            </Button>
            <Button
              icon={<img src={DownloadSimple} alt="" />}
              iconPlace="left"
              type="tertiary"
            >
              {translate("settlement.download_sample_file_settlement")}
            </Button>
          </div>

          <StandardTable
            rowKey={"id"}
            columns={columns}
            dataSource={tableData}
            isDragable={true}
            idContainer="table-id"
            scroll={{ y: "calc(100vh - 320px)" }}
            className="custom-table"
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) => {
                if (record.isTotal) {
                  return null;
                }
                if (record.children && record.children.length > 0) {
                  return (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpand(record, e);
                      }}
                    >
                      {expanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </span>
                  );
                }
                return null;
              },
              defaultExpandAllRows: true,
            }}
          />
        </div>
      )}

      {openDrawerSettlementGoodsServices && (
        <DrawerSettlementGoodsServices
          visible={openDrawerSettlementGoodsServices}
          handleClose={handleCloseDrawer}
          handleSave={handleSaveDrawer}
          recordGoodServices={recordEdit}
        />
      )}
    </div>
  );
};

export default SettlementGoodsAndServices;
