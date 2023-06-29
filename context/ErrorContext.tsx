import { useAppSelector } from "./redux/store";

export function useErrorContext(){
    return {
        errorDispatch: () => {}
    }
}


export const getErrorsFromLocalStorage = () =>
  useAppSelector((state) => state.errors);