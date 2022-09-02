import { useEffect } from "react";

import { getDatabase, ref, set, onValue } from "firebase/database";
import firebase from "firebase/compat/app";
// import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { auth } from "./setup/setupFirebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { db, lastIdPath } from "./setup/setupFirebase";
import {
  RecoilRoot,
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
} from "recoil";

import Login from "./components/Login";
import App from "./App";

import { uidState, lastIdState } from "./atoms";

export function EntryWithRecoil() {
  const [user, loading, error] = useAuthState(auth);
  const setUid = useSetRecoilState(uidState);
  const setLastId = useSetRecoilState(lastIdState);

  useEffect(() => {
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const idRef = ref(db, `${user.uid}/${lastIdPath}`);
      onValue(idRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLastId(data);
        }
      });
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (!user) {
    return <Login />;
  }

  return <App />;
}

export default function Entry() {
  return (
    <RecoilRoot>
      <EntryWithRecoil />
    </RecoilRoot>
  );
}
