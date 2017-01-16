# Redux schema

```

{
  users:{
    isAuthed,
    authedId,
    isFetching,
    error,
    [uid]:{
      lastUpdated,
      info:{
        name,
        email,
        uid,
        avatar,
      }
    }
  }

}



```