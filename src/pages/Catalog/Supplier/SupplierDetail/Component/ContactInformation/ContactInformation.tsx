import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import { Button, StandardTable } from "react-components-design-system";
import { Col, Row } from "antd";
import { Add } from "@carbon/icons-react";
import { isEmpty } from "lodash";
import { OpinionCollectorIcon } from "assets/icons";

export const ContactInformation = () => {
  const [translate] = useTranslation();
  const { contactContentColumns, contactContents, handleAddContact } =
    useContext(SupplierDetailContext);

  return (
    <div className="w-100">
      <Row className="">
        <Col span={24} className=" p-b--xs">
          {!isEmpty(contactContents) ? (
            <Button
              type="secondary"
              icon={<Add />}
              iconPlace="left"
              onClick={handleAddContact}
            >
              {translate("SL.addContact")}
            </Button>
          ) : null}
        </Col>
        <Col span={24} className=" p-b--xs">
          {isEmpty(contactContents) ? (
            <div className="empty_data_section">
              <img src={OpinionCollectorIcon} alt="Icon" />
              <div className="body">
                <span>{translate("SL.emptyContact")}</span>
                <Button
                  size="lg"
                  className="btn-opinion"
                  type="secondary"
                  icon={<Add />}
                  iconPlace="left"
                  onClick={handleAddContact}
                >
                  {translate("SL.addContact")}
                </Button>
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
