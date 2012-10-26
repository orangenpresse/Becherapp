Ext.require(['Ext.chart.*', 'Ext.chart.axis.Gauge', 'Ext.chart.series.*', 'Ext.Window']);

Ext.onReady(function() {
    window.store = Ext.create('Ext.data.JsonStore', {
        fields: ['users', 'stuck', 'hard', 'good'],
    });

    var source = new EventSource('update-stream');
    source.onmessage = function(event) {
        data = JSON.parse(event.data);
        store.loadData([data]);
        jQuery("#users").html("Users: " + data.users);
        updateGauges(data.users);
    };

    source.onerror = function() {
        jQuery("#serverstatus").html('<span style="background-color: rgb(255,0,0);">OFFLINE</span>');
    }

    source.onopen = function() {
        jQuery("#serverstatus").html('<span style="background-color: rgb(0,255,0);">ONLINE</span>');
    }
    goodGauge = Ext.create('Ext.chart.Chart', {
        renderTo: "status_green",
        width: 200,
        height: 100,
        style: 'background:#fff',
        animate: true,
        insetPadding: 25,
        store: store,
        flex: 1,
        axes: [{
            type: 'gauge',
            position: 'gauge',
            minimum: 0,
            maximum: 100,
            steps: 1,
            margin: 7
        }],
        series: [{
            type: 'gauge',
            field: 'good',
            donut: 30,
            colorSet: ['#00ff00', '#ddd']
        }]
    });


    stuckGauge = Ext.create('Ext.chart.Chart', {
        renderTo: "status_red",
        width: 200,
        height: 100,
        style: 'background:#fff',
        animate: true,
        insetPadding: 25,
        store: store,
        flex: 1,
        axes: [{
            type: 'gauge',
            position: 'gauge',
            minimum: 0,
            maximum: 100,
            steps: 1,
            margin: 7
        }],
        series: [{
            type: 'gauge',
            field: 'stuck',
            donut: 30,
            colorSet: ['#ff0000', '#ddd']
        }]
    });


    hardGauge = Ext.create('Ext.chart.Chart', {
        renderTo: "status_yellow",
        width: 200,
        height: 100,
        style: 'background:#fff',
        animate: true,
        insetPadding: 25,
        store: store,
        flex: 1,
        axes: [{
            type: 'gauge',
            position: 'gauge',
            minimum: 0,
            maximum: 100,
            steps: 1,
            margin: 7
        }],
        series: [{
            type: 'gauge',
            field: 'hard',
            donut: 30,
            colorSet: ['#ffff00', '#ddd']
        }]
    });

});

function updateGauges(newMax) {
    if (newMax < 1) newMax = 1;

    goodGauge.axes.get("gauge").maximum = newMax;
    goodGauge.redraw();
    stuckGauge.axes.get("gauge").maximum = newMax;
    stuckGauge.redraw();
    hardGauge.axes.get("gauge").maximum = newMax;
    hardGauge.redraw();
}