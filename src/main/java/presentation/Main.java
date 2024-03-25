package presentation;
import datasource.LoaderByFile;
import domain.MapManager;

public class Main {
    public static void main(String... args){
        LoaderByFile lbf = new LoaderByFile("NodeList.txt","EdgeList.txt");
        MapManager mm = new MapManager(lbf);
        System.out.println(mm.shortestPath("SRC_Main", "Apartments_Road_4"));
    }
}
