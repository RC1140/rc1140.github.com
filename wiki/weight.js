'use strict';
$(document).ready(function() {
    
MG._hooks = {};
d3.json('https://spreadsheets.google.com/feeds/list/1ctzBIkxtY89RH45ArIFLVwxLv50kvAI6eRunhCXt7v4/2/public/basic?alt=json', function(data) {
    var rows = data.feed.entry;
	var dataRows = [],weightRows = [],fatRows=[],muscleRows = [];
	$.each(rows,function(index,row){
		var currentRowsDate = new Date(row.title.$t);
		$.each(row.content.$t.split(','),function(i,val){
			var mappedParts = val.trim().split(':');
			var currentVal = parseInt(mappedParts[1].trim());
			var rowToPush = {'date':currentRowsDate,'value':currentVal};
			switch(mappedParts[0]){
				case 'weight':
					weightRows.push(rowToPush);
					break;
				case 'fat':
					fatRows.push(rowToPush);
					break;
				case 'muscle':
					muscleRows.push(rowToPush);
					break;

			};
		});
	});
	dataRows.push(weightRows);
	dataRows.push(fatRows);
	dataRows.push(muscleRows);
	var markers = [{
        'date': new Date('2014-06-13T00:00:00.000Z'),
        'label': 'Ramadan And Operation'
   }, {
        'date': new Date('2015-04-05T00:00:00.000Z'),
        'label': 'Scale logged invalid data'
    }];
    MG.data_graphic({
        title: "Weight Over time",
        data: dataRows,
		min_y_from_data: true,
        width: 900,
        height: 400,
        right: 40,
		legend : ['weight','fat','muscle'],
		area:false,
        markers: markers,
		aggregate_rollover: true,
        y_extended_ticks: true,
        target: document.getElementById('fake_users1')
    });
});

}, false);
