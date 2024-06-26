package domain;
import datasource.EdgeData;
import datasource.Loader;
import datasource.LoaderByFile;
import java.util.List;

public class MapManager{
    private final Graph roseMap;
    private final Loader loader;

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
            g.addEdge(e.startNode(), e.endNode(), e.distance());
        }
        return g;
    }

    public String shortestPath(String beginningNodeId, String destinationNodeId){
        StringBuilder retString = new StringBuilder();
        retString.append(beginningNodeId).append("\n");
        List<Edge> optimalPath = roseMap.findShortestPath(beginningNodeId, destinationNodeId);
        for (Edge e : optimalPath){
            retString.append(e.destination().label()).append("\n");
        }
        retString.append("Total Distance: ").append(getPathLength(optimalPath)).append(" ft");
        return retString.toString();
    }

    public Double getPathLength(List<Edge> edges){
        double pathLength = 0.0;
        for(Edge e : edges){
            pathLength += e.weight();
        }
        return pathLength;
    }
}