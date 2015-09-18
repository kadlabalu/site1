  /**
  	* Standard DX javascript that would be inclided in a page
  	*/



  	// add functions for touchponts
  	setupTouchPointTracking();

  	// track visibiluty of touch point
  	trackVisibility();

  	// set a user if the cookie does not exist
  	var userId;
  	setUser();
  	
  	//Track this user in google analytics
	ga('set', 'dimension2', userId);
	ga('send', 'pageview');

  	// If mixpanel is available, track the user there along with any campaign information we may have.
    if(mixpanel !== null && mixpanel !== undefined)
    {
    	var idx = document.URL.indexOf("#campaign=");
		var campaignName = idx != -1 ? document.URL.substring(idx+10) : "NONE";
		var experimentData = "none";

		if(window.optimizely !== null && window.optimizely !== undefined)
		{
			experimentData = window.optimizely.data.state;	
		}

		var trackedData = {
	        "title" : document.title, 
	        "campaign" : campaignName, 
	        "user" : userId,
	        "experimentData" : JSON.parse(JSON.stringify(experimentData))
	    };

	    mixpanel.track("Page View", trackedData);
    }

    function setUser()
    {
    	if(document.cookie.indexOf("dxUserCookie") == -1)
    	{
    		// set a cookie with user id
    		document.cookie = "dxUserCookie=" + guid();	
    	}
    	userId = getCookie("dxUserCookie");
    }

    function getCookie(cname) 
    {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}

    function guid() 
    {
	  	function s4() 
	  	{
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	function recordEvent(eventName, eventdata)
	{
		if(mixpanel !== null && mixpanel !== undefined)
		{
			var trackedData = {				
				"user" : userId,
				"touchpoint" : eventdata
				};

			mixpanel.track(eventName, trackedData);				
		}
	}

	function setupTouchPointTracking()
	{
		var touchPoints = ["#contactMe"];

		$(document).ready(function () {

			for (var i = 0; i < touchPoints.length; i++) 
			{
				
				if( $(touchPoints[i]) !== null && $(touchPoints[i]) !== undefined )		
				{
					$(touchPoints[i]).on("click", function(ev) { 						
						recordEvent(ev.currentTarget.id); 
					} );
				}				
			};

		});
	}

	function trackVisibility()
	{
		$.getScript("js/jquery.lazyloadxt.js", function() { 

			var touchPoints = ["#contactMe"];
     		$(document).ready(function () 
     		{
     			for (var i = 0; i < touchPoints.length; i++)
     			{
					if( $(touchPoints[i]) !== null && $(touchPoints[i]) !== undefined )		
					{
		     			$(touchPoints[i])
			     			.on('lazyshow', function(ev) { recordEvent("touchpoint-visible",  ev.currentTarget.id); })
			     			.lazyLoadXT({visibleOnly: false});

					}
     			}
        	});

		 });		
     }
	

