function getRandomPointInTriangle(x1, y1, x2, y2, x3, y3) {
  let a1 = Math.random();
  let a2 = Math.random();

  // If the point is outside the triangle, flip it inside.
  if (a1 + a2 > 1) {
    a1 = 1 - a1;
    a2 = 1 - a2;
  }

  const x = a1 * x1 + a2 * x2 + (1 - a1 - a2) * x3;
  const y = a1 * y1 + a2 * y2 + (1 - a1 - a2) * y3;

  return [x, y];
}

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

function appendCircle(g, cx, cy, r) {
  g.append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)
    .attr("stroke", "black")
    .attr("fill", "black")
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
  let birdG = svg.append("g").attr("class", "bird-g")

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
  drawTriangle(birdG, Ex, Ey, Ox, Oy, Cx, Cy, getRandomColor()) // Beak
  let [Ix, Iy] = getRandomPointInTriangle(Ax, Ay, Bx, By, Ox, Oy)
  appendCircle(birdG, Ix, Iy, width / height)

  // D
  let Dy = getRandomArbitrary(By + bumper, height+margin.bottom)
  let OBIntercept = getXIntercept(Dy, Ox, Oy, Bx, By)
  let Dx = getRandomArbitrary(Math.max(Ox + bumper, OBIntercept), width)

  drawTriangle(birdG, Ox, Oy, Cx, Cy, Dx, Dy, getRandomColor())


  L1y = Cy - ((Cy - Dy) / 10)
  L1x = getXIntercept(L1y, Cx, Cy, Dx, Dy)

  L2y = Cy - ((Cy - Dy) / 10 * 2)
  L2x = getXIntercept(L2y, Cx, Cy, Dx, Dy)

  birdG.selectAll("line")
    .data([{ "x": L1x, "y": L1y }, { "x": L2x, "y": L2y }])
    .enter()
    .append('line')
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", (d) => d.x)
    .attr("y1", (d) => d.y)
    .attr("x2", (d) => d.x)
    .attr("y2", height);

  return birdG
}

function generateNBirds(n, birdBox, svg, margin, height) {
  svg.selectAll(".bird-g").remove()
  let birdG;
  for (let i = 0; i < n; i++) {
    birdG = drawBird(svg, birdBox, birdBox, margin)
    birdG.attr("transform", "translate(" + (i * birdBox) + ", " + (height / 2 - birdBox) + ")")
  }
}

function mainBirdFunction() {
  const width = 1000,
    height = 500,
    margin = { "top": 10, "bottom": 20, "right": 10, "left": 10 },
    birdBox = 100;

  const svg = d3.select("#random-bird-container").append("svg").attr("viewBox", [0, 0, width, height])
  svg.append("line")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", 0)
    .attr("x2", 1000)
    .attr("y1", height / 2)
    .attr("y2", height / 2)

  generateNBirds(10, birdBox, svg, margin, height)

  let rectHeight = 50
  let rectWidth = 200
  let = buttonG = svg.append("g")
  buttonG.append("rect")
    .attr('x', width / 2 - (rectWidth / 2))
    .attr('y', height - rectHeight)
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('stroke', 'black')
    .attr('fill', getRandomColor());

  buttonG.append("text")
    .text("NEW BIRDS PLS")
    .attr("x", width / 2 - (rectWidth / 2))
    .attr("y", height - rectHeight)
    .attr("dx", 10)
    .attr("dy", 20)

  buttonG.on("click", (event) => generateNBirds(10, birdBox, svg, margin, height))
}

mainBirdFunction()
