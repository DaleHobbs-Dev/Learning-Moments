# Setting up JSON Server with `npm run api`

This guide explains how to configure your project so you can run your API using `npm run api` instead of typing out the full `json-server` command every time.

---

## Steps

1. **Initialize your project (creates `package.json`)**

   ```bash
   npm init -y
   ```

2. **Install JSON Server locally (version 0.17.4 is stable)**

   ```bash
   npm install json-server@0.17.4 --save-dev
   ```

3. **Verify your JSON Server version**

   ```bash
   npx json-server --version
   ```

   You should see `0.17.4`.

4. **Add a script to your `package.json`**
   Inside the `"scripts"` section, add:

   ```json
   "scripts": {
     "api": "json-server -p 8088 -w api/database.json"
   }
   ```

5. **Run your API**

   ```bash
   npm run api
   ```

---

## Notes

* Running `npm run api` is equivalent to running:

  ```bash
  json-server -p 8088 -w api/database.json
  ```

* The advantage of using `npm run api` is that your team (or future you) doesn’t need to install JSON Server globally. Anyone can clone the project, run `npm install`, and then `npm run api`.

Perfect idea 👍 — here’s an extra blurb you can append to your `SETUP.md` that explains how to **ignore `database.json`** so Live Server doesn’t reload the page every time the API writes to the file.

---

## Optional: Prevent Live Server from refreshing on `database.json` changes

When you use VS Code’s Live Server alongside JSON Server, every time you place an order, `database.json` is updated. By default, Live Server will detect this change and refresh your page — which can be annoying.

To fix this:

1. In your project root, create a new folder called `.vscode`
2. Inside `.vscode`, create a new file named `settings.json`
3. Paste in the following:

   ```json
   {
     "liveServer.settings.ignoreFiles": [
       "**/database.json"
     ]
   }
   ```

4. Restart Live Server

Now Live Server will **ignore `database.json`** changes, and your page won’t auto-refresh every time you submit an order.
