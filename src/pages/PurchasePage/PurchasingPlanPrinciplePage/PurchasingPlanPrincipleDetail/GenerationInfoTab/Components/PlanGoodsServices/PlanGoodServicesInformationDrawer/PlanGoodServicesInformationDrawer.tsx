import { Col, Row } from "antd";
import { NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";
import { useContext, useEffect } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";

interface Props {
  recordGoodServices: GoodServiceByCategory;
}

const PlanGoodServicesInformationDrawer = ({ recordGoodServices }: Props) => {
  const {
    translate,
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  useEffect(() => {
    if (recordGoodServices) {
      handleChangeAllField({
        ...model,
        manufacturers: recordGoodServices?.manufacturer,
        remainingRequestQuantity: recordGoodServices?.remainingRequestQuantity,
        goodsDescriptions: recordGoodServices?.description,
        goodsNote: recordGoodServices?.note,
      });
    }
  }, [recordGoodServices]);

  return (
    <div>
      {/* Mã hàng hóa --- Tên hàng hóa */}
      <Row gutter={12}>
        <Col lg={8}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_code_goods")}
            value={recordGoodServices?.code}
            isSmall={false}
          />
        </Col>
        <Col lg={16}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_name_goods")}
            value={recordGoodServices?.name}
            isSmall={false}
          />
        </Col>
      </Row>
      {/* Đơn vị tính --- Hãng sản xuất */}
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              readOnly
              isSmall={false}
              label={translate("PL.purchasing_plan_unit_of_measure")}
              value={recordGoodServices?.unit?.name}
            />
          </Col>
          <Col lg={16}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "manufacturers"
              )}
            >
              <Select
                isRequired
                isSmall={false}
                label={translate("PL.purchasing_plan_manufacturer")}
                searchProperty="name"
                searchType=""
                isSearch
                valueFilter={{
                  name: "",
                  isActive: true,
                }}
                getList={purchasingPlanRepository.getListManufacturers}
                onChange={handleChangeSelectField({
                  fieldName: "manufacturers",
                })}
                value={model.manufacturers}
                classFilter={undefined}
                render={(t) => (t ? t?.name : "")}
                isEnumerable={false}
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      {/* Số lượng mua */}
      <div className="p-t--sm">
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "remainingRequestQuantity"
          )}
        >
          <InputNumber
            isRequired
            allowClear={false}
            label={translate("PL.purchasing_plan_purchase_quantity")}
            value={model.remainingRequestQuantity}
            onChange={handleChangeSingleField({
              fieldName: "remainingRequestQuantity",
            })}
            isSmall={false}
            numberType={"DECIMAL"}
            min={0}
            max={NUMBER_MAX_13}
            translate={translate}
          />
        </FormItem>
      </div>
      <div className="p-t--sm">
        <TextArea
          label={translate("PL.principle.title.description_goods")}
          placeHolder={translate("PL.principle.placeholder.description_goods")}
          showCount
          maxLength={4000}
          resize="none"
          onChange={handleChangeSingleField({ fieldName: "goodsDescriptions" })}
          value={model.goodsDescriptions}
          translate={translate}
        />
      </div>
      <div className="p-t--sm">
        <TextArea
          label={translate("PL.purchasing_plan_note")}
          placeHolder={translate("PL.purchasing_plan_note_placeholder")}
          showCount
          maxLength={500}
          resize="none"
          onChange={handleChangeSingleField({ fieldName: "goodsNote" })}
          value={model.goodsNote}
          translate={translate}
        />
      </div>
    </div>
  );
};

export default PlanGoodServicesInformationDrawer;
