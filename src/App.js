import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import "./App.scss";
import React from "react";
import { useSelector } from "react-redux";

import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import message from "./i18n";

import Buy from "./pages/Buy";
import Profile from "./pages/Profile";
import Launchpad from "./pages/Launchpad";
import BuyZETH from "./pages/BuyZETH";

import Mine from "./pages/Mine";
import Swap from "./pages/Swap";
import Yield from "./pages/Yield";
// import SwapNew from "./pages/SwapNew";
// import MineDetail from "./pages/MineDetail";

import AppHeader from "components/AppHeader";
import AppSidebar from "components/AppSidebar";
// import AppFooter from "components/AppFooter";

import enUS from "antd/lib/locale/en_US";
// import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";

// const language =
//   localStorage.getItem("language") ||
//   (navigator.language === "zh-CN" ? "zh" : "en");

Date.prototype.getUTCTime = function () {
  return this.getTime() - this.getTimezoneOffset() * 60000;
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: message,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

function App() {
  const { i18n } = useTranslation();
  const theme = useSelector((state) => state.setting.theme);
  const location = useLocation();
  // const [bgNum, setBgNum] = useState(1);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setBgNum((prev) => {
  //       return prev === 3 ? 1 : prev + 1;
  //     });
  //   }, 6000);
  //   // return clearInterval(interval);
  // }, []);

  return (
    <ConfigProvider locale={enUS}>
      <div
        className={`App ${i18n.language} ${
          location.pathname === "/star-cluster" ? "light" : theme
        } ${location.pathname === "/star-cluster" ? "app-star-cluster" : ""} ${
          location.pathname === "/launchpad" ? "launchpad" : ""
        } ${location.pathname === "/profile" ? "profile" : ""} ${
          location.pathname === "/swap" ? "swap" : ""
        } ${location.pathname === "/yield" ? "yield-hubble" : ""}`}
      >
        <AppSidebar />
        <div className="main-content">
          <AppHeader />
          <Switch>
            <Route exact path="/">
              <Redirect to="/mine" />
            </Route>
            <Route path="/buy" component={Buy} />
            <Route path="/profile" component={Profile} />
            <Route path="/launchpad" component={Launchpad} />
            <Route path="/zeth/private" component={BuyZETH} />
            <Route path="/mine" component={Mine} />
            <Route path="/star-cluster" component={Mine} />
            <Route path="/swap" component={Swap} />
            <Route path="/yield" component={Yield} />
            {/* <Route path="/swap-new" component={SwapNew} /> */}
            {/* <Route exact path="/mine/:address" component={MineDetail} /> */}
          </Switch>
          {/* <AppFooter /> */}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
