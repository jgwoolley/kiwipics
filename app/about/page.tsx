"use client";

import "@aws-amplify/ui-react/styles.css";

export default function App() {
    return (
        <main>
            <h3>About</h3>
            <p>Hello! Thanks for stopping by!</p>
            <p>I am <b>James Woolley</b>, and I created this website for my final project for <b>CSCI90: Cloud Services, Infrastructure, and Computing</b>. This is a photo gallery for uploading pictures of everyone's favorite flightless bird the <a href="https://en.wikipedia.org/wiki/Kiwi_(bird)" target="_blank" rel="noopener noreferrer">Kiwi</a>. I spent 6 months working in New Zealand. And I thought it would be fun to theme my project on that trip.</p>

            <h4>Key Features</h4>
            <ul>
                <li>Ability for unauthenticated users to see photos uploaded by other users.</li>
                <li>Ability for authenticated users to upload new photos for other users to see, and delete photos. Users should be required to give the name of the Kiwi pictured.</li>
                <li>Ability to login, signout, change password, and delete account.</li>
            </ul>

            <h4>Links</h4>
            <ul>
                <li><a
                    href="https://github.com/jgwoolley/kiwipics"
                    target="_blank"
                    rel="noopener noreferrer"
                >Source Code</a></li>
                <li><a
                    href="https://youtu.be/XSe2aGDy8-0"
                    target="_blank"
                    rel="noopener noreferrer"
                >Short Video</a></li>
                <li><a
                    // TODO: Fix
                    href="https://www.youtube.com/watch?v=BrWHcQFy5Kc"
                    target="_blank"
                    rel="noopener noreferrer"
                >Long Video</a></li>
            </ul>

            <h4>Technologies Used</h4>
            <ul>
                <li><a
                    href="https://aws.amazon.com/amplify/"
                    target="_blank"
                    rel="noopener noreferrer"
                >AWS Amplify</a>: The core technology demonstrated in this project, Amplify brings together many different AWS products together to create front end applications.</li>
                <ul>
                    <li><a
                        href="https://aws.amazon.com/cognito/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >AWS Cognito</a>: Amplify creates Cognito User Pools to handle client authentication.</li>
                    <li><a
                        href="https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >AWS IAM Identify Center</a>: Amplify can deploy mock environments for developers to test features, and developers use IAM Identity Center to do this.</li>
                    <li><a
                        href="https://aws.amazon.com/s3/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >AWS S3</a>: Customer files are stored in S3, Amplify will create buckets for each deployment (production / feature branches).</li>
                    <li><a
                        href="https://aws.amazon.com/amplify/data/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >AWS AppSync</a>: Customer data is managed through AWS AppSync, creating GraphQL APIs which can be called from the FrontEnd code.</li>
                </ul>
                <li><a
                    href="https://en.wikipedia.org/wiki/Cloudflare"
                    target="_blank"
                    rel="noopener noreferrer"
                >Cloudflare</a>: Domain registration, and DDOS protection.</li>
                <li><a
                    href="https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >GitHub</a>: Is used for hosting both the frontend, and the backend code.</li>
                <li>Developer Tools</li>
                <ul>
                    <li><a
                        href="https://en.wikipedia.org/wiki/TypeScript"
                        target="_blank"
                        rel="noopener noreferrer"
                    >TypeScript</a>: A programming language that complies down to JavaScript, adds features that are nice for developers such as more strict typing.</li>
                    <li><a
                        href="https://en.wikipedia.org/wiki/Npm"
                        target="_blank"
                        rel="noopener noreferrer"
                    ><abbr title="Node Package Manager">NPM</abbr></a>: A package manager which contains many libraries for JavaScript development.</li>
                    <li><a
                        href="https://en.wikipedia.org/wiki/Next.js"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Next.js</a>: A web development framework for creating frontend and backend applications. In my project, we are using mostly frontend capabilities.</li>
                </ul>

            </ul>

            <h4>Considerations</h4>
            <ul>
                <li>There isn't any validation that uploaded images are <abbr title="Safe for Work">SFW</abbr>. Lambdas are built into Amplify, and calls to Amazon Rekognition could be used to do this. </li>
                <li>Users can delete any picture, pictures aren't associated with any specific user.</li>
                <li>There are no limits on the amount or size of pictures a user can upload.</li>
                <li>Some of the original features I had proposed are not included: such as specifying the true location where the picture was taken, or using Geoservices. I didn't want to overcomplicate the project any further.</li>
            </ul>
        </main>
    );
}
