package datasource;
import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

public class LoaderByFile implements Loader{
    private final String nodeFile;
    private final String edgeFile;

    public LoaderByFile(String nodeFile, String edgeFile){
        this.nodeFile = nodeFile;
        this.edgeFile = edgeFile;
    }

    public EdgeData[] getEdges(){
        ArrayList<EdgeData> myEdges = new ArrayList<>();
        try {
            Scanner myReader = readFile(edgeFile);
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                String[] data_values = data.split(" ");
                myEdges.add(new EdgeData(data_values[0], data_values[1], Double.parseDouble(data_values[2])));
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
        return myEdges.toArray(new EdgeData[0]);
    }

    public String[] getNodes(){
        ArrayList<String> myNodes = new ArrayList<>();
        try {
            Scanner myReader = readFile(nodeFile);
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();
                myNodes.add(data);
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
        return myNodes.toArray(new String[0]);
    }


    private Scanner readFile(String file) throws FileNotFoundException {
        File f = new File(file);
        return new Scanner(f);
    }

}

