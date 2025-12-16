"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  const [kiwiLocation, setKiwiLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({
    file: null,
    kiwiName: null,
    kiwiLocation: null,
  });

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

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors: Record<string, string | null> = {
      file: null,
      kiwiName: null,
      kiwiLocation: null,
    };

    // Check for file
    if (!file) {
      newErrors.file = "Please select a Kiwi image.";
      isValid = false;
    }

    // Check for Kiwi Name
    if (kiwiName.trim().length === 0) {
      newErrors.kiwiName = "Kiwi Name cannot be empty.";
      isValid = false;
    }

    // Check for Kiwi Location
    if (kiwiLocation.trim().length === 0) {
      newErrors.kiwiLocation = "Kiwi Location cannot be empty.";
      isValid = false;
    }

    setErrors(newErrors);
    console.log('Ran validation function:', isValid, newErrors);
    return isValid;
  }, [file, kiwiName, kiwiLocation]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  }, [setFile]);

  const handleKiwiNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKiwiName(event.target.value);
    }, [setKiwiName, setErrors, errors]);

  const handleKiwiLocationChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKiwiLocation(event.target.value);
    }, [setKiwiLocation, setErrors, errors]);

  const handleUpload: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    async () => {
      if (!validateForm()) {
        // Stop execution if validation fails
        return;
      }

      if (!file) return;

      try {
        const picturePath = `picture-submissions/${Date.now()}-${file.name}`;

        const contentResult = await uploadData({
          path: picturePath,
          data: file,
          options: {
            metadata: {
              kiwiName: kiwiName,
              kiwiLocation: kiwiLocation,
            },
          },
        }).result;
        console.log('Successfully uploaded content:', contentResult);

        const metadataResult = await client.models.Picture.create({
          kiwiName: kiwiName,
          kiwiLocation: kiwiLocation,
          picturePath: picturePath,
        });

        console.log('Successfully uploaded metadata:', metadataResult);

        if(metadataResult.errors && metadataResult.errors.length > 0) {
          alert('Error uploading!')
        } else {
          router.push('/');
        }

      } catch (error) {
        console.error('Error uploading file:', error);
      }

    }, [file, kiwiName, kiwiLocation]);

  return (
    <main>
      <h3>Upload Pictures!</h3>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/login" style={user ? {}: { color: 'red', backgroundColor: 'white', fontSize: '0.9em', marginTop: '0.25rem' }}>{user ? 'Click to signout.' : 'You will need to login.'}</Link>
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
        {errors.file && <p style={{ color: 'red', backgroundColor: 'white', fontSize: '0.9em', marginTop: '0.25rem' }}>{errors.file}</p>}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="kiwiName">Kiwi Name: </label>
        <input
          id="kiwiName"
          value={kiwiName}
          onChange={handleKiwiNameChange}
          disabled={!user}
        />
        {errors.kiwiName && <p style={{ color: 'red', backgroundColor: 'white', fontSize: '0.9em', marginTop: '0.25rem' }}>{errors.kiwiName}</p>}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="kiwiLocation">Kiwi Location: </label>
        <input
          id="kiwiLocation"
          value={kiwiLocation}
          onChange={handleKiwiLocationChange}
          disabled={!user}
        />
        {errors.kiwiLocation && <p style={{ color: 'red', backgroundColor: 'white', fontSize: '0.9em', marginTop: '0.25rem' }}>{errors.kiwiLocation}</p>}
      </div>
      <button
        onClick={handleUpload}
        style={{ marginBottom: '1rem' }}
        disabled={!user}
      >
        Upload Image
      </button>

    </main>
  );
}