"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData, list, getUrl } from 'aws-amplify/storage';
import Link from "next/link";
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';

Amplify.configure(outputs);

export default function App() {
  const [user, setUser] = useState<AuthUser>();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const userDetails = await getCurrentUser();
      setUser(userDetails);

    } catch (error) {
      console.log("User is not logged in:", error);
      setUser(undefined);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    if (!file) return;

    try {
      // Use a unique key for the file in S3, e.g., combining the file name with a timestamp
      const filename = `${Date.now()}-${file.name}`;

      const response = uploadData({
        path: `picture-submissions/${filename}`,
        data: file,
      });

      const result = await response.result;

      console.log('Successfully uploaded file:', result);
      // You can now store 'result.key' or 'filename' in your database.

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (

    <main>
      <h3>Upload Pictures!</h3>
      <p><Link href="/login">{user ? 'Click to signout.': 'You will need to login.' }</Link></p>
      <input type="file" onChange={handleFileChange} accept="image/*" disabled={!user}/>
      <button onClick={handleUpload} disabled={!user || !file}>
        Upload Image
      </button>

    </main>
  );
}