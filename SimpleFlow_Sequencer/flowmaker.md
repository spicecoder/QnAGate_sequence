1. A  config file looks like :

{"process_dir":"process_units",
 "processlog" :"./processstatusLog.json",
 "processregister":"processregister.json",
 "sequencelocker":"./processunitlocker.json",
 "sequence" :"./greeter_flower.json"
}   

2. A  flow, a sequence, "./greeter_flower.json', sequence of units looks like :
{
    "Sequence": {
        "name":"Greeter_sequence",
        "user": "u1",
        "flow":{  "QnA":{},"looplimit":6
        },
        "units": [
            {   "preamble" :{"QnA": { }},
                "name": "unit_1",
                "sh": "process_units/unit_1/hellou1.sh",
                "assert":{"unit 1":"done"},
               "postamble":{"QnA": {"u1 said hello":"yes" } } 
            } ,
            {   "preamble" :{"QnA": {"u1 said hello":"yes" }},
            "name": "unit_2",
            "sh": "process_units/unit_2/hellou2.sh",
            "assert":{"u1 image is good":"true"},
            "postamble":{"QnA": {"u2 is ran":"yes" } } 
        },
        {   "preamble" :{"QnA": {"u2 is ran":"yes" }},
            "name": "unit_3",
            "assert":{"u1 run tested":"true"},
            "sh": "process_units/unit_3/hellou3.sh",
           "postamble":{"QnA": {"u2 said hello":"yes" }} 
        },
        {   "preamble" :{"QnA":{ "u2 said hello":"yes" }},
        "name": "unit_4",
        "sh": "process_units/unit_4/hellou4.sh",
        "assert":{"u2 image is good":"true"},
       "postamble":{"QnA": { "u5 is ready":"yes" }} 
    },
    {   "preamble" :{"QnA": {"u5 is ready":"yes" } },
        "name": "unit_5",
        "sh": "process_units/unit_5/hellou5.sh",
        "assert":{"u5 image ran fine":"true"},
       "postamble":{} 
    }
          ]
     }
}
3. Aflow emitter starts the flow : flowEmitter.emit("SQ_UnitStarter", proflow)  in the e_UnitStartTrigger where floweEmitter comes from process_flowEmitter.js.
4. the SQ_unitstarter ,defined in process_flowEmitter.js , does through the following :
5. For each unit is accessed through the for loop for (var unit of aseq.units) 
   1. Each unit has a pre-amble collection of question-answer sets , if the flow set of qnA matches with the preamble set then the unit is executed else it is skipped .
   2. A unit can have a postamble which is  overriden in to the flow set  og question-answer set  ;if the unit postamble question answr is empty the flow stops. 
6. QnA trigger is a  functions that matches question -answer sets, and if match triggers the unit execution of the unit through sX.subExec(process_sq) ;
7. QnAOverride is a function that takes a question answer set pair and replaces the second set by the first ,by replacing the answer from first if questions are same.
8. UpdateLockedUnit act as a running state of the flow
9. e_UnitTrigger is triggered at the end of unit execution and start the next unit
10. 
   


