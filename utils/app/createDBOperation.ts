import { PostgrestError } from "@supabase/supabase-js";

export const createDatabaseOperation = (operation: () => any) => {
    let errorCallBack = (error: any) => { };
    let successCallBack = (data: any) => { };

    const executeOperation = async () => {
        const { data, error } = await operation();
        if (error) {
            errorCallBack(error);
        } else {
            successCallBack(data);
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