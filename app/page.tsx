"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from 'aws-amplify/storage';
import { Authenticator, useAuthenticator, Button } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [file, setFile] = useState<File | null>(null);

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

  function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    if (!file) return;

    try {
      // Use a unique key for the file in S3, e.g., combining the file name with a timestamp
      const filename = `${Date.now()}-${file.name}`;

      const result = uploadData({
        path: `picture-submissions/${filename}`,
        data: file,
      });

      console.log('Successfully uploaded file:', result);
      // You can now store 'result.key' or 'filename' in your database.

    } catch (error) {
      console.error('Error uploading file:', error);
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
