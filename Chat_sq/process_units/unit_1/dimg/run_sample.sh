docker run --env libv=sharp --name $DOCKERCONTAINER  -v $(pwd)/IN:/IN/:rw  -v $(pwd)/$OUT:/OUT/:rw  $DOCKERIMAGE  angle=500
