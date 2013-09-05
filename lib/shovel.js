// shovel.js - Do the heavy lifting in this sandbox
// @sydcanem
// Added options to include variables in context.
// Added ability to execute asynchronous code.

/* ------------------------------ INIT ------------------------------ */
var util = require( 'util' )
	, _ = require('underscore')
	, params
	, code
	, initSandbox
	, result
	, console
	, sandbox
	, Script
	, stdin;

if ( ! ( Script = process.binding( 'evals').NodeScript ) )
	if ( ! ( Script = process.binding('evals').Script ) )
		Script = require( 'vm' );

/* ------------------------------ Sandbox ------------------------------ */
var console = [];


// Get code
params = '';
stdin = process.openStdin();
stdin.on( 'data', function( data ) {
	params += data;
})
stdin.on( 'end', function () {
	try {
		params = JSON.parse(params);
		code = params.code;
		initSandbox = params.context || {};
	} catch (e) {
		var error = e.name + ': ' + e.message;
		process.stdout.write( JSON.stringify( { result: util.inspect( error ) } ) );
		process.exit(1);
	}
	run();
});


function getSafeRunner() {
	var global = this;
	// Keep it outside of strict mode
	function UserScript(str) {
		// We want a global scoped function that has implicit returns.
		return Function('return eval('+JSON.stringify(str+'')+')');
	}
	// place with a closure that is not exposed thanks to strict mode
	return function run(comm, src) {
		// stop argument / caller attacks
		"use strict";
		var send = function send(event) {
			"use strict";
			//
			// All comm must be serialized properly to avoid attacks, JSON or XJSON
			//
			comm.send(event, JSON.stringify([].slice.call(arguments,1)));
		}
		// globals
		global.print = send.bind(global, 'stdout');
		global.console = {};
		global.console.log = send.bind(global, 'stdout');
		global.done = send.bind(global, 'done');
		UserScript(src)();
	}
}

wat = 0
// Run code
function run() {
	// include 'require' and 'process' in context
	initSandbox = _.extend(initSandbox, { require: require, process: process });
	var context = Script.createContext(initSandbox);
	var safeRunner = Script.runInContext('('+getSafeRunner.toString()+')()', context);
	var result;
	try {
		safeRunner({
			send: function (event, value) {
				"use strict";

				switch (event) {
					case 'stdout':
						console.push(JSON.parse(value)[0]);
						break;
					case 'done':
						result = JSON.parse(value)[0];
						process.stdout.write( JSON.stringify( { result: result , console: console } ) );
						process.exit(0);
						break;
				}
			}
		}, code);
	}
	catch (e) {
		result = e.name + ': ' + e.message + '\n' + e.stack;
		process.stdout.write( JSON.stringify( { result: util.inspect( result ), console: console } ) );
	}
	
	process.stdout.on( 'drain', function() {
		process.exit(0)
	});
	
}

