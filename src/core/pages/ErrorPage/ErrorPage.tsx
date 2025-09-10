import { useTranslation } from "react-i18next";
import errorPageStyle from "./ErrorPage.module.scss";
import { Button } from "react-components-design-system";

export function errorHandler() {
  // Do something with the error
  // E.g. log to an error logging client here
}

export default function ErrorPage() {
  const [translate] = useTranslation();

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <div className={errorPageStyle["container"]}>
        <h1>{translate("CM.error_boundary")}</h1>
        <h2>{translate("CM.unexpected_error")}&nbsp;</h2>
        <div className={errorPageStyle["gears"]}>
          <div className={`${errorPageStyle["gear"]} ${errorPageStyle["one"]}`}>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
          <div className={`${errorPageStyle["gear"]} ${errorPageStyle["two"]}`}>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
          <div
            className={`${errorPageStyle["gear"]} ${errorPageStyle["three"]}`}
          >
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
            <div className={errorPageStyle["bar"]}></div>
          </div>
        </div>
        <Button
          className={errorPageStyle["button"]}
          type="secondary"
          size="lg"
          onClick={handleReloadPage}
        >
          {translate("CM.suggestion_reload_page")}
        </Button>
      </div>
    </>
  );
}
