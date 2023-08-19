import axios from 'axios';

export const monitorUrl = async (url) => {
    try {
        const startTime = new Date();
        const response = await axios.get(url);
        const endTime = new Date();
        const responseTime = endTime - startTime;
        const status = response.status;
        const data = {
            responseTime, status
        }
        return data;
    } catch (error) {
        console.error(`Error monitoring URL: ${url}`);
        console.error(error.message);
    }
}