import { Col, Row } from "antd";
import React from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  HandleChangeAllField,
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierContact,
  SupplierModel,
} from "models/PurchasingPlan";
import { utilService } from "core/services/common-services/util-service";
import { combineTextExtra } from "core/helpers/text";
import Insight from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/Components/Insight/Insight";
import { ContentInfoModel } from "models/ContractAdjustment";
import { delay, map, Observable, of } from "rxjs";
import { ModelFilter } from "react-3layer-common";

interface SupplierInfoInfoProps {
  currentItem: SupplierModel;
  model?: PurchasingPlanModel;
  handleChangeAllFieldSupplier: HandleChangeAllField;
  isView?: boolean;
}

export interface TaxBoxProps {
  price: string;
  covertPrice?: string;
  currency: string;
}

export const SupplierInfo: React.FC<SupplierInfoInfoProps> = ({
  currentItem,
  handleChangeAllFieldSupplier,
  isView,
}) => {
  const handleChangeEmail = (object: any) => {
    handleChangeAllFieldSupplier({
      ...currentItem,
      quoteEmailId: object?.id,
      quoteEmail: object?.email,
      quoteName: object?.name,
      phoneNumber: object?.phoneNumber,
      errors: {
        ...currentItem.errors,
        quoteEmail: null,
      },
    });
  };

  return (
    <>
      {!isView ? (
        <RenderDetail
          currentItem={currentItem}
          handleChangeEmail={handleChangeEmail}
        />
      ) : (
        <RenderView data={currentItem} />
      )}
    </>
  );
};

const RenderView = ({ data }: { data: SupplierModel }) => {
  const [translate] = useTranslation();
  const content: ContentInfoModel[] = [
    {
      label: translate("PL.purchasing_plan_tax_code_label"),
      value: data?.taxCode,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_name_supplier"),
      value: data?.name,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_type_supplier"),
      value: data?.supplierType?.name,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
      onClick: null,
    },
    {
      label: translate("PL.drawer_email_person_quoting_price"),
      value: data?.quoteEmail,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate(
        "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
      ),
      value: data?.quoteName,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("SL.txt_phone"),
      value: data?.phoneNumber,
      colSpan: 8,
      isShowTag: false,
      textTag: "",
      isNotBorder: false,
      isShow: true,
      isLink: false,
    },
    {
      label: translate("PL.purchasing_plan_supplier_address"),
      value: data?.address,
      colSpan: 24,
      isShowTag: false,
      textTag: "",
      isNotBorder: true,
      isShow: true,
      isLink: false,
    },
  ];
  return <Insight content={content} />;
};

const RenderDetail = ({
  currentItem,
  handleChangeEmail,
}: {
  currentItem: SupplierModel;
  handleChangeEmail: any;
}) => {
  const [translate] = useTranslation();
  const valueEmailObject = {
    id: currentItem?.quoteEmailId,
    name: currentItem?.quoteName,
    email: currentItem?.quoteEmail,
  };

  const supplierContacts = currentItem?.supplierContacts || [];

  const getSearchingFilter = (
    model: ModelFilter
  ): Observable<SupplierContact[]> => {
    const search = model?.searchText?.contain?.trim().toLowerCase() ?? "";
    return of(supplierContacts).pipe(
      delay(300),
      map((contacts) =>
        contacts?.filter(
          (contact) =>
            contact.email.toLowerCase().includes(search) ||
            contact?.name?.toLowerCase().includes(search)
        )
      )
    );
  };

  return (
    <div>
      <Row gutter={12}>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_tax_code_label")}
            value={currentItem?.taxCode}
            isSmall={false}
          />
        </Col>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.purchasing_plan_name_supplier")}
            value={currentItem?.name}
            isSmall={false}
          />
        </Col>
      </Row>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_type_supplier")}
              value={currentItem?.supplierType?.name}
              isSmall={false}
            />
          </Col>
          <Col lg={12}>
            <InputText
              label={translate("PL.purchasing_plan_supplier_address")}
              value={currentItem?.address}
              readOnly={true}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                currentItem,
                "quoteEmail"
              )}
            >
              <Select
                label={translate("PL.drawer_email_person_quoting_price")}
                placeHolder={translate(
                  "PL.purchasing_plan_supplier_email_of_the_person_quoting_the_price_placeholder"
                )}
                classFilter={SearchingFilterModel}
                searchProperty="searchText"
                isSearch={true}
                isSmall={false}
                getList={getSearchingFilter}
                value={valueEmailObject}
                onChange={(_, object) => {
                  handleChangeEmail(object);
                }}
                isEnumerable={false}
                isRequired
                appendToBody
                render={(valueRender) => {
                  return valueRender?.email;
                }}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <InputText
              label={translate(
                "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price"
              )}
              placeHolder={translate(
                "PL.purchasing_plan_supplier_name_of_the_person_quoting_the_price_placeholder"
              )}
              value={currentItem.quoteName}
              allowClear={true}
              translate={translate}
              readOnly={true}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <InputText
          label={translate("PL.purchasing_plan_phone_number_supplier_label")}
          placeHolder={translate(
            "PL.purchasing_plan_phone_number_supplier_label_placeholder"
          )}
          isSmall={false}
          readOnly={true}
          value={currentItem.phoneNumber}
          maxLength={20}
        />
      </div>
    </div>
  );
};
