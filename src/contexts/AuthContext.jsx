import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { auth, facebookProvider, googleProvider } from "../lib/firebase";

// Khi tạo context thì tạo bên ngoài components. Còn nếu use ví dụ như useContext, useState thì phải bỏ vào trong component
export const AuthContext = createContext({
    currentUser: null,
    login: () => { },
    logout: () => { },
    register: () => { },
    updateProfile: () => { },
})

// Tạo provider để chia sẻ state với nhau

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateProfileCurrentUser = async (displayName, photoURL) => {
        await updateProfile(currentUser, { displayName, photoURL });
        setCurrentUser((prev) => ({ ...prev, displayName }))
    }

    const register = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);

    }

    const login = async (type, email, password) => {
        switch (type) {
            case 'google': await signInWithPopup(auth, googleProvider);
                break;
            case 'facebook': await signInWithPopup(auth, facebookProvider);
                break;
            default: signInWithEmailAndPassword(auth, email, password);
                break;
        }
    }

    const logout = async () => {
        await signOut(auth);
    }

    const value = {
        currentUser,
        login,
        logout,
        register,
        updateProfile: updateProfileCurrentUser,
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
            else {
                setCurrentUser(null);
            }
            setLoading(false);
        })
    }, []);
    console.log(currentUser);

    return <AuthContext.Provider value={value}>
        {!loading ? children : <Spinner />}
    </AuthContext.Provider>
}

export default AuthProvider;