// UTILITY FUNCTION TO CLASSIFY USER AGENT TYPE
const classifyUserAgent = (agentName) => {
    const lowerAgent = agentName.toLowerCase();
    if (lowerAgent.includes("thunder client")) return "Thunder Client";
    if (lowerAgent.includes("postmanruntime")) return "Postman";
    if (lowerAgent.includes("edge")) return "Edge Browser";
    if (lowerAgent.includes("chrome")) return "Chrome Browser";
    if (lowerAgent.includes("curl")) return "Curl";
    return "Other";
};

module.exports = {
    classifyUserAgent
};