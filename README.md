# QnAGate_sequence
## QnA -question answer gates to drive logic between independent modules
## A general challenge in computing and understandibily of what we produce  ,how can we combine small contained chunks  of code or units of computing unit without modifying those 
chunks but at the same time, can configure those chunks during execution time ,so that we can produce custom logic. The concept of interface, API and also microservice is
there to solve this hard problem. The problem is hard because what we see as a small chunk at the start of our system can easily grow with business logic and 
other infrastructure constraints  or domain discovery,like the need to use the same data structure or domain knowledge ,is locked up in a chunk.

QnA Gate is a way to build system through flows that are a conceptual sequence of chunks of code ,but which allows one to build run time logic about which chunk 

pieces are to be executed in sequence or which can be executed simultaneously through configuration of some question answers {which can potentially be in real time

as user interaction} 

Conceptually each unit of computation has a set of question,answers in a QnA object  in a preamble and postamble state. A flow has also its own set of question and answers 
in a flow QnA.

As the flow visits each unit, the unit passes its set of preamble question to check wheter that set is a subset of the QnA collection from the flow qnA.

If it is yes (through the function QATrigger.js) it means that particular unit is executed ; at the end of the execution ,the unit passes its postamble QnA to the 
flow and also optionally it can push it own question answer in the assert category to the preamble state (the assert category allows an unit to stop being executed as the 
flow continues and revisits that particular unit). These operation are achieved through the QAOverride function

Each unit has its own subEx function ,which submits a .sh file as an independent process the unit is supposed to compute , by the end of which the flow restarts 
its hunt for the next unit to be executed after collecting the QnA from the current unit's postamble.

Through the QnA gate logic the repo allows some independent nodejs processes ,e.g docker containers to behave cooperatively by maintaining the desired sequence 
of execution while the QnA can also be exposed to user ,there by providing real time feed back from end user about the next task in the desired flow.
The repo can be used as follows :
after doing npm install , run node e_unitStartTrigger.js ; this takes the flow from the configuration defined in config.json , which has the following enties

{"process_dir":"process_units",
 "processlog" :"./processstatusLog.json",
 "processregister":"processregister.json",
 "sequencelocker":"./processunitlocker.json",
 "sequence" :"./docker_flower.json"
} 

process_dir is the directory which is the sarting dir used in the flow definition docker_flower.json file used in the repo, which defines the units to be executed (as shell execfie as 
independent process. 

Some To Do tasks :
1. seperate the json files used during run time into seperate directory , provide seperate directory for log files ,
2. Develop configurable user interaction in the preamble and postamble steps. [so in this casee the QATrigger and QAOverride logics can be driven by the UI 
and user can drive the flow
3. the module processflow_emitter uses even listener to react to startUnit and endUnit modules. This can be extended for cross machine communication through rest api or
pure messaging. 
4. A more generic computtaion model can be built using QnA facility to address some deep rooted software challenges, because QnA approach allows a system to grow
dynamically absorbing domain experience and feed back. The notion that any computtaion has a preamble and a postamble built into it, encorages a computaion unit model
that is inherently non tightly coupled to another unit,but  are easy to  configure to cooperate with other units through pure QnA, question and answers provided at time of execution.

![image](https://user-images.githubusercontent.com/6982948/186930174-42b0a80b-28b2-43f7-934c-2e09b3805953.png)

