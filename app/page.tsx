"use client";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/data";
import { getUrl, remove } from 'aws-amplify/storage';
import Link from "next/link";
import { useEffect, useState } from "react";

Amplify.configure(outputs);
const client = generateClient<Schema>();

type FinalPicture = {
  id: string,
  path: string,
  url: string,
  kiwiName: string,
  kiwiLocation: string,
}

export default function App() {
  const [user, setUser] = useState<AuthUser>();
  const [images, setImages] = useState<FinalPicture[]>([]);

  async function fetchUser() {
    try {
      const userDetails = await getCurrentUser();
      setUser(userDetails);

    } catch (error) {
      console.log("User is not logged in:", error);
      setUser(undefined);
    }
  }

  async function fetchPictures() {
    client.models.Picture.observeQuery().subscribe({
      next: async (results) => {
        const newImages: FinalPicture[] = []
        for (const picture of results.items) {
          if (picture.picturePath == undefined) {
            continue;
          }
          const urlResult = await getUrl({
            path: picture.picturePath,
          });

          newImages.push({
            id: picture.id,
            path: picture.picturePath,
            url: urlResult.url.toString(),
            kiwiName: picture.kiwiName,
            kiwiLocation: picture.kiwiLocation,
          });
        }
        setImages([...images, ...newImages]);
      },
    });
  }

  useEffect(() => {
    fetchUser();
    fetchPictures();
  }, []);

  return (
    <main>
      <h3>Community Pictures</h3>
      {images.length === 0 && <Link href="/upload">All the Kiwis are gone! Upload a new one!</Link>}
      <div
        style={{
          overflowY: 'auto',
          maxWidth: '80%',
          margin: '0 auto',
          padding: '1rem',
        }}
      >
        {images.map((picture, index) => (
          <figure
            key={index}
            style={{
              display: 'block',
              margin: '1rem auto',
              clear: 'both',
              padding: '1rem',
              border: '.25rem solid #ccc',
              textAlign: 'center',
            }}
          >
            <a
              href={picture.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src={picture.url}
                alt={`${picture.kiwiName} from ${picture.kiwiLocation}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </a>
            <figcaption
              style={{
                marginTop: '1rem',
                color: '#333'
              }}
            >
              <span
                style={{
                  fontStyle: 'italic',
                }}
              >{`${picture.kiwiName} from ${picture.kiwiLocation}`}</span>
              {user && (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    await client.models.Picture.delete({ id: picture.id });
                    await remove({ path: picture.path });
                    await new Promise(resolve => setTimeout(resolve, 5000));
                  }}
                > 🚫</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
