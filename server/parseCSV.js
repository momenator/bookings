const { parse } = require('papaparse');

const parseCSV = async (csvBuffer) => {
  try {
    // parse one file at a time
    const { data } = parse(csvBuffer.toString());
    cleanedData = cleanData(data);
    return cleanedData;
  } catch(e) {
    console.log(e);
    // TODO: handle errors here...
    return [];
  }
};

// clean parsed csv data
const cleanData = (data) => {
  const numCol = data[0].length;
  // filter rows with invalid column length
  const filtered = data.filter(((d, i) => d.length ===  numCol && i !== 0));
  return filtered.map(r => {
    return { 
      'time': r[0].trim(), 
      'duration': Number(r[1].trim()), 
      'user_id': r[2].trim() 
    };
  });
};

module.exports = parseCSV;
