package domain;

public class Edge {
    private Node start;
    private Node destination;
    private double weight;

    public Edge(Node start, Node destination, double weight){
        this.start = start;
        this.destination = destination;
        this.weight = weight;
    }

    public Node getDestination(){
        return this.destination;
    }

    public double getWeight(){
        return this.weight;
    }

    public Node getStart(){
        return this.start;
    }

}