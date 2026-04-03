const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');

// REPLECE THESE WITH YOUR SERVICE ROLE KEY FOR PRODUCTION INGESTION
// Service role key allows bypassing RLS and bulk insert.
const SUPABASE_URL = "https://stzbxkqqfjtpbfruqaag.supabase.co"; 
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0emJ4a3FxZmp0cGJmcnVxYWFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM1MTMwMCwiZXhwIjoyMDc2OTI3MzAwfQ.3DhhnCcCU_4GMBKzBCkeAsMHTet37MPfVe8XQ4X2vkQ"; // You must get this from Supabase Dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const filePath = path.join(__dirname, '../final_timetable_with_lab_codes.xlsx');

async function ingest() {
  try {
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Processing ${data.length} records...`);

    const formattedData = data.map((row) => {
      // Split "12:40-14:00" into start and end
      const timings = row.Timings || '';
      const [startStr, endStr] = timings.split('-').map(t => t?.trim());
      
      // Basic validation
      if (!startStr || !endStr) {
        console.warn(`Skipping row with invalid timings: ${JSON.stringify(row)}`);
        return null;
      }

      return {
        class_dept: row['Class Dept'],
        batch_code: row.Classes,
        subject: row.Subject,
        course_code: row['Course Code'],
        teacher_name: (row.Teacher || '').replace('VF-', '').trim(), // Clean VF prefix
        teacher_dept: row['Teacher Dept'],
        day: row.Day,
        start_time: startStr + ":00", // Format for Postgres 'time' type
        end_time: endStr + ":00",
        room: row.Room
      };
    }).filter(Boolean);

    console.log(`Uploading ${formattedData.length} records to Supabase...`);

    // Upload in batches of 50 to avoid request size limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < formattedData.length; i += BATCH_SIZE) {
      const batch = formattedData.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('timetables').insert(batch);
      
      if (error) throw error;
      console.log(`Uploaded rows ${i} to ${Math.min(i + BATCH_SIZE, formattedData.length)}`);
    }

    console.log('Ingestion completed successfully!');
  } catch (err) {
    console.error('Ingestion failed:', err.message);
  }
}

ingest();
