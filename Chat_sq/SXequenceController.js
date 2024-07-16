const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const path = require('path');
const { QATrigger, QAOverride } = require('./QAManager');

class SequenceController extends EventEmitter {
    constructor(configPath) {
        super();
        this.config = this.loadConfig(configPath);
        this.sequenceData = this.loadSequenceData(this.config.sequence);
        this.currentUnitIndex = 0;
        this.currentState = {};  // Start with an empty state
        console.log("Initial sequence data:", this.sequenceData);
        console.log("Initial current state:", this.currentState);
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

    processUnit(unitData) {
        console.log(`Evaluating unit: ${unitData.name}`);
        if (!QATrigger(unitData.preamble, this.currentState)) {
            console.log(`Preamble conditions not met for ${unitData.name}, skipping.`);
            this.emit('unit_processed');
            return;
        }
        console.log(`Conditions met, processing unit: ${unitData.name}`);
        // Simulate unit task execution here
        this.emit('unit_processed');
    }

    onNextUnit() {
        if (this.currentUnitIndex < this.sequenceData.Sequence.units.length) {
            const unitData = this.sequenceData.Sequence.units[this.currentUnitIndex];
            this.processUnit(unitData);
            this.currentUnitIndex++;  // Increment after processing to avoid off-by-one errors
        } else {
            this.endSequence();
        }
    }

    endSequence() {
        console.log('Sequence ended.');
        this.emit('sequence_ended');
    }

    init() {
        this.on('process_next_unit', this.onNextUnit.bind(this));
        this.on('unit_processed', () => {
            if (this.currentUnitIndex > 0) {  // Ensure there's a unit to refer to
                const currentUnit = this.sequenceData.Sequence.units[this.currentUnitIndex - 1];
                this.currentState = QAOverride(currentUnit.postamble, this.currentState);
            }
            this.emit('process_next_unit');
        });
        this.on('sequence_ended', () => console.log('Sequence has completed.'));
    }
}

module.exports = SequenceController;
