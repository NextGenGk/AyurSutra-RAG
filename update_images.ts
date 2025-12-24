
import fs from 'fs';
import path from 'path';

// Deterministic image assignment logic (matching the frontend logic)
const HEALTHCARE_STOCK_IMAGES = [
    'photo-1559839734-2b71ea197ec2', // Female healthcare worker
    'photo-1612349317150-e413f6a5b16d', // Male doctor
    'photo-1582750433449-648ed127bb54', // Female nurse
    'photo-1594824804732-ca8db7d1457c', // Female doctor with stethoscope
    'photo-1551601651-2a8555f1a136', // Female healthcare professional
    'photo-1607990281513-2c110a25bd8c', // Male nurse
    'photo-1544005313-94ddf0286df2', // Female healthcare worker
    'photo-1638202993928-7267aad84c31', // Medical professional
    'photo-1576091160399-112ba8d25d1f', // Female doctor
    'photo-1584467735871-8e3d5c4d6b3e'  // Male healthcare worker
];

const getHealthcareImageForId = (id: string, width = 400, height = 400): string => {
    if (!id) {
        const randomId = HEALTHCARE_STOCK_IMAGES[Math.floor(Math.random() * HEALTHCARE_STOCK_IMAGES.length)];
        return `https://images.unsplash.com/${randomId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
    }

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % HEALTHCARE_STOCK_IMAGES.length;
    const imageId = HEALTHCARE_STOCK_IMAGES[index];

    return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
};

const DOCTORS_FILE = path.join(__dirname, 'data', 'docters.json');

async function updateDoctorsWithImages() {
    try {
        console.log('Reading doctors data from:', DOCTORS_FILE);
        const rawData = fs.readFileSync(DOCTORS_FILE, 'utf-8');
        const doctors = JSON.parse(rawData);

        console.log(`Found ${doctors.length} doctors. Updating with images...`);

        let updatedCount = 0;
        const updatedDoctors = doctors.map((doc: any) => {
            // Only update if image_url is missing or empty
            if (!doc.image_url) {
                doc.image_url = getHealthcareImageForId(doc.did);
                doc.profile_image_url = doc.image_url; // Set both for compatibility
                updatedCount++;
            }
            return doc;
        });

        if (updatedCount > 0) {
            fs.writeFileSync(DOCTORS_FILE, JSON.stringify(updatedDoctors, null, 2), 'utf-8');
            console.log(`Successfully updated ${updatedCount} doctors with profile images.`);
        } else {
            console.log('All doctors already have images. No changes made.');
        }

    } catch (error) {
        console.error('Error updating doctors data:', error);
    }
}

updateDoctorsWithImages();
