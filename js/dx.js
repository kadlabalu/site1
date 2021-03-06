  /**
  	* Standard DX javascript that would be inclided in a page
  	*/



  	// add functions for touchponts
  	setupTouchPointTracking();

  	// track visibiluty of touch point
  	trackVisibility();

  	// Category based data
  	setupTargetedData();

  	// set a user if the cookie does not exist
  	var userId;
  	setUser();
  	
  	//Track this user in google analytics
	ga('set', 'dimension2', userId);
	ga('set', 'dimension3', "testValue");
	ga('set', '&uid', userId); // Set the user ID using signed-in user_id.
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
		var touchPoints = ["#contactMe", "#bookshelf-row1", "#bookshelf-row2", "#ReadingNow-FoodRules", "#ReadingNow-Omnivores-Delimma", "#ReadingNow-ThirdPlate", "#ReadingNow-InDefenceOfFood"];

		$(document).ready(function () {

			for (var i = 0; i < touchPoints.length; i++) 
			{
				
				if( $(touchPoints[i]) !== null && $(touchPoints[i]) !== undefined )		
				{
					$(touchPoints[i]).on("click", function(ev) { 						
						recordEvent("touchpoint-clicked", ev.currentTarget.id); 
					} );
				}				
			};

		});
	}

	function trackVisibility()
	{
		$.getScript("js/jquery.lazyloadxt.js", function() { 

			var touchPoints = ["#contactMe", "#bookshelf-row1", "#bookshelf-row2", "#ReadingNow-FoodRules", "#ReadingNow-Omnivores-Delimma", "#ReadingNow-ThirdPlate", "#ReadingNow-InDefenceOfFood"];
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

     function setupTargetedData()
     {

     		$.getJSON( "http://tags.bluekai.com/site/21036?ret=js", function(data) {
     			alert("here");
     		} );

     		
     		//showNotificationBar("This is a test message");
     }

	function showNotificationBar(message, duration, bgColor, txtColor, height) 
	{
	    /*set default values*/
	    duration = typeof duration !== 'undefined' ? duration : 1500;
	    bgColor = typeof bgColor !== 'undefined' ? bgColor : "#F4E0E1";
	    txtColor = typeof txtColor !== 'undefined' ? txtColor : "#A42732";
	    height = typeof height !== 'undefined' ? height : 40;
	    /*create the notification bar div if it doesn't exist*/
	    if ($('#notification-bar').size() == 0) {
	        var HTMLmessage = "<div class='notification-message' style='text-align:center; line-height: " + height + "px;'> " + message + " </div>";
	        $('body').prepend("<div id='notification-bar' style='display:none; width:100%; height:" + height + "px; background-color: " + bgColor + "; position: fixed; z-index: 100; color: " + txtColor + ";border-bottom: 1px solid " + txtColor + ";'>" + HTMLmessage + "</div>");
	    }
	    /*animate the bar*/
	    $('#notification-bar').slideDown(function() {
	        setTimeout(function() {
	            $('#notification-bar').slideUp(function() {});
	        }, duration);
	    });
	}


// Used by different event tracking points.
// eventCategory and eventAction are mandatory.
function sendEvent(eventCategory,eventAction,eventLabel,eventValue)
{
	if(eventLabel && eventValue)
          {
          	ga('send','event',eventCategory, eventAction, eventLabel, eventValue);
          }
          else if(eventLabel)
          {
          	ga('send','event',eventCategory, eventAction, eventLabel);
          }
          else
          {
                ga('send','event',eventCategory, eventAction);
          }
}
