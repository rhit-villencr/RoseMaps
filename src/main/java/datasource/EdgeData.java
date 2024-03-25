package datasource;

public class EdgeData {
    private String startNode;
    private String endNode;
    private double distance;

    public EdgeData(String startNode, String endNode, double distance){
        this.startNode = startNode;
        this.endNode = endNode;
        this.distance = distance;
    }

    public String getStartNode(){
        return this.startNode;
    }
    public String getEndNode(){
        return this.endNode;
    }
    public double getDistance(){
        return this.distance;
    }
}
