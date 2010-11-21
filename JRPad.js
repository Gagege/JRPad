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

window['JRPad'] = (function () {
	function JRPad(domElementID)
	{
		if (typeof domElementID === 'string') {
			if (domElementID.indexOf('#') === 0)
				domElementID = domElementID.substr(1);
			this.domNode = document.getElementById(domElementID);
		} else if (typeof domElementID === 'object') {
			this.domNode = domElementID;
		}
	
		//functions
		this.setMouseDown = setMouseDown;
		this.drawDot = drawDot;
		this.renderDot = renderDot;
		this.drawLine = drawLine;
		this.renderLine = renderLine;
		this.eraser = eraser;
		this.setColor = setColor;
		this.setWidth = setWidth;
		
		//variables
		this.id = domElementID;
		
		this.strokeWidth = 1;
		this.strokeColor = "#000000";
		this.backgroundColor = "#ffffff";
		
		var	jDomNode = $(this.domNode),
			width = $(jDomNode).width(),
			height = $(jDomNode).height();
		
		this.offset = jDomNode.offset();
		
		this.previousX = 0;
		this.previousY = 0;

		this.paper = Raphael(this.domNode, width, height);
		this.background = this.paper.rect(this.offset.left - 8, this.offset.top - 8, width, height).attr({fill: "white"});
		
		this.mouseIsDown = false;
		
		this.saveString = "[";
		
	}

	function setMouseDown(isDown)
	{
		this.mouseIsDown = isDown;
	}

	//draw dot on single mouse click
	function drawDot(e)
	{
		var x = e.pageX - this.offset.left;
		var y = e.pageY - this.offset.top;
		
		this.renderDot(x, y);
	}
	
	function renderDot(x, y)
	{
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
				
				this.renderLine(this.previousX, this.previousY, x, y);
				
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
	
	function renderLine(prevx, prevy, x, y)
	{
		this.paper.path("M" + prevx + " " + prevy + "L" + x + " " + y).attr(
		{
			"stroke-width": this.strokeWidth + "px",
			"stroke-linecap": "round",
			stroke: this.strokeColor
		});
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
	
	function getSaveString()
	{
		return this.saveString;
	}
	
	return JRPad;
})();