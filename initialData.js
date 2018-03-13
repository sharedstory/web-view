(function() {
	var small = [
		{
			map: "stanford",
			markers: [
				{
					icon: "home",
					text: "home",
					x: 0.3521981,
					y: 0.64898306,
				},
				{
					icon: "school",
					text: "dining hall",
					x: 0.54181635,
					y: 0.3560664,
				},
				{
					icon: "park",
					text: "work",
					x: 0.3668223,
					y: 0.3746807,
				}
			],
			timestamp: Date.now(),
		}
	];

	var models =  {
		small: small,
   };

   if( typeof exports !== 'undefined' ) {
	   // We're being loaded by the Node.js module loader ('require') 	so we use its
	   // conventions of returning the object in exports.
	   exports.models = models;
   } else {
	   // We're not in the Note.js module loader so we assume we're being loaded
	   // by the browser into the DOM.
	   window.models = models;
   }
})();