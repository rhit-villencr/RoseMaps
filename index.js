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

async function populateDropdowns(g) {
    let drop1 = document.getElementById("start-names")
    let drop2 = document.getElementById("end-names")
    for (const key in g) {
        drop1.innerHTML += `<option>${key}</option>`
        drop2.innerHTML += `<option>${key}</option>`
    }
}

const filePath = 'EdgeList.txt'; // Provide the path to your file here
let g = populateGraphFromFile(filePath)
    .then(graph => {
        if (graph) {
            return graph
        } else {
            console.log('Failed to fetch or parse the file.');
        }
    });

function linedraw(ax, ay, bx, by) {
    var c = document.getElementById("idCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    return ctx
}

async function updateImageNodes(file) {
    const map_id = document.getElementById("map-id")
    let nodeData = '';
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error('Failed to fetch the file');
        }
        const textData = await response.text();
        for (const l of textData.split("\n")) {
            const temp = l.split(" ")
            nodeData += l + "\n";
            map_id.innerHTML += `<area class="node" shape="circle" name="${await temp[0]}" coords="${parseFloat(temp[1])+5.0},${parseFloat(temp[2])+4.0},3" href="/">`
        }
        // Get all elements with the class name "node"
        var nodes = await document.getElementsByClassName("node");

        // Iterate through each node and add a click listener
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener("click", async function (e) {
                e.preventDefault()
                // Your click event handling code here
                const resultsDiv = document.getElementById("results-path")
                if (start) {
                    resultsDiv.innerHTML = ""
                    resultsDiv.innerHTML += `From:\n<ul class="node-item">${e.target.getAttribute("name")}</ul>`
                    start = false
                } else {
                    resultsDiv.innerHTML += `To:\n<ul class="node-item">${e.target.getAttribute("name")}</ul>`
                    start = true
                    const e1 = resultsDiv.innerText.split("From:\n")[1].split("\nTo:")[0]
                    const e2 = e.target.getAttribute("name")
                    const path = findShortestPath(await g, e1, e2);
                    console.log(`Start Value: ${e1}\nEnd Value: ${e2}`)
                    console.log(path)
                    console.log("============================================================")
                    resultsDiv.innerHTML = "";
                    let nodePath = ""
                    let prev = null;
                    for (const n of path["path"]) {
                        resultsDiv.innerHTML += `<ul class="node-item">${n}</ul>`
                        nodePath += n + " "
                    }
                    let ctx;
                    for (const n of nodePath.split(" ")) {
                        if (n) {
                            console.log(n)
                            for (const m of nodeData.split("\n")) {
                                const temp = m.split(" ")
                                if (temp[0] === n) {
                                    if (prev) {
                                        ctx = linedraw(prev[1], prev[2], temp[1], temp[2])
                                    }
                                    prev = temp
                                }
                            }
                        }
                    }
                    ctx.stroke()
                }
                console.log("Clicked on a node!" + i);
            });
        }
    } catch (error) {
        console.error('Error fetching or parsing file:', error);
        return null;
    }
}

let start = true
updateImageNodes("NodeList.txt")
populateDropdowns(await g)
document.getElementById("submit").addEventListener("click", async function (e) {
    const e1 = document.getElementById("start-names").value
    const e2 = document.getElementById("end-names").value
    const path = findShortestPath(await g, e1, e2);
    console.log(`Start Value: ${e1}\nEnd Value: ${e2}`)
    console.log(path)
    console.log("============================================================")
    const resultsDiv = document.getElementById("results-path")
    resultsDiv.innerHTML = "";
    for (const n of path["path"]) {
        resultsDiv.innerHTML += `<ul class="node-item">${n}</ul>`
    }
});