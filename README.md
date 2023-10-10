Setting up repo:
- install node.js (for npm)
- install yarn: npm install -g yarn
- in dir above project run: yarn create vite
  project name: your project
  framework: react
  variant: typescript 
  that will create project.
- npm install --save react-dom
  npm install --save-dev @types/react @types/react-dom
  for react and react's types
- in tsconfig.json
  set "moduleResolution" to "Node"
  add "esModuleInterop": true,
- save workspace in VSCode and add in workspace file in settings:
   "[javascript][typescript][html][typescriptreact][javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
