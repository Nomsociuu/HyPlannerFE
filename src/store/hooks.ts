import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Sử dụng trong toàn bộ app thay vì `useDispatch` và `useSelector` mặc định
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: (selector: (state: RootState) => any) => any =
  useSelector;
