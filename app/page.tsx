"use client";

import { useState, useEffect, useMemo } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData, list, getUrl } from 'aws-amplify/storage';
import { Authenticator, Button } from '@aws-amplify/ui-react';
import Link from "next/link";
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';

Amplify.configure(outputs);

export default function App() {
  const [user, setUser] = useState<AuthUser>();
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{
    versionId?: string | undefined;
    contentType?: string | undefined;
    lastModified?: Date | undefined;
    size?: number | undefined;
    eTag?: string | undefined;
    path: string;
    url: string,
  }[]>([]);

  useEffect(() => {
    fetchUser();
    fetchImages();
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

  async function fetchImages() {
    try {
      const { items } = await list({
        path: 'picture-submissions/', // Trailing backslash designates the folder.
      });

      if (items.length === 0) {
        console.log('No images found in the folder.');
      }
      console.log(items)
      const itemsWithUrl = await Promise.all(items.map(async (x) => {
        const result = await getUrl({
          path: x.path,
        });
        return { ...x, url: result.url.toString() };
      }));
      console.log(itemsWithUrl)

      setImages(itemsWithUrl);
    } catch (error) {
      console.error("Error fetching images:", error);
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
    fetchImages();
  }

  return (

    <main>
      <h3>Community Pictures</h3>
      <div style={{
        maxWidth: '20%',
        margin: 'auto',
        overflow: 'hidden',
        borderRadius: '8px',
      }}>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          gap: '10px',
        }}>
          {images.map((result, index) => (
            <img
              key={index}
              src={result.url}
              style={{
                flex: '1 0 100%',
                scrollSnapAlign: 'start',
                height: 'auto',
                objectFit: 'cover',
                maxWidth: '100%',
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
