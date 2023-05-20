import newman from 'newman';
import collection from './Bosta-Be-Assessment.postman_collection.json' assert { type: "json" };

newman.run({
  collection,
  reporters: 'htmlextra',
  reporter: {
    htmlextra: {
      export: './documentation.html',
    },
  },
}, (err) => {
  if (err) {
    console.error(err);
  }
  console.log('Postman documentation generation complete!');
});
