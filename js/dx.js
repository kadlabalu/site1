  /**
  	* Standard DX javascript that would be inclided in a page
  	*/

  	// Set a cookie for user, if one is not present

  	var userId;
  	setUser();

    if(mixpanel !== null && mixpanel !== undefined)
    {
    	var idx = document.URL.indexOf("#campaign=");
		var campaignName = idx != -1 ? document.URL.substring(idx+10) : "NONE";

		var trackedData = {
	        "title" : document.title, 
	        "campaign" : campaignName, 
	        "user" : userId
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