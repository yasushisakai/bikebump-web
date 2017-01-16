# list of views

### main
* first welcome page
* skips if the user is authenticated, redirects to record view
* simple navigation route

### login/signup
* handles authentification of user

### logout
* boring logout

### record
* main view for retriving data
* detects and records sound
* button to start the commute
* navigates to map roads and single user view

### map
* holistic view of map
* will visualise fences, and commutes
* when user is authed, shows own commutes and reports

### roads
* list of roads that contains fences
* to specify the target

### user
* keeps of the record of commutes, fences
* enable to change configuration
* asks follow up questions about specific
* can set neighborhood? what size?
* ranking system

### choose
* able to choose proposals for places that were marked.
* comments