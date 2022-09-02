# build docker image
docker rm runu1

docker  build -f process_units/unit_1/dimg/Dockerfile  process_units/unit_1/dimg -t u1img  >  userlog/buildu1.log 2>&1