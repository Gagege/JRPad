$(document).ready(function() {

	document.ondragstart = function(e) { return false; }
	
	var paper = Raphael(document.getElementById("draw"), 200, 200);

	var c = paper.rect(0, 0, 200, 200);
	
	var offset = $("#draw").offset();
	
	var x;
	var y;
	var oldx = 0;
	var oldy = 0;
	var isMouseDown = false;
	var strokeWidth = 8;
	var strokeColor = "ff5500";
	
	$("#draw").mousedown( function()
	{
		isMouseDown = true;
	}).mouseup( function()
	{
		isMouseDown = false;
	});
	
	$("#draw").mousemove( function(e)
	{
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
		
		if(isMouseDown)
		{
			if((oldx+1) < x || (oldy+1) < y || (oldx-1) > x || (oldy-1) > y)
			{
				//get rid of crazy line from 0,0
				if(oldx == 0 || oldy == 0)
				{
					oldx = x;
					oldy = y;
				}
				
				var segment = paper.path("M" + oldx + " " + oldy + "L" + x + " " + y);
				
				segment.attr(
				{
					"stroke-width": strokeWidth + "px",
					"stroke-linecap": "round",
					stroke: "#" + strokeColor
				});
				
				oldx = x;
				oldy = y;
			}
		}
		else
		{
			oldx = x;
			oldy = y;
		}
		
		//var coords = x + ", " + y;
		
		//$("#coordinatesLabel").text(coords);
	});
});
