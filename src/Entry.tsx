import { useEffect } from "react";

import { ref, get, onValue } from "firebase/database";
// import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { auth } from "./setup/setupFirebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { db, lastIdPath } from "./setup/setupFirebase";
import { RecoilRoot, useSetRecoilState, useRecoilState } from "recoil";

import Login from "./components/Login";
import App from "./App";

import { uidState, lastIdState, pkdState } from "./atoms";
import { UID_KEY } from "./utils/constants";

export function EntryWithRecoil() {
  const [user, loading, error] = useAuthState(auth);
  const [uid, setUid] = useRecoilState(uidState);
  const setPkd = useSetRecoilState(pkdState);
  const setLastId = useSetRecoilState(lastIdState);

  useEffect(() => {
    const localUid = window.localStorage.getItem(UID_KEY);
    if (localUid && !uid) {
      setUid(localUid);
    }
  }, []);

  useEffect(() => {
    get(ref(db, `${uid}/pkd`)).then((snapshot) => {
      setPkd(snapshot.val());
    });
  }, [uid]);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      setUid(uid);
      window.localStorage.setItem(UID_KEY, uid);
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

  if (uid) {
    return <App />;
  } else if (loading) {
    return <></>;
  }

  return <Login />;
}

export default function Entry() {
  return (
    <RecoilRoot>
      <EntryWithRecoil />
    </RecoilRoot>
  );
}
