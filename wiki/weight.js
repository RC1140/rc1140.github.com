'use strict';
$(document).ready(function() {
    
    d3.json('https://spreadsheets.google.com/feeds/list/1ctzBIkxtY89RH45ArIFLVwxLv50kvAI6eRunhCXt7v4/2/public/basic?alt=json', function(data) {
		var rows = data.feed.entry;
		var rowObjects = $(rows).map(function(index,row){
			var mappedRow = {};
			mappedRow['Date'] = new Date(row.title.$t);
			$.each(row.content.$t.split(','),function(i,val){
				var mappedParts = val.trim().split(':');
				mappedRow[mappedParts[0]] = parseInt(mappedParts[1].trim());
			});
			return mappedRow;
		});
		console.log(rowObjects);
        //data = convert_dates(rows, 'year');
        data_graphic({
            title: "Weight over time",
            data: data,
            width: 900,
            chart_type: 'line',
            height: 200,
            target: '#weightHolder',
            x_accessor: 'Date',
            y_accessor: 'weight'
        });
		
    });
}, false);
