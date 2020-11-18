let _width = $(window).width();
let _height = $(window).height();
let width = _width;
let height = _height;

let adjecentMatrix = [];
let strength = [];
let idealLength = [];
let maxD = 0;

let up = 2;

// 数据格式
// nodes = [{"id": 学校名称, "weight": 毕业学生数量}, ...]
// links = [{"source": 毕业学校, "target": 任职学校, "weight": 人数}, ...]

export function kk(nodes, links) {
  for (let i in nodes) {
    nodes[i].x = Math.random() * 0.8 * width + 0.1 * width;
    nodes[i].y = Math.random() * 0.8 * height + 0.1 * height;
  }
  init(nodes.length);
  floyd(nodes, links);
  // 计算各个顶点的度数
  const degrees = [];
  let maxDegree = 0;
  for (let i = 0; i < nodes.length; ++i) {
    let count = 0;
    for (let j = 0; j < nodes.length; ++j) {
      if (adjecentMatrix[i][j] === 1) {
        ++count;
      }
    }
    degrees.push(count);
    maxDegree = Math.max(count, maxDegree);
  }
  // KK 算法
  const L = height / maxD;
  let visited = [];
  for (let i = 0; i < nodes.length; ++i) {
    visited[i] = false;
    for (let j = 0; j < nodes.length; ++j) {
      idealLength[i][j] = L * adjecentMatrix[i][j];
      if (nodes[i].weight > 20 && nodes[j].weight > 20) {
        idealLength[i][j] *= up;
      }
      strength[i][j] = 20 / (adjecentMatrix[i][j] * adjecentMatrix[i][j]);
    }
  }
  while (true) {
    const epsilon = 1e-2;
    let maxM = -1;
    let maxDelta = 0;
    let counter = 500;
    for (let i = 0; i < nodes.length; ++i) {
      let tmp = getDeltaI(nodes, i);
      if (tmp > maxDelta && visited[i] === false) {
        maxM = i;
        maxDelta = tmp;
      }
    }
    visited[maxM] = true;
    if (maxDelta <= epsilon) {
      break;
    }
    while (getDeltaI(nodes, maxM) > epsilon && counter--) {
      // 解方程
      // console.log('maxM: ', maxM, 'deltaM: ', getDeltaI(nodes, maxM));
      // console.log('x: ', nodes[maxM].x, 'y: ', nodes[maxM].y);
      const { deltaX, deltaY } = solveDelta(nodes, maxM);
      nodes[maxM].x += deltaX;
      nodes[maxM].y += deltaY;
    }
    if (nodes[maxM].x > 0.95 * width) {
      nodes[maxM].x = 0.97 * width;
    }
    if (nodes[maxM].x < 0.05 * width) {
      nodes[maxM].x = 0.03 * width;
    }
    if (nodes[maxM].y > 0.95 * height) {
      nodes[maxM].y = 0.97 * height;
    }
    if (nodes[maxM].y < 0.05 * height) {
      nodes[maxM].y = 0.03 * height;
    }
    // console.log('x: ', nodes[maxM].x, 'y: ', nodes[maxM].y);
    // break;
  }
}

function init(l) {
  // 初始化邻接矩阵，l矩阵和k矩阵
  for (let i = 0; i < l; ++i) {
    adjecentMatrix.push([]);
    idealLength.push([]);
    strength.push([]);
    for (let j = 0; j < l; ++j) {
        adjecentMatrix[i][j] = Infinity;
    }
    adjecentMatrix[i][i] = 0;
  }
}

function floyd(nodes, links) {
  // 建立节点名到编号的映射
  let nodesToIndex = new Map();
  nodes.forEach((item, index) => {
    nodesToIndex.set(item.id, index);
  });
  // 建立邻接矩阵
  for (let edge of links) {
    let { source, target } = edge;
    adjecentMatrix[nodesToIndex.get(source)][nodesToIndex.get(target)] = 1;
    adjecentMatrix[nodesToIndex.get(target)][nodesToIndex.get(source)] = 1;
  }
  // Floyd 算法
  // 顺便维护最大边距
  for (let k = 0; k < nodes.length; ++k) {
    for (let i = 0; i < nodes.length; ++i) {
      for (let j = 0; j < nodes.length; ++j) {
        adjecentMatrix[i][j] = Math.min(adjecentMatrix[i][j], 
                                        adjecentMatrix[i][k] + adjecentMatrix[k][j]);
        maxD = Number.isFinite(adjecentMatrix[i][j]) ? 
                Math.max(maxD, adjecentMatrix[i][j]) :
                maxD;
      }
    }
  }
}

function partialDerivationXX(nodes, m) {
  let sum = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (i !== m) {
      let tmp = 1 - idealLength[m][i] * Math.pow((nodes[m].y - nodes[i].y), 2)
                    / Math.pow(Math.pow(nodes[m].x - nodes[i].x, 2) + Math.pow(nodes[m].y - nodes[i].y, 2), 3 / 2);
      sum += strength[m][i] * tmp;
    }
  }
  return sum;
}

function partialDerivationYY(nodes, m) {
  let sum = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (i !== m) {
      let tmp = 1 - idealLength[m][i] * Math.pow((nodes[m].x - nodes[i].x), 2)
                    / Math.pow(Math.pow(nodes[m].x - nodes[i].x, 2) + Math.pow(nodes[m].y - nodes[i].y, 2), 3 / 2);
      sum += strength[m][i] * tmp;
    }
  }
  return sum;
}

function partialDerivationXY(nodes, m) {
  let sum = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (i !== m) {
      let tmp = idealLength[m][i] * (nodes[m].x - nodes[i].x) * (nodes[m].y - nodes[i].y)
                    / Math.pow(Math.pow(nodes[m].x - nodes[i].x, 2) + Math.pow(nodes[m].y - nodes[i].y, 2), 3 / 2);
      sum += strength[m][i] * tmp;
    }
  }
  return sum;
}

function partialDerivationX(nodes, m) {
  let sum = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (i !== m) {
      let tmp = (nodes[m].x - nodes[i].x) - idealLength[m][i] * (nodes[m].x - nodes[i].x)
                    / Math.pow(Math.pow(nodes[m].x - nodes[i].x, 2) + Math.pow(nodes[m].y - nodes[i].y, 2), 1 / 2);
      sum += strength[m][i] * tmp;
    }
  }
  return sum;
}

function partialDerivationY(nodes, m) {
  let sum = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (i !== m) {
      let tmp = (nodes[m].y - nodes[i].y) - idealLength[m][i] * (nodes[m].y - nodes[i].y)
                    / Math.pow(Math.pow(nodes[m].x - nodes[i].x, 2) + Math.pow(nodes[m].y - nodes[i].y, 2), 1 / 2);
      sum += strength[m][i] * tmp;
    }
  }
  return sum;
}

function getDeltaI(nodes, m) {
  return Math.sqrt(Math.pow(partialDerivationX(nodes, m), 2) + Math.pow(partialDerivationY(nodes, m), 2))
}

function solveDelta(nodes, m) {
  const cxx = partialDerivationXX(nodes, m),
        cxy = partialDerivationXY(nodes, m),
        cyy = partialDerivationYY(nodes, m),
        cx = partialDerivationX(nodes, m),
        cy = partialDerivationY(nodes, m);
  const deltaX = (cy * cxy - cx * cyy)
               / (cxx * cyy - cxy * cxy),
        deltaY = (cx * cxy - cy * cxx)
               / (cxx * cyy - cxy * cxy);
  return { deltaX, deltaY };
}