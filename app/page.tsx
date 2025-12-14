"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData, list, getUrl } from 'aws-amplify/storage';
import { Authenticator, Button } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
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
    fetchImages();
  }, []);

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

  async function fetchImages() {
    try {
      const { items } = await list({
        path: 'picture-submissions/', // Trailing backslash designates the folder.
      });

      if (items.length === 0) {
        console.log("No images found in the folder.");
      }
      console.log(items)
      const itemsWithUrl = await Promise.all(items.map(async (x) => {
        const result = await getUrl({
          path: x.path,
        });
        return {...x, url: result.url.toString()};
      }));
      console.log(itemsWithUrl)

      setImages(itemsWithUrl);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  return (
    
      <main>
        <h1>My favorite Kiwi names!</h1>
        <button onClick={fetchImages}>Fetch Images</button>
        <ul>
          {images.map((result, index) => (
            <li key={index}><img src={result.url} height='50px' /></li>
          ))}
        </ul>
        <Authenticator>
          {({signOut, user}) =>{
            return (
              <>
                <Button onClick={signOut} style={{ marginBottom: '20px' }}>
                  Sign Out
                </Button>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button onClick={handleUpload} disabled={!file}>
                  Upload Image
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
