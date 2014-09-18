'use strict';

var net = require( 'net' );
var fs = require( 'fs' );

var client = require( 'client' );
var clients = [];
var appDir = process.cwd();

var serverConfig = {};
var userDB = {};

initialize();

var server = net.createServer( function( sock ) {
  sock.write( serverConfig.configuration.MOTD, 'utf8' );

  var chatClient = new client.Client( sock );
  clients.push( chatClient );

  sock.setEncoding( 'utf8' );
  sock.setTimeout( 0 );

  sock.on( 'data', function( data ) {
    console.log( '>> ' + data );
  });

  sock.on( 'error', function( e ) {
    console.log( e );
  });
});

function initialize() {

  //server config check
  var serverConfigPath = appDir + '/config.json';
  var configFile = checkForFileExistence( serverConfigPath, '{"configuration":{"MOTD":"Hello to trollbox server..."}}\n' );
  serverConfig = JSON.parse( configFile );

  //user database check
  var userDBPath = appDir + '/users/userDB.json';
  var userDBFile = checkForFileExistence( userDBPath, '{"users":[]}\n' );
  userDB = JSON.parse( userDBFile );
}


function checkForFileExistence( filename, defaultContent) {
  try {
    return fs.readFileSync( filename );
  } catch( e ) {
    fs.writeFileSync( filename, defaultContent );
    return fs.readFileSync( filename );
  }
}

server.listen( 6666 );
