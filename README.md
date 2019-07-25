# fw-backend

Hi sir/madam, this is Viswesh N G from SATSRA Deemed To Be University. This is my first ever attempt in backend. With a little bit of knowledge of NodeJs I have attempted to do this backend assignment.

There are two files FW-backend.js and backmod.js.

'backmod' is the expected library the client can use to do operations on a local datastore. 
FW-backend.js file is a simple demonstration of how a user can use the functions of 'backmod'.

'backmod' library supports :

1. creation of a file in a location either provided by the user or a default
2. inserting key-value pair into the file
3. reading from the file using a key
4. deleting a key from the file 
5. A cron job scheduler to periodically check if a key in the datastore has exceeded its time to live value

Appropriate error handling have been taken care of as much as possible.
The functionality of the library operations have been explained with the help of comments and most of the functional and non functional requirements have been considered.
