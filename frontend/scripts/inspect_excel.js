const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../final_timetable_with_lab_codes.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Total Rows:', data.length);
console.log('Sample Row 1:', JSON.stringify(data[0], null, 2));
console.log('Sample Row 2:', JSON.stringify(data[1], null, 2));
console.log('Available Columns:', Object.keys(data[0]));
