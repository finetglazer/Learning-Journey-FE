import { isEmpty } from "lodash";
import { ColumnProps } from "antd/lib/table";
import { TABLE_ROW_KEY, WIDTH_1000 } from "core/config/consts";
import {
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierModel,
} from "models/PurchasingPlan";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  FormItem,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { Col, Row } from "antd";
import classNames from "classnames";
import {
  BidderInformationModel,
  ColumnKey,
  PersonInChargeModel,
} from "models/PurchasingPlan/PurchasingPlanBidder";
import { useTranslation } from "react-i18next";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";

type props = {
  open: boolean;
  handleCancelModal: () => void;
  handleApplyPersonInCharge: (data: PersonInChargeModel) => void;
  contextValue: PurchasingPlanModel;
  dataBidderInformation?: BidderInformationModel;
  titleModal?: string;
  selectedSupplier: SupplierModel;
  setSelectedSupplier: Dispatch<SetStateAction<SupplierModel>>;
  isDetail?: boolean;
};

const columnsWidth = {
  personInCharge: 166,
  email: 166,
  phone: 166,
  role: 166,
};

const ModalSupplierInformation = (props: props) => {
  const [translate] = useTranslation();
  const {
    open,
    handleCancelModal,
    handleApplyPersonInCharge,
    contextValue,
    titleModal = translate("PL.bidding.title.supplier_information"),
    selectedSupplier,
    setSelectedSupplier,
    isDetail = false,
  } = props;
  const { model } = contextValue;

  const [data, setData] = useState([new PersonInChargeModel()]);

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PL.bidding.title.person_in_charge")}
          </div>
        ),
        key: ColumnKey.PERSON_IN_CHARGE,
        dataIndex: ColumnKey.PERSON_IN_CHARGE,
        width: columnsWidth.personInCharge,
        render: (_, record) => {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "personInCharge.personInCharge"
                )}
              >
                <Select
                  isSmall={true}
                  placeHolder={translate(
                    "PL.bidding.placeholder.person_in_charge"
                  )}
                  classFilter={SearchingFilterModel}
                  searchProperty="searchText"
                  isSearch={true}
                  getList={purchasingPlanRepository.listMasterUser}
                  value={record?.pic || record}
                  onChange={(value, item) => {
                    setSelectedSupplier({
                      ...selectedSupplier,
                      [ColumnKey.PERSON_IN_CHARGE]: [
                        {
                          ...item,
                          pic: item,
                        },
                      ],
                    });
                    setData([item]);
                  }}
                  isEnumerable={false}
                  disabled={isDetail}
                  isRequired
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: columnsWidth.email,
        render: () => (
          <LayoutCell>
            <OneLineText value={data?.[0]?.email} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE,
        dataIndex: ColumnKey.PHONE,
        width: columnsWidth.phone,
        render: () => (
          <LayoutCell>
            <OneLineText value={data?.[0]?.phone || data?.[0]?.phoneNumber} />
          </LayoutCell>
        ),
      },
    ],
    [translate, model, selectedSupplier, setSelectedSupplier, data]
  );

  useEffect(() => {
    if (selectedSupplier?.personInChargeInfos?.[0]?.pic) {
      setData([
        {
          ...selectedSupplier.personInChargeInfos[0].pic,
          phoneNumber: selectedSupplier.personInChargeInfos[0].pic.phoneNumber,
          email: selectedSupplier.personInChargeInfos[0].pic.email,
        },
      ]);
    } else {
      setData([
        {
          id: "0",
          phoneNumber: "",
          email: "",
          name: "",
        },
      ]);
    }
  }, [selectedSupplier]);

  return (
    <Modal
      open={open}
      title={titleModal}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={isEmpty(
        selectedSupplier?.[ColumnKey.PERSON_IN_CHARGE]
      )}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCancelModal}
      handleSave={() => handleApplyPersonInCharge(selectedSupplier)}
      className={"modal-bidder-information-detail"}
    >
      <Row gutter={12} className="mb-3">
        <Col span={12}>
          <InputText
            readOnly={true}
            isSmall={true}
            label={translate("PL.purchasing_plan_supplier_tab")}
            placeHolder={translate("PL.bidding.placeholder.supplier_name")}
            value={selectedSupplier?.name || selectedSupplier?.supplier?.name}
          />
        </Col>

        <Col span={12}>
          <InputText
            readOnly={true}
            isSmall={true}
            label={translate("PL.purchasing_plan_supplier_tax_code")}
            placeHolder={translate("PL.purchasing_plan_search_modal_supplier")}
            value={
              selectedSupplier?.taxCode || selectedSupplier?.supplier?.taxCode
            }
          />
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={24}>
          <InputText
            readOnly={true}
            isSmall={true}
            label={translate("PL.purchasing_plan_supplier_address")}
            placeHolder={translate("CT.enter_address")}
            value={
              selectedSupplier?.address || selectedSupplier?.supplier?.address
            }
          />
        </Col>
      </Row>

      <div className="page-master__table mt-3">
        <div className={classNames("title mb-2")}>
          {translate("PL.bidding.title.person_in_charge_information")}
        </div>
        <StandardTable
          className="mt-2"
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          isDragable={true}
          dataSource={data}
          scroll={{ y: 414 }}
        />
      </div>
    </Modal>
  );
};

export default ModalSupplierInformation;
