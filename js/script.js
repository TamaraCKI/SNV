
// They just use "debt" at a lot of points in the program. It doesn't seem to have a specific reason for it to be debt
// But we should also call our y-var "debt", or change the program.
// Data

var data = [
  //{"year": 1910,    "debt": 74},
  //{"year": 1911,    "debt": 74},
  //{"year": 1929,    "debt": 66},
  //{"year": 1950,    "debt": 63},
  //{"year": 1960,    "debt": 54},
  //{"year": 1970,    "debt": 48},
  //{"year": 1971,    "debt": 48},
  // With slashes I calculated myself, now did every two years.
  {"year": 1980,    "debt": 43},
  {"year": 1981,    "debt": 43},//
  {"year": 1982,    "debt": 41},//
  {"year": 1983,    "debt": 40},//

  {"year": 1984,    "debt": 39},
    {"year": 1986,    "debt": 37.6},//
      {"year": 1988,    "debt": 36.3},//
  {"year": 1990,    "debt": 35},
    {"year": 1992,    "debt": 33.6},//
      {"year": 1994,    "debt": 32.3},//
        {"year": 1996,    "debt": 31},//
  {"year": 1999,    "debt": 29},
  {"year": 2001,    "debt": 26.3}, //
  {"year": 2003,    "debt": 22.4}, //
  {"year": 2005,    "debt": 21},
    {"year": 2007,    "debt": 18.5},//
  {"year": 2010,    "debt": 16},
    {"year": 2012,    "debt": 13.6},//
  {"year": 2015,    "debt": 10},
]


// added variables:
var minx = 1980
var maxx = 2015
var miny = 0
var maxy = 100
var endpointData = 1981 //1981
//var noAnswer = false //When true, no answer shows

var ƒ = d3.f
// About the html:
var sel = d3.select('#infographie').html('')
var c = d3.conventions({
  parentSel: sel,
  totalWidth: sel.node().offsetWidth,
  height: 400,
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})



c.x.domain([minx, maxx])
c.y.domain([miny, maxy])

//distance for the y-axis steps
c.xAxis.ticks(10).tickFormat(ƒ()) //10
//distance for the y-axis steps and the label for the y-axis
c.yAxis.ticks(5).tickFormat(d => d + '%')
//c.yAxis.tickSize(-800, -1000, 0)







// ??
var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('debt', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('debt', c.y))

// T: for the endpoint of the data, last point on the graph. Don't know why the -2 is there.
var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(endpointData), height: c.height}) // jc.x(endpointData) - 2

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')



correctSel.append('path.area').at({d: area(data)})

correctSel.append('path.line').at({d: line(data)})

yourDataSel = c.svg.append('path.your-line')



c.drawAxis()



// where you can start drawing
yourData = data
  .map(function(d){ return {year: d.year, debt: d.debt, defined: 0} })
  .filter(function(d){
    if (d.year == endpointData) d.defined = true
    return d.year >= endpointData
  })


// This could be maybe which we should change if we add the button.
// orignally, this is false, but if you make it true, then no answers are shown.
var completed = false

// if you make this endpointData + 1, then you are forced to start your drawing where the data ended. If you make it endpointData -2
// the user can decide it themselves (as it was orignally)
var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(endpointData + 1, maxx, c.x.invert(pos[0]))
    var debt = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < 0.6){//if you make this 8, it is way more fluent, but it doesn't start at the point it should start (1.0 is the highest number that forces the starting point.)
        d.debt = debt
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})
//maxx here represents to where the answer is drawn.
    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true // tried this to prevent answer from showing the answer by making it false, it failed.
       // duration is the speed of drawing the answer.
    }
  })

c.svg.call(drag)




function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }

//<script>
	var noAnswer = false;//When true, no answer shows.

	function displayInfo(){
		 //This line is currently not working.

    if(completed)
    {
      clipRect.transition().duration(1000).attr('width', c.x(maxx))
      document.getElementById("exp1").innerHTML='<br> <span style="font-weight: 700;"> Extreme poverty has plummeted. </span> <br>Despite unprecedented population growth over the last two decades, the global percentage of extreme poverty has gone down. Starting at 43% in 1980, it decreased to only 9.98% in 2015 and has been predicted to decline even further in the future! This is not only the case for extreme poverty. No matter where you put the poverty threshold, poverty has decreased in the last few decades.';
      document.getElementById("exp2").innerHTML='<br><span style="font-weight: 700;"> But what caused this decrease? </span> <br>The answer is economic growth. Due to technological innovations made in the last two centuries, worldwide productivity keeps increasing. This led to a sustained economic growth that remains increasing prosperity to this day by reducing poverty. For the past few decades this decline in poverty was mainly concentrated in China, Indonesia, India, Pakistan and Vietnam.';
      document.getElementById("exp3").innerHTML='<br> <span style="font-weight: 700;"> How did you do?  </span> <br>If your drawn line was nowhere close to the actual data, you were not alone! A global survey from 2017 showed that only 20% of the people asked believed that poverty had decreased in the last two decades.';
      document.getElementById("exp4").innerHTML='<br> <span style="font-weight: 700;"> What now?  </span> <br>Less than 10% extreme poverty seems low, but any extreme poverty is undesirable.The United Nations has the sustainable development goal to eradicate extreme poverty worldwide before 2030. Do you think we can reach this goal?';
      window.location.hash = "#exp4";
      //YUAN: watch out, you need to use ' ' and not " " otherwise <span> won't work :)
      //document.getElementsByTagName('BODY')[0].scrollTop=document.getElementsByTagName('BODY')[0].scrollHeight;
    }

	}
//</script>
