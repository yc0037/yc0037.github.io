let _width = $(window).width();
let _height = $(window).height();
let width = _width;
let height = _height;

export function simpleLayout(nodes, links) {
  // 数据格式
  // nodes = [{"id": 学校名称, "weight": 毕业学生数量}, ...]
  // links = [{"source": 毕业学校, "target": 任职学校, "weight": 人数}, ...]
  let nodes_dict = {};
  for (let i in nodes) {
      nodes_dict[nodes[i].id] = {
        "self": nodes[i],
        "next": []
      };
  }

  for (let edge of links) {
    nodes_dict[edge.source].next.push(edge.target);
  }

  const area = 0.8 * width * 0.8 * height;
  const k = Math.sqrt(area / nodes.length);

  let repeat = 200;
  while(repeat--) {
    // 计算引力
    for (let edge of links) {
      let n1 = nodes_dict[edge.source].self;
      let n2 = nodes_dict[edge.target].self;
      const d = Math.sqrt((n1.x - n2.x) * (n1.x - n2.x) 
                        + (n1.y - n2.y) * (n1.y - n2.y));
      if (d === 0) {
        continue;
      }
      let f = d * d / k;
      n1.x += (f * 0.01 * (n2.x - n1.x) / d);
      n1.y += (f * 0.01 * (n2.y - n1.y) / d);
      n2.x += (f * 0.01 * (n1.x - n2.x) / d);
      n2.y += (f * 0.01 * (n1.y - n2.y) / d);
      if (n1.x < 0.1 * width) {
        n1.x = 0.11 * width;
      }
      if (n1.x > 0.9 * width) {
        n1.x = 0.89 * width;
      }
      if (n2.x < 0.1 * width) {
        n2.x = 0.11 * width;
      }
      if (n2.x > 0.9 * width) {
        n2.x = 0.89 * width;
      }
      if (n1.y < 0.1 * height) {
        n1.y = 0.11 * height;
      }
      if (n1.y > 0.9 * height) {
        n1.y = 0.89 * height;
      }
      if (n2.y < 0.1 * height) {
        n2.y = 0.11 * height;
      }
      if (n2.y > 0.9 * height) {
        n2.y = 0.89 * height;
      }
    }
    // 计算斥力
    for (let n1 of nodes) {
      for (let n2 of nodes) {
        const d = Math.sqrt((n1.x - n2.x) * (n1.x - n2.x) 
                      + (n1.y - n2.y) * (n1.y - n2.y));
        if (d === 0) {
          continue;
        }
        let f = k * k / d;
        n1.x -= (f * 0.01 * (n2.x - n1.x) / d);
        n1.y -= (f * 0.01 * (n2.y - n1.y) / d);
        n2.x -= (f * 0.01 * (n1.x - n2.x) / d);
        n2.y -= (f * 0.01 * (n1.y - n2.y) / d);
        if (n1.x < 0.1 * width) {
          n1.x = 0.11 * width;
        }
        if (n1.x > 0.9 * width) {
          n1.x = 0.89 * width;
        }
        if (n2.x < 0.1 * width) {
          n2.x = 0.11 * width;
        }
        if (n2.x > 0.9 * width) {
          n2.x = 0.89 * width;
        }
        if (n1.y < 0.1 * height) {
          n1.y = 0.11 * height;
        }
        if (n1.y > 0.9 * height) {
          n1.y = 0.89 * height;
        }
        if (n2.y < 0.1 * height) {
          n2.y = 0.11 * height;
        }
        if (n2.y > 0.9 * height) {
          n2.y = 0.89 * height;
        }
      }
    }
  }
}