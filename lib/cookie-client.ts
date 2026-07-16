export interface UserData {
    _id: string; 
    name? : string; 
    email : string;
    role : 'user' | 'admin'; 
    createdAt : string; 
    updatedAt : string; 
    [key:string] : any; 
}

// Client-side cookie functions for browser API calls
export const getAuthTokenClient = (): string | null => {
    if (typeof document === "undefined") return null;
    
    const name = "auth_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

export const getUserDataClient = (): UserData | null => {
    if (typeof document === "undefined") return null;
    
    const name = "user_data=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            try {
                return JSON.parse(cookie.substring(name.length, cookie.length));
            } catch {
                return null;
            }
        }
    }
    return null;
}
