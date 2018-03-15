(function() {
	var small = [
		{
			map: "stanford",
			markers: [
				{
					icon: 11,
					text: "my first dorm",
					x: 0.3521981,
					y: 0.64898306,
				},
				{
					icon: 15,
					text: "Rainbow Coalition protests against the ethnocentric Western Culture requirement in 1988 and the takeover of the President’s Office in 1989.",
					x: 0.56181635,
					y: 0.3560664,
				},
				{
					icon: 14,
					text: "Lake Lagunita stopped becoming artifically filled in late 1990s to preserve wildlife",
					x: 0.2,
					y: 0.85,
				}
			],
			timestamp: Date.now(),
		},
		{
			map: "paloalto",
			markers: [
				{
					icon: 11,
					text: "home",
					x: 0.3521981,
					y: 0.64898306,
				},
				{
					icon: 12,
					text: "dining hall",
					x: 0.54181635,
					y: 0.3560664,
				},
				{
					icon: 16,
					text: "work",
					x: 0.3668223,
					y: 0.3746807,
				}
			],
			timestamp: Date.now(),
		},
		{
			map: "epa",
			markers: [
				{
					icon: 11,
					text: "home",
					x: 0.3521981,
					y: 0.64898306,
				},
				{
					icon: 12,
					text: "dining hall",
					x: 0.54181635,
					y: 0.3560664,
				},
				{
					icon: 16,
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