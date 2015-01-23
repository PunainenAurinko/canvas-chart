var canvas,
    context,
    data,
    colour,
    label,
    value = 0,
    total = 0;

document.addEventListener("DOMContentLoaded", init);

function init() {
    getData("data/cheese.json");
}

function getData(path) {
    var xhr = $.ajax({
        url: path,
        datatype: "JSON",
        type: "GET"
    }).done(gotData).fail(gotNothing);
}

function gotData(JSONdata) {
    data = JSONdata;
    console.log(data);
        
    for (i = 0; i < data.segments.length; i++) {
        colour = data.segments[i].color;
        label = data.segments[i].label;
        value = data.segments[i].value;
        console.log("Cheese " + i + " - Label: " + label + ", Value: " + value + ", Colour: " + colour);
        total += value;
    }
    
    console.log("Total    = " + total);
    
    drawPie();
    drawTarget();
}

function gotNothing(){
    console.log("You've got nothing at the moment (AJAX call failed). Try again later." + xhr.status);
}

function setDefaultStyles(){
    //set default styles for canvas
    context.strokeStyle = "#fff";	//colour of the lines
    context.lineWidth = 2.5;
    context.font = "italic bold 12pt Courier";
    context.fillStyle = colour;
    context.textAlign = "left";
}

function drawPie() {
    var radius;
    canvas = document.querySelector("#pie-chart");
    context = canvas.getContext("2d");
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set the styles in case others have been set
    setDefaultStyles();
    var cx = canvas.width/2.6;
    var cy = canvas.height/2;
    
    
    var currentAngle = 0;
    
    for(var i=0; i<data.segments.length; i++) {
        
        colour = data.segments[i].color;
        label = data.segments[i].label;
        value = data.segments[i].value;
        
        var pct = value/total;
        var endAngle = currentAngle + (pct * (Math.PI * 2));
        
                
        if (value === data.segments[4].value) {
            radius = 90;
        } else if (value === data.segments[1].value) {
            radius = 110;
        } else {
            radius = 100;
        }
     
    
        //draw the arc
        context.moveTo(cx, cy);
        context.beginPath();
        context.fillStyle = colour;
        context.arc(cx, cy, radius, currentAngle, endAngle, false);  
        context.lineTo(cx, cy);
        context.fill();
        context.stroke();
    
    
        //draw the lines
        context.save();
        context.translate(cx, cy);//make the middle of the circle the (0,0) point
    
        context.beginPath();
        //angle for the lines
        var midAngle = (currentAngle + endAngle)/2; //middle of two angles
    
        var dx = Math.cos(midAngle) * (0.6 * radius);
        var dy = Math.sin(midAngle) * (0.6 * radius);
        context.moveTo(dx, dy);
        //ending points for the lines
        if (value === data.segments[4].value) {
            var dx = Math.cos(midAngle) * (radius + 50); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 50);
        } else {
            var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 30);
        }
        context.lineTo(dx, dy);
        context.stroke();
    
        //    context.fillStyle = "#fff";
        if (label === data.segments[1].label) {
            context.fillText(label, dx - 30, dy + 20);
        } else if (label === data.segments[5].label) {
            context.fillText(label, dx - 10, dy - 15);
        } else if (label === data.segments[0].label) {
            context.fillText(label, dx + 10, dy + 10);
        } else {        
            context.fillText(label, dx - 30, dy - 20);
        }
        context.restore();
    
        currentAngle = endAngle;
    }
}

function drawTarget() {
    canvas = document.querySelector("#target");
    context = canvas.getContext("2d");
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set the styles in case others have been set
    setDefaultStyles();
    
    var cx = canvas.width/2.2;
    var cy = canvas.height/2;
     		
    for(var i=0; i<data.segments.length; i++) {
        
        colour = data.segments[i].color;
        label = data.segments[i].label;
        value = data.segments[i].value;
        
        var pct = value/total;
        
        context.beginPath();
        context.arc(cx, cy, value*Math.PI, pct*Math.PI, false);
        context.lineWidth = 17;
	 	context.strokeStyle = colour;
        context.stroke();

        context.fillStyle = colour;
        context.fillText(label, ((cx+value)*1.4)-10, (cy+value*2)+18);
    }
}