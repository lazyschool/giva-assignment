import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setRole(userDoc.exists() ? userDoc.data().role : null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, isAdmin) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    const role = isAdmin ? "admin" : "user";
    await setDoc(doc(db, "users", newUser.uid), { role });
    setUser(newUser);
    setRole(role);
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    setUser(currentUser);
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    setRole(userDoc.exists() ? userDoc.data().role : null);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
