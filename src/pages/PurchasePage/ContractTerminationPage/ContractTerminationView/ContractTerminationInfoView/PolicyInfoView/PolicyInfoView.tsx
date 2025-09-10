import { Col, Row } from "antd";
import { ContractTerminationContextModel } from "models/ContractTermination";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { getBase65ByPath } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGenerationInfoTab/Components/ProposedBasis/helper";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./PolicyInfoView.scss";

const PolicyInfoView = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );
  const [policies, setPolicies] = useState([]);

  const updateDataEditor = async (data: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const imgTags = doc.querySelectorAll("img[src^='eprocurement/']");
    const newListPath = await Promise.all(
      Array.from(imgTags).map(async (img) => {
        const path = img.getAttribute("src");
        if (path) {
          const base64 = await getBase65ByPath(path);
          return { path, base64 };
        }
        return null;
      })
    );

    let newContent = data;
    newListPath.forEach((item) => {
      const base64 = item.base64;
      const path = item.path;
      newContent = newContent.replace(path, base64);
    });
    return newContent;
  };

  const getDataPolicies = async () => {
    const taskContent = await updateDataEditor(model?.taskContent);
    const generalTerms = await updateDataEditor(model?.generalTerms);
    const warrantyTerms = await updateDataEditor(model?.warrantyTerms);

    return [
      {
        title: translate("contractTermination.work_content"),
        content: taskContent,
      },
      {
        title: translate("contractTermination.general_policy_title"),
        content: generalTerms,
      },
      {
        title: translate("contractTermination.warranty_terms_title"),
        content: warrantyTerms,
      },
    ];
  };

  useEffect(() => {
    const fetchData = async () => {
      const policiesData = await getDataPolicies();
      setPolicies(policiesData);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div className="policyinfor-container">
      <Row gutter={16}>
        {policies?.map((p) => (
          <Col key={p.title} className="gutter-row" span={8}>
            <div className="title">{p.title}</div>
            <div className="content">
              <div dangerouslySetInnerHTML={{ __html: p.content }} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PolicyInfoView;
