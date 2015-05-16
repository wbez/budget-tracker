$( document ).ready(function() {

    Isotope.Item.prototype._create = function() {
      // assign id, used for original-order sorting
      this.id = this.layout.itemGUID++;
      // transition objects
      this._transn = {
        ingProperties: {},
        clean: {},
        onEnd: {}
      };
      this.sortData = {};
    };

    Isotope.prototype.arrange = function( opts ) {
      // set any options pass
      this.option( opts );
      this._getIsInstant();
      // just filter
      this.filteredItems = this._filter( this.items );
      // flag for initalized
      this._isLayoutInited = true;
    };

    var $items = $('#items');
    var $container = $('#items');
    // init
    $container.isotope({
      // options
      itemSelector: '.item',
      layoutMode: 'masonry',
    });

    $('.players-expand').click(function(){
        $('.bio').show();
        $('.players-expand').hide();
        $('.players-collapse').show();
    })

    $('.players-collapse').click(function(){
        $('.bio').hide();
        $('.players-expand').show();
        $('.players-collapse').hide();
    })

    $('button.tag').click(function(){
        console.log('button');
        var $parent = $(this).parent();
        var filters = [];
        var directory = '';
        $('button.tag').removeClass('active');
        $('button.tag').not(this).addClass('inactive')
        $(this).addClass("active");
        $(this).removeClass("inactive");
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
        });

        selector = filters.join(',');
        if (filters.length>0){
            directory = 'tag'   
            hasher.setHash( directory, selector );
        } else {
            hasher.setHash('_');
        };
        
        hasher.setHash( directory, selector );
        return false;
    });

    $('.tags').click(function(){
        console.log('tags');
        var $parent = $(this).parent();
        var filters = [];
        var directory = '';
        if ($(this).hasClass("active")) {
                $( ".tags[data-filter='"+$(this).attr('data-filter')+"']" ).removeClass("active")
            } else {
                $( ".tags[data-filter='"+$(this).attr('data-filter')+"']" ).addClass("active")
            };
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
        });

        selector = filters.join(',');
        if (filters.length>0){
            directory = 'tag'   
            hasher.setHash( directory, selector );
        } else {
            hasher.setHash('_');
        };
        
        hasher.setHash( directory, selector );
        return false;
    });

    $('.clear-filters').click(function(){
        $("button.tag,.tags").removeClass("active inactive");
        hasher.setHash('_');
        return false;
    });

    function handleChanges(newHash, oldHash){
        // remove any active tags
        $("button.tag,.tags").removeClass("active");
        
        // save previous oldHash globally for modal
        previous = oldHash;
        
        // get attributes from newHash
        var hashArray = hasher.getHashAsArray();
        var directory = hashArray[0];
        var tagString = hashArray[1];
        var tags = [];
        var tagsArray = [];
        
        // create tagsArray and tags class filters
        if (tagString){
            tagsArray = hashArray[1].split(',');
            for (var i in tagsArray) {
                tags[i] = '.'+tagsArray[i];
            };
            filter = tags.join('');
        };
            
        // parse directory and then filter as needed
        if (directory=='tag') {
            $('.active-filters').html('Filtering for: ');
            $("button.tag").addClass("inactive");
            for (var i in tagsArray) {
                var prettyTag = $( "button[data-filter='"+tagsArray[i]+"'],.tags[data-filter='"+tagsArray[i]+"']" ).first().text()
                $( "button[data-filter='"+tagsArray[i]+"'],.tags[data-filter='"+tagsArray[i]+"']" ).addClass("active");
                $( "button[data-filter='"+tagsArray[i]+"']" ).removeClass("inactive");
                $('.clear-filters').html('<i class="fa fa-times-circle"></i> Clear filters');
                if (i==0) {
                    $('.active-filters').append(prettyTag);
                } else if (i == tagsArray.length-1 && tagsArray.length > 1){
                    $('.active-filters').append(" and " +prettyTag);
                } else {
                    $('.active-filters').append(", " +prettyTag);
                }
            };
            $items.isotope({ filter: filter });
        } else {
            $('.active-filters').html('');
            $('.clear-filters').html('');
            $items.isotope({ filter: '*' });
        };
      }

    $container.isotope( 'on', 'arrangeComplete', function(filteredItems){
        $('#noresults').hide();
        if (filteredItems.length == 0) {
            $('#noresults').show();
        } else {
            $('#noresults').hide();
        }
    });

    $('.filter-text').affix({
        offset: {
            top: $('.active-filters').offset().top
        }
    });

    hasher.changed.add(handleChanges); //add hash change listener
    hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
    hasher.init(); //initialize hasher (start listening for history changes)

    twttr.events.bind(
      'loaded',
      function (event) {
        event.widgets.forEach(function (widget) {
          $container.isotope('layout');
        });
      }
    );

});