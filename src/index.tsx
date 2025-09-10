import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import i18nTranslation from "core/config/i18n";

import LoadingPage from "core/pages/LoadingPage/LoadingPage";
import { utilService } from "core/services/common-services/util-service";
import workerService from "core/config/worker";
// Import styles
import "assets/scss/app.scss";
import { externalAssetService } from "core/services/common-services/external-asset-service";
import ConfigStore from "core/config/ConfigStore";

const AppRoot = React.lazy(async () => {
  workerService.startWorker();
  externalAssetService.prepareAssets([
    {
      name: "pdfjsLib",
      src: "/external-script/pdf.min.js",
    },
    {
      name: "PDFLib",
      src: "/external-script/pdf-lib.min.js",
    },
    {
      name: "makeTextPDF",
      src: "https://cdn.jsdelivr.net/gh/snamoah/react-pdf-editor/public/makeTextPDF.js",
    },
  ]);

  await i18nTranslation.initialize();
  const { httpInterceptor } = await import("core/config/http");
  const config = await fetch(
    window.location.origin + "/config/envconfig.json"
  ).then((res) => res.json());
  ConfigStore.getInstance().set("baseApiUrl", config.REACT_APP_BASE_API_URL);
  ConfigStore.getInstance().set(
    "realtimeApiUrl",
    config.REACT_APP_REALTIME_API_URL
  );
  ConfigStore.getInstance().set("isUAT", config.REACT_APP_IS_UAT);
  const isStaging = config.REACT_APP_BASE_API_URL.includes("stg")
    ? true
    : false;
  ConfigStore.getInstance().set("isStaging", `${isStaging}`);
  await Promise.all([
    httpInterceptor.initialize(),
    utilService.cacheImages([]),
  ]);

  return import("app/AppRoot");
});

const app = (
  <BrowserRouter>
    <React.Suspense fallback={<LoadingPage />}>
      <AppRoot />
    </React.Suspense>
  </BrowserRouter>
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(app);
