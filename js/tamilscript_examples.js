/* 
 * (C) 2015 Muthiah Annamalai
 * This file is part of Tamilscript project.
 * 
 * Utility to load programs. 
 */
 
var tamilscript_examples = (function(){
    return {
      programs: { 'counter': 'counter.ts' },
              /* load data from website into the DOM id $(res) */
      load : function (example_file,res) {
        $.get("/examples/"+example_file,function ( data ) {
                $( res ).val( data );
                console.log( 'Completed loading w/ size '+data.length)
            }).fail( function ( ) { 
                $( res ).val('Sorry! could not load file '+example_file); 
         });
      }
    };
})();