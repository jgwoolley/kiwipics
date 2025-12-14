"use client";

import { useState, useEffect, useMemo } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from 'aws-amplify/storage';
import Link from "next/link";
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from "next/navigation";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [user, setUser] = useState<AuthUser>();
  const [file, setFile] = useState<File | null>(null);
  const [kiwiName, setKiwiName] = useState('');
  const router = useRouter();
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
      const picturePath = `picture-submissions/${Date.now()}-${file.name}`;

      const response = uploadData({
        path: picturePath,
        data: file,
        options: {
          metadata: {
            kiwiName: kiwiName,
          },
        },
      });
      console.log(response);

      const contentResult = await response.result;

      console.log('Successfully uploaded content:', contentResult);

      const metadataResult = client.models.Picture.create({
        kiwiName: kiwiName,
        lat: 0,
        long: 0,
        picturePath: picturePath,
      });
      console.log('Successfully uploaded metadata:', metadataResult);

      router.push('/');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const disableUpload = useMemo(() => !user || !file || kiwiName.length === 0, [user, file, kiwiName])

  return (

    <main>
      <h3>Upload Pictures!</h3>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/login">{user ? 'Click to signout.' : 'You will need to login.'}</Link>
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="kiwiImage">Kiwi Image: </label>
        <input
          id="kiwiImage"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          disabled={!user}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="kiwiName">Kiwi Name: </label>
        <input
          id="kiwiName"
          value={kiwiName}
          onChange={(e) => setKiwiName(e.target.value)}
          disabled={!user}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={disableUpload}
        style={{ marginBottom: '1rem' }}
      >
        Upload Image
      </button>

    </main>
  );
}