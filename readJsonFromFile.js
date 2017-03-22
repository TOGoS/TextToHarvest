const fsu = require('./FSUtil');

module.exports.default = function(filename) {
	const fsu = require('./FSUtil');
	return fsu.readFile(filename).then( (data) => {
		try {
			return JSON.parse(data);
		} catch( err ) {
			return Promise.reject(new Error("Failed to load config from "+filename+": "+err.message));
		}
	});
}
