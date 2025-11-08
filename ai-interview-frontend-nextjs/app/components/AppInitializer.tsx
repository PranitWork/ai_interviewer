"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { asyncCurrentUser } from "../Store/actions/authActions";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(asyncCurrentUser());
  }, [dispatch]);

  return null;
}
