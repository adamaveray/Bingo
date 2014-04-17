// Handlebars extensions
(function(Handlebars){
	Handlebars.registerHelper('set', function(name, value){
		this[name]	= value;
	});
}(Handlebars));

// Site
(function($, undefined){
	var $grid	= $('#grid');
	
	var DEFAULT_CARD	= $grid.data('default-card'),
		CARD_PATH		= 'cards/',
		CARD_EXT		= '.txt',
		CARD_SIZE		= 5,
		TILES_COUNT		= (CARD_SIZE * CARD_SIZE) - 1;
	
	var classes	= {
		cell:			'grid-cell',
		cellSelected:	'grid-cell-selected',
		gridLoading:	'grid-loading'
	};
	
	var query	= (function(query){
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

		urlParams = {};
		while(match = search.exec(query)){
			urlParams[decode(match[1])] = decode(match[2]);
		}
		return urlParams;
	}(window.location.search.substring(1)));
	
	var page	= (function(){
		var template	= Handlebars.compile($('#template-grid').html());
			
		var self	= {
			setup:	function(){
				$('#action-reshuffle').click(function(e){
					e.preventDefault();
					
					self.showCard(self.card, self.tiles);
				});
			},
			
			
			loadCard:	function(card){
				self.card	= card;
				$.get(CARD_PATH+encodeURIComponent(card+CARD_EXT), function(data){
					data	= "\n"+data+"\n";
					data	= data.replace(/\n?[ \t]*(?=\n)/g, "")
								  .replace(/\n#.*?(?=\n)/g, "")
								  .replace(/^\s+|\s+$/g, "")
								  .split("\n");
					self.tiles	= data;
					self.showCard(self.card, self.tiles);
				});
			},
			
			showCard:	function(card, tiles){
				tiles	= self.getProcessedTiles(tiles);
				
				var i			= 0,
					midPoint	= ((CARD_SIZE % 2) ? Math.floor(CARD_SIZE/2) : 0);
					
				var processedTiles	= [];
				for(x = 0; x < CARD_SIZE; x++){
					var row	= [];
					for(y = 0; y < CARD_SIZE; y++){
						if(midPoint && x === midPoint && y === midPoint){
							// Middle tile!
							row.push(false);
						} else {
							// Normal tile
							row.push(tiles[i]);
							i++;	
						}
					}
					processedTiles.push(row);
				}
				
				$grid.removeClass(classes.gridLoading)
					 .html(template({
						 tiles:	processedTiles
					 }));
				
				self.initialiseGrid();
			},
			
			initialiseGrid:	function(){
				var $cells	= $grid.find('.'+classes.cell);
				$cells.find('input[type="checkbox"]').change(function(){
					var $this	= $(this),
						$cell	= $(this).closest('.'+classes.cell);
					
					$cell[($this.is(':checked') ? 'add' : 'remove')+'Class'](classes.cellSelected);
					$this.prop('disabled', true);
				});
			},
			
			getProcessedTiles:	function(tiles){
				if(tiles.length < TILES_COUNT){
					// Pad missing tiles with free space
					for(var i = tiles.length; i < TILES_COUNT; i++){
						tiles.push(false);
					}
				}
				
				tiles	= self.getRandomTiles(tiles, TILES_COUNT);
				return tiles;
			},
			
			getRandomTiles:	function(tiles, limit){
			    var shuffled = tiles.slice(0), i = tiles.length, min = i - limit, temp, index;
			    while (i-- > min) {
			        index = Math.floor((i + 1) * Math.random());
			        temp = shuffled[index];
			        shuffled[index] = shuffled[i];
			        shuffled[i] = temp;
			    }
			    return shuffled.slice(min);
			}
		};
		return self;
	}());
	
	page.loadCard(query.card ? query.card : DEFAULT_CARD);
	page.setup();
}(jQuery));
