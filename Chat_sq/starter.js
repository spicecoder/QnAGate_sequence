// Import the SequenceController class
const SequenceController = require('./SequenceController');

// Create an instance of the controller with logging enabled
const controller = new SequenceController('./config.json', true);

// Start the sequence processing
controller.startSequence();
