docker run -p 770067:8080 --name $DOCKERCONTAINER  -v $(pwd)/IN:/IN/:rw  -v $(pwd)/$OUT:/OUT/:rw  $DOCKERIMAGE   
