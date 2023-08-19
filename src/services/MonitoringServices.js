import axios from "axios";
import { SaveCheck, GetAllChecks, GetCheckName, DeleteAllChecks, updateCheckByEmailAndName } from "./dbServices.js";
export const CreateCheck = async (
    email,
    checkname,
    url,
    protocol,
    path,
    port,
    webhook,
    timeout,
    interval,
    threshold,
    authentication,
    httpHeaders,
    assert,
    tags,
    ignoreSSL,
) => {
    try {
        const startTime = new Date();
        const response = await axios.get(url);
        const endTime = new Date();
        const responseTime = endTime - startTime;
        const urlToMonitor = url;
        console.log(`The results of your Check, URL: ${urlToMonitor},Status Code: ${response.status},Response Time: ${responseTime}ms `);
        await SaveCheck(
            email,
            checkname,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            authentication,
            httpHeaders,
            assert,
            tags,
            ignoreSSL
        );
        // You can add more checks here, such as checking for specific content in the response.
    } catch (error) {
        console.error(`Error monitoring URL: ${urlToMonitor}`);
        console.error(error.message);
    }
}

export const GetChecks = async (email) => {
    try {
        await GetAllChecks(email);

    } catch (error) {
        console.error(error.message);
    }

}

export const GetByCheckName = async (email, name) => {
    try {
        await GetCheckName(email, name);
    } catch (error) {
        console.error(error.message);
    }

}

export const DeleteAllChecksByEmail = async (email) => {
    try {
        await DeleteAllChecks(email)
    } catch (error) {
        console.error(error.message);

    }
}

export const UpdateCheck = async (
    email,
    checkname,
    url,
    protocol,
    path,
    port,
    webhook,
    timeout,
    interval,
    threshold,
    authentication,
    httpHeaders,
    assert,
    tags,
    ignoreSSL,
) => {
    try {
        await updateCheckByEmailAndName(
            email,
            checkname,
            url,
            protocol,
            path,
            port,
            webhook,
            timeout,
            interval,
            threshold,
            authentication,
            httpHeaders,
            assert,
            tags,
            ignoreSSL
        );
        // You can add more checks here, such as checking for specific content in the response.
    } catch (error) {
        console.error(`Error monitoring URL: ${urlToMonitor}`);
        console.error(error.message);
    }
}
