var data = [
  {"year": 1981,    "percentage": 53},
  {"year": 1984,    "percentage": 58},
  {"year": 1987,    "percentage": 42},
  {"year": 1990,    "percentage": 43},
  {"year": 1993,    "percentage": 41},
  {"year": 1996,    "percentage": 36},
  {"year": 1999,    "percentage": 34},
  {"year": 2002,    "percentage": 30},
  {"year": 2005,    "percentage": 25},
  {"year": 2008,    "percentage": 21},
  {"year": 2011,    "percentage": 17},
]

var ƒ = d3.f

var sel = d3.select('#infographie').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, 
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.x.domain([1981, 2011])
c.y.domain([0, 100])

//what are ticks?
c.xAxis.ticks(10).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => d + '%')

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('percentage', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('percentage', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(2011) - 2, height: c.height})//The last year on the graph

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {year: d.year, percentage: d.percentage, defined: 0} })
  .filter(function(d){
    if (d.year == 1981) d.defined = true //where to star drawing
    return d.year >= 1981
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(2008, 2011, c.x.invert(pos[0])) //Don't know what are these two years 
    var percentage = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.percentage = percentage
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1500).attr('width', c.x(2011)) //duration(1500)?
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
