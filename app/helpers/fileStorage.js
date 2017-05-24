window.requestFileSystem = window.requestFileSystem ||
                          window.webkitRequestFileSystem;
function FileStorage() {
  this.state = "online"
  this.fs

  //list of ids. Delete ids in delete function
  uploadTasks = {}
  requestedBytes = 1024*1024*10*10*10*10*10 //1/2 MB * 10 soundclips per commute * 2 commute per day * 5 days per week * 4 weeks = 200 mb. User would need 600 mb available.

  //REQUEST CLIENT FOR STORAGE
  this.init = function () {
    p = new Promise(strapInit)
    return p
  }
  //Reject if storage is not high enough or not chrome browser
  strapInit = function(resolve, reject) {
      navigator.webkitPersistentStorage.requestQuota (
          requestedBytes, function(grantedBytes) {
               console.log(grantedBytes)
              window.requestFileSystem(PERSISTENT, grantedBytes, success, reject)
          }, reject)
      success = function(fs) {
      this.fs = fs
      console.log(this.fs)
      resolve('success')
    }
    success.bind(this)
  }
  strapInit.bind(this)


  //WRITE BLOBS TO FILE SYSTEM
  this.writeBlob = function(blob, id) {
    fs.root.getFile('soundclip-'+id,  {create:true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {

         fileWriter.onwriteend = function(e) {
           console.log('Write completed.', id)
           //RESOLVE PROMISE
         }

         fileWriter.onerror = function(e) {
           console.log('Write failed: ' + e.toString())
         }

         fileWriter.write(blob)

       }, errorHandler)

     }, errorHandler)

  }

  //UPLOAD BLOBS TO FIREBASE AND DELETE BLOBS FROM FILE SYSTEM
  this.uploadFiles = function() {
    getandSendFiles(this,fs.root)
  }

  this.cancelUploads = function () {
    if (uploadTasks.length > 0) {
        for (uploadTask of uploadTasks) {
          uploadTask.cancel()
        }
      uploadTasks = {}
    }
  }
  //list of references of files
  function getandSendFiles (ctx, directory) {
    dirReader = directory.createReader()
    p = new Promise(function(resolve, reject) {
        dirReader.readEntries(getFilesCallBack, errorHandler)
        function getFilesCallBack(files) {
          resolve(files)
        }
    })
    //read files after I get refrences to all files
    p.then(function(files) {
      readFiles(ctx,files)
    })
  }

  function readFiles (ctx,entries) {
    for (entry of entries) {
      function send(entry) {
        entry.file(function(file) {
          //if (ctx.state == "offline"){
            //return
          //}
          id = file.name.split('-')[1]
          sendBlob(file,id)
        }, errorHandler);
      }
      send(entry)
    }
  }

  function sendBlob(blob,id) {
    console.log(blob)
    //INSERT STOREBLOB HERE
    ref = storage.ref().child("soundclip-"+id+".txt")
    uploadTask = ref.put(blob)
    uploadTasks[id] = uploadTask
    //////////////////////////

    monitorUploadProgress(uploadTask,id)
    success = function(snapshot) {
      console.log('Uploaded a blob or file!', id);
      delete uploadTasks[id]
      //insert delete from list of ids
      deleteBlob(id)
    }
    uploadTask.then(success)
  }

  //FOR UI PURPOSES: MAY wANT TO UPDATE HTML ELEMENTS
  function monitorUploadProgress(uploadTask, id) {
    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload '+id+ ' is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload '+id+' is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload ' +id+' is running');
          break;
      }
    })
  }

  function deleteBlob(id) {
    console.log("Delete", id)
    fs.root.getFile('soundclip-'+id, {}, function(fileEntry) {
      fileEntry.remove(function() {
        console.log("File Removed")
      },errorHandler)
    },errorHandler)
  }

  function errorHandler(e) {
    console.log('Error', e)
  }
}
