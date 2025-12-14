"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import Link from "next/link";

Amplify.configure(outputs);

export default function App() {
  return (

    <main>
      <h3>Login</h3>
      <Authenticator>
        {({ signOut, user }) => {
          return (
            <>
              <p>Welcome {user?.username}!</p>
              <button onClick={signOut}>
                Sign Out
              </button>
            </>
          )
        }}
      </Authenticator>
      <div>
      </div>
    </main>
  );
}
