import { isEmpty } from "lodash";
import { ColumnProps } from "antd/lib/table";
import { TABLE_ROW_KEY, WIDTH_1000 } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import {
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierModel,
} from "models/PurchasingPlan";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputText,
  LayoutCell,
  Modal,
  Select,
  StandardTable,
} from "react-components-design-system";

import { utilService } from "core/services/common-services/util-service";
import { Col, Row } from "antd";
import { Add } from "@carbon/icons-react";
import classNames from "classnames";
import {
  BidderInformationModel,
  ColumnKey,
  PersonInChargeModel,
} from "models/PurchasingPlan/PurchasingPlanBidder";
import { TrashIcon } from "assets/icons";

import "./ModalBidderInformation.scss";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { BidderInformationProps } from "../../BidderInformation";

interface ModalBidderInformationProps extends BidderInformationProps {
  open: boolean;
  handleCancelModal: () => void;
  handleApplyPersonInCharge: (data: PersonInChargeModel[]) => void;
  dataBidderInformation?: BidderInformationModel;
  title?: string;
}

const columnsWidth = {
  personInCharge: 166,
  email: 166,
  phone: 166,
  role: 166,
};

const ModalBidderInformation = (props: ModalBidderInformationProps) => {
  const {
    open,
    handleCancelModal,
    handleApplyPersonInCharge,
    contextValue,
    isDetail = false,
    title,
    titleNameProperty,
  } = props;
  const { translate, model } = contextValue;

  const [data, setData] = useState([new PersonInChargeModel()]);

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SupplierModel>("checkbox", [], false, "auto");

  const handleAddNewPersonInCharge = useCallback(() => {
    const newListData = [...data];
    const lastItem = newListData[newListData.length - 1];
    const newDataObject = new PersonInChargeModel({
      id: `New${lastItem?.id}`,
    });

    newListData.push(newDataObject);

    setData(newListData);
  }, [data]);

  const handleDeletePersonInCharge = useCallback(
    (index: number) => {
      const newListData = [...data];
      const indexData = newListData.findIndex((_, idx) => idx === index);

      newListData.splice(indexData, 1);
      selectedRowKeys.splice(indexData, 1);
      selectedRow.splice(indexData, 1);
      setData(newListData);
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(selectedRow);
    },
    [data, selectedRow, selectedRowKeys, setSelectedRow, setSelectedRowKeys]
  );

  const handleChangeItemTable = useCallback(
    // set any because doesn't know
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ value, key, index }: { value: any; key: string; index: number }) => {
      const newListData = [...data];

      const indexById = newListData.findIndex((_, idx) => idx === index);
      newListData[indexById][key] = value;

      if (key === ColumnKey.PIC) {
        newListData[indexById][ColumnKey.NAME] = value?.name;
        newListData[indexById][ColumnKey.PERSON_IN_CHARGE_ID] = value?.id;
        newListData[indexById][ColumnKey.EMAIL] = value?.email;
        newListData[indexById][ColumnKey.PHONE_NUMBER] = value?.phoneNumber;
        newListData[indexById][ColumnKey.ROLE] = value?.position?.name;
      }
      setData(newListData);
    },
    [data]
  );

  const handleSavePersonInCharge = () => {
    handleApplyPersonInCharge([...data]);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  };

  const handleCloseModal = () => {
    setData(model?.organizationGeneral?.personInChargeInfos || []);
    handleCancelModal();

    setSelectedRowKeys([]);
    setSelectedRow([]);
  };

  const handleDeleteItemsSelected = () => {
    const newListData = [...data].filter(
      (item) => !selectedRowKeys.includes(item.id)
    );

    setData(newListData);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.bidding.title.person_in_charge"),
        key: ColumnKey.PIC,
        dataIndex: ColumnKey.PIC,
        width: columnsWidth.personInCharge,
        render: (value, record, index) => {
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
                  value={value}
                  onChange={(_, item) => {
                    handleChangeItemTable({
                      value: item,
                      key: ColumnKey.PIC,
                      index,
                    });
                  }}
                  isEnumerable={false}
                  isRequired
                  appendToBody
                  disabled={isDetail}
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
        render: (value, _, index) => (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "personInCharge.email"
              )}
            >
              <InputText
                isSmall={true}
                placeHolder={translate("PL.purchasing_plan_email_placeholder")}
                value={value}
                onChange={(value) =>
                  handleChangeItemTable({ value, key: ColumnKey.EMAIL, index })
                }
                maxLength={255}
                disabled={isDetail}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: columnsWidth.phone,
        render: (value, _, index) => (
          <LayoutCell position="center">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "personInCharge.phone"
              )}
            >
              <InputText
                isSmall={true}
                placeHolder={translate("PR.plh_telephone_number")}
                value={value}
                onChange={(value) =>
                  handleChangeItemTable({
                    value,
                    key: ColumnKey.PHONE_NUMBER,
                    index,
                  })
                }
                disabled={isDetail}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: translate("PM.role"),
        key: ColumnKey.ROLE,
        dataIndex: ColumnKey.ROLE,
        width: columnsWidth.role,
        render: (value, _, index) => (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "personInCharge.role"
              )}
            >
              <InputText
                isSmall={true}
                placeHolder={translate("PL.bidding.placeholder.role")}
                value={value}
                onChange={(value) =>
                  handleChangeItemTable({ value, key: ColumnKey.ROLE, index })
                }
                disabled={isDetail}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: "",
        width: isDetail ? 1 : 40,
        render(_, __, index) {
          if (isDetail) return;
          return (
            <LayoutCell>
              <button
                className={"delete-row-btn"}
                onClick={() => handleDeletePersonInCharge(index)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [
      handleChangeItemTable,
      handleDeletePersonInCharge,
      isDetail,
      model,
      translate,
    ]
  );

  useEffect(() => {
    if (model?.organizationGeneral?.personInChargeInfos) {
      setData(
        model.organizationGeneral.personInChargeInfos?.map(
          (item: PersonInChargeModel) => {
            return {
              ...item,
              name: item.name,
              phone: item.phoneNumber,
            };
          }
        ) || []
      );
    }
  }, [
    model?.organizationGeneral?.personInChargeInfos,
    model?.personInChargeInfos,
  ]);

  return (
    <Modal
      open={open}
      title={title}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={isDetail || isEmpty(data)}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCloseModal}
      handleSave={handleSavePersonInCharge}
      className="modal-bidder-information-detail"
    >
      <Row gutter={12} className="mb-3">
        <Col span={12}>
          <InputText
            readOnly={true}
            isSmall={true}
            label={titleNameProperty || translate("PL.bidding.title.name")}
            placeHolder={translate("PL.bidding.placeholder.name")}
            value={model?.userOrganization?.[0]?.name}
          />
        </Col>

        <Col span={12}>
          <InputText
            readOnly={true}
            isSmall={true}
            label={translate("PL.purchasing_plan_supplier_tax_code")}
            placeHolder={translate("PL.purchasing_plan_search_modal_supplier")}
            value={model?.userOrganization?.[0]?.taxCode}
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
            value={model?.userOrganization?.[0]?.address}
          />
        </Col>
      </Row>

      <div className="page-master__table mt-3">
        <div className={classNames("title mb-2")}>
          {translate("PL.bidding.title.person_in_charge_information")}
        </div>
        <FormItem
          validateObject={utilService.getValidateObj(model, "shippingDate")}
        >
          <Button
            className="receiving_date_btn"
            type="secondary"
            size="lg"
            icon={<Add />}
            iconPlace="left"
            onClick={handleAddNewPersonInCharge}
            disabled={isDetail}
          >
            {translate("PL.bidding.button.add_person_in_charge")}
          </Button>
        </FormItem>
        <div className="mt-2">
          {isDetail ? null : (
            <ActionBarComponent
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <Button
                type="secondary"
                size="sm"
                onClick={handleDeleteItemsSelected}
              >
                {translate("CL.delete_btn")}
              </Button>
            </ActionBarComponent>
          )}
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            columns={columns}
            isDragable={true}
            dataSource={data}
            rowSelection={
              isDetail
                ? null
                : {
                    ...rowSelection,
                    renderCell: (value: boolean, record) => {
                      if (record.isTotal) return null;
                      return (
                        <div className="d-flex justify-content-center align-items-center payment-height_40">
                          <Checkbox
                            disabled={isDetail}
                            checked={value}
                            onChange={(e) => {
                              if (e) {
                                setSelectedRowKeys([
                                  ...selectedRowKeys,
                                  record.id,
                                ]);
                                setSelectedRow([...selectedRow, record]);
                              } else {
                                setSelectedRowKeys(
                                  selectedRowKeys.filter(
                                    (key) => key !== record.id
                                  )
                                );
                                setSelectedRow(
                                  selectedRow.filter(
                                    (key) => key.id !== record.id
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      );
                    },
                  }
            }
            scroll={{ y: 414 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalBidderInformation;
