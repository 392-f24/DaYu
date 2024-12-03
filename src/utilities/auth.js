import { auth, db } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await saveUserData(user);
        return user;
    } catch (error) {
        console.error("Error with sign in: ", error.message);
        return null;
    }
};

const saveUserData = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        const firstname = user.displayName?.split(" ")[0] || "";
        const lastname = user.displayName?.split(" ")[1] || "";
        const email = user.email;

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                firstname: firstname,
                lastname: lastname,
                email: email,
                createdDate: new Date(),
            });
            console.log("New user data saved successfully.");
        } else {
            console.log("User already exists in the database.");
        }
    } catch (error) {
        console.error("Error saving user data: ", error.message);
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error(error);
    }
};