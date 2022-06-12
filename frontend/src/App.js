import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "components/Login";
import Main from "components/Main";
import NotFound from "components/NotFound";

import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "reducers/user";
import thoughts from "reducers/thoughts";

const reducer = combineReducers({
  user: user.reducer,
  thoughts: thoughts.reducer
});

const store = configureStore ({reducer});

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Main />}></Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
      </Provider>
  );
};
