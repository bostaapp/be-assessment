import registerEmailCreatedListener from './email-created.js';

export default function registerListeners(eventEmitter){
    registerEmailCreatedListener(eventEmitter);
}