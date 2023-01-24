import { doc, onSnapshot } from "firebase/firestore";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { auth, database } from "lib/firebase";
import User from "types/user";

type AuthContext = {
    user: User | null;
    loading: boolean;
};

const authContextDefaultValues: AuthContext = {
    user: null,
    loading: true,
};

const AuthContext = createContext<AuthContext>(authContextDefaultValues);

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [uid, setUid] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUid(user ? user.uid : null);
            if (!user) setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!uid) {
            setUser(null);
            return;
        }

        const unsubscribe = onSnapshot(doc(database, "users/" + uid), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const user: User = {
                    id: uid,
                    email: data.email,
                    name: data.name,
                };
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [uid]);

    return (
        <>
            <AuthContext.Provider value={{ user, loading }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}
