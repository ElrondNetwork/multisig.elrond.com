import React from "react";
import { DappProvider } from "@elrondnetwork/dapp-core";
import { ChainID, NetworkConfig } from "@elrondnetwork/erdjs/out";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { germanTranslations } from "i18n/de";
import { englishTranslations } from "i18n/en";

import { store, persistor } from "redux/store";
import Layout from "./components/Layout";
import PageNotFound from "./components/PageNotFound";
import {
  network,
  walletConnectBridge,
  walletConnectDeepLink,
  chainID,
} from "./config";
import routes from "./routes";

NetworkConfig.getDefault().ChainID = new ChainID(chainID);

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: englishTranslations,
    },
    de: {
      translation: germanTranslations,
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default function App() {
  return (
    <ReduxProvider store={store}>
      <DappProvider
        networkConfig={{ network, walletConnectBridge, walletConnectDeepLink }}
      >
        <Router basename={process.env.PUBLIC_URL}>
          <PersistGate loading={null} persistor={persistor}>
            <Layout>
              <Routes>
                {routes.map((route, i) => (
                  <Route
                    path={route.path}
                    key={route.path + i}
                    element={<route.component />}
                  />
                ))}
                <Route element={PageNotFound} />
              </Routes>
            </Layout>
          </PersistGate>
        </Router>
      </DappProvider>
    </ReduxProvider>
  );
}
