## bikebump-web
---
the previous web app is living in the ```fall-semester``` branch.
we will be migrating the code make it to compatible using redux

since the server was detached from this repo, we now need to
have to run that separately.

0. request yasushi for the firebase credential files and exported_roads.json files

1. do ```git clone https://github.com/yasushisakai/bikebump-server.git server``` 
*the directory should be in the same level*
- put the directories/files from Yasushi inside ```server``` folder
  the structure should be like this
  
  ```
  /bikebump
    /server
      /lib
      /data // from Yasushi
      /config //from Yasushi
      /src
    /web // this repo
      ...etc
  ```
  
3. ```cd server```
- ```npm install``` & ```npm run production```
- cd back to this repo
- ```npm install``` & ```npm run start```
- check ```localhost:8081/```

---

