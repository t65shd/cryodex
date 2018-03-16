; (function ($, window, document, undefined) {
	var pluginName = "cryodex",
		defaults = {
			baseColours: {
				first: '#1abc9c',
				second: '#e74c3c',
				third: '#3498db',
				fourth: '#9b59b6',
				fifth: '#34495e',
				sixth: '#2ecc71',
				seventh: '#e67e22',
				eighth: '#f1c40f',
				ninth: '#7f8c8d',
				tenth: '#d35400' 
			},
			legend: {}
		};

	function Cryodex(element, options) {
		this.element = element;

		$('body').append('<div id="cryodex-js-colour-config"></div>');
		colours =  jQuery.parseJSON($('#cryodex-js-colour-config').css('content').replace(/"/g,'').replace(/'/g,'"'));

		if (typeof(colours) == 'object') {
			defaults.colours = colours;
		} else {
			defaults.colours = defaults.baseColours;
		}

		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this._counter = 0 ;

		this.init();
	}

	Cryodex.prototype = {

		init: function () {
			switch ($(this.element).attr('data-cryodex-widget')) {
				case 'gauge':
					this._gauge();
					break;
				case 'doughnut':
					this._doughnut();
					break;
				case 'bar':
					this._bar('bar');
					break;
				case 'horizontal-bar':
					this._bar('horizontalBar');
					break;
				case 'line':
					this._line();
					break;
				case 'progress':
					this._progress();
					break;
			}
			$(this.element).addClass('cryodex-loaded');
		},

		_getColour: function(colour) {
			if (typeof (colour) == 'undefined' || colour == '') {
				colour = this.options.colours[Object.keys(this.options.colours)[this._counter % Object.keys(this.options.colours).length]];
			} else if (typeof (this.options.colours[colour]) != 'undefined') {
				colour = this.options.colours[colour];
			} else if (typeof (this._defaults.baseColours[colour]) != 'undefined') {
				colour = this._defaults.baseColours[colour];
			}
			return colour;
		},

		_getColourAlpha: function (colour, opacity) {
			colour = this._getColour(colour);
			if (colour.substr(0, 5) == 'rgba(') {
				rgb = colour.replace('rgba(', '').replace(')', '');
				rgb = rgb.split(',');
				colour = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
			} else if (colour.substr(0, 4) == 'rgb(') {
				rgb = colour.replace('rgb(', '').replace(')', '');
				rgb = rgb.split(',');
				colour = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
			} else if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colour)) {
				c = colour.substring(1).split('');
				if (c.length == 3) {
					c = [c[0], c[0], c[1], c[1], c[2], c[2]];
				}
				c = '0x' + c.join('');
				colour = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
			}

			return colour;
		},

		_gauge: function () {
			this._counter = 0;

			var value1 = $(this.element).attr('data-percent') * 0.75;
			var value2 = 75 - value1;
			var colour = this._getColour($(this.element).attr('data-colour'));

			$(this.element).append('<canvas />');
			this.chart = new Chart($('canvas', this.element), {
				type: 'doughnut',
				responsive: true,
				data: {
					labels: ['Complete', null],
					datasets: [{
						label: 'progress',
						data: [value1, value2, 25],
						backgroundColor: [
							colour,
							'#ddd',
							'transparent'
						],
						hoverBackgroundColor: [
							colour,
							'#ddd',
							'transparent'
						],
						borderWidth: 0
					}]
				},
				options: {
					legend: { display: false },
					tooltips: { enabled: false },
					cutoutPercentage: 70,
					rotation: 0.75 * Math.PI,
					onClick: window[$(this.element).attr('data-click')]
				}
			});
		},

		_doughnut: function () {
			var base = this;
			base._counter = 0;

			var table = $('table', this.element).eq(0).hide();

			var labels = new Array();
			$('thead th', table).each(function () {
				labels.push($(this).text());
			});

			var datasets = new Array();
			$('tbody tr', table).each(function () {
				var dataset_item = new Object();
				dataset_item.label = $(this).attr('data-label');
				dataset_item.data = new Array();
				dataset_item.backgroundColor = new Array();
				$('td', this).each(function () {
					dataset_item.data.push($(this).text());
					dataset_item.backgroundColor.push(base._getColour($(this).attr('data-colour')));
					base._counter ++;
				});
				dataset_item.borderWidth = 0;
				datasets.push(dataset_item);
			});
			var legend = this.options.legend;
			//legend.position = 'left';
			legend.display = false;
			if ($(this.element).attr('data-legend-click')) {
				legend.onClick = window[$(this.element).attr('data-legend-click')];
			}

			$(this.element).append('<div class="cryodex-chart-wrapper"><div class="cryodex-legend" /><div class="cryodex-chart"><canvas /></div></div>');
			this.chart = new Chart($('canvas', this.element), {
				type: 'doughnut',
				responsive: true,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					legend: legend,
					onClick: window[$(this.element).attr('data-click')],
					legendCallback: function(chart) {
						console.log(chart.data);
						var text = [];
						text.push('<ul>');
						for (var i=0; i<chart.data.datasets[0].data.length; i++) {
							text.push('<li>');
							console.log($(base.element).attr('data-legend-click'));
							if ($(base.element).attr('data-legend-click')) {
								text.push('<a href="javascript:' + $(base.element).attr('data-legend-click') + '(null, {index: ' + i +', text: \'' + chart.data.labels[i] + '\'});">');
							}
							text.push('<span style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '">&nbsp;</span>');
							if (chart.data.labels[i]) {
								text.push(chart.data.labels[i]);
							}
							if ($(base.element).attr('data-legend-click')) {
								text.push('</a>');
							}
							text.push('</li>');
						}
						text.push('</ul>');
						return text.join("");
					}
				}				
			});
			$('.cryodex-legend', this.element).html(this.chart.generateLegend());
		},

		_bar: function (charttype) {
			var base = this;
			base._counter = 0;

			var table = $('table', this.element).eq(0).hide();

			var labels = new Array();
			$('thead th', table).each(function () {
				labels.push($(this).text());
			});

			var datasets = new Array();
			$('tbody tr', table).each(function () {
				var dataset_item = new Object();
				dataset_item.label = $(this).attr('data-label');
				dataset_item.data = new Array();
				dataset_item.backgroundColor = new Array();
				$('td', this).each(function () {
					dataset_item.data.push($(this).text());
					dataset_item.backgroundColor.push(base._getColour($(this).attr('data-colour')));
					base._counter ++;
				});
				dataset_item.borderWidth = 0;
				datasets.push(dataset_item);
			});

			var chartoptions = {
				legend: { display: false },
				onClick: window[$(this.element).attr('data-click')]
			}

			if ($(this.element).attr('data-stacked')) {
				chartoptions.scales = {
					xAxes: [{ stacked: true }],
					yAxes: [{ stacked: true }]
				}
			}

			$(this.element).append('<canvas />');
			this.chart = new Chart($('canvas', this.element), {
				type: charttype,
				responsive: true,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: chartoptions
			});
		},

		_line: function () {
			var base = this;
			base._counter = 0;

			var table = $('table', this.element).eq(0).hide();

			var labels = new Array();
			$('thead th', table).each(function () {
				labels.push($(this).text());
			});

			var datasets = new Array();
			$('tbody tr', table).each(function () {
				var dataset_item = new Object();
				dataset_item.label = $(this).attr('data-label');
				dataset_item.data = new Array();
				dataset_item.pointRadius = 3;
				dataset_item.pointHoverRadius = 5;
				var colour = base._getColour($(this).attr('data-colour'));
				dataset_item.pointBackgroundColor = colour;
				dataset_item.borderColor = colour;
				dataset_item.pointBorderColor = '#fff';
				dataset_item.pointHitRadius = 20;
				if (typeof ($(this).attr('data-fill')) != 'undefined') {
					dataset_item.backgroundColor = base._getColourAlpha($(this).attr('data-colour'), 0.6);
				}
				$('td', this).each(function () {
					dataset_item.data.push($(this).text());
				});
				datasets.push(dataset_item);
				base._counter ++;
			});

			$(this.element).append('<canvas />');
			this.chart = new Chart($('canvas', this.element), {
				type: 'line',
				responsive: true,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					legend: { display: false },
					tooltips: { mode: 'x-axis' },
					hover: { mode: 'x-axis' },
					onClick: window[$(this.element).attr('data-click')]
				}
			});
		},

		_progress: function() {
			$(this.element).attr('data-value', $(this.element).html());
		},
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return $('[data-cryodex-widget]', this).each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName,
				new Cryodex(this, options));
			}
		});
	};

})(jQuery, window, document);