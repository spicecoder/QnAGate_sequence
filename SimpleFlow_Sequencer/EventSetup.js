var EventEmitter = require('events').EventEmitter;
class FlowEmitter extends EventEmitter {};
const flowEmitter = new FlowEmitter();

function emit(ev, d) { flowEmitter.emit(ev, d); }
function onEvent(ev, handler) { flowEmitter.on(ev, handler); }

module.exports = { emit, onEvent, flowEmitter };
