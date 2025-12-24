
import fs from 'fs';
import path from 'path';

const DOCTORS_FILE = path.join(__dirname, 'data', 'docters.json');
const USERS_FILE = path.join(__dirname, 'users-seed.json');

async function mergeDoctorNames() {
  try {
    console.log('Reading files...');
    const doctorsRaw = fs.readFileSync(DOCTORS_FILE, 'utf-8');
    const usersRaw = fs.readFileSync(USERS_FILE, 'utf-8');

    const doctors = JSON.parse(doctorsRaw);
    const users = JSON.parse(usersRaw);

    console.log(`Loaded ${doctors.length} doctors and ${users.length} users.`);

    let updatedCount = 0;
    
    // Create a map of users by uid for faster lookup
    const usersMap = new Map();
    users.forEach((u: any) => {
        usersMap.set(u.uid, u);
    });

    const updatedDoctors = doctors.map((doc: any) => {
      const user = usersMap.get(doc.uid);
      if (user) {
        // Update name
        if (!doc.name) {
            doc.name = user.name;
            updatedCount++;
        }
        // Ensure image consistency if missing in doctor but present in user (though we drove it the other way recently)
        if (!doc.image_url && user.profile_image_url) {
            doc.image_url = user.profile_image_url;
        }
      }
      return doc;
    });

    if (updatedCount > 0) {
        fs.writeFileSync(DOCTORS_FILE, JSON.stringify(updatedDoctors, null, 2), 'utf-8');
        console.log(`Successfully added names to ${updatedCount} doctors.`);
    } else {
        console.log('No new names merged (maybe they already exist).');
    }

  } catch (error) {
    console.error('Error merging data:', error);
  }
}

mergeDoctorNames();
