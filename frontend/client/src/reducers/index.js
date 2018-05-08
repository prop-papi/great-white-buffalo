import { combineReducers } from "redux";
import localData from "./setLocalData.js";
import globalData from "./setGlobalData.js";
import defaultData from "./setDefaultData.js";

export default combineReducers({
  local: localData,
  global: globalData,
  data: defaultData
});
