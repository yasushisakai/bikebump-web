var getLatLng = function(component){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position)=>{
        component.setLatLng(position);
      },
      (error)=>{console.error(error.message)}
    )
  }else{
    console.error('browser does not know how to obtain latlng');
  }
}

module.exports = getLatLng;
