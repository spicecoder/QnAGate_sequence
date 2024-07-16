const { emit, onEvent } = require('./EventSetup');
const { processUnit } = require('./UnitProcessor');

onEvent('SQ_UnitStarter', (data) => {
  console.log('Event received:', data);
  // Further processing...
});

onEvent('SQ_UnitStarter', (data) => {
  console.log('Processing started...');
  processUnit(data);
});

// Other event setups...
console.log("Event about to be emitted...");
emit('SQ_UnitStarter', { name: "Example", flow: { loopcount: 0, looplimit: 5 } });
