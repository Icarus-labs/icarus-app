import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.scss";
import React from "react";

import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import message from "./i18n";

import Buy from "./pages/Buy";
import Mine from "./pages/Mine";
import MineDetail from "./pages/MineDetail";

import AppHeader from "components/AppHeader";
import enUS from "antd/lib/locale/en_US";
// import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";

// const language =
//   localStorage.getItem("language") ||
//   (navigator.language === "zh-CN" ? "zh" : "en");

Date.prototype.getUTCTime = function(){ 
  return this.getTime()-(this.getTimezoneOffset()*60000); 
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: message,
    lng: 'en',
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

function App() {
  const { i18n } = useTranslation();
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
      <div className={`App ${i18n.language}`}>
        <div className="container">
          <Router>
            <AppHeader />
            <Switch>
              <Route exact path="/">
                <Redirect to="/mine" />
              </Route>
              <Route exact path="/buy" component={Buy} />
              <Route exact path="/mine" component={Mine} />
              <Route exact path="/mine/:address" component={MineDetail} />
            </Switch>
          </Router>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
