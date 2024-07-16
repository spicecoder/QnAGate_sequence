const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const EventEmitter = require('events');

class SequenceController extends EventEmitter {
    constructor(configPath) {
        super();
        this.config = this.loadConfig(configPath);
        this.sequenceData = this.loadSequenceData(this.config.sequence);
        this.currentUnitIndex = 0;
        this.currentState = {};
        this.sequenceLogPath = path.join(__dirname, this.config.processlog);
    }

    loadConfig(configPath) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    loadSequenceData(sequencePath) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, sequencePath), 'utf8'));
    }

    startSequence() {
        console.log('Sequence started.');
        this.emit('process_next_unit');
    }

    async processUnit() {
        const unitData = this.sequenceData.Sequence.units[this.currentUnitIndex];
        if (!this.QATrigger(unitData.preamble)) {
            console.log(`Preamble conditions not met for ${unitData.name}, skipping...`);
            this.emit('unit_processed');  // Move to the next unit
            return;
        }
        console.log(`Processing unit: ${unitData.name}`);
        try {
            await this.executeUnitScript(unitData);
            this.updateSequenceStatus(unitData);
            this.emit('unit_processed');
        } catch (error) {
            console.error("Error during unit execution:", error);
            this.emit('error', error);
        }
    }

    async executeUnitScript(unitData) {
        const filesh = `push_execs/pushsh${unitData.name}${this.currentUnitIndex}.sh`;
        const shpath = path.join(__dirname, filesh);
        const content = `${unitData.unitsh}\nnode e_UnitEndTrigger.js > unitEndLog/${this.currentUnitIndex}.txt`;

        await fs.promises.writeFile(shpath, content);
        await fs.promises.chmod(shpath, 0o755);
        execFile(shpath, { shell: true }, (error, stdout, stderr) => {
            if (error) throw new Error(`Execution error: ${error.message}`);
            console.log("Execution stdout:", stdout);
        });
    }

    QATrigger(preamble) {
        return Object.keys(preamble).every(key => this.currentState[key] === preamble[key]);
    }

    updateSequenceStatus(unitData) {
        let status = {
            user: this.config.user,
            name: unitData.name,
            unitIndex: this.currentUnitIndex,
            loopcount: this.currentState.loopcount || 0
        };
        let currentStatus = JSON.parse(fs.readFileSync(this.sequenceLogPath));
        currentStatus.push(status);
        fs.writeFileSync(this.sequenceLogPath, JSON.stringify(currentStatus));
        console.log("Sequence status updated:", status);
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
        console.log('Sequence ended.');
        this.emit('sequence_ended');
    }

    init() {
        this.on('process_next_unit', () => this.onNextUnit());
        this.on('unit_processed', () => this.onNextUnit());
        this.on('error', (error) => {
            console.log(`An error occurred: ${error}`);
            this.endSequence();  // Optionally retry or handle error specifically
        });
    }
}

module.exports = SequenceController;
