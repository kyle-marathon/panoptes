import { useEffect } from "react";
// import { auth, signInWithGoogle } from "../setup/setupFirebase";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Login() {
  return <>login test</>;
}

// export default function Test() {
//   const [user, loading, error] = useAuthState(auth);

//   useEffect(() => {
//     if (loading) {
//     } else if (user) {
//     }
//   }, [user, loading]);

//   return (
//     <div>
//       <button className="login__btn login__google" onClick={signInWithGoogle}>
//         Login with Google
//       </button>
//     </div>
//   );
// }
