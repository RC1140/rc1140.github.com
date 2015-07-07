'use strict';
$(document).ready(function() {
    //var split_by_data;
    d3.json('https://spreadsheets.google.com/feeds/list/1ctzBIkxtY89RH45ArIFLVwxLv50kvAI6eRunhCXt7v4/2/public/basic?alt=json', function(data) {
        data = convert_dates(data, 'year');
        data_graphic({
            title: "Weight over time",
            data: data,
            width: 900,
            chart_type: 'line',
            height: 200,
            target: '#weightHolder',
            x_accessor: 'year',
            y_accessor: 'count'
        });
    });
}, false);
