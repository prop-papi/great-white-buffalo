import { combineReducers } from "redux";
import local from "./setLocalData.js";
import global from "./setGlobalData.js";
import notificationsData from "./notificationsReducer.js";
import userPane from "./userPaneData.js";
import currentLounge from "./loungeReducer.js";
import component from "./mainComponentReducer.js";

export default combineReducers({
  local,
  global,
  userPane,
  component,
  notificationsData,
  currentLounge
});
