"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { asyncCurrentUser } from "../Store/actions/authActions";
import { asyncGetAllFeedbacks } from "../Store/actions/feedbackAction";
import { asyncgetUser } from "../Store/actions/userActions";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(asyncCurrentUser());
    dispatch(asyncGetAllFeedbacks());
    dispatch(asyncgetUser());
  }, [dispatch]);

  return null;
}
