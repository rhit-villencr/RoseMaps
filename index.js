function populateGraphFromText(textData) {
    const graph = {};
    const lines = textData.trim().split('\n');
    lines.forEach(line => {
        if (line.length > 1) {
            const [source, destination, weight] = line.trim().split(' ');
            const parsedWeight = parseFloat(weight);

            if (!graph[source]) {
                graph[source] = {};
            }
            graph[source][destination] = parsedWeight;
        }
    });
    return graph;
}

async function populateGraphFromFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Failed to fetch the file');
        }
        const textData = await response.text();
        return populateGraphFromText(textData);
    } catch (error) {
        console.error('Error fetching or parsing file:', error);
        return null;
    }
}

const shortestDistanceNode = (distances, visited) => {
    let shortest = null;
    for (let node in distances) {
        let currentIsShortest =
            shortest === null || distances[node] < distances[shortest];
        if (currentIsShortest && !visited.includes(node)) {
            shortest = node;
        }
    }
    return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {
    let distances = {};
    console.log(graph)
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);
    let parents = {
        endNode: null
    };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }
    let visited = [];
    let node = shortestDistanceNode(distances, visited);
    while (node) {
        let distance = distances[node];
        let children = graph[node];
        for (let child in children) {
            if (String(child) === String(startNode)) {
                continue;
            } else {
                let newdistance = distance + children[child];
                if (!distances[child] || distances[child] > newdistance) {
                    distances[child] = newdistance;
                    parents[child] = node;
                }
            }
        }
        visited.push(node);
        node = shortestDistanceNode(distances, visited);
    }
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();
    let results = {
        distance: distances[endNode],
        path: shortestPath,
    };
    return results;
};

let g = populateGraphFromFile('EdgeList.txt')
    .then(graph => {
        if (graph) {
            return graph
        } else {
            console.log('Failed to fetch or parse the file.');
        }
    });

async function populateMap() {
    let nodeData = ''
    const map_id = document.getElementById("map-id")
    const response = await fetch("NodeList.txt");
    if (!response.ok) {
        throw new Error('Failed to fetch the file');
    }
    const textData = await response.text();
    for (const l of textData.split("\n")) {
        const temp = l.split(" ")
        nodeData += l + "\n";
        map_id.innerHTML += `<area class="node" shape="circle" name="${temp[0]}" coords="${parseFloat(temp[1]) + 5.0},${parseFloat(temp[2]) + 4.0},3" href="/">`
    }
    return nodeData
}

async function updateImageNodes(file) {
    let nodeData = await populateMap();
    var nodes = document.getElementsByClassName("node");
    var resultPath = [];
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("click", async function (e) {
            e.preventDefault()
            // const resultsDiv = document.getElementById("results-path")
            if (start) {
                // resultsDiv.innerHTML = ""
                resultPath = [];
                var c = document.getElementById("idCanvas")
                const context = c.getContext("2d")
                context.clearRect(0, 0, c.width, c.height);

                // resultsDiv.innerHTML += `From:\n<ul class="node-item">${e.target.getAttribute("name")}</ul>`
                resultPath.push(e.target.getAttribute("name"))
                start = false
            } else {
                // resultsDiv.innerHTML += `To:\n<ul class="node-item">${e.target.getAttribute("name")}</ul>`
                resultPath.push(e.target.getAttribute("name"))
                const path = findShortestPath(await g, resultPath[0], resultPath[1]);
                console.log(`Start Value: ${resultPath[0]}\nEnd Value: ${resultPath[1]}`)
                console.log(path)
                // resultsDiv.innerHTML = "";
                let nodePath = ""
                let prev = null;
                for (const n of path["path"]) {
                    // resultsDiv.innerHTML += `<ul class="node-item">${n}</ul>`
                    nodePath += n + " "
                }
                var c = document.getElementById("idCanvas");
                var ctx = c.getContext("2d");
                for (const n of nodePath.split(" ")) {
                    if (n) {
                        for (const m of nodeData.split("\n")) {
                            const temp = m.split(" ")
                            if (temp[0] === n) {
                                if (prev) {
                                    ctx.lineTo(parseFloat(temp[1] - 5.0), parseFloat(temp[2]));
                                } else {
                                    ctx.beginPath();
                                    ctx.moveTo(parseFloat(temp[1] - 5.0), parseFloat(temp[2]));
                                }
                                prev = temp
                            }
                        }
                    }
                }
                ctx.strokeStyle = '#00ffff';
                ctx.stroke()
                start = true
            }
        });
    }
}

let start = true
updateImageNodes()
document.getElementById("idCanvas").style.height = document.getElementById("rose-map").style.height
document.getElementById("idCanvas").style.width = document.getElementById("rose-map").style.width
