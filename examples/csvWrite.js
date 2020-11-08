const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'timestamp', title: 'timestamp'},
    {id: 'value', title: 'value'}
  ]
});

const data = [
  {
    timestamp: 11111,
    value: 1
  }, {
    timestamp: 22222,
    value: 2
  }, {
    timestamp: 33333,
    value: 3
  }
];

csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));