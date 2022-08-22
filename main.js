const os = require("os");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');

class PDBConnection {

    init () {
        if (!fs.existsSync(this.full_path)) {
            fs.mkdirSync(this.full_path);
        }
    }

    auth () {
        let auth_file_path = path.join(this.full_path, this.username + ".pdb-auth");
        if (!fs.existsSync(auth_file_path)) {
            fs.writeFileSync(auth_file_path, JSON.stringify(this.encrypt(this.username + "_" + crypto.randomBytes(16).toString('hex'))));
            return true;
        }
        
        let auth_content = fs.readFileSync(auth_file_path, "utf8");
        try {
            auth_content = JSON.parse(auth_content);
            auth_content = this.decrypt(auth_content);
        } catch (err) {
            console.error(err);
            return false;
        }

        if (auth_content.includes(this.username)) {
            return true;
        }
        return false;
    }

    encrypt (raw) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const encrypted = Buffer.concat([cipher.update(raw), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    };

    decrypt (hash) { // hash: {iv, content}
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(hash.iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrpyted.toString();
    };

    constructor(username, password) {
        this.path = ".pseudo-db";
        this.full_path = path.join(os.homedir(), this.path);
        this.init();

        this.algorithm = "aes-256-ctr"; 
        this.hash_algo = "sha256"; 

        this.username = username;
        this.password = crypto.createHash(this.hash_algo).update(password).digest('base64').substr(0, 32);
        this.key = this.password
        if (!this.auth()) {
            console.error("Incorrect login!");
            delete this;
        }
        // this.key = Buffer.from(this.password, "utf-8");

        // this.loaded = [];
        // might implement this but not rn

        // i should also add async stuff
    }

    createDB (db_name) {
        fs.writeFileSync(path.join(this.full_path, this.username + "_" + db_name + ".pdb"), JSON.stringify(this.encrypt(
            // no more ids.. no more arrays... no more duplicates.. life is easy now 
            // why didnt i think of this from the start...
            JSON.stringify({})    
        )));
    }
    
    readDB (db_name) {
        let db_path = path.join(this.full_path, this.username + "_" + db_name + ".pdb");
        if (!fs.existsSync(db_path)) {
            this.createDB(db_name);
        }
        let db_content = fs.readFileSync(db_path, "utf8");
        db_content = JSON.parse(db_content);
        db_content = this.decrypt(db_content);
        db_content = JSON.parse(db_content);
        return db_content;
    }

    saveDB (db_name, db_content) {
        fs.writeFileSync(path.join(this.full_path, this.username + "_" + db_name + ".pdb"), JSON.stringify(this.encrypt(JSON.stringify(db_content))));
    }

    deleteDB (db_name) {
        let db_path = path.join(this.full_path, this.username + "_" + db_name + ".pdb");
        if (fs.existsSync(db_path)) {
            fs.unlinkSync(db_path);
        }
    }

    insert (db_name, key, value) {
        let db_content = this.readDB(db_name);
        db_content[key] = value;
        this.saveDB(db_name, db_content);
    }

    update (db_name, key, new_value) {
        this.insert(db_name, key, new_value);
        // wait, its all insert?
        // its always been...
    }

    delete (db_name, key) {
        let db_content = this.readDB(db_name);
        delete db_content[key];
        this.saveDB(db_name, db_content);
    }

    query (db_name, key) {
        let db_content = this.readDB(db_name);
        let content = db_content[key];
        if ( content == undefined ) return false;
        return content;
    }

    includes (db_name, key) {
        let db_content = this.readDB(db_name);
        let content = db_content[key];
        if ( content == undefined ) return false;
        return true;
    }
}

module.exports = PDBConnection;