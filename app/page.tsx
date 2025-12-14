"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData, list } from 'aws-amplify/storage';
import { Authenticator, Button } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{
    versionId?: string | undefined;
    contentType?: string | undefined;
    lastModified?: Date | undefined;
    size?: number | undefined;
    eTag?: string | undefined;
    path: string;
  }[]>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
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

  async function fetchImages() {
    try {
      // 1. List all items (files) in the specific folder
      const { items } = await list({
        path: 'picture-submissions',
      });

      if (items.length === 0) {
        console.log("No images found in the folder.");
      }

      setImages(items);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  return (
    
      <main>
        <h1>My favorite Kiwi names!</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
        <ul>
          {images.map((todo) => (
            <li key={todo.path}>{todo.path}</li>
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
