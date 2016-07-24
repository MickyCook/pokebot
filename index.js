'use strict';

var PokemonGO = require('pokemon-go-node-api');
var Bot = require('slackbots');

var me = new PokemonGO.Pokeio();

// create a bot
var settings = {
    token: 'your access token',
    name: 'bot name'
};

var bot = new Bot(settings);

var location = {
    type: 'name',
    name: process.env.PGO_LOCATION || 'Your location'
};

var username = process.env.PGO_USERNAME || 'your username';
var password = process.env.PGO_PASSWORD || 'your password';
var provider = process.env.PGO_PROVIDER || 'google';

me.init(username, password, location, provider, function(err) {
    if (err) throw err;


    me.GetProfile(function(err, profile) {
        if (err) throw err;

        setInterval(function(){
            me.Heartbeat(function(err,hb) {
                if(err) {
                    console.log(err);
                }

                for (var i = hb.cells.length - 1; i >= 0; i--) {
                    if(hb.cells[i].NearbyPokemon[0]) {
                        //console.log(a.pokemonlist[0])
                        var pokemon = me.pokemonlist[parseInt(hb.cells[i].NearbyPokemon[0].PokedexNumber)-1];
                        console.log('1[+] There is a ' + pokemon.name + ' at ' + hb.cells[i].NearbyPokemon[0].DistanceMeters.toString() + ' meters');
                        bot.postMessageToChannel('pokemon', 'There is a ' + pokemon.name + ' nearby.');
                    }
                }

            });
        }, 10000);

    });
});

