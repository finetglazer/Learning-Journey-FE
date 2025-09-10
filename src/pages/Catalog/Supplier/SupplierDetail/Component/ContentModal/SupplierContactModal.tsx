import {
  Checkbox,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import React, { useContext, useEffect } from "react";
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import { GetOpinionsInfo } from "assets/icons";

export const SupplierContactModal = () => {
  const {
    visibleContactModal,
    targetContact,
    handleCancelContactModal,
    handleSaveContactModal,
    handleChangeSimpleFieldContact,
    contactContents,
  } = useContext(SupplierDetailContext);

  const checkDefault = React.useMemo(() => {
    if (!contactContents || contactContents?.length === 0) {
      return false;
    } else {
      const filter = contactContents?.filter((item) => {
        return item?.isDefault;
      });
      return filter?.length > 0;
    }
  }, [contactContents, targetContact?.isDefault]);

  const [showWarning, setShowWarning] = React.useState(false);

  const contact = contactContents?.filter(
    (item) => item.id === targetContact?.id
  );

  const handleChangeCheckbox = (value: boolean) => {
    if (contact?.[0]?.isDefault) {
      setShowWarning(false);
      handleChangeSimpleFieldContact("isDefault")(value);
      return;
    }
    if (checkDefault) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      handleChangeSimpleFieldContact("isDefault")(value);
    }
  };

  useEffect(() => {
    if (!visibleContactModal) {
      setShowWarning(false);
    }
  }, [visibleContactModal]);

  const [translate] = useTranslation();
  return (
    <Modal
      open={visibleContactModal}
      title={
        !targetContact?.id
          ? `${translate("SL.contactModal.create")}`
          : `${translate("SL.contactModal.detail")}`
      }
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCancelContactModal}
      onCancel={handleCancelContactModal}
      handleSave={() => handleSaveContactModal(targetContact)}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        {showWarning && (
          <Col lg={24} className="m-b--sm">
            <div
              style={{
                height: "60px",
                backgroundColor: "#e6f2fb",
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                color: "#0673c6",
                border: "#0673c6 1px solid",
              }}
            >
              <img src={GetOpinionsInfo} alt="" height={40} width={40} />
              <span>{translate("SL.contactModal.warningDefault")}</span>
            </div>
          </Col>
        )}
        <Col lg={12} className="m-b--sm">
          <Checkbox
            label={translate("SL.contactModal.isDefault")}
            checked={targetContact?.isDefault}
            onChange={handleChangeCheckbox}
          />
        </Col>
        <Col lg={12} className="m-b--sm">
          <Checkbox
            label={translate("SL.contactModal.isCreateAccount")}
            checked={targetContact?.isCreateAccount}
            onChange={(value) => {
              handleChangeSimpleFieldContact("isCreateAccount")(value);
            }}
          />
        </Col>
        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetContact, "name")}
          >
            <InputText
              isRequired
              maxLength={500}
              label={translate("SL.contactModal.name")}
              placeHolder={translate("SL.contactModal.placeholderName")}
              value={targetContact?.name}
              onChange={handleChangeSimpleFieldContact("name")}
            />
          </FormItem>
        </Col>

        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetContact,
              "position"
            )}
          >
            <InputText
              maxLength={500}
              label={translate("SL.contactModal.position")}
              placeHolder={translate("SL.contactModal.placeholderPosition")}
              value={targetContact?.position}
              onChange={handleChangeSimpleFieldContact("position")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetContact, "phone")}
          >
            <InputText
              isRequired
              maxLength={500}
              label={translate("SL.contactModal.phone")}
              placeHolder={translate("SL.contactModal.placeholderPhone")}
              value={targetContact?.phone}
              onChange={handleChangeSimpleFieldContact("phone")}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetContact, "email")}
          >
            <InputText
              isRequired
              maxLength={500}
              label={translate("SL.contactModal.email")}
              placeHolder={translate("SL.contactModal.placeholderEmail")}
              value={targetContact?.email}
              onChange={handleChangeSimpleFieldContact("email")}
            />
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
};
