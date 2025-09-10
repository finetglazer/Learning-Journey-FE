import { Col, Row } from "antd";
import { OpinionCollectorIcon } from "assets/icons";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SupplierViewContext } from "../../SupplierViewHook";

export const PaymentInformation = () => {
  const [translate] = useTranslation();
  const { paymentContentColumns, paymentContents } =
    useContext(SupplierViewContext);

  return (
    <div className="w-100">
      <Row className="">
        <Col span={24} className="p-b--xs">
          {isEmpty(paymentContents) ? (
            <div className="empty_data_section">
              <img src={OpinionCollectorIcon} alt="Icon" />
              <div className="body">
                <span>{translate("SL.emptyPayment")}</span>
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
