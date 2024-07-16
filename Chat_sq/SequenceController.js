const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const EventEmitter = require('events');

const { QATrigger } = require('./QAManager');  // Assuming the import path is correct
const { QAOverride } = require('./QAManager');  // Assuming the import path is correct
//const { subExec } = require('./subExec');  // Assuming the import path is correct

class SequenceController extends EventEmitter {
    constructor(configPath, loggingEnabled = true) {
        super();
        this.config = this.loadConfig(configPath);
        this.sequenceData = this.loadSequenceData(this.config.sequence);
        console.log("config-seq data",this.config, this.sequenceData)
        this.currentUnitIndex = -1;
        this.loopcount =0 ;
        this.looplimit = 99;
        this.currentState = {};
        this.loggingEnabled = loggingEnabled;  // Toggle logging on or off
        this.initDirectories();
        this.initEvents();
        this.log('SequenceController initialized.');
    }

    log(message) {
        if (this.loggingEnabled) {
            console.log(message);
        }
    }

    loadConfig(configPath) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.log(`Config loaded: ${JSON.stringify(config)}`);
        return config;
    }

    loadSequenceData(sequencePath) {
        const sequenceData = JSON.parse(fs.readFileSync(path.join(__dirname, sequencePath), 'utf8'));
        this.log(`Sequence data loaded: ${JSON.stringify(sequenceData)}`);
        return sequenceData;
    }

    initDirectories() {
        const dirs = ['push_execs', 'unitEndLog'];
        dirs.forEach(dir => {
            const dirPath = path.join(__dirname, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                this.log(`Directory created: ${dirPath}`);
            }
        });
    }

    initEvents() {
        this.log('initEvents',this.currentUnitIndex);
        // this.on('process_next_unit', () => this.onNextUnit());
        // this.on('unit_processed', () => this.onNextUnit());
        /* check validity of unit_updated */
        this.on('unit_updated', () => this.checkNextUnit());
        this.on('error', (error) => {
            this.log(`An error occurred: ${error}`);
        });
    }

    // startSequence() {
    //     this.log('Sequence started.');
    //     this.emit('process_next_unit');
    // }
    
    startSequence() {
        this.log('Sequence started.');
        this.checkNextUnit();
    }

    async processUnit() {
        const unitData = this.sequenceData.Sequence.units[this.currentUnitIndex];
        this.log(`Processing unit: ${unitData.name}`);

        if (!QATrigger(unitData.preamble, this.currentState)) {
            this.log(`Preamble conditions not met for ${unitData.name}, skipping...`);
            this.emit('unit_processed');  // Move to the next unit
            return;
        }

        try {
            await this.executeUnitScript(unitData);
            this.currentState = QAOverride(unitData.postamble, this.currentState);
            this.log(`Unit ${unitData.name} completed successfully.`);
            this.emit('unit_processed');
        } catch (error) {
            this.log(`Error during unit execution: ${error}`);
            this.emit('error', error);
        }
    }
    async executeUnitScript(unitData) {
        console.log("unit for exe:", JSON.stringify(unitData))
        const shellCommand = unitData.sh;
        const scriptPath = path.join(__dirname, 'push_execs', `${unitData.name}.sh`);
        
        // Ensure the script is written and executable
        
        fs.writeFileSync(scriptPath, shellCommand, { mode: 0o755 });
        this.log(`Executing script: ${scriptPath} ${shellCommand}`);

        execFile(scriptPath,{ shell: true }, (error, stdout, stderr) => {
            if (error) {
                this.log(`Error during script execution: ${error}`,stderr);
                console.error(`Failed to execute script: ${error.message}`);
    
                this.emit('error', error);
                return;
            }
            this.log(`Execution complete. Output: ${stdout}`);
            this.currentState = QAOverride(unitData.postamble, this.currentState);
            this.currentUnitIndex++;
            this.emit('unit_updated');
        });
    }
//  async   executeUnitScript(unitData) {
//         const shellCommand = unitData.sh || 'echo "No shell command provided"';
//         const scriptPath = path.join(__dirname, 'push_execs', `pushsh${unitData.name}${this.currentUnitIndex}.sh`);
//         const command = `${shellCommand}\necho "Unit execution complete";`;
//         this.log(`Executing script: ${scriptPath}`);
//         // Simulation of script execution
//         setTimeout(() => {
//             this.log(`Simulated execution complete for unit ${unitData.name}`);
//             this.currentState = QAOverride(unitData.postamble, this.currentState);
//             this.currentUnitIndex++;
//             this.emit('unit_updated');  // Notify the system that a unit has updated the state
//         }, 1000);  // Simulated delay
//     }

    // async executeUnitScript(unitData) {
    //     const scriptPath = path.join(__dirname, 'push_execs', `pushsh${unitData.name}${this.currentUnitIndex}.sh`);
    //     const shellCommand = unitData.sh || 'echo "No shell command provided"'; // Default message if command is undefined
    //     const command = `${shellCommand}\necho "Executing unit end trigger"; node e_UnitEndTrigger.js > ${path.join(__dirname, 'unitEndLog', `${this.currentUnitIndex}.txt`)}`;
    
    //     this.log(`Executing script: ${scriptPath}`);
    //     await fs.promises.writeFile(scriptPath, command);
    //     await fs.promises.chmod(scriptPath, 0o755);
    //     execFile(scriptPath, { shell: true }, (error, stdout, stderr) => {
    //         if (error) throw new Error(`Execution error: ${error.message}`);
    //         this.log(`Execution stdout: ${stdout}`);
    //     });
    // }
    
    // initEvents() {
    //     this.on('unit_updated', () => this.checkNextUnit());
    // }
    checkNextUnit() {
        this.currentUnitIndex=this.currentUnitIndex+1;
        if (this.currentUnitIndex < this.sequenceData.Sequence.units.length) {
            const unitData = this.sequenceData.Sequence.units[this.currentUnitIndex];
            console.log("sequence data" ,this.currentUnitIndex, JSON.stringify(this.sequenceData.Sequence.units[this.currentUnitIndex]));
            if (QATrigger(unitData.preamble, this.currentState)) {
                this.executeUnitScript(unitData);
            } else {
                this.log(`Waiting for conditions to be met for unit ${unitData.name}`);
            }
        } else {
            this.endSequence();
        }
    }

    onNextUnit() {
        this.currentUnitIndex++;
        if (this.currentUnitIndex < this.sequenceData.Sequence.units.length) {
            this.processUnit();
        } else {
            this.endSequence();
        }
    }

    endSequence() {
        this.log('Sequence ended.');
        this.emit('sequence_ended');
    }
}

module.exports = SequenceController;
