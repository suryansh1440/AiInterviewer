import Api from '../modals/api.modal.js';

export const addApi = async (req, res) => {
    const { apiEmail, apiKey } = req.body;
    try {
        const api = new Api({ apiEmail, apiKey });
        await api.save();
        res.status(200).json({ message: "Api added successfully" });
    } catch (error) {
        console.log("error in addApi", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllApis = async (req, res) => {
    try {
        const apis = await Api.find();
        res.status(200).json(apis);
    } catch (error) {
        console.log("error in getAllApis", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const overUsage = async (req, res) => {
    const { apiKey } = req.body;
    try {
        const api = await Api.findOne({ apiKey });
        if (api) {
            api.apiStatus = 'overloaded';
            await api.save();
        }
        res.status(200).json({ message: "Api overloaded successfully" });
    } catch (error) {
        console.log("error in overUsage", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const resetApi = async (req, res) => {
    const { apiKey } = req.body;
    try {
        const api = await Api.findOne({ apiKey });
        if (api) {
            api.apiStatus = 'active';
            api.apiUsage = 0;
            await api.save();
        }
        res.status(200).json({ message: "Api reset successfully" });
    } catch (error) {
        console.log("error in resetApi", error);
        res.status(500).json({ message: "Internal server error" });
    }
}