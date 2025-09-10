import { Col, Row } from "antd";
import { OpinionCollectorIcon } from "assets/icons";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { StandardTable } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SupplierViewContext } from "../../SupplierViewHook";

export const ContactInformation = () => {
  const [translate] = useTranslation();
  const { contactContentColumns, contactContents } =
    useContext(SupplierViewContext);

  return (
    <div className="w-100">
      <Row className="">
        <Col span={24} className=" p-b--xs">
          {isEmpty(contactContents) ? (
            <div className="empty_data_section">
              <img src={OpinionCollectorIcon} alt="Icon" />
              <div className="body">
                <span>{translate("SL.emptyContact")}</span>
              </div>
            </div>
          ) : (
            <StandardTable
              rowKey="id"
              isDragable
              columns={contactContentColumns}
              dataSource={contactContents}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};
