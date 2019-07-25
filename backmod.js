const cron = require('node-cron');

module.exports.Initiate = function (loc,name) { 
      init(loc,name);
};
module.exports.Create = function (key,val,ttl) { 
      create(key,val,ttl);
};
module.exports.Read = function (key) { 
      var obj=read(key);
      return obj;
};
module.exports.Delete = function (key) { 
      del(key);
};

module.exports.CheckTTL = function () { 
    checkIfTime();
};

let location="";
let nam="";

// Function to create a datastore by providing the location(optional) and name of the username

function init(loc,name){ 
  var fs = require('fs');
  location=loc;
  nam=name;
    if(loc.length>0){
         var dir=loc+'/datastore.json';  // loc is the location passed by the user. For example loc='C:/Users/MyFolder
         fs.open(dir, 'w', function (err, file) {
         if (err) throw err;
         console.log('Created datastore with location provided!');
         });
     }
                                         // else create a default location for the datastore
     else{ 
        //var dir='C:/Users/Viswesh N G/Documents/datastore.json';
        var dir='C:/Users/'+name+'/Documents/datastore.json';
        fs.open(dir, 'w', function (err, file) {
            if (err) throw err;
            else
            console.log('Created datastore at default location!');
        });
     }
}

function create(key,val,ttl){
    
    var fs = require('fs');
    var curtime= new Date().getTime() / 1000;     // gets the time of creation of the key
   
    if(location.length===0){
     var dir='C:/Users/'+nam+'/Documents/datastore.json';
      //var dir='C:/Users/Viswesh N G/Documents/datastore.json';
    }
    else{
        var dir=location+'/datastore.json';
    }
    fs.readFile(dir, function (err, data) {            // The flow of logic here is :
        if(err){                                       // each time a key value pair is to be inserted, we have to check if the file already has some data
            console.log('error is'+err);               // If it does, read the json data, and parse it, and append the new key value pair to the json data and write the new json to the file
        }                                              // If the file is initially empty, the key value pair is written to the file
        else{
            //console.log("data "+data)
            var fileSizeInBytes;
            var stats = fs.stat(dir,function(err,stats){
                //console.log(stats);
                fileSizeInBytes=stats[size];
            });                                       // to find out the size of the file
           
            //console.log("key "+key)
            //console.log(fileSizeInBytes)

         if (fileSizeInBytes>0){                      // if filealready has data
           var json = JSON.parse(data);
            if(json.hasOwnProperty(key)){
             console.log("ERROR : key already exists. Please provide a new key")
           }
           else{
             console.log("file already has stuff");
             var obj={'ttl' : ttl , 'timestamp': curtime, 'value' : val};      // timestamp property of the key stores the time at which the key was created in the file
             var as={}
             as[key]=obj;
             var ob=JSON.stringify(as);
             var size=SizeInUtf8Bytes(ob);
             size=size/1000000.0;
             var fileSizeInBytes; 
            fs.stat(dir,function(err,stats){
                console.log(stats);
                fileSizeInBytes=stats[size];
            });
             var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
             
             if(size+fileSizeInMegabytes<=1000.0){    // Checking if the file size exceeds more than 1 GB
                  json.push(as);
                  fs.writeFile(dir, JSON.stringify(json),function(err){
                    if (err) throw err;
                    console.log('Updated!');
                  });
             }
             else{
                 console.log("cant add object! Size of your Data Store exceeds 1GB")
             }
        }
      }
      else{                                     // if the file doesnt have data
          
        var obj={'ttl' : ttl , 'timestamp': curtime, 'value' : val};
        var as={}
        as[key]=obj;
        var ob=JSON.stringify(as);
        var size=SizeInUtf8Bytes(ob);
        size=size/1000000.0;
        if(size<=1000){
            fs.writeFile(dir, JSON.stringify(as),function(err){
                if (err) throw err;
                //console.log('Updated!'+JSON.stringify(as));
              });
        }
      }
     }
    })
}

// Function to read by providing the key

function read(key){
    var fs = require('fs');
    fs.readFile('datastore.json', function (err, data) {
           if(err){
               console.log(err);
           }
           else{
               //console.log("data "+data);
            var json = JSON.parse(data);
             if(json.hasOwnProperty(key)){            // we check if the particular key exists in the file
                var resu=json[key];
                var result=resu['value'];
                console.log("json value fetched")
                return result;
             }
             else{
                console.log("KEY DOES NOT EXIST!!")
             } 
           }
    })
}

// Function to delete by providing the key

function del(key){
    var fs = require('fs');
    fs.readFile('datastore.json', function (err, data) {
           if(err){
               console.log(err);
           }
           else{
            var json = JSON.parse(data);
             if(json.hasOwnProperty(key)){
                delete json[key];                                                  // if key is present we delete it from the json file
                fs.writeFile("datastore.json", JSON.stringify(json),function(err){
                    if (err) throw err;
                    console.log('Updated!');
                  });
                console.log('key : '+key+' deleted ssuccesfully');
             }
             else{
                console.log("KEY DOES NOT EXIST!!")
             } 
           }
    })  
}

function SizeInUtf8Bytes(str) {                    // function which returns the size of json object in bytes
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  }

// a function that periodically checks for every minute if a key exceeds its time to live in the datastore
// The logic is as follows: The cron scheduler does a the task of checking every minute. The scheduler checks if the difference between the current time and timestamp property of a key
// is less than time to live property of the key. If the difference exceeds TTL the key value pair is removed from the file

function checkIfTime(){                                 
  var fs= require('fs');
  var task = cron.schedule('* * * * *', () => {
    fs.readFile('datastore.json', function (err, data) {     
        if(err){
            console.log(err);
        }
        else{
            var json = JSON.parse(data);
            var curtime=new Date().getTime() / 1000;
          for(var i=0;i<json.length;i++){
              if(curtime-json[key].timestamp>json[key].ttl){
                  delete json[key];
                  fs.writeFile("datastore.json", JSON.stringify(json),function(err){
                    if (err) throw err;
                    console.log('Updated!');
                  });
              }
          }
        }
    })
  })
  task.start();
}