#!/usr/bin/env node
"use strict";

const http = require('https');

function encodeQsParams( params ) {
	let p = [];
	for( let k in params ) {
		p.push( encodeURIComponent(k)+"="+encodeURIComponent(params[k]) );
	}
	if( p.length > 0 ) return "?"+p.join("&");
	return "";
}

function HarvestClient( config ) {
	this.harvestHostname = config.harvestHostname,
	this.username = config.username;
	this.password = config.password;
	this.verbosity = config.verbosity || 100;
}
HarvestClient.prototype.doRequest = function( method, path, qsParams, data ) {
	if( qsParams == undefined ) qsParams = {};
	if( typeof data == 'object' && !(data instanceof Uint8Array) ) {
		data = JSON.stringify(data, null, "\t");
	}
	return new Promise( (resolve,reject) => {
		const requestOptions = {
			method,
			host: this.harvestHostname,
			path: path + encodeQsParams(qsParams),
			auth: this.username+":"+this.password,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		};
		if( this.verbosity >= 200 ) console.log("Request:", requestOptions, data);
		const req = http.request( requestOptions, (res) => {
			const chunks = [];
			res.setEncoding('utf8');
			res.on('data', (chunk) => chunks.push(chunk) );
			res.on('end', () => {
				let ct = res.headers['content-type'] || 'none';
				let ctp = ct.split(/\s*;\s*/);
				let resData = chunks.join("");
				if( ctp[0] == 'application/json' && resData.length > 0 ) {
					try {
						let info = JSON.parse(resData);
						resolve(info);
					} catch( err ) {
						reject(new Error([
							"Error while parsing JSON from response: "+err.message,
							"data: «"+resData+"»",
							"code: "+res.statusCode,
							"headers: "+JSON.stringify(res.headers, null, "\t")
						].join('; ')));
					}
				} else {
					resolve(resData);
				}
			});
			res.on('error', reject);
		});
		if( data ) req.write(data);
		req.end();
	});
}
HarvestClient.prototype.dateToDoyAndY = function( date ) {
	if( typeof date == 'string' ) {
		date = new Date(Date.parse(date));
	}
	if( !(date instanceof Date) ) {
		throw new Error("Date passed to dateToDoyAndY must be a string or Date object; given "+JSON.stringify(date));
	}
	let yearStart = new Date(date.getFullYear(), 0, 1);
	let diff = date - yearStart;
	let dayOfYear = Math.round(diff / (1000*3600*24)) + 1;
	return dayOfYear+"/"+date.getFullYear();
}
HarvestClient.prototype.getDailyStuff = function( date ) {
	return this.doRequest('GET', "/daily/"+this.dateToDoyAndY(date));
}
/**
 * Hours is array (or object; keys are ignored) of {
 *   projectId: 12345,
 *   taskId: 45678,
 *   hours: 2.5,
 *   notes?: "blah blah blah",
 *   link?: http://wherever.com/
 * }
 */
HarvestClient.prototype.updateHoursForDay = function( date, hours ) {
	return this.getDailyStuff(date).then( (stuff) => {
		let hoursByProjectTask = {};
		let entryIdsToDelete = [];
		for( let e in stuff.day_entries ) {
			entryIdsToDelete.push( stuff.day_entries[e].id );
		}
		let newStuffs = [];
		for( let h in hours ) {
			let entry = hours[h];
			if( entry.projectId == undefined || entry.taskId == undefined ) {
				throw new Error("Project/Task ID undefined on entry "+h+" "+JSON.stringify(entry));
			}
			let newStuf = {
				notes: entry.notes,
				hours: entry.hours,
				project_id: entry.projectId,
				task_id: entry.taskId,
				spent_at: date,
			};
			
			if( entry.link ) newStuf.external_ref = {
				// These seem to be the only required fields to make external_ref save,
				// and arbitrary values seem to be allowed.
				// I'll use "xyz123"" for ID to mean "idkwtf I'm doing"
				id: "xyz123",
				namespace: entry.link,
			};

			newStuffs.push(newStuf);
		}

		let prom = Promise.resolve();
		for( let e in entryIdsToDelete ) {
			prom = prom.then( () => this.doRequest("DELETE", '/daily/delete/'+entryIdsToDelete[e]) );
		}
		for( let ns in newStuffs ) {
			prom = prom.then( () => this.doRequest("POST", '/daily/add', null, newStuffs[ns]));
		}
		return prom;
	});
}

if( require.main == module ) {
	let m;
	let date = new Date();
	let mode = "show-daily";
	for( let i=0; i<process.argv.length; ++i ) {
		let arg = process.argv[i];
		if( arg == '--show-daily' ) {
			mode = 'show-daily'
		} else if( arg == '--update-daily' ) {
			mode = 'update-daily'
		} else if( (m = /^--date=(.*)/.exec(arg)) ) {
			date = new Date(Date.parse(m[1]));
		}
	}
	const readJsonFromFile = require('./readJsonFromFile').default;
	readJsonFromFile('harvest-api.config.json').then( (config) => {
		return new HarvestClient(config);
	}).then( (client) => {
		if( mode == 'show-daily' ) {
			return client.getDailyStuff(date).then( (stuff) => {
				console.log(JSON.stringify(stuff, null, "\t"));
			});
		} else if( mode == 'update-daily' ) {
			return client.updateHoursForDay(date, [
				{
					projectId: '12642303',
					taskId: '12642303',
					hours: 4,
					notes: "I can haz linx?",
					link: "http://www.nuke24.net/",
				}
			]).then( () => {
				console.log("Okay; updated "+date);
			}).then( () => {
				return client.getDailyStuff(date).then( (stuff) => {
					console.log(JSON.stringify(stuff, null, "\t"));
				});
			});
		} else {
			return Promise.reject("Unrecognized mode: "+mode);
		}
	}).catch( (err) => {
		console.error(err.stack);
		process.exitCode = 1;
	});
}

module.exports.default = HarvestClient;
