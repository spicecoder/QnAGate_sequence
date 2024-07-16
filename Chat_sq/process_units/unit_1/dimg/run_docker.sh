 
#! /bin/sh
###########################
# Process Pipeline Assumptions #
#  The Virtual Machine (VM) has two fixed persistent directories:
#  VM_INPUT and VM_OUTPUT where  the container reads and outputs data
#  Before Docker Container is ran , the input files are downloaded from
#  Object store ; There is a object container name "platform_file_store " 
#  which contains any file that user picks from front end list ; The chosen file is 
#  downloaded and put in the VM_INPUT directory by  .If an internal file name is
#  associated with a particulatr file ,the file is named as the internal file name
#  The docker container runs and creates the output files in VM_OUTPUT directory
#  After docker finishes the upload_dir utility will run and take the output files
#  to the users work space directory in the object store. 
# A dockerimage is supposed to have an entry point with over writeable parameters 
# in the CMD line; all the  run parameters are space seperated 
# and lined up 
##########################
UUID=$1
UPWD=$2
INVOL="VM_INPUT/"
OUTVOL="VM_OUTPUT/"
 #rest of the variables could be populated by front end 
 #----possible repeat----INFO type 1---
INPUTFILE="hs1.jpg"
INTERNALFILE="image.jpg"
 #-----------------------INFO TYPE 2-----
 USER="loya"
 OBJECTCONTAINER="images_container"
 USERWORK="work_${USER}/"
 #----possible repeat---INFOTYPE 3----
 UENV="libv=sharp" 
 #-------------------------INFOTYPE 4---
 DOCKERIMAGE="protateio"
 DOCKERCONTAINER="run_protateio"
  #--------possible repeat---INFOTYPE 5--------
 RUNPARAM="angle=500"
 #----------------------------

#both the download and upload utils uses authentication tokens to connect to 
#nectar objectstore 

node download_dfile.js  $OBJECTCONTAINER $INVOL  $INPUTFILE $INTERNALFILE
#remove leftover containers
docker rm  $DOCKERCONTAINER
docker run --env $UENV  --name $DOCKERCONTAINER  -v $(pwd)/$INVOL:/input/:rw  -v $(pwd)/$OUTVOL:/output/:rw  $DOCKERIMAGE  $RUNPARAM

# at this point the upload util just pumps the files output into the 
# user workspace in object store , this can be extended to treat individual files like selective upload ,rename etc 
node upload_dir.js  $OBJECTCONTAINER $USERWORK $OUTVOL  