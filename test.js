const PDBConnection = require("./main");

let pdb = new PDBConnection("osaki", "test");
console.log(pdb.readDB("test"));