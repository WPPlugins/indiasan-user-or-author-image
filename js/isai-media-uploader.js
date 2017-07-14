jQuery(document).ready(function($) {
	
	//Image uploader as per wordpress version
	jQuery( document ).on('click', '#isai_author_image_uploader', function() { 
		
		var imgfield, showimgfield;
		
		imgfield     = jQuery(this).prev('input').attr('id');
		
		// Show uploaded image
		showimgfield = 'avatar';
		
		// Check for media uploader
		if( typeof wp == "undefined" || isai.new_media_ui != '1' ){
				
			tb_show( '', 'media-upload.php?type=image&amp;TB_iframe=true' );
	    	
			window.original_send_to_editor = window.send_to_editor;
			window.send_to_editor = function(html) {
				
				if(imgfield)  {
					
					var mediaurl = jQuery('img',html).attr('src');
					jQuery('#'+imgfield).val(mediaurl);
					jQuery('.'+showimgfield).attr('src',mediaurl);
					tb_remove();
					imgfield = '';
					
				} else {
					
					window.original_send_to_editor(html);
					
				}
			};
	    	return false;
			
		      
		} else {
			
			var file_frame;
			
			// If the media frame already exists, reopen it
			if ( file_frame ) {
				file_frame.open();
			  return;
			}
	
			// Create the media frame
			file_frame = wp.media.frames.file_frame = wp.media({
				frame: 'post',
				state: 'insert',
				multiple: false // Set to true to allow multiple files to be selected
			});
	
			file_frame.on( 'menu:render:default', function(view) {
		        
				// Store our views in an object
		        var views = {};
	
		        // Unset default menu items
		        view.unset('library-separator');
		        view.unset('gallery');
		        view.unset('featured-image');
		        view.unset('embed');
	
		        // Initialize the views in our view object
		        view.set(views);
		    });
	
			// When an image is selected, run a callback
			file_frame.on( 'insert', function() {
	
				// Get selected size from media uploader
				var selected_size = jQuery('.attachment-display-settings .size').val();
				
				var selection = file_frame.state().get('selection');
				selection.each( function( attachment, index ) {
					attachment = attachment.toJSON();
					
					// Selected attachment url from media uploader
					var attachment_url = attachment.sizes[selected_size].url;
					
					if(index == 0){
						
						// place first attachment in field
						jQuery('#'+imgfield).val(attachment_url);
						jQuery('.'+showimgfield).attr('src',attachment_url);
					} else{ 
						jQuery('#'+imgfield).val(attachment_url);
						jQuery('.'+showimgfield).attr('src',attachment_url);
					}
				});
			});
	
			// Finally, open the modal
			file_frame.open();
			
			window.original_send_to_editor = window.send_to_editor;
			window.send_to_editor = function(html) {
				
				if(imgfield)  {
					
					var mediaurl = jQuery('img',html).attr('src');
					jQuery('#'+imgfield).val(mediaurl);
					jQuery('.'+showimgfield).attr('src',mediaurl);
					tb_remove();
					imgfield = '';
					
				} else {
					
					window.original_send_to_editor(html);
				}
			};
		}
	});
});