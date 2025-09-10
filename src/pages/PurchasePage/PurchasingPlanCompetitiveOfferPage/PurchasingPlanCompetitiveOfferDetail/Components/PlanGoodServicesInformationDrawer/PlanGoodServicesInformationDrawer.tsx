import { Col, Row } from "antd";
import { NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import {
  FormItem,
  InputNumber,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

type Props = {
  handleChangeSelectFieldGoodServices: any;
  handleChangeSingleFieldGoodServices: any;
  currentItem: GoodServiceByCategory;
};

const PlanGoodServicesInformationDrawer = ({
  handleChangeSelectFieldGoodServices,
  handleChangeSingleFieldGoodServices,
  currentItem,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <div>
      {/* Mã hàng hóa --- Tên hàng hóa */}
      <div>
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_code_goods")}
              value={currentItem?.code}
              isSmall={false}
            />
          </Col>
          <Col lg={16}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_name_goods")}
              value={currentItem?.name}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      {/* Đơn vị tính --- Hãng sản xuất */}
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              readOnly
              isSmall={false}
              label={translate("PL.purchasing_plan_unit_of_measure")}
              value={currentItem?.unit?.name}
            />
          </Col>
          <Col lg={16}>
            <FormItem
              validateObject={utilService.getValidateObj(
                currentItem,
                "manufacturer"
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
                onChange={handleChangeSelectFieldGoodServices({
                  fieldName: "manufacturer",
                })}
                value={currentItem.manufacturer}
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
          validateObject={utilService.getValidateObj(currentItem, "quantity")}
        >
          <InputNumber
            isRequired
            allowClear={false}
            label={translate("PL.purchasing_plan_purchase_quantity")}
            value={currentItem.quantity}
            onChange={handleChangeSingleFieldGoodServices({
              fieldName: "quantity",
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
        <FormItem
          validateObject={utilService.getValidateObj(
            currentItem,
            "description"
          )}
        >
          <TextArea
            label={translate(
              "PL.purchasing_plan_goods_and_services_description"
            )}
            placeHolder={translate(
              "PL.purchasing_plan_goods_and_services_description_placeholder"
            )}
            showCount
            maxLength={4000}
            resize="none"
            onChange={handleChangeSingleFieldGoodServices({
              fieldName: "description",
            })}
            value={currentItem.description}
            translate={translate}
          />
        </FormItem>
      </div>
      <div className="p-t--sm">
        <FormItem
          validateObject={utilService.getValidateObj(currentItem, "note")}
        >
          <TextArea
            label={translate("PL.purchasing_plan_note")}
            placeHolder={translate("PL.purchasing_plan_note_placeholder")}
            showCount
            maxLength={500}
            resize="none"
            onChange={handleChangeSingleFieldGoodServices({
              fieldName: "note",
            })}
            value={currentItem.note}
            translate={translate}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default PlanGoodServicesInformationDrawer;
