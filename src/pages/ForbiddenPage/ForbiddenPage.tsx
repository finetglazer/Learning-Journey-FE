import { BgForbidden } from "assets/images";
import "./ForbiddenPage.scss";
import { useTranslation } from "react-i18next";
import { Button } from "react-components-design-system";
import { useHistory } from "react-router";

const ForbiddenPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleGoBack = () => {
    if (history.action === "REPLACE" && history.length <= 2) {
      history.push("/");
    } else {
      history.goBack();
    }
  };

  return (
    <div className="forbidden-page">
      <img src={BgForbidden} alt="bg_forbidden" />
      <div className="forbidden-page__content">
        <span className="title">{t("FB.title")}</span>
        <span className="content">{t("FB.content")}</span>
        <Button
          onClick={handleGoBack}
          className="btn__back"
          type="primary"
          size="lg"
        >
          {t("FB.btn_back")}
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
