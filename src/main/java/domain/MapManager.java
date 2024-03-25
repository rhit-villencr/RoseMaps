package domain;
import datasource.EdgeData;
import datasource.LoaderByFile;

public class MapManager{
    private final Graph roseMap;
    private LoaderByFile loader;

    public MapManager(LoaderByFile loader){
        this.loader = loader;
        this.roseMap = loadMap();
    }

    private Graph loadMap(){
        Graph g = new Graph();
        EdgeData[] edges = this.loader.getEdges();
        String[] node_labels = this.loader.getNodes();
        for (String n : node_labels){
            g.addNode(n);
        }
        for (EdgeData e : edges){
            g.addEdge(e.getStartNode(), e.getEndNode(), e.getDistance());
        }
        return g;
    }

    public String shortestPath(String sn, String en){
        StringBuilder printPath = new StringBuilder();
        for (Edge e : roseMap.findShortestPath(sn, en)){
            printPath.append(e.getDestination().getLabel()).append("\n");
        }
        return printPath.toString();
    }

    public Graph getGraph(){
        return this.roseMap;
    }
}