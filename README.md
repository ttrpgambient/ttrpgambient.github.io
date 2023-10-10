Setting up repo:
- install node.js (for npm)
- install yarn: `npm install -g yarn`
- in dir above project run: `yarn create vite`
  project name: your project
  framework: react
  variant: typescript 
  that will create project.
- `npm install --save react-dom`
  `npm install --save-dev @types/react @types/react-dom`
  for react and react's types
- in `tsconfig.json`
  set `"moduleResolution"` to `"Node"`
  add `"esModuleInterop": true,`
- save workspace in VSCode and add in workspace file in settings:
  ```
   "[javascript][typescript][html][typescriptreact][javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  ```

Automated deploy:
- on github page in `Settings` -> `Pages`
  change `Source` of `Build and Deploy` to `Github Action`
- create `.github\workflows\static.yml` and copy content from this repo.
  This will create action that deploys page on main when something is submitted to main. 
  So when pull request is requested from dev, main will later run deploy and update website automatically.

Dropbox:
- `npm install --save dropbox`

Env variables:
- add files `.env.development` and `.env.production` in root
- `npm run dev` uses `.env.development`
- `npm run build` uses `.env.production`
- for env variable to be in processed file it needs to start with `VITE_`

Commands:
- `npm run dev` runs server locally 
- `npm run build` builds page to `dist` dir