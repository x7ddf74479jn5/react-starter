import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { auth } from "@/lib/firebase";

type AuthUser = Pick<
  User,
  "uid" | "displayName" | "email" | "photoURL" | "metadata"
  // | "emailVerified"
  // | "getIdToken"
  // | "getIdTokenResult"
  // | "isAnonymous"
  // | "phoneNumber"
  // | "refreshToken"
>;

type UserState = AuthUser | null;

const userState = atom<UserState>({
  key: "userState",
  default: null,
  dangerouslyAllowMutability: true,
});

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  const userCredential = await _createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const logout = async () => {
  await signOut(auth);
};

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [setUser]);

  return isLoading;
};

export const useUserState = () => {
  return useRecoilValue(userState);
};
