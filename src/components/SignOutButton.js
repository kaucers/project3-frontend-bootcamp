import React from "react";
import Typography from "@mui/material/Typography";

const SignOutButton = () => {
  const handleSignOut = () => {
    // const auth = getAuth();
    // signOut(auth)
    //   .then(() => {
    //     // Sign-out successful.
    //     // console.log("User signed out successfully");
    //   })
    //   .catch((error) => {
    //     // An error happened.
    //     // console.error("Error occurred while signing out:", error);
    //   });
  };

  return (
    <Typography onClick={handleSignOut} textAlign="center">
      {"Logout "}
    </Typography>
  );
};

export default SignOutButton;
