
// They just use "debt" at a lot of points in the program. It doesn't seem to have a specific reason for it to be debt
// But we should also call our y-var "debt", or change the program.
// Data
var data = [
  {"year": 1981,    "debt": 53},
  {"year": 1984,    "debt": 58},
  {"year": 1987,    "debt": 42},
  {"year": 1990,    "debt": 43},
  {"year": 1993,    "debt": 41},
  {"year": 1996,    "debt": 36},
  {"year": 1999,    "debt": 34},
  {"year": 2002,    "debt": 30},
  {"year": 2005,    "debt": 25},
  {"year": 2008,    "debt": 21},
  {"year": 2011,    "debt": 17},
]


// added variables:
 var minx = 1981
var maxx = 2011
var miny = 0
var maxy = 100
var endpointData = 1987

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
c.xAxis.ticks(10).tickFormat(ƒ())
//distance for the y-axis steps and the label for the y-axis
c.yAxis.ticks(5).tickFormat(d => d + '€')

// ??
var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('debt', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('debt', c.y))

// T: for the endpoint of the data, last point on the graph. Don't know why the -2 is there.
var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(endpointData) - 2, height: c.height})

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
      if (Math.abs(d.year - year) < .5){
        d.debt = debt
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})
//maxx here represents to where the answer is drawn.
    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true // tried this to prevent answer from showing the answer by making it false, it failed.
      clipRect.transition().duration(1500).attr('width', c.x(maxx)) // duration is the speed of drawing the answer.
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
