function getXIntercept(chosenY, x1, y1, x2, y2) {
  // slope of A to O
  let m = (y2 - y1) / (x2 - x1); // Get slope of inverse A-O
  // Calculate the y-intercept
  let yIntercept = y1 - m * x1;
  // find X coordinate
  let xIntercept = (chosenY - yIntercept) / m
  return xIntercept
}

function getRandomColor() {
  return d3.rgb(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ).formatHex();
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function appendCircle(g, cx, cy) {
  g.append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", 1)
    .attr("stroke", "black")
    .attr("fill", "black")
}

function appendText(g, text, x, y) {
  g.append("text")
    .text(text)
    .attr("x", x)
    .attr("y", y)
    .attr("dx", 6)
    .attr("dy", 10)
}

function drawTriangle(svg, aX, aY, bX, bY, cX, cY, fill) {
  let trianglePath = d3.path()

  trianglePath.moveTo(aX, aY)
  trianglePath.lineTo(bX, bY)
  trianglePath.lineTo(cX, cY)
  trianglePath.closePath()

  svg.append("path")
    .attr("d", trianglePath)
    .attr("fill", fill)
    .attr("stroke", "black")
}

function drawBird(svg, height, width, margin) {
  // Bumper value
  let bumper = 20
  let birdG = svg.append("g")

  // Origo is always in the middle
  let Ox = width / 2,
    Oy = height / 2;


  // A --> Place A in the left side
  let Ax = getRandomArbitrary(margin.left, Ox - bumper),
    Ay = getRandomArbitrary(margin.top, height - margin.bottom);

  // B
  let By = getRandomArbitrary(Math.min(Oy - bumper, Ay), margin.top);
  let Bx;
  if (Oy < Ay) {
    let xIntercept = getXIntercept(By, Ox, Oy, Ax, Ay)
    Bx = getRandomArbitrary(Ax, Math.min(xIntercept, width - margin.right))
  } else {
    Bx = getRandomArbitrary(Ax + bumper, width - margin.right)
  }
  drawTriangle(birdG, Ox, Oy, Ax, Ay, Bx, By, getRandomColor())

  // Todo temporary
  let Ex = (Ax + Ox) / 2
  let Ey = (Ay + Oy) / 2

  // C
  let Cy = getRandomArbitrary(Math.max(Oy, Ay) + bumper, height - margin.bottom)
  let Cx = getRandomArbitrary(Ex, Ox)
  drawTriangle(birdG, Ex, Ey, Ox, Oy, Cx, Cy, getRandomColor())

  // D
  let Dy = getRandomArbitrary(By + bumper, height - margin.bottom)
  let OBIntercept = getXIntercept(Dy, Ox, Oy, Bx, By)
  let Dx = getRandomArbitrary(Math.max(Ox + bumper, OBIntercept), width - margin.right)

  drawTriangle(birdG, Ox, Oy, Cx, Cy, Dx, Dy, getRandomColor())

  
  L1y = Cy-((Cy-Dy)/10)
  L1x = getXIntercept(L1y, Cx, Cy, Dx, Dy)
  
  L2y = Cy-((Cy-Dy)/10*2)
  L2x = getXIntercept(L2y, Cx, Cy, Dx, Dy)
  
  birdG.selectAll("line")
    .data([{"x": L1x, "y": L1y}, {"x": L2x, "y": L2y}])
    .enter()
    .append('line')
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", (d) => d.x)
    .attr("y1", (d) => d.y)
    .attr("x2", (d) => d.x)
    .attr("y2", height);
}

function createBird() {
  const width = 700,
    height = 500,
    margin = { "top": 20, "bottom": 20, "right": 20, "left": 100 }

  const svg = d3.select("#random-bird-container").append("svg").attr("viewBox", [0, 0, width, height])

  drawBird(svg, height, width, margin)
}

createBird()
