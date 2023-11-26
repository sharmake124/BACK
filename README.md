# BACK

pour que le test function correctement  il faut suivre ses etape: 
1- npm install 

2 : npm install --save-dev jest
3- npm install --save-dev supertest
4- une fois les modules installés, il faut faire petite modif dans le package.json
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"  ( ici il faut que ça soit "jest" )
  },
