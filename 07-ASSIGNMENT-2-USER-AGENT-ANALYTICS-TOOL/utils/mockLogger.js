const mockUserAgentData = require("../mockUserAgentData.json");
const { classifyUserAgent } = require("./userAgentClassifier");

// COUNT MOCK USER AGENT DATA
const countUserAgents = () => {
    const counts = {
        "Thunder Client": 0,
        "Postman": 0,
        "Edge Browser": 0,
        "Chrome Browser": 0,
        "Curl": 0,
        "Other": 0
    };

    mockUserAgentData.forEach(agent => {
        const agentType = classifyUserAgent(agent);
        counts[agentType]++;
    });
    return counts;
}

module.exports = {
    countUserAgents
};