<div align="center">
<h1>PseudoDB</h1>
<h3>Small scale Object DB</h3>
</div>

It basically writes to files locally, all databases are objects and insertions just set properties on those objects. 
Really similar to localstorage in browser.<br><br>
This is just something I made for a project. Im not sure how fast, reliable or secure it is but its really easy to use..<br>
Also, Im not sure how it reacts to large data sets.. so I dont recommend using it for large scale projects.

# Usage

### Install
```bash
npm i simple-pseudo-db
```

### Example
```js
const PDBConnection = require("simple-pseudo-db");

let instance = new PDBConnection("osaki", "password");
instance.createDB("new_db");
instance.insert("new_db", "key", "value");
instance.insert("new_db", "new_key", "new value");
console.log(instance.readDB("new_db"));
```
Output:
```js
{ 
    key: 'value', 
    new_key: 'new value' 
}
```

### Functions
```
createDB (db_name) -> void
readDB (db_name) -> object
deleteDB (db_name) -> void

insert (db_name, key, value) -> void
update (db_name, key, new_value) -> void
delete (db_name, key) -> void
query (db_name, key) -> value
includes (db_name, key) -> boolean
```

## Todo: 
- Better Docs
- Ability to delete User

## Useful:
DB files are located in `$HOME/.pseudo-db`
