
//the function which creates an XMLHttpRequest request object to communicate with the server
function createRequest() {
  try {
    request = new XMLHttpRequest();
  } catch (tryMS) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (otherMS) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
        request = null;
      }
    }
  }	
  return request;
}

//the function which adds multiple event handlers to an event 
function addEventHandler(object,eventName,handlerFunction){
  
  if(document.attachEvent){
    object.attachEvent("on" + eventName, handlerFunction);  //for IE 
  }

  else if(document.addEventListener){
    object.addEventListener(eventName,handlerFunction,false); //for Chrome, Firefox, Safari, Opera, etc...

  }
}


//the function which removes event handlers to an event
function removeEventHandler(object,eventName,handlerFunction){

  if(document.detachEvent){
    object.detachEvent("on" + eventName, handlerFunction);
  }

  else if(document.removeEventListener){
    object.removeEventListener(eventName,handlerFunction,false);
  }
}

//the function to take an event as an argument from browsers and figure out & return the activated object
function getActivatedObject(e){
  var object;

  if(!e){
    object = window.event.srcElement; //early version of IE
  }

  else if(e.srcElement){
    object = e.srcElement;  //IE 7+
  }

  else{
    object = e.target;  //Dom Level 2 browser
  }

  return object;
}

