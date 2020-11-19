import { simpleLayout } from './simple.js';
import { kk } from './kk.js';

let _width = $(window).width();
let _height = $(window).height();
let width = _width;
let height = _height;

let data = null;
let data_file = './data/data.json';

let link, node, text, nodes_dict;

// 需要实现一个图布局算法，给出每个node的x,y属性
function graph_layout_algorithm(nodes, links) {
    // 算法开始时间
    let d = new Date()
    let begin = d.getTime()

    //这是一个随机布局，请在这一部分实现图布局算法
    for (let i in nodes) {
      nodes[i].x = Math.random() * 0.8 * width + 0.1 * width;
      nodes[i].y = Math.random() * 0.8 * height + 0.1 * height;
    }

    kk(nodes, links);

    // 算法结束时间
    let d2 = new Date()
    let end = d2.getTime()

    console.log(nodes.length, end - begin);

    // 保存图布局结果和花费时间为json格式，并按提交方式中重命名，提交时请注释这一部分代码
    // var content = JSON.stringify({"time": end-begin, "nodes": nodes, "links": links});
    // var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    // saveAs(blob, "save.json");
}

function draw_graph() {
    let svg = d3.select('#container')
        .select('svg')
        .attr('width', width)
        .attr('height', height);

    // 数据格式
    // nodes = [{"id": 学校名称, "weight": 毕业学生数量}, ...]
    // links = [{"source": 毕业学校, "target": 任职学校, "weight": 人数}, ...]
    let links = data.links;
    let nodes = data.nodes;

    nodes_dict = {};
    for (let i in nodes) {
        nodes_dict[nodes[i].id] = nodes[i]
    }

    // links
    link = svg.append("g")
        .attr("stroke", "#999")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-opacity", d => d.weight > 15 ? 0.4 : 0.2)
        .attr("stroke-width", d => Math.sqrt(d.weight));

    // nodes
    node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => Math.sqrt(d.weight) * 1.4 + 1)
        .attr("fill", "steelblue")
        .attr("nodeid", d => d.id)
        .on("mouseover", function (e, d) {// 鼠标移动到node上时显示text
            node
              .attr("r", function (f) {
                if (f.id == d.id) {
                  return Math.sqrt(f.weight) * 1.4 + 5;
                } else {
                  return Math.sqrt(f.weight) * 1.4 + 1;
                }
              })
              .style('zIndex', f => f.id == d.id ? 99 : 1);
            text
              .attr("display", function (f) {
                  if (f.id == d.id || f.weight > 40) {
                      return "null";
                  }
                  else {
                      return "none";
                  }
              });
            link
              .attr("stroke", function (f) {
                if (f.source == d.id || f.target == d.id) {
                  return '#f759ab';
                }
              })
              .attr("stroke-opacity", function (f) {
                if (f.source == d.id || f.target == d.id) {
                  return 0.7;
                } else {
                  return f.weight > 15 ? 0.4 : 0.2;
                }
              });
        })
        .on("mouseout", function (e, d) {// 鼠标移出node后按条件判断是否显示text
          node
            .attr("r", function (f) {
              return Math.sqrt(f.weight) * 1.4 + 1;
            });
          text
            .attr("display", function (f) {
                if (f.weight > 40) {
                    return 'null';
                }
                else {
                    return 'none';
                }
            });
          link
            .attr("stroke", function (f) {
              return 'null';
            })
            .attr("stroke-opacity", d => d.weight > 15 ? 0.4 : 0.2)
            .attr("stroke-width", d => Math.sqrt(d.weight));
        });

    // 学校名称text，只显示满足条件的学校
    text = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.id)
        .attr("display", function (d) {
            if (d.weight > 40) {
                return 'null';
            }
            else {
                return 'none';
            }
        });

    // 图布局算法
    graph_layout_algorithm(nodes, links, link, node, text)

    // 绘制links, nodes和text的位置
    link
        .attr("x1", d => nodes_dict[d.source].x)
        .attr("y1", d => nodes_dict[d.source].y)
        .attr("x2", d => nodes_dict[d.target].x)
        .attr("y2", d => nodes_dict[d.target].y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    text
        .attr("x", d => d.x)
        .attr("y", d => d.y)
}

function addDrag() {
  const nodes = document.querySelectorAll('circle');
  nodes.forEach(v => {
    v.onmousedown = function(event) {
      const data = v.__data__;

      moveAt(event.pageX, event.pageY);

      // 移动现在位于坐标 (pageX, pageY) 上的球
      function moveAt(pageX, pageY) {
        nodes_dict[data.id].x = pageX;
        nodes_dict[data.id].y = pageY;

        link
          .attr("x1", d => nodes_dict[d.source].x)
          .attr("y1", d => nodes_dict[d.source].y)
          .attr("x2", d => nodes_dict[d.target].x)
          .attr("y2", d => nodes_dict[d.target].y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        text
            .attr("x", d => d.x)
            .attr("y", d => d.y)
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      // 在 mousemove 事件上移动球
      document.addEventListener('mousemove', onMouseMove);

      // 放下球，并移除不需要的处理程序
      document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
      };
    };
    v.ondragstart = function() {
      return false;
    };
  });
  document.querySelectorAll('text').forEach(v => {
    v.onselectstart = () => false;
  });
}

function main() {
    d3.json(data_file).then(function (DATA) {
        data = DATA;
        draw_graph();
        addDrag();
    })
}

main()