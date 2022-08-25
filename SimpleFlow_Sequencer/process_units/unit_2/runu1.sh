docker run --env libv=sharp --name runu1  -v $(pwd)/process_units/unit_1/dimg/IN:/IN/:rw  -v $(pwd)/process_units/unit_1/dimg/OUT:/OUT/:rw  u1img  angle=500   > u1runner.log 2>&1

