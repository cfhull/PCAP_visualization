d3.csv('/data', data => {
  const svg = d3.select('#pcap-viz')
    .style('height', '100vh')
    .append('svg')
      .attr('width', '600')

  svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  const headers = svg.append('g')
  headers.append('text')
    .attr('y', 25)
    .text('Client')

  headers.append('text')
    .attr('x', 400)
    .attr('y', 25)
    .text('Server')

  let prevMsg = {}
  let currConvo
  let msgCount = 0
  let endPoint = 375
  let startPoint = 250
  let nextY = 0;
  let nextColor = 'pink'
  
  const colors = {
    DNS: 'lavender',
    TCP: 'lightblue',
    HTTP: 'aquamarine',
    'TLSv1.2': 'palegreen'
  }

  data.forEach((currMsg, i) => {
    if (isSameConvo(currMsg, prevMsg)) {
      msgCount++
      drawArrow(startPoint, endPoint)
      ;[startPoint, endPoint] = [endPoint, startPoint]
    } else {
      if (currConvo) {
        currConvo.insert('rect', ':first-child')
          .attr('y', -25)
          .attr('width', 550)
          .attr('height', 20 + msgCount * 10)
          .style('fill', nextColor)
      }
      nextColor = colors[currMsg['_ws.col.Protocol']] 
      nextY += currConvo ? currConvo.node().getBBox().height - 1 : 60
      currConvo = svg.append('g')
        .attr('transform', 'translate(0, ' + nextY + ')')
      
      currConvo.append('text')
        .style('font-size', '16')
        .style('font-weight', 'normal')
        .text(currMsg['ip.src'])
        .on('mouseenter', function() {
          d3.select(this).style('font-weight', 'bold')
          highlightMatches(currMsg['ip.src'])
        })
        .on('mouseleave', function() {
          d3.select(this).style('font-weight', 'normal')
          unhighlightMatches(currMsg['ip.src'])
        })

      currConvo.append('text')
        .attr('x', 225)
        .attr('dy', '-15')
        .style('font-size', '12')
        .text(currMsg['_ws.col.Protocol'])

      currConvo.append('text')
        .attr('x', 400)
        .style('font-size', '16')
        .style('font-weight', 'normal')
        .text(currMsg['ip.dst'])
        .on('mouseenter', function() {
          d3.select(this).style('font-weight', 'bold')
          highlightMatches(currMsg['ip.dst'])
        })
        .on('mouseleave', function() {
          d3.select(this).style('font-weight', 'normal')
          unhighlightMatches(currMsg['ip.dst'])
        })

      endPoint = 375
      startPoint = 125
      msgCount = 1

      drawArrow(startPoint, endPoint)
      ;[startPoint, endPoint] = [endPoint, startPoint]
    }
    prevMsg = currMsg
  })
  
  // dumb hack to insert bg color for last record
  currConvo.insert('rect', ':first-child')
    .attr('y', -25)
    .attr('width', 550)
    .attr('height', 20 + msgCount * 10)
    .style('fill', nextColor)

  // sets svg to be slightly bigger than its content
  svg.attr('height', nextY + 50) 
  
  function highlightMatches(data) {
    const convos = svg.selectAll('g')
    convos.each(function(d, i) {
      if (i === 0) {
      } else {
        if(data !== d3.select(this).selectAll('text').nodes()[0].innerHTML &&
           data !== d3.select(this).selectAll('text').nodes()[2].innerHTML) {
          const bg = d3.select(this).select('rect')
          bg.style('fill', () => d3.rgb(bg.style('fill')).darker(2))
        }
      }
    })
  }

  function unhighlightMatches(data) {
    const convos = svg.selectAll('g')
    convos.each(function(d, i) {
      if (i === 0) {
      } else {
        if(data !== d3.select(this).selectAll('text').nodes()[0].innerHTML &&
           data !== d3.select(this).selectAll('text').nodes()[2].innerHTML) {
          const bg = d3.select(this).select('rect')
          bg.style('fill', () => d3.rgb(bg.style('fill')).darker(-2))
        }
      }
    })
  }

  function isSameConvo(currMsg, prevMsg) {
    if (currMsg['ip.src'] === prevMsg['ip.dst'] &&
        currMsg['ip.dst'] === prevMsg['ip.src'] &&
        currMsg['_ws.col.Protocol'] === prevMsg['_ws.col.Protocol'])
      return true;

    return false;
  }

  function drawArrow(start, finish) {
    currConvo.append('path')
      .attr('marker-end', 'url(#arrow)')
      .attr('d', `M ${start} ${-20 + msgCount * 10} L ${finish} ${-20 + msgCount * 10}`)
      .style('stroke', 'black')
  }
})
