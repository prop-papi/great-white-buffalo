import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import userPaneData from "./userPaneData.js";

export default combineReducers({
  local: localData,
  global: globalData,
  userPane: userPaneData
});
