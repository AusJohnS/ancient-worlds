// tokenData = {
//     hash: "0x11ac16678959949c12d5410212301960fc496813cbc3495bf77aeed738579738",
//     tokenId: "123000456"
// };
tokenData = genTokenData(Math.floor(Math.random() * 100));
let hash = tokenData.hash;
class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    };
  };
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  };
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  };
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  };
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
};
let R = new Random();
const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const settings = {
  dimensions: [ 1200, 1200 ],
};
var hArray = new Array();
var vArray = new Array();
var hStack = new Array();
var vStack = new Array();
var cH = new Array();
var cV = new Array();
var lW = 1.0;
var minDistance = R.random_num(2 * lW, 5 * lW);
const loop = 1 + Math.floor(settings.dimensions[0] * settings.dimensions[1] / 1000);
var nLeft, nRight, nUp, nDown;
var xOne, xTwo, y;
var x, yOne, yTwo;
var f, g;
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 2 * lW;
    context.strokeStyle = 'white';
    context.strokeRect(0, 0, width, height);
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = lW;
    for(i = 0; i <= loop; i++) {
      if(i == 0) {
        xOne = 0, xTwo = width, y = Math.floor(R.random_num(R.random_dec(), R.random_dec()) * height);
        hStack.push({x1: xOne, x2: xTwo, y: y});
        hArray.push({x1: xOne, x2: xTwo, y: y});
        context.moveTo(xOne, y);
        context.lineTo(xTwo, y);
      } else {
        if(i % 2 != 0) {
          nUp = 0;
          nDown = height;
          for(let hL in hStack) {
            cH.push({x1: hStack[hL].x1, x2: hStack[hL].x2, y: hStack[hL].y});
            f = R.random_num(R.random_dec(), R.random_dec());
            xOne = Math.floor(cH[cH.length - 1].x1 + (cH[cH.length - 1].x2 - cH[cH.length - 1].x1) * f);
            xTwo = Math.floor(cH[cH.length - 1].x1 + (cH[cH.length - 1].x2 - cH[cH.length - 1].x1) * (1 - f));
            let vUp = (hArray.filter(a => xOne >= a.x1 && xOne <= a.x2 && cH[cH.length - 1].y > a.y));
            let maxVUP = 0;
            maxVUP = Math.max(maxVUP, Math.max.apply(Math, vUp.map (function(o) {return o.y})));
            let vDown = hArray.filter(b => xTwo >= b.x1 && xTwo <= b.x2 && cH[cH.length - 1].y < b.y);
            let minVDOWN = height;
            minVDOWN = Math.min(minVDOWN, Math.min.apply(Math, vDown.map (function(p) {return p.y})));
            nUp = maxVUP;
            vUp = [];
            nDown = minVDOWN;
            vDown = [];
            if(xOne >= cH[cH.length - 1].x1 + minDistance && xOne + minDistance <= cH[cH.length - 1].x2 || xTwo >= cH[cH.length - 1].x1 + minDistance && xTwo + minDistance <= cH[cH.length - 1].x2) { 
              if(cH[cH.length - 1].y - nUp >= minDistance) {
                vStack.push({x: xOne, y1: nUp, y2: cH[cH.length - 1].y});
                vArray.push({x: xOne, y1: nUp, y2: cH[cH.length - 1].y});
                context.moveTo(xOne, nUp);
                context.lineTo(xOne, cH[cH.length - 1].y);
              };
              if(nDown - cH[cH.length - 1].y >= minDistance) {
                vStack.push({x: xTwo, y1: cH[cH.length - 1].y, y2: nDown});
                vArray.push({x: xTwo, y1: cH[cH.length - 1].y, y2: nDown});
                context.moveTo(xTwo, cH[cH.length - 1].y);
                context.lineTo(xTwo, nDown);
              };
            };
            cH.shift();
            nUp = 0;
            nDown = height;
          };
          hStack = [];
        } else {
          nLeft = 0;
          nRight = width;
          for(let vL in vStack) {
            cV.push({x: vStack[vL].x, y1: vStack[vL].y1, y2: vStack[vL].y2});
            g = R.random_num(R.random_dec(), R.random_dec());
            yOne = Math.floor(cV[cV.length - 1].y1 + (cV[cV.length - 1].y2 - cV[cV.length - 1].y1) * g);
            yTwo = Math.floor(cV[cV.length - 1].y1 + (cV[cV.length - 1].y2 - cV[cV.length - 1].y1) * (1 - g));
            let hLeft = vArray.filter(a =>  yOne >= a.y1 && yOne <= a.y2 && cV[cV.length - 1].x > a.x);
            let maxHLEFT = 0;
            maxHLEFT = Math.max(maxHLEFT, Math.max.apply(Math, hLeft.map(function(o) {return o.x})));
            let hRight = vArray.filter(b => yTwo >= b.y1 && yTwo <= b.y2 && cV[cV.length - 1].x < b.x);
            let minHRIGHT = width;
            minHRIGHT = Math.min(minHRIGHT, Math.min.apply(Math, hRight.map(function(p) {return p.x})));
            nLeft = maxHLEFT;
            hLeft = [];
            nRight = minHRIGHT;
            hRight = [];
            if(yOne >= cV[cV.length - 1].y1 + minDistance && yOne + minDistance <= cV[cV.length - 1].y2 || yTwo >= cV[cV.length - 1].y1 + minDistance && yTwo + minDistance <= cV[cV.length - 1].y2) {
              if(cV[cV.length - 1].x - nLeft >= minDistance) {
                hStack.push({x1: nLeft, x2: cV[cV.length - 1].x, y: yOne});
                hArray.push({x1: nLeft, x2: cV[cV.length - 1].x, y: yOne});
                context.moveTo(nLeft, yOne);
                context.lineTo(cV[cV.length - 1].x, yOne);              
              };
              if(nRight - cV[cV.length - 1].x >= minDistance) {
                hStack.push({x1: cV[cV.length - 1].x, x2: nRight, y: yTwo});
                hArray.push({x1: cV[cV.length - 1].x, x2: nRight, y: yTwo});
                context.moveTo(cV[cV.length - 1].x, yTwo);
                context.lineTo(nRight, yTwo);              
              };
            };
            cV.shift();
            nLeft = 0;
            nRight = width;
          };
          vStack = [];
        };
      };
    };
    context.stroke();
  };
};
canvasSketch(sketch, settings);
function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  };
  data.hash = hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
};