"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { asyncCurrentUser } from "../Store/actions/authActions";
import { asyncGetAllFeedbacks } from "../Store/actions/feedbackAction";
import { asyncgetPlans } from "../Store/actions/plansActions";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const response = useSelector((state:any)=>state.authReducer.user);
  console.log(response,"user exist")
  useEffect(() => {
    dispatch(asyncCurrentUser());
    dispatch(asyncGetAllFeedbacks());
    dispatch(asyncgetPlans())
  }, [dispatch]);

  return null;
}
