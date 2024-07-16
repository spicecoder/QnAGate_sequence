const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const path = require('path');

class SequenceController extends EventEmitter {
    constructor(configPath) {
        super();
        this.config = this.loadConfig(configPath);
        this.currentUnitIndex = 0;
        this.sequenceData = this.loadSequenceData(this.config.sequence);
    }

    loadConfig(configPath) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    loadSequenceData(sequencePath) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, sequencePath), 'utf8'));
    }

    startSequence() {
        console.log('Sequence started.');
        this.emit('SQ_UnitStarter', this.sequenceData.Sequence);
    }

    processUnit(unitData) {
        console.log(`Processing unit: ${unitData.name}`);
        // Logic to process the unit, should be implemented or called here.
       // sX.subExec(process_sq)
    }

    endSequence() {
        console.log('Sequence ended.');
        this.emit('SQ_UnitEnder');
    }

    onNextUnit() {
        if (this.currentUnitIndex < this.sequenceData.Sequence.units.length) {
            const unitData = this.sequenceData.Sequence.units[this.currentUnitIndex];
            this.processUnit(unitData);
            this.currentUnitIndex++;
        } else {
            this.endSequence();
        }
    }

    onError(error) {
        console.error('Error in sequence:', error);
        this.endSequence();
    }

    init() {
        this.on('SQ_UnitStarter', () => this.onNextUnit());
        this.on('SQ_UnitEnder', () => console.log('Sequence has completed.'));
    }
}

module.exports = SequenceController;
