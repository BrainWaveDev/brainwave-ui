import { supabase } from "../supabase-client"

export const validatePassword = async (email:string,password: string) => {
    const {error } = await supabase.auth.signInWithPassword({
        email: email,   
        password: password,
    })
    if (error) {
        console.log(error)
        throw error
    }
    return true
}

export const updatePassword = async (password: string) => {
    const {error } = await supabase.auth.updateUser({
        password: password,
    })
    if (error) {
        console.log(error)
        throw error
    }
    return true
}

export const signoutUser = async () => {
    const {error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        throw error
    }
    return true
}


export const getProfile = async (user_id:string) => {
    // user id is nessary here becase profile is public by default
    const { data, error } = await supabase.from('profile').select('*').eq('user_id', user_id).single()
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

export const updateProfileName = async (user_id:string, name:string) => {
    const { data, error } = await supabase.from('profile').upsert({ user_id:user_id,user_name: name }).single()
    if (error) {
        console.log(error)
        throw error
    }
    return data
}