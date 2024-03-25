package domain;

import java.util.*;

public final class Graph {

    private final Map<Node, Set<Edge>> map = new HashMap<>();

    public void addNode(String node) {
        map.computeIfAbsent(new Node(node), key -> new HashSet<>());
    }

    public void addEdge(String one, String two, double weight) {
        Node one_node = getNode(one);
        Node two_node = getNode(two);

        if(one_node != null && two_node != null){
            Edge temp = new Edge(one_node, two_node, weight);
            map.get(one_node).add(temp);
        }
    }

    private Node getNode(String label){
        for(Node k : map.keySet()){
            if(k.label().equals(label)){
                return k;
            }
        }
        return null;
    }

    public List<Edge> findShortestPath(String beginningNode, String destinationNode){
        Node one_node = getNode(beginningNode);
        Node two_node = getNode(destinationNode);
        return dijkstra(one_node, two_node);
    }

    private List<Edge> dijkstra(Node start, Node destination) {
        Map<Node, Double> distances = new HashMap<>();
        Map<Node, Edge> parentEdges = new HashMap<>();
        PriorityQueue<Node> minHeap = new PriorityQueue<>(Comparator.comparingDouble(distances::get));

        for (Node vertex : map.keySet()) {
            if (vertex == start) {
                distances.put(vertex, 0.0);
            } else {
                distances.put(vertex, Double.MAX_VALUE);
            }
            minHeap.add(vertex);
        }

        while (!minHeap.isEmpty()) {
            Node current = minHeap.poll();
            if (current == destination) {
                break;
            }
            for (Edge edge : map.get(current)) {
                double newDistance = distances.get(current) + edge.weight();
                if (newDistance < distances.get(edge.destination())) {
                    distances.put(edge.destination(), newDistance);
                    parentEdges.put(edge.destination(), edge);
                    minHeap.remove(edge.destination());
                    minHeap.add(edge.destination());
                }
            }
        }
        List<Edge> shortestPath = new ArrayList<>();
        Node current = destination;
        while (parentEdges.containsKey(current)) {
            Edge edge = parentEdges.get(current);
            shortestPath.add(edge);
            current = edge.start();
        }
        Collections.reverse(shortestPath);
        return shortestPath;
    }

    @Override
    public String toString() {
        StringBuilder printString = new StringBuilder();
        for(Node k : map.keySet()){
            printString.append(k.label()).append(" -----> ").append("\n");
            for(Edge e : map.get(k)){
                printString.append("\t").append(e.destination().label()).append(" (").append(e.weight()).append(" ft)\n");
            }
        }

        return printString.toString();
    }
}
