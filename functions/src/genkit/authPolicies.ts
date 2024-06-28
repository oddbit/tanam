import {firebaseAuth} from "@genkit-ai/firebase/auth";

export const isSignedInAuthPolicy = firebaseAuth((user) => {
  console.log("User", user);

  // Place for custom auth policies such as checking custom claims
  // if (!user.email_verified) {
  //   throw new Error("Verified email required to run flow");
  // }
});
