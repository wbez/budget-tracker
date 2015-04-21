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

    $('button.tag,.tags,.topic-btn').click(function(){
        console.log('tag');
        var $parent = $(this).parent();
        var filters = [];
        var directory = '';
        if ($(this).hasClass("active")) {
                $( "button[data-filter='"+$(this).attr('data-filter')+"'],.tags[data-filter='"+$(this).attr('data-filter')+"'],.topic-btn[data-filter='"+$(this).attr('data-filter')+"']" ).removeClass("active")
            } else {
                $( "button[data-filter='"+$(this).attr('data-filter')+"'],.tags[data-filter='"+$(this).attr('data-filter')+"'],.topic-btn[data-filter='"+$(this).attr('data-filter')+"']" ).addClass("active")
            };
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            console.log($.inArray(filter, filters));
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
            console.log(filters);
        });
        selector = filters.join(',');
        console.log(selector)
        if (filters.length>0){
            directory = 'tag'   
            hasher.setHash( directory, selector );
        } else {
            console.log("No filters");
            hasher.setHash('_');
        };
        
        hasher.setHash( directory, selector );
        return false;
    });

    // $('.tags').click(function(){
    //     var filters = []
    //     filters.push($(this).attr('data-filter'));
    //     selector = $(this).attr('data-filter');
    //     console.log(selector);
    //     hasher.setHash( 'tag', selector );
    //     return false;
    // });

    $('.clear-filters').click(function(){
        $("button.tag,.tags,.topic-btn").removeClass("active");
        hasher.setHash('_');
        return false;
    });

    function handleChanges(newHash, oldHash){
        // remove any active tags
        $("button.tag,.tags,.topic-btn").removeClass("active");
        
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
            console.log(filter);
        };
            
        // parse directory and then filter as needed
        if (directory=='tag') {
            for (var i in tagsArray) {
                $( "button[data-filter='"+tagsArray[i]+"'],.tags[data-filter='"+tagsArray[i]+"'],.topic-btn[data-filter='"+tagsArray[i]+"']" ).addClass("active");
            };
            $items.isotope({ filter: filter });
        } else if (directory=="card"){
            $cardID = $("#"+tagString);
            $('.modal-title').empty();
            $('.modal-body').empty();
            
            var content = $cardID.children("img").attr("src");
            var title = $cardID.find('> * > .wish').html();  
            var image  = $cardID.attr('image');
            var w = $(".container.cards").width();
            $('.modal-title').html(title);
            $('.modal-body').html("<img class='modal-photo' src='images/"+image+".jpg'/>");
            $('.modal-photo').css('max-height', $(window).height() * 0.75);
            $('#myModal').modal();
        } else {
            $items.isotope({ filter: '*' });
        };

        // display message box if no filtered items

      }

    $container.isotope( 'on', 'arrangeComplete', function(filteredItems){
        console.log(filteredItems.length);
        $('#noresults').hide();
        if (filteredItems.length == 0) {
            $('#noresults').show();
        } else {
            $('#noresults').hide();
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