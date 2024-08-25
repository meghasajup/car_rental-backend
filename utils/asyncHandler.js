export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        if (err.isJoi) err.status = 408;
        res.status(err.status || 500).send({ status: false, error: err.message || "Internal server error" });
    }
};