import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, database, handleError } from "lib/firebase";

export async function register(
    name: string,
    email: string,
    password: string
): Promise<boolean> {
    try {
        const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        await setDoc(doc(database, "users", response.user.uid), {
            name: name,
            email: response.user.email,
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function login(email: string, password: string): Promise<boolean> {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function logout(): Promise<boolean> {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function resetPassword(email: string): Promise<boolean> {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}
