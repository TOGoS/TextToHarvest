"use strict";

// TODO: Make this take a date.
// Some projects change over time where we're supposed to bill hours to.
module.exports.default = function( name ) {
	let m;
	switch( name ) {
		/*
	case 'align/ep/meet': return {
		projectId: 12642303,
		taskId: 2909951
	};
	case 'align/ep/dev': return {
		projectId: 12642303,
		taskId: 1918572
	};
	case 'align/ep/deploy': return {
		projectId: 12642303,
		taskId: 1918604
	};
	*/

	/*
	case 'align/ep/code-review': return {
		projectId: 13819525,
		taskId: 5325193
	};
	case 'align/ep/deploy': return {
		projectId: 13819525,
		taskId: 1918604
	};
	case 'align/ep/ui-design': return {
		projectId: 13819525,
		taskId: 1918598
	};
	case 'align/ep/project-management': return {
		projectId: 13819525,
		taskId: 1918572
	};
	case 'align/ep/qa': return {
		projectId: 13819525,
		taskId: 2005127
	};
	// Some other stuff blah
	case 'align/ep/meet': return {
		projectId: 13819525,
		taskId: 2909951
	};
	*/

	case 'activlife/dev': return {
		projectId: 14866410,
		taskId: 1918572
	};
	case 'activlife/meet': case 'activlife/scrum-meeting': return {
		projectId: 14866410,
		taskId: 2909951,
	};
	case 'activlife/grooming': case 'activlife/sprint-grooming-meeting': return {
		projectId: 14866410,
		taskId: 2909950
	};
	case 'activlife/sprint-review-meeting': return {
		projectId: 14866410,
		taskId: 7255926
	};
	
	case 'align/first30/dev': return {
		projectId: 13819525,
		taskId: 1918572
	};

	case 'align/ep/meet': case 'align/ep/scrum-meet': return {
		projectId: 13819460,
		taskId: 2909951
	};
	case 'align/ep/requirements': return {
		projectId: 13819460,
		taskId: 1918566
	};
	case 'align/ep/sprint-grooming': return {
		projectId: 13819460,
		taskId: 2909950
	};
	case 'align/ep/dev': return {
		projectId: 13819460,
		taskId: 1918572
	};
	case 'align/ep/deploy': return {
		projectId: 13819460,
		taskId: 1918572
	};
	case 'align/ep/code-review': return {
		projectId: 13819460,
		taskId: 5325193
	};
	
	case 'earthit/pdficate/dev': return {
		projectId: 13156258,
		taskId: 1918572
	};
	case 'earthit/fssk': case 'earthit/fssk/dev': case 'earthit/fssk/meet': return {
		projectId: 9686850,
		taskId: 6977423
	};
	case 'earthit/log': return {
		projectId: 3257319,
		taskId: 1920926
	};
	case 'earthit/phrebar': case 'earthit/phrebar/dev': return {
		projectId: 9686850,
		taskId: 5304076
	};
	case 'earthit/team-meet': return {
		projectId: 3257319,
		taskId: 4936441
	};
	case 'earthit/tech-talk': return {
		projectId: 9684460, // 'Professional development'
		taskId: 1920940
	};
	case 'earthit/steve+dan-meet': return {
		projectId: 3257319,
		taskId: 4936441,
		notes: "Steve+Dan meeting"
	};
	case 'earthit/non-billable-healthcare-proposals/meeting': return {
		projectId: 9680979,
		taskId: 5295785
	};
	case 'earthit/interview': return {
		projectId: 3257319,
		taskId: 1920933
	};
	case 'earthit/hr-internal': return {
		projectId: 3257319,
		taskId: 1920930
	};

	case 'lls/dev': return {
		projectId: 13791662,
		taskId: 1918572
	};
	case 'lls/backup': return {
		projectId: 13791662,
		taskId: 1918604 // That's 'deployment'
	};
	case 'trimble/usagi/dev': return {
		projectId: 14595477, // 'Usagi Qx' - may need to be updated over time, which is annoying.
		taskId: 1918572
	};
	} // endo el switcho

	if( (m = /^unbillable\b/.exec(name)) ) return null;
	if( (m = /^align\/engage\/(ALIGN-\d+)$/.exec(name)) ) return {
		projectId: 13819525,
		taskId: 1918572,
		notes: m[1],
		link: "https://earthling.atlassian.net/browse/"+m[1]
	};
	if( (m = /^activlife\/(ALIFE-\d+)$/.exec(name)) ) return {
		projectId: 14866410,
		taskId: 1918572,
		notes: m[1],
		link: "https://earthling.atlassian.net/browse/"+m[1]
	};
	if( (m = /^align\/ep\/(EMPENGAGE-\d+)$/.exec(name)) ) return {
		projectId: 13819460,
		taskId: 1918572,
		notes: m[1],
		link: "https://earthling.atlassian.net/browse/"+m[1]
	};
	
	throw new Error("Unrecognized task: '"+name+"'");
};
