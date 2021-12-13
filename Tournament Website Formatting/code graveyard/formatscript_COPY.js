$(document).on('ready', function() {

	var knownBrackets = [2,4,8,16,32,64], // brackets with perfect proportions (full fields, no byes)
			exampleTeams = [];
			bracketCount = 0;console.log($(exampleTeams).length);
		// exampleTeams  = _.shuffle(["ello", "bello"]),
		// bracketCount = 0;console.log($(exampleTeams).length);

	/*
	 * Build bracket "model"
	 */
	function getBracket(base) {

		var closest 		= _.find(knownBrackets, function(k) { return k>=base; }),
			byes 			= closest-base;
		// base is the the knownBrackets number that is chosen
		if(byes>0)	base = closest;

		var brackets 	= [],
			round 		= 1,
			baseT 		= base/2,
			baseC 		= base/2,
			teamMark	= 0,
			nextInc		= base/2;

		for(i=1;i<=(base-1);i++) {
			var	baseR = i/baseT,
				isBye = false;

			if(byes>0 && (i%2!=0 || byes>=(baseT-i))) {
				isBye = true;
				byes--;
			}

			var last = _.map(_.filter(brackets, function(b) { return b.nextGame == i; }), function(b) { return {game:b.bracketNo,teams:b.teamnames}; });

			brackets.push({
				lastGames:	round==1 ? null : [last[0].game,last[1].game],
				nextGame:	nextInc+i>base-1?null:nextInc+i,
				teamnames:	round==1 ? [exampleTeams[teamMark],exampleTeams[teamMark+1]] : [last[0].teams[_.random(1)],last[1].teams[_.random(1)]],
				bracketNo:	i,
				roundNo:	round,
				bye:		isBye
			});
			console.log(exampleTeams[teamMark]);
			teamMark+=2;
			if(i%2!=0)	nextInc--;
			while(baseR>=1) {
				round++;
				baseC/= 2;
				baseT = baseT + baseC;
				baseR = i/baseT;
			}
		}

		renderBrackets(brackets);
	}

	/*
	 * Inject brackets
	 */
	function renderBrackets(struct) {
		var groupCount	= _.uniq(_.map(struct, function(s) { return s.roundNo; })).length;

		var group	= $('<div class="group'+(groupCount+1)+'" id="b'+bracketCount+'"></div>'),
			grouped = _.groupBy(struct, function(s) {return s.roundNo; });
		for(g=1;g<=groupCount;g++) {
			var round = $('<div class="r'+g+'"></div>');
			console.log(g);
			console.log(grouped[g]);
			_.each(grouped[g], function(gg) {
				if(gg.bye)
					round.append('<div></div>');
				else
					round.append('<div><div class="bracketbox"><span class="info1" contenteditable="true">'+gg.bracketNo+'</span><span class="info2">'+gg.bracketNo+'</span><span class="teama" contenteditable="true">'+gg.teamnames[0]+'</span><span class="teamb" contenteditable="true">'+gg.teamnames[1]+'</span></div></div>');
					// gg.teamnames[0] = "test1";
					// gg.teamnames[1] = "test2";
					console.log(gg.teamnames[0] + ": " + gg.teamnames[1]);
			});
			group.append(round);
		}
		// +_.last(struct).teamnames[_.random(1)]+ instead of " "

		// adds final bracket box
		group.append('<div class="r'+(groupCount+1)+'" contenteditable="true"><div class="final "><div class="bracketbox"><span class="teamc ">'+ "ㅤ" +'</span></div></div></div>');
		$('#brackets').append(group);
		console.log(_.last(struct));

		bracketCount++;
		$('html,body').animate({
			scrollTop: $("#b"+(bracketCount-1)).offset().top
		});
	}

	$('#add').on('click', function() {
		var saveData = {
			teams : [
			  ["a", "b"],
			  ["c", "d"],
			  ["e", "f"],
			  ["g", "h"]
			],
			results : []
		  }
		  console.log(saveData.teams[0][0]);
		  function saveFn(data, userData) {
		  var json = JSON.stringify(data)
			// future data storage
		  /* $('#saveOutput').text('POST '+userData+' '+json)
		   jQuery.ajax("url"+userData, {contentType: 'application/json',
										dataType: 'json',
										type: 'post',
										data: json})
		  */
		}
		
		// var opts = parseInt(prompt('Bracket size (number of teams):',32));
		var lines = document.getElementById('contestantBox').innerText;
		var lineArr = lines.split('\n');
		for(var i = 0; i < lineArr.length; i++) {
				saveData.teams.push(lineArr[i]);
				}
			bracketCount = 0;console.log($(exampleTeams).length);
		var opts = exampleTeams.length;
		$('#allFormatting').html("");

		$(function() {
			var container = $('.tournament')
			console.log(container);
			container.bracket({
			  init: saveData,
			  save: saveFn,
			  // future data storage
			  userData: null
			})
		  })
		// if(!_.isNaN(opts) && opts <= _.last(knownBrackets))
		// 	getBracket(opts);
		// else
		// 	alert('The bracket size you specified is not currently supported.');
		// 	$('#clear').off('click');
		// 	$('#clear').on('click',function(){
		// 		$('#brackets').html("");
		// 	});
	});


});