/*	
	JRPad 1.0
	Javascript drawing program that uses jQuery and RaphaelJS.
	
	Copyright 2010 Gage Herrmann
	
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//stop browser from initiating its drag function
document.ondragstart = function(e) { return false; }

window['JRPad'] = (function () {
	function JRPad(domElementID)
	{
		//functions
		this.setMouse = setMouse;
		this.drawDot = drawDot;
		this.drawLine = drawLine;
		this.eraser = eraser;
		this.setColor = setColor;
		this.setWidth = setWidth;
		
		//variables
		this.id = domElementID;
		this.fullID = "#" + domElementID;
		
		this.strokeWidth = 1;
		this.strokeColor = "#000000";
		this.backgroundColor = "#ffffff";
		
		var width = $(this.fullID).width();
		var height = $(this.fullID).height();
		
		this.offset = $(this.fullID).offset();
		
		this.previousX = 0;
		this.previousY = 0;

		this.paper = Raphael(document.getElementById(this.id), width, height);
		this.background = this.paper.rect(this.offset.left - 8, this.offset.top - 8, width, height).attr({fill: "white"});
		
		this.mouseIsDown = false;
		
	}

	function setMouse(isDown)
	{
		this.mouseIsDown = isDown;
	}

	//draw dot on single mouse click
	function drawDot(e)
	{
		var x = e.pageX - this.offset.left;
		var y = e.pageY - this.offset.top;
		
		this.paper.circle(x, y, this.strokeWidth / 2).attr(
				{
					stroke: this.strokeColor,
					fill: this.strokeColor
				});
	}

	function drawLine(e)
	{
		if(this.mouseIsDown)
		{
			var x = e.pageX - this.offset.left;
			var y = e.pageY - this.offset.top;
			
			if((this.previousX) < x || (this.previousY) < y || (this.previousX) > x || (this.previousY) > y)
			{
				//get rid of crazy line from 0,0
				if(this.previousX == 0 || this.previousY == 0)
				{
					this.previousX = x;
					this.previousY = y;
				}
				this.paper.path("M" + this.previousX + " " + this.previousY + "L" + x + " " + y).attr(
				{
					"stroke-width": this.strokeWidth + "px",
					"stroke-linecap": "round",
					stroke: this.strokeColor
				});
				
				this.previousX = x;
				this.previousY = y;
			}
			else
			{
				this.previousX = x;
				this.previousY = y;
			}
		}
		else
		{
			this.previousX = 0;
			this.previousY = 0;
		}
	}

	function eraser()
	{
		this.strokeColor = this.backgroundColor;
	}

	function setColor(colorValue)
	{
		this.strokeColor = colorValue;
	}

	function setWidth(widthValue)
	{
		this.strokeWidth = widthValue
	}
	
	return JRPad;
})();