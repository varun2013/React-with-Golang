import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
// import store, { persistor } from "./redux/store";

import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/index.css";
import "jquery/dist/jquery.min.js";
import store from "./redux/store";
import Loader from "./components/common/loader/Loader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={<Loader />} persistor={persistor}> */}
      <Suspense fallback={<Loader />}>
        <Router>
          <AllRoutes />
        </Router>
      </Suspense>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
