"use client";

import "@aws-amplify/ui-react/styles.css";

export default function App() {
  return (
    <main>
        <h3>About</h3>
        <p>Hello! This is <b>James Woolley</b>, and I created this website for my final project for <b>CSCI90: Cloud Services, Infrastructure, and Computing</b>. Thanks for stopping by! This is a photo gallery for uploading pictures of everyone's favorite flightless bird the Kiwi. I spent 6 months working in New Zealand, and I miss it. I thought it would be fun to theme my final project by paying hommage to this trip.</p>
        
        <h4>Links</h4>
        <ul>
            <li><a
                href="https://en.wikipedia.org/wiki/Kiwi_(bird)"
                target="_blank" 
                rel="noopener noreferrer"
            >Wikipedia: Kiwi</a></li>
            <li><a 
                href="https://github.com/jgwoolley/kiwipics" 
                target="_blank" 
                rel="noopener noreferrer"
            >Source Code</a></li>
            <li><a 
                // TODO: Fix
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                target="_blank" 
                rel="noopener noreferrer"
            >Short Video Explination</a></li>
            <li><a 
                // TODO: Fix
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                target="_blank" 
                rel="noopener noreferrer"
            >Long Video Explination</a></li>
        </ul>
    </main>
  );
}
