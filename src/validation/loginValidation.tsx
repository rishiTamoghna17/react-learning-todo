import React from "react";
import { users } from "../assets/dummyUser";

export const loginValidation = (email, password) => {
  const user = users.find((user) => user.email === email);
  if (user) {
    if (user.password === password) {
      return { success: true, user };
    } else {
      return { success: false, error: "Incorrect password" };
    }
  } else {
    return { success: false, error: "User not found" };
  }
};
