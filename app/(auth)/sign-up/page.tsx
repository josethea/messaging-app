"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
      }}
      onSubmit={signUp}
    />
  );
};

export default Page;
