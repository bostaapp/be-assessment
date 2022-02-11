export default function(eventEmitter){
    eventEmitter.on('url-check-created', (url) => createUrlCheckerCronJob(url))
}