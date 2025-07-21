import Interview from '../modals/interview.modal.js';

export const getInterviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ interviews });
    } catch (error) {
        console.log('Error in getInterviews:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};