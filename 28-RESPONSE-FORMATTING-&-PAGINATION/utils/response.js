function sendSuccess(res, data, status=200) {
    res.status(status).json({
        success: true,
        data,
        error: null,
        meta: {
            requestId: res.locals.requestId,
            ts: Date.now(),
        }
    });
};

function sendError(res, status, code, message) {
    res.status(status).json({
        success: false,
        data: null,
        error: {code, message},
    });
};


module.exports = {sendError, sendSuccess};