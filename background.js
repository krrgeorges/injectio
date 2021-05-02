const SET_LOCATION = "setLocation"
const GET_LOCATION = "getLocation"

const DEF_RESPONSE = "1"

var current_loc = null


chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
	if(request.intent == SET_LOCATION){
		current_loc = request.location
		sendResponse(DEF_RESPONSE)
	}
	else if(request.intent == GET_LOCATION){
		sendResponse(current_loc)
	}
})