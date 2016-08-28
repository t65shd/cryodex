; (function ($, window, document, undefined) {
	var pluginName = "cryodex",
		defaults = {
			baseColors: {
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
			}
		};

	function Cryodex(element, options) {
		this.element = element;

		defaults.colors = defaults.baseColors;

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
					this._bar();
					break;
				case 'line':
					this._line();
					break;
			}
		},

		_getColor: function(color) {
			if (typeof (color) == 'undefined' || color == '') {
				color = this.options.colors[Object.keys(this.options.colors)[this._counter % Object.keys(this.options.colors).length]];
			} else if (typeof (this._defaults.baseColors[color]) != 'undefined') {
				color = this._defaults.baseColors[color];
			} else if (typeof (this.options.colors[color]) != 'undefined') {
				color = this.options.colors[color];
			}
			return color;
		},

		_getColorAlpha: function (color, opacity) {
			color = this._getColor(color);
			if (color.substr(0, 5) == 'rgba(') {
				rgb = color.replace('rgba(', '').replace(')', '');
				rgb = rgb.split(',');
				color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
			} else if (color.substr(0, 4) == 'rgb(') {
				rgb = color.replace('rgb(', '').replace(')', '');
				rgb = rgb.split(',');
				color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
			} else if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
				c = color.substring(1).split('');
				if (c.length == 3) {
					c = [c[0], c[0], c[1], c[1], c[2], c[2]];
				}
				c = '0x' + c.join('');
				color = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
			}

			return color;
		},

		_gauge: function () {
			this._counter = 0;

			var value1 = $(this.element).attr('data-percent') * 0.75;
			var value2 = 75 - value1;
			var color = this._getColor($(this.element).attr('data-color'));

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
							color,
							'#ddd',
							'transparent'
						],
						hoverBackgroundColor: [
							color,
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
					rotation: 0.75 * Math.PI
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
					dataset_item.backgroundColor.push(base._getColor($(this).attr('data-color')));
					base._counter ++;
				});
				dataset_item.borderWidth = 0;
				datasets.push(dataset_item);
			});

			$(this.element).append('<canvas />');
			this.chart = new Chart($('canvas', this.element), {
				type: 'doughnut',
				responsive: true,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: { legend: { position: 'left' } }
			});
		},

		_bar: function () {
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
					dataset_item.backgroundColor.push(base._getColor($(this).attr('data-color')));
					base._counter ++;
				});
				dataset_item.borderWidth = 0;
				datasets.push(dataset_item);
			});

			$(this.element).append('<canvas />');
			this.chart = new Chart($('canvas', this.element), {
				type: 'bar',
				responsive: true,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					legend: { display: false }
				}
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
				var color = base._getColor($(this).attr('data-color'));
				dataset_item.pointBackgroundColor = color;
				dataset_item.borderColor = color;
				dataset_item.pointBorderColor = '#fff';
				dataset_item.pointHitRadius = 20;
				if (typeof ($(this).attr('data-fill')) != 'undefined') {
					dataset_item.backgroundColor = base._getColorAlpha($(this).attr('data-color'), 0.6);
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
					hover: { mode: 'x-axis' }
				}
			});
		}
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