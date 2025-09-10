import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import { Button, StandardTable } from "react-components-design-system";
import { Col, Row } from "antd";
import { Add } from "@carbon/icons-react";
import { isEmpty } from "lodash";
import { OpinionCollectorIcon } from "assets/icons";

export const PaymentInformation = () => {
  const [translate] = useTranslation();
  const { paymentContentColumns, paymentContents, handleAddPayment } =
    useContext(SupplierDetailContext);

  return (
    <div className="w-100">
      <Row className="">
        <Col span={24} className="p-b--xs">
          {!isEmpty(paymentContents) ? (
            <Button
              type="secondary"
              icon={<Add />}
              iconPlace="left"
              onClick={handleAddPayment}
            >
              {translate("SL.addPayment")}
            </Button>
          ) : null}
        </Col>
        <Col span={24} className="p-b--xs">
          {isEmpty(paymentContents) ? (
            <div className="empty_data_section">
              <img src={OpinionCollectorIcon} alt="Icon" />
              <div className="body">
                <span>{translate("SL.emptyPayment")}</span>
                <Button
                  size="lg"
                  className="btn-opinion"
                  type="secondary"
                  icon={<Add />}
                  iconPlace="left"
                  onClick={handleAddPayment}
                >
                  {translate("SL.addPayment")}
                </Button>
              </div>
            </div>
          ) : (
            <StandardTable
              rowKey="id"
              isDragable
              columns={paymentContentColumns}
              dataSource={paymentContents}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};
