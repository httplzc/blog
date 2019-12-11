;(function () {

	//*** Init Configs

	//* FormSpree
	var contactform =  document.getElementById('contactform');
	if(contactform) {
		contactform.setAttribute('action', '//formspree.io/' + 'macaw' + '@' + 'macaw' + '.' + 'ws');
	}
	////

	//*** Init Plug-ins

	//* FluidVids
	fluidvids.init({
		selector: ['iframe', 'object'],
		players: ['player.youtube.com', 'www.youtube.com']
	});

    //* StickyNav
	stickyNav.init({
		scrollNav: false,
		mainNav: document.getElementById('mainNav'),
		scrollY: 200,
	});


	//*** Events After DOM Content Loaded
	document.addEventListener('DOMContentLoaded', function(e) {

		//* ScrollReveal
		var config = {
	        viewFactor : 0.15,
	        duration   : 800,
	        distance   : "0",
	        reset: true,
	        scale      : 0.5
	    };

	    window.sr = ScrollReveal( config );
		sr.reveal(".post", { scale: 0.8, duration: 1500 });


		//* offSetMenu
    	var btnMenu = document.querySelectorAll('.offsetMenu');

	    for(var x = 0; x < btnMenu.length; x++) {
	      btnMenu[x].addEventListener('click', function () {
	      	document.body.classList.toggle('nav-opened');
	      }, false);
	    }

		//* offSetSearch
    	var btnMenu = document.querySelectorAll('.offsetSearch');

	    for(var x = 0; x < btnMenu.length; x++) {
	      btnMenu[x].addEventListener('click', function () {
	      	document.body.classList.toggle('search-opened');
	      }, false);
	    }


		//* MagicLinks
		var navLinks = document.getElementsByClassName('internal-link');
		var outEff = document.getElementById('bWrapper');


	  	window.addEventListener("scroll", function(event) {

	    	if(this.scrollY > 1) {
	    		outEff.classList.remove('fadeIn');
	    	}

		}, false);

		// Set special anim internal click events
		for(var i = 0; i < navLinks.length; i++) {

			navLinks[i].addEventListener('click', function(e) {

		  		//e.preventDefault();
		  		var self = this;

		  		outEff.classList.add('fadeOut');

		  		window.setTimeout(function() {
		  			var trigg = document.createEvent('HTMLEvents');
					trigg.initEvent('click', true, false);
					self.dispatchEvent(trigg);
		  		}, 500);

			}, false);

		}

	}, false);
	////

  	//*** Service Worker (PWA Cache)

    //* Register the service worker if available.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        });
    }

    window.addEventListener('online', function(e) {
        // Resync data with server.
        console.log("You are online");
        Page.hideOfflineWarning();
        //Arrivals.loadData();
    }, false);

    window.addEventListener('offline', function(e) {
        // Queue up events for server.
        console.log("You are offline");
        Page.showOfflineWarning();
    }, false);

	////
})();
