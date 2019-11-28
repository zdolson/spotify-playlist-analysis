This project's goal is display aggregated song data from a Spotify account's playlist. This data is then displayed on a radar chart.

**Tech Stack:**
- React.js
- Redux (and React-Redux) **Soon to be replaced with React Hooks & Context**
- Router **Soon to be transitioning to Gatsby's Router (reach/router)**
- Bootstrap **Eventual replacement with more custom coding**
- Express.js **May pivot to Boa.ja**
- __To be added: Gatsby.js__
- Spotify API

- Node v12.13.1
- NPM v6.13.1

---

### Do this prior to running any scripts

In the root directory of this repo create a file called `.env`, filling in the CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI with your own Spotify app values.
```
CLIENT_ID=yourIdHereWithNoQuotes
CLIENT_SECRET=yourSecretHereWithNoQuotes
REDIRECT_URI=yourRedirectURIHereWithNoQuotes
```

---

### Available Scripts

In the root directory, you can run:

#### `npm start`

Runs the both the client and server in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view client in the browser.<br>
Server is exposed at [http://localhost:3001](http://localhost:3001).

The client will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm client`

Runs the client in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm server`

Runs the server.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

Any edits on `server.js` will be apparent upon restarting the server.<br>

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!