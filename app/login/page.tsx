"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { AccountSettings, Authenticator, Button } from '@aws-amplify/ui-react';

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
              <Button onClick={signOut}>
                Sign Out
              </Button>
              <h4>Change Password</h4>
              <AccountSettings.ChangePassword 
                onSuccess={() => alert('password is successfully changed!')} 
              />
              <h4>Delete User</h4>
              <AccountSettings.DeleteUser onSuccess={() => alert('user has been successfully deleted!')} />
            </>
          )
        }}
      </Authenticator>

      <div>
      </div>
    </main>
  );
}
