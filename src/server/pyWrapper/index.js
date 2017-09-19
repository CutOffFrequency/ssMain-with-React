"use strict";
const spawn = require("child_process").spawn;
const checkAcct = require("../pyWrapper/checke.js").check;
const _ = require("lodash");
const globals = require("../../../global.js").paths;
// spawns child process to call python script
let callSpawn = (acct, io) => {
    io.of("/piata").emit("spawning", acct);
    // inits arguments / options
    const drive = globals.root;
    const loc = globals.script;
    const command = drive + "\\python27\\python";
    const script = "piata.py";
    const args = [ script, "-u", acct, "stream" ];
    const options = { stdio: "pipe", cwd: loc };
    let outJSON = "";
    let child = spawn(command, args, options, (err, stdout, stderr) => {
        if (err) {
            console.error("error from spawn process: ", err);
        }
    });
    // chunks data returned from python script
    child.stdout.on("data", (chunk) => {
        if (chunk.toString() !== "success") {
            outJSON += chunk;
        }
    });
    // returns data on close
    child.on("close", (code) => {
        let parsedJSON = _.attempt(JSON.parse.bind(null, outJSON));
        if ( parsedJSON instanceof Error ) {
            console.log(parsedJSON);
            io.of("/piata").emit("JSON error", acct, outJSON);
        } else {
            if (code !== "0" ) {
                io.of("/piata").emit("return acct", parsedJSON);
                child.kill( "SIGHUP" );
            } else {
                let acctClose = {
                    acct: acct,
                    close: code
                };
                io.of("/piata").emit("spawn error", acctClose);
            }
        }
    });
};
// checks if acct number from input is valid
let validateAcct = (acct) => {
    return checkAcct(acct) ? true : false;
};
module.exports = {
    validateAcct,
    callSpawn
};