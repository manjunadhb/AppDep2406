import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

let intialStore = {
  loginDetails: {},
};

let loginReducer = (latestStore = intialStore, dispatchedObj) => {
  console.log("inside loginReducer");
  console.log(dispatchedObj);
  if ((dispatchedObj.type = "login")) {
    return { ...latestStore, loginDetails: dispatchedObj.data };
  }

  return latestStore;
};

let tasksReducer = (latestStore = intialStore, dispatchedObj) => {
  console.log("inside tasksReducer");
  console.log(dispatchedObj);
  if ((dispatchedObj.type = "assignTask")) {
    console.log(dispatchedObj.type);
  } else if ((dispatchedObj.type = "submitTask")) {
    console.log(dispatchedObj.type);
  } else if ((dispatchedObj.type = "approveTask")) {
    console.log(dispatchedObj.type);
  } else if ((dispatchedObj.type = "rejectTask")) {
    console.log(dispatchedObj.type);
  }

  return latestStore;
};

let leavesReducer = (latestStore = intialStore, dispatchedObj) => {
  console.log("inside leavesReducer");
  console.log(dispatchedObj);
  if ((dispatchedObj.type = "applyLeave")) {
    console.log(dispatchedObj.type);
  } else if ((dispatchedObj.type = "cancelLeave")) {
    console.log(dispatchedObj.type);
  } else if ((dispatchedObj.type = "postponeLeave")) {
    console.log(dispatchedObj.type);
  }

  return latestStore;
};

let store = createStore(
  combineReducers({ loginReducer, tasksReducer, leavesReducer }),
  applyMiddleware(thunk)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
