$(document).ready(function(){
	chrome.runtime.sendMessage({intent:"getLocation"},function(data){
		if(data == null){
			switchToView("not-view")
		}
		else{
			$("#loc_url").val(data)
			switchToView("form-view")
			var editor = ace.edit("editor");
			editor.setTheme("ace/theme/monokai");
			editor.session.setMode("ace/mode/javascript");
		}
	})

	$("#inject-btn").click(function(){
		processForm();
	})

	$("#view-all-btn").click(function(){
		showReferences()
	})

	$("#go-back-btn").click(function(){
		switchToView("form-view")
	})

	$("#delete-all-btn").click(function(){
		var db = new wsDB()
		db.truncateTable("references").then(a=>{
			showReferences();
		})
	})
})

function switchToView(view){
	var views = ["form-view","not-view","table-view"]
	for(var i=0;i<=views.length-1;i++){
		if(views[i] == view){
			$("#"+views[i]).css("display","block")
		}
		else{
			$("#"+views[i]).css("display","none")
		}
	}
	if(view == "form-view"){
		$("#first-row").css("display","block")
		$("#second-row").css("display","none")
	}
	if(view == "table-view"){
		$("#first-row").css("display","none")
		$("#second-row").css("display","block")
	}
}

function isURL(text){
	var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
	return regex.test(text)
}

function processForm(){
	var position_href = null
	var radio_btns = document.getElementsByName("position-href")
	for(var i=0;i<=radio_btns.length-1;i++){
		if(radio_btns[i].checked == true){
			position_href = radio_btns[i].value
			break
		}
	}
	var url = $("#loc_url").val()
	if(position_href == 0 || position_href == 1){
		if(isURL(url) == false){
			toastr.error("URL not valid")
			return
		}
	}
	var editor = ace.edit("editor");
	var code = editor.getValue()
	var db = new wsDB()
	db.insert("references",[url,position_href,code,new Date().toString()]).then(a=>{
		toastr.success("Injection recorded. Reload the page to activate it.")
	})
}

function showReferences(){
	switchToView("table-view")
	var db = new wsDB()
	db.queryTable("references").then(res=>{
		console.log(res)
		var records = res.records
		var trs = ""
		for(var i=0;i<=records.length-1;i++){
			var phref = null
			if(records[i][1] == "0" || records[i][1] == 0){
				phref = "Exact"
			}
			else if(records[i][1] == "1" || records[i][1] == 1){
				phref = "Contains"
			}
			else if(records[i][1] == "2" || records[i][1] == 2){
				phref = "Regex"
			}
			trs += "<tr><td>"+records[i][0]+"</td><td><input type='text' disabled value='"+records[i][2]+"'/></td><td>"+phref+"</td><td>"+records[i][3]+"</td><td><button type='button' class='btn btn-danger del-ref' data-url='"+records[i][3]+"'>Delete</button></td></tr>"
		}
		$("#tr-container").html(trs)
		$(".del-ref").click(function(){
			console.log($(this).data("url"))
			db.delete("references","added_on",$(this).data("url")).then(a=>{
				showReferences();
			})
		})
	})
}	