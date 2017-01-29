## bikebump-web
the previous web app is living in the ```fall-semester``` branch.

## How to run

0. request Yasushi for firebase credentials
1. clone the parent repository

  ``` 
  git clone https://github.com/yasushisakai/bikebump.git
  ```
2. init and update web and server 
  
  ``` 
  cd bikebump
  git submodule update --init web server 
  ```
3. checkout master for both web and server

    ```
    cd web/ s
    git checkout master
    cd ../server/
    git checkout master
    ```
4. put the credential file (from step.1) inside server/config/
5. install & build the server

  ```
  (cd to/server/directory )
  npm install
  npm run build
  ``` 
6. install & run web

  ```
  (cd to/web/directory)
  npm install
  npm run start
  ```
7. check

  check ```localhost:8081/```

---

### node and npm versions
some version may not work, these are tested enviroments

- mac(development), npm v3.10.3, node v6.3.0,
- ubuntu(production), npm v3.10.9, node v7.2.0 
