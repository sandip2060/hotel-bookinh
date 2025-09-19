import { useContext } from "react";
import { AppContext } from "./AppContext.jsx";

export const useAppContext = () => useContext(AppContext);