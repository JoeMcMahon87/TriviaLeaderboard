### Overview
AngularExample project using MEAN stack. It also uses socket.io to provide a realtime web experience.
As users edit the account list other users will see the account list updates.

### Setup
#### Start Mongo in a command window
Requires MongoDB to be running first. 
Run 'mongod' bash script in the root project folder. 
If you already have `mongod` running on port 27017, you might want to stop that 
process, or choose a unique port for the startup parameter in the `./mongod` script.

Execute:

```
> ./mongod
```

#### Creating the database
Run the `seeddb` script in the root project folder.

Execute:
```
> ./seeddb
```

#### Start the app
Execute:
```
> ./bin/www
```

#### Open Browser
`http://localhost:3030`

To show the board:
`http://localhost:3030/board`







