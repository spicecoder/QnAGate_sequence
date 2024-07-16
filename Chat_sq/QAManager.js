// QAManager.js

// Evaluates whether the current QnA matches the conditions specified in a unit's preamble
function QATrigger(preamble, currentState) {
    console.log("current state passed",currentState)
    // Ensure preamble QnA is not empty and currentState is properly checked
    if (preamble.QnA && Object.keys(preamble.QnA).length > 0) {
        return Object.keys(preamble.QnA).every(key => currentState[key] === preamble.QnA[key]);
    }
    return true; // If no preamble QnA, return true to continue execution
}

// Updates the global QnA state based on a unit's postamble
function QAOverride(postamble, currentState) {
    console.log("postamble ,curr state,",postamble,currentState)
    if (postamble.QnA) {
        Object.entries(postamble.QnA).forEach(([key, value]) => {
            currentState[key] = value;
        });
    }
    return currentState;
}

module.exports = { QATrigger, QAOverride };
