import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../rtk/user-rtk/user-slice";
import chatReducer from "../rtk/chat-rtk/chat-slice";

const rootReducer = combineReducers({
    user:userReducer,
    chat:chatReducer
});

export default rootReducer