"use client";
import { Provider } from "react-redux";
import {store} from "@/store/Store"

export default function Providers({ children}) {
  console.log(store)
  return <Provider store={store}>{children}</Provider>;
}
