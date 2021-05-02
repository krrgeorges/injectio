function inject(code){
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.innerHTML = code
	document.head.append(s)
}

var db = new wsDB("local")
db.createTable("references",["url","position_href","code","added_on"]).then(a=>{
	db.queryTable("references").then(res=>{
		for(var i=0;i<=res.records.length-1;i++){
			var record = res.records[i]
			if(record[1] == 0){
				if(window.location.href == record[0]){
					inject(record[2])
				}
			}
			else if(record[1] == 1){
				if(window.location.href.indexOf(record[0]) >= 0){
					inject(record[2])
				}
			}
		}
	})
})
chrome.runtime.sendMessage({"intent":"setLocation","location":window.location.href},function(data){
	
})

