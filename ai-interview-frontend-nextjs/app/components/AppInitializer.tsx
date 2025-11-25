"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { asyncCurrentUser } from "../Store/actions/authActions";
import { asyncGetAllFeedbacks } from "../Store/actions/feedbackAction";
import { asyncgetPlans } from "../Store/actions/plansActions";
import { useAppDispatch } from "../Store/hook";

export default function AppInitializer() {
const dispatch = useAppDispatch();
  const response = useSelector((state:any)=>state.authReducer.user);
  useEffect(() => {
    dispatch(asyncCurrentUser());
    dispatch(asyncGetAllFeedbacks());
    dispatch(asyncgetPlans())
  }, [dispatch]);

  return null;
}
