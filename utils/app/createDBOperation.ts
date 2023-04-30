import { PostgrestError } from "@supabase/supabase-js";

export const isGeneratedId = (id: number) => {
    return id > 100_000_000_000;
}

export const randomNumberId = () => {
  // generate a random number between 100,000,000 and Number.MAX_SAFE_INTEGER
  // temprory holder for id, replace with db generated id later
  const minValue = 100_000_000_000;
  const maxValue = Number.MAX_SAFE_INTEGER;

  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
} 

export const createDatabaseOperation = (operation: () => any) => {
    let errorCallBack = (error: any) => { };
    let successCallBack = (data: any) => { };

    const executeOperation = async () => {
        const res = await operation();
        console.log("res = ",res);
        if (res.error ) {
            errorCallBack(res.error);
        } else {
            successCallBack(res.data);
        }
    };
    const registerErrorCallBack = (callback: (error: PostgrestError | null) => void) => {
        errorCallBack = callback;
        return {
            onSuccess: registerSuccessCallBack,
            execute: () => executeOperation(),
        };
    };

    const registerSuccessCallBack = (callback: (data: any) => void) => {
        successCallBack = callback;
        return {
            onError: registerErrorCallBack,
            execute: () => executeOperation(),
        };
    };

    return {
        onError: registerErrorCallBack,
        onSuccess: registerSuccessCallBack,
        execute: () => executeOperation(),
    };
};