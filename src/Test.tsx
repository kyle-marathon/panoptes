export default function Test() {
  return <div>test</div>;
}

// import React, { useCallback, useEffect, useState } from "react";
// import { getDatabase, ref, set, onValue } from "firebase/database";

// import { Counter } from "./Counter";
// import { db } from "./setup/setupFirebase";

// import { auth, signInWithGoogle } from "./setup/setupFirebase";
// import { useAuthState } from "react-firebase-hooks/auth";

// const arr = [1, 3, 5, 7];

// const userId = "17";
// const taskId = "0";

// export default function Test() {
//   const [user, loading] = useAuthState(auth);

//   useEffect(() => {
//     if (loading) {
//     } else if (user) {
//     }
//   }, [user, loading]);

//   const handleClick = () => {
//     const db = getDatabase();
//     set(ref(db, `tasks/${userId}/${taskId}`), {
//       title: "my new task",
//       id: `task-${taskId}`,
//       subtasks: [
//         {
//           title: "my friendly subtask",
//           id: `task-${taskId}-0`,
//         },
//         {
//           title: "my friendly subtask",
//           id: `task-${taskId}-1`,
//         },
//       ],
//     });
//   };

//   const memoizedCallback = useCallback(handleClick, []);

//   return (
//     <div>
//       <button className="login__btn login__google" onClick={signInWithGoogle}>
//         Login with Google
//       </button>
//       <button onClick={handleClick}>Click me</button>
//     </div>
//   );
// }
