import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import notificationsData from "./notificationsReducer.js";
import userPaneData from "./userPaneData.js";
import message from "./messageReducer.js";
import currentLounge from "./loungeReducer.js";
import mainComponent from "./mainComponentReducer.js";

export default combineReducers({
  local: localData,
  global: globalData,
  userPane: userPaneData,
  component: mainComponent,
  notificationsData,
  currentLounge
});
