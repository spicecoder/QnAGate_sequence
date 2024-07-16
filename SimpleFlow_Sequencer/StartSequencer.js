const SequenceController = require('./SequenceController');
const controller = new SequenceController('./config.json');

controller.init();
controller.startSequence();
