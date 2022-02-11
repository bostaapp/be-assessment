export default function(eventEmitter){
    eventEmitter.on('url-check-deleted', (url) => deleteUrlCheckerCronJob(url))
}