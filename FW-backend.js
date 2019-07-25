// This file is just a sample show of how a client running some process can use the datastore to create, retreive or delete key value pairs
var bmod=require('./backmod.js');   // imports the library required to work with datastore

/* Client running some process 
.
.
.
.
.

*/

// The part of his process where the client can make use of the datastore

//bmod.CheckTTL();                                 // This function periodically (typically every minute) checks if a key in the datastore has exceeded it's time to live

var loc="";          // user is expected to enter the location into the string 'loc', he can pass an empty string too to indicate that he doesnt care about the location of the datastore on his laptop

var name="Viswesh N G"           // the laptop username is expected in the string
bmod.Initiate(loc,name);    //  creates the datastore on the local machine

var key="ANY STRING USER WANTS TO USE";          // a string which the user uses
var ttl=-1;                                      //  user is expected to provide an integer value for 'ttl' indicating the number of seconds the particular lives in the datastor. Default value=-1 indicating that the key lives forever
var value={}                                    // a JSON object the user wishes to push for the particular key

bmod.Create(key,value,ttl);                        // in case the user inserts a key and the size of the datastore exceeds 1 GB, the user is prompted that the insert didnt take place in the console 
                                                   // 'value' is a JSON object the user wishes to push for the particular key

var res=bmod.Read(key);                         // user makes use of the json object 'res' for that particular key 
console.log(JSON.stringify(res));               // a simple demo to print the object retrieved on the console

var keyToDel="";                                // the key value pair which the user wants to remove from the datastore. 'KeyToDel' is the key that is to be removed from the datastore
bmod.Delete(keyToDel);                           

/*
client running some process
.
.
.
.

*/