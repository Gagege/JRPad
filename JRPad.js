var strokeWidth = 4;
var strokeColor = "#555555";

$(document).ready(function() {

	document.ondragstart = function(e) { return false; }
	
	var width = $("draw").width();
	var height = $("draw").height();
	
	var paper = Raphael(document.getElementById("draw"), width, height);
	
	var offset = $("#draw").offset();
	
	var x;
	var y;
	var oldx = 0;
	var oldy = 0;
	var isMouseDown = false;
	
	$("#draw").mousedown( function(e)
	{
		isMouseDown = true;
		
		//draw dot on single mouse click
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
		
		var segment = paper.circle(x, y, strokeWidth / 2);
		
		segment.attr(
				{
					//"stroke-width": strokeWidth + "px",
					stroke: strokeColor,
					fill: strokeColor
				});
		
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
					stroke: strokeColor
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
	});
});
