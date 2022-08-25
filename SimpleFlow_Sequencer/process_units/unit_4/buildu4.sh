# build docker image
docker rm runu2

docker  build -f process_units/unit_4/d3IO/Dockerfile  process_units/unit_4/d3IO -t u2img  >  buildu4.log 2>&1