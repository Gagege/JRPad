var paper;
function JRPad(domElementID)
{
	//functions
	this.update = update;
	this.erase = erase;
	
	//variables
	this.id = domElementID;
	this.fullID = "#" + domElementID;
	
	this.strokeWidth = 14;
	this.strokeColor = "#444499";
	this.backgroundColor = "#ffffff";
	
	var width = $(this.fullID).width();
	var height = $(this.fullID).height();

	paper = Raphael(document.getElementById(this.id), width, height);
	
	this.drawing = [];
}

function update()
{
	
	//stop browser from initiating it's drag function
	document.ondragstart = function(e) { return false; }
	
	var offset = $(this.fullID).offset();
	
	var x;
	var y;
	var oldx = 0;
	var oldy = 0;
	var isMouseDown = false;
	var color = this.strokeColor;
	var bgColor = this.backgroundColor;
	var stWidth = this.strokeWidth;
	
	$(this.fullID).mousedown( function(e)
	{
		isMouseDown = true;
		
		//draw dot on single mouse click
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
		
		paper.circle(x, y, stWidth / 2).attr(
				{
					stroke: bgColor,
					fill: color
				});
		
	}).mouseup( function()
	{
		isMouseDown = false;
	});
	
	$(this.fullID).mousemove( function(e)
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
				
				parent.paper.path("M" + oldx + " " + oldy + "L" + x + " " + y).attr(
				{
					"stroke-width": stWidth + "px",
					"stroke-linecap": "round",
					stroke: color,
					opacity: 100
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
	return;
}

function erase()
{
	this.strokeColor = this.backgroundColor;
}
