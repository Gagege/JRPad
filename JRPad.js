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
		this.clear = clear;
		this.setColor = setColor;
		this.setWidth = setWidth;
		this.shapeToSaveString = shapeToSaveString;
		this.getSaveString = getSaveString;
		this.parseSaveString = parseSaveString;
		this.renderShapeFromStringData = renderShapeFromStringData;
		
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

		this.paper = new Raphael(this.domNode, width, height);
		this.background = this.paper.rect(this.offset.left - 8, this.offset.top - 8, width, height).attr({fill: this.backgroundColor});
		
		this.mouseIsDown = false;
		
		this.saveString = "";
		
		var pad = this; // alias this so we can reference in closures

	    $(pad.domNode)
			.mousedown( function(e) {
				pad.setMouseDown(true);
				pad.drawDot(e);
				return false;
			})
			.mouseup( function() {
				pad.setMouseDown(false);
			})
			.mousemove( function(e) {
				pad.drawLine(e);
			});
		
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
		
		this.renderDot(x, y, this.strokeColor, this.strokeWidth);
	}
	
	function renderDot(x, y, color, width)
	{
		this.paper.circle(x, y, width/ 2).attr(
		{
			stroke: color,
			fill: color
		});
		this.shapeToSaveString("d", x, y, color, width);
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
				this.renderLine(this.previousX, this.previousY, x, y, this.strokeColor, this.strokeWidth);
			}
			this.previousX = x;
			this.previousY = y;
		}
		else
		{
			this.previousX = 0;
			this.previousY = 0;
		}
	}
	
	function renderLine(prevx, prevy, x, y, color, width)
	{
		this.paper.path("M" + prevx + " " + prevy + "L" + x + " " + y).attr(
		{
			"stroke-width": width + "px",
			"stroke-linecap": "round",
			stroke: color
		});
		this.shapeToSaveString("l", x, y, color, width);
	}

	function eraser()
	{
		this.strokeColor = this.backgroundColor;
	}
	
	function clear()
	{
		this.paper.clear();
		
		var	jDomNode = $(this.domNode),
			width = $(jDomNode).width(),
			height = $(jDomNode).height();
		
		this.background = this.paper.rect(this.offset.left - 8, this.offset.top - 8, width, height).attr({fill: "white"});
		
	}

	function setColor(colorValue)
	{
		this.strokeColor = colorValue;
	}

	function setWidth(widthValue)
	{
		this.strokeWidth = widthValue
	}
	
	function shapeToSaveString(shapeType, x, y, color, width)
	{
		this.saveString += shapeType + "|" +
									x + "|" +
									y + "|" +
									color + "|" +
									width +
									",";
	}
	
	function getSaveString()
	{
		return this.saveString;
	}
	
	function parseSaveString(saveString)
	{
		saveString = jQuery.trim(saveString);
		
		var shapeType = "";
		var previousX = "";
		var previousY = "";
		var x = "";
		var y = "";
		var color = "";
		var width = "";
		var currentAttribute = 0;
		
		for(i = 0; i < saveString.length; i++)
		{
			var currentChar = saveString.charAt(i);
			switch(currentChar)
			{
				case ',':
					this.renderShapeFromStringData(shapeType, previousX, previousY, x, y, color, width);
					shapeType = "";
					previousX = x;
					previousY = y;
					x = "";
					y = "";
					color = "";
					width = "";
					currentAttribute = 0;
					break;
				case '|':
					currentAttribute++;
					break;
				default:
					if(currentAttribute == 0)
						shapeType = currentChar;
					else if(currentAttribute == 1)
						x += currentChar;
					else if(currentAttribute == 2)
						y += currentChar;
					else if(currentAttribute == 3)
						color += currentChar;
					else if(currentAttribute == 4)
						width += currentChar;
			}
		}
		this.renderShapeFromStringData(shapeType, previousX, previousY, x, y, color, width);
	}
	
	function renderShapeFromStringData(shapeType, previousX, previousY, x, y, color, width)
	{
		if(shapeType == 'l')
		{
			//get rid of crazy line from 0,0
			if(previousX == 0 || previousY == 0)
			{
				previousX = x;
				previouxY = y;
			}
			this.renderLine(previousX, previousY, x, y, color, width);
		}
		else if(shapeType == 'd')
		{
			this.renderDot(x, y, color, width);
		}
	}
	
	return JRPad;
})();