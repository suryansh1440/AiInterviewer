import Api from '../modals/api.modal.js';

export const getApi = async () => {
    try {
        const apis = await Api.find({ apiStatus: 'active' });
        const randomApi = apis[Math.floor(Math.random() * apis.length)];
        if (randomApi) {
            randomApi.apiUsage = (randomApi.apiUsage || 0) + 1;
            if(randomApi.apiUsage >= 200){
                randomApi.apiStatus = 'overloaded';
            }
            await randomApi.save();
            return randomApi.apiKey;
        }
        return null;
    } catch (error) {
        console.log("error in getApi", error);
        return null;
    }
}
