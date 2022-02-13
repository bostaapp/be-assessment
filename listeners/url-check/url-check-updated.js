export default function(eventEmitter){
    eventEmitter.on('url-check-updated', (url) => updateUrlCheckerCronJob(url))
}