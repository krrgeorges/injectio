class wsDB{

    constructor(type){
        if(type == "sync"){
            this.helper = chrome.storage.sync
        }
        else{
            this.helper = chrome.storage.local
        }
    }

    createTable(table_name,column_names){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    data = {"table_name":table_name,"column_names":column_names,records:[]}
                    chrome.storage.local.set({"wsDB":JSON.stringify({"tables":[data]})},function(data){
                        resolve(true)
                    })
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var found = false
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            found = true
                            break
                        }
                    }
                    if(found == false){
                        data["tables"].push({"table_name":table_name,"column_names":column_names,records:[]})
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    resolve(true)
                }
            })
        })
        
    }

    insert(table_name,record_list){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        data["tables"][index]["records"].push(record_list)
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    update(table_name,record_list,index_changes,where_col,where_val){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        var table = data["tables"][index]
                        var col_index = -1
                        for(var i=0;i<=table["column_names"].length-1;i++){
                            if(table["column_names"][i] == where_col){
                                col_index = i
                                break
                            }
                        }
                        if(col_index == -1){
                            reject("Column does not exist")
                        }
                        for(var i=0;i<=table["records"].length-1;i++){
                            if(table["records"][i][col_index] == where_val){
                                var record = table["records"][i]
                                for(var j=0;j<=index_changes.length-1;j++){
                                    record[index_changes[j]] = record_list[index_changes[j]]
                                }
                                table["records"][i]= record
                            }
                        }
                        data["tables"][index] = table
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    delete(table_name,where_col,where_val){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        var table = data["tables"][index]
                        var col_index = -1
                        for(var i=0;i<=table["column_names"].length-1;i++){
                            if(table["column_names"][i] == where_col){
                                col_index = i
                                break
                            }
                        }
                        if(col_index == -1){
                            reject("Column does not exist")
                        }
                        for(var i=0;i<=table["records"].length-1;i++){
                            if(table["records"][i][col_index] == where_val){
                                table["records"].splice(i, 1);
                                i = i-1
                            }
                        }
                        data["tables"][index] = table
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    dropTable(table_name){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        data["tables"].splice(index,1)
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    queryTable(table_name){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        var table = data["tables"][index]
                        var col_names = table["column_names"]
                        var records = table["records"]
                        resolve({"col_names":col_names,"records":records})
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    queryTableRecord(table_name,where_col,where_val){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        var table = data["tables"][index]
                        var col_index = -1
                        for(var i=0;i<=table["column_names"].length-1;i++){
                            if(table["column_names"][i] == where_col){
                                col_index = i
                                break
                            }
                        }
                        if(col_index == -1){
                            reject("Column does not exist")
                        }
                        var records = []
                        for(var i=0;i<=table["records"].length-1;i++){
                            if(table["records"][i][col_index] == where_val){
                                records.push(table["records"][i])
                            }
                        }
                        resolve({"col_names":table["column_names"],"records":records})
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    truncateTable(table_name){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get(["wsDB"],function(data){
                if(data.wsDB == undefined || data.wsDB == null){
                    reject("DB does not exist. Create a table to automatically generate a DB.")
                }
                else{
                    data = JSON.parse(data.wsDB)
                    var index = -1
                    for(var i=0;i<=data["tables"].length-1;i++){
                        if(data["tables"][i]["table_name"] == table_name){
                            index = i
                            break
                        }
                    }
                    if(index >= 0){
                        data["tables"][index]["records"] = []
                        chrome.storage.local.set({"wsDB":JSON.stringify(data)},function(data){
                            resolve(true)
                        })
                    }
                    else{
                        reject("Table does not exist")
                    }
                }
            })
        })
    }

    clearDB(){
        return new Promise((resolve,reject)=>{
            chrome.storage.local.set({wsDB:null},function(data){
                resolve(true);
            })
        })
    }

}