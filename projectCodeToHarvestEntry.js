"use strict";

function projectNameToHarvestId( name ) {
	switch( name ) {
	case 'activlife':
		return 14866410;
	case 'align/pcc-etl':
		return 16684943;
	case 'align/ep':
		return 13819460;
	case 'align/first30': case 'align/engage':
		return 13819525;
	case 'lls':
		return 17040925;
	case 'overhead/other':
		return 9683800;
	case 'overhead/healthcare':
	case 'earthit/hc-overhead': // Don't use this one; use the other one.
		return 9683765;
	case 'overhead/geo':
		return 9683714;
	case 'trimble':
		return 14595477; // 'Usagi 2017/2018'
	default:
		return null; // as in idfk
	}
}

function taskNameToHarvestId( name ) {
	switch( name ) {
	case 'dev': return 1918572;
	case 'meet': case 'activlife/scrum-meeting':	return 2909951;
	case 'sprint-grooming-meeting': return 2909950;
	case 'sprint-review-meeting': return 7255926;
	case 'code-review': return 5325193;
	case 'requirements': return 1918566;
	case 'support': return 1918590;
	case 'planning': return 5301998;
	case 'project-management': return 1918577;
	case 'testing': return 2005127;
	case 'modeling': return 1918609;
	case 'documentation': return 1919487;
	case 'deployment': return 1918604;
	case 'overhead': return 5301999;
	case 'planning': return 5301998;
	default:
		return null;
	}
}

// TODO: Make this take a date.
// Some projects change over time where we're supposed to bill hours to.
module.exports.default = function( name ) {
	let m;
	switch( name ) {
	case 'earthit/pdficate/dev': return {
		projectId: 13156258,
		taskId: 1918572
	};
	case 'earthit/fssk': case 'earthit/fssk/dev': case 'earthit/fssk/meet': return {
		projectId: 9686850,
		taskId: 6977423
	};
	case 'earthit/setup': return {
		projectId: 3257319,
		taskId: 1920924
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
	
	case 'trimble/usagi/dev': return {
		projectId: 14595477, // 'Usagi Qx' - may need to be updated over time, which is annoying.
		taskId: 1918572
	};
	} // endo el switcho
	
	// project/TICKET-123/task
	if( (m = /^(.+)\/([A-Z0-9]+-\d+)(?:\/([^\/]+))?$/.exec(name)) ) {
		let projectName = m[1];
		let projectId = projectNameToHarvestId(projectName);
		let ticketId = m[2];
		let taskName = m[3] || 'dev';
		let taskId = taskNameToHarvestId(taskName);
		if( projectId != undefined && taskId != undefined ) return {
			projectId,
			taskId,
			notes: ticketId,
			link: "https://earthling.atlassian.net/browse/"+ticketId,
		};
	}
	
	// project/task
	if( (m = /^(.+)\/([^\/]+)$/.exec(name)) ) {
		let projectName = m[1];
		let projectId = projectNameToHarvestId(projectName);
		let taskName = m[2];
		let taskId = taskNameToHarvestId(taskName);
		if( projectId != undefined && taskId != undefined ) return {
			projectId,
			taskId
		};
	}
	
	if( (m = /^unbillable\b/.exec(name)) ) return null;
	
	throw new Error("Unrecognized task: '"+name+"'");
};
