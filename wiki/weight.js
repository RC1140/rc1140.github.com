'use strict';
$(document).ready(function() {
    
MG._hooks = {};
d3.json('https://spreadsheets.google.com/feeds/list/1ctzBIkxtY89RH45ArIFLVwxLv50kvAI6eRunhCXt7v4/2/public/basic?alt=json', function(data) {
    var rows = data.feed.entry;
		var rowObjects = [];
		$.each(rows,function(index,row){
			var mappedRow = {};
			mappedRow['date'] = new Date(row.title.$t);
			$.each(row.content.$t.split(','),function(i,val){
				var mappedParts = val.trim().split(':');
				mappedRow[mappedParts[0]] = parseInt(mappedParts[1].trim());
			});
			rowObjects.push(mappedRow);
		});
    MG.data_graphic({
        title: "Weight Over time",
        data: rowObjects,
	min_y_from_data: true,
        width: 900,
        height: 400,
        right: 40,
	area:false,
        target: document.getElementById('fake_users1'),
        x_accessor: 'date',
        y_accessor: 'weight'
    });
});

}, false);
