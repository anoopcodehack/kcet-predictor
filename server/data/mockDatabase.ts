export interface College {
  code: string;
  name: string;
  location: string;
  type: 'Government' | 'Aided' | 'Private';
  fee: number;
  ranking: number;
  website: string;
  intake: number;
}

export interface Branch {
  code: string;
  name: string;
  duration: number;
  intake: number;
}

export interface Cutoff {
  collegeCode: string;
  branchCode: string;
  year: number;
  round: number; // 1 or 2
  category: string;
  cutoffRank: number;
}

function buildCollegesList(): College[] {
  const baseColleges: College[] = [
    {
      code: 'E001',
      name: 'University Visvesvaraya College of Engineering (UVCE)',
      location: 'Bangalore',
      type: 'Government',
      fee: 38240,
      ranking: 5,
      website: 'https://uvce.ac.in',
      intake: 640
    },
    {
      code: 'E002',
      name: 'Govt. S K S J T Institute of Engineering',
      location: 'Bangalore',
      type: 'Government',
      fee: 38240,
      ranking: 45,
      website: 'https://sksjt.ac.in',
      intake: 420
    },
    {
      code: 'E003',
      name: 'BMS College of Engineering (BMSCE)',
      location: 'Bangalore',
      type: 'Aided',
      fee: 96574,
      ranking: 3,
      website: 'https://bmsce.ac.in',
      intake: 1250
    },
    {
      code: 'E004',
      name: 'Dr. Ambedkar Institute of Technology',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 38,
      website: 'https://drait.edu.in',
      intake: 960
    },
    {
      code: 'E005',
      name: 'RV College of Engineering (RVCE)',
      location: 'Bangalore',
      type: 'Private',
      fee: 110000,
      ranking: 1,
      website: 'https://rvce.edu.in',
      intake: 1060
    },
    {
      code: 'E006',
      name: 'M S Ramaiah Institute of Technology (MSRIT)',
      location: 'Bangalore',
      type: 'Private',
      fee: 110000,
      ranking: 4,
      website: 'https://msrit.edu',
      intake: 1200
    },
    {
      code: 'E007',
      name: 'Dayananda Sagar College of Engineering',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 15,
      website: 'https://dayanandasagar.edu',
      intake: 1120
    },
    {
      code: 'E008',
      name: 'Bangalore Institute of Technology (BIT)',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 6,
      website: 'https://bit-bangalore.edu.in',
      intake: 1180
    },
    {
      code: 'E009',
      name: 'PES University (PESU - RR Campus)',
      location: 'Bangalore',
      type: 'Private',
      fee: 110000,
      ranking: 2,
      website: 'https://pes.edu',
      intake: 1440
    },
    {
      code: 'E011',
      name: 'MVJ College of Engineering',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 24,
      website: 'https://mvjce.edu.in',
      intake: 900
    },
    {
      code: 'E012',
      name: 'Sir M. Visvesvaraya Institute of Technology',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 18,
      website: 'https://sirmvit.edu',
      intake: 840
    },
    {
      code: 'E013',
      name: 'Ghousia Engineering College',
      location: 'Ramanagara',
      type: 'Private',
      fee: 96574,
      ranking: 75,
      website: 'https://ghousiaedu.org',
      intake: 480
    },
    {
      code: 'E014',
      name: 'S J C Institute of Technology',
      location: 'Chikkaballapur',
      type: 'Private',
      fee: 96574,
      ranking: 68,
      website: 'https://sjcit.ac.in',
      intake: 720
    },
    {
      code: 'E015',
      name: 'Dr. T. Thimmaiah Institute of Technology (KGF)',
      location: 'Kolar Gold Fields',
      type: 'Private',
      fee: 96574,
      ranking: 110,
      website: 'https://drttit.edu.in',
      intake: 420
    },
    {
      code: 'E016',
      name: 'Siddaganga Institute of Technology (SIT)',
      location: 'Tumkur',
      type: 'Aided',
      fee: 96574,
      ranking: 9,
      website: 'https://sit.ac.in',
      intake: 980
    },
    {
      code: 'E017',
      name: 'Sri Siddhartha Institute of Technology',
      location: 'Tumkur',
      type: 'Aided',
      fee: 96574,
      ranking: 55,
      website: 'https://ssit.edu.in',
      intake: 680
    },
    {
      code: 'E018',
      name: 'Kalpatharu Institute of Technology',
      location: 'Tiptur',
      type: 'Private',
      fee: 96574,
      ranking: 85,
      website: 'https://kittiptur.ac.in',
      intake: 540
    },
    {
      code: 'E021',
      name: 'Sri Jayachamarajendra College of Engineering (SJCE)',
      location: 'Mysore',
      type: 'Aided',
      fee: 96574,
      ranking: 7,
      website: 'https://sjce.ac.in',
      intake: 860
    },
    {
      code: 'E022',
      name: 'The National Institute of Engineering (NIE)',
      location: 'Mysore',
      type: 'Aided',
      fee: 96574,
      ranking: 8,
      website: 'https://nie.ac.in',
      intake: 780
    },
    {
      code: 'E023',
      name: 'P E S College of Engineering',
      location: 'Mandya',
      type: 'Aided',
      fee: 96574,
      ranking: 28,
      website: 'https://pescemandya.org',
      intake: 820
    },
    {
      code: 'E024',
      name: 'Malnad College of Engineering (MCE)',
      location: 'Hassan',
      type: 'Aided',
      fee: 96574,
      ranking: 16,
      website: 'https://mcehassan.ac.in',
      intake: 720
    },
    {
      code: 'E033',
      name: 'BMS Institute of Technology & Management (BMSIT)',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 10,
      website: 'https://bmsit.ac.in',
      intake: 840
    },
    {
      code: 'E053',
      name: 'MVJ College of Engineering',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 15,
      website: 'https://mvjce.edu.in',
      intake: 900
    },
    {
      code: 'E085',
      name: 'SJB Institute of Technology',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 14,
      website: 'https://sjbit.edu.in',
      intake: 820
    },
    {
      code: 'E093',
      name: 'Nitte Meenakshi Institute of Technology (NMIT)',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 12,
      website: 'https://nmit.ac.in',
      intake: 1020
    },
    {
      code: 'E103',
      name: 'RNS Institute of Technology (RNSIT)',
      location: 'Bangalore',
      type: 'Private',
      fee: 96574,
      ranking: 13,
      website: 'https://rnsit.ac.in',
      intake: 960
    }
  ];

  const list = [...baseColleges];

  const prefixes = [
    'Visvesvaraya', 'Basaveshwara', 'Siddheshwar', 'Sri Krishna', 'Shridevi', 'Rajiv Gandhi', 'Ambedkar', 
    'Maratha Mandal', 'Tontadarya', 'Gogte', 'BLDEA', 'Hira Sugar', 'Gurunanak Dev', 'Bheemanna Khandre', 
    'Rao Bahadur', 'Malnad', 'Ghousia', 'Harsha', 'Alva', 'Beary', 'Yenepoya', 'East West', 'Sapthagiri', 
    'New Horizon', 'Amrutha', 'Sambhram', 'Sai Vidya', 'Oxford', 'Acharya', 'Reva', 'Presidency', 'Alliance', 
    'CMR', 'Atria', 'Cambridge', 'GSSS', 'Secab', 'Angadi', 'Don Bosco', 'T. John', 'Impact', 'Vemana', 
    'BGS', 'Global', 'Brindavan', 'Karavali', 'Canara', 'St. Joseph', 'A J', 'Adichunchanagiri', 'Srinivas', 
    'Rathinam', 'Akshaya', 'Navodaya', 'Cauvery', 'G. Madegowda', 'Proudadevaraya', 'Vidya Vikas', 'Ganga', 
    'Vidyashilp', 'Bahubali', 'Kishkinda', 'Akash', 'Amity'
  ];

  const suffixes = [
    'College of Engineering',
    'Institute of Technology',
    'Engineering College',
    'Academy of Technology',
    'Institute of Technology & Management',
    'School of Engineering'
  ];

  const locations = [
    'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Dharwad', 'Belgaum', 'Gulbarga', 'Davanagere', 
    'Shimoga', 'Bellary', 'Tumkur', 'Hassan', 'Chikmagalur', 'Karwar', 'Kolar', 'Mandya', 'Bidar', 
    'Bagalkot', 'Bijapur', 'Gadag', 'Koppal', 'Udupi', 'Chitradurga', 'Ramanagara', 'Chamarajanagar', 
    'Chikkaballapur', 'Haveri', 'Yadgir', 'Raichur'
  ];

  const types: ('Government' | 'Aided' | 'Private')[] = ['Private', 'Government', 'Aided', 'Private'];

  let codeNum = 1;
  while (list.length < 300) {
    const codeStr = 'E' + String(codeNum).padStart(3, '0');
    
    if (list.some(c => c.code === codeStr)) {
      codeNum++;
      continue;
    }
    
    const prefix = prefixes[codeNum % prefixes.length];
    const suffix = suffixes[(codeNum * 3) % suffixes.length];
    const location = locations[(codeNum * 7) % locations.length];
    const type = types[codeNum % types.length];
    
    let fee = 96574;
    if (type === 'Government') fee = 38240;
    if (type === 'Private') fee = 110000;
    
    const ranking = 15 + (codeNum % 285);
    const intake = 300 + (codeNum % 10) * 100;
    const name = `${prefix} ${suffix}`;
    const website = `https://${prefix.toLowerCase().replace(/[\s.]/g, '')}ce.edu.in`;
    
    list.push({
      code: codeStr,
      name,
      location,
      type,
      fee,
      ranking,
      website,
      intake
    });
    
    codeNum++;
  }
  
  list.sort((a, b) => a.code.localeCompare(b.code));
  return list;
}

export const COLLEGES: College[] = buildCollegesList();

export const BRANCHES: Branch[] = [
  { code: 'CS', name: 'Computer Science & Engineering', duration: 4, intake: 180 },
  { code: 'IS', name: 'Information Science & Engineering', duration: 4, intake: 120 },
  { code: 'AI', name: 'Artificial Intelligence & Machine Learning', duration: 4, intake: 60 },
  { code: 'DS', name: 'Computer Science & Engineering (Data Science)', duration: 4, intake: 60 },
  { code: 'EC', name: 'Electronics & Communication Engineering', duration: 4, intake: 120 },
  { code: 'EE', name: 'Electrical & Electronics Engineering', duration: 4, intake: 60 },
  { code: 'ME', name: 'Mechanical Engineering', duration: 4, intake: 60 },
  { code: 'CE', name: 'Civil Engineering', duration: 4, intake: 60 },
  { code: 'BT', name: 'Biotechnology Engineering', duration: 4, intake: 30 }
];

export const CATEGORIES = [
  { code: 'GM', name: 'General Merit', multiplier: 1.0 },
  { code: 'GMK', name: 'General Merit Kannada', multiplier: 1.3 },
  { code: 'GMR', name: 'General Merit Rural', multiplier: 1.22 },
  { code: '1G', name: 'Category 1 General', multiplier: 1.6 },
  { code: '1K', name: 'Category 1 Kannada', multiplier: 1.95 },
  { code: '1R', name: 'Category 1 Rural', multiplier: 1.8 },
  { code: '2AG', name: 'Category 2A General', multiplier: 1.55 },
  { code: '2AK', name: 'Category 2A Kannada', multiplier: 1.85 },
  { code: '2AR', name: 'Category 2A Rural', multiplier: 1.7 },
  { code: '2BG', name: 'Category 2B General', multiplier: 1.65 },
  { code: '2BK', name: 'Category 2B Kannada', multiplier: 2.1 },
  { code: '2BR', name: 'Category 2B Rural', multiplier: 1.9 },
  { code: '3AG', name: 'Category 3A General', multiplier: 1.25 },
  { code: '3AK', name: 'Category 3A Kannada', multiplier: 1.55 },
  { code: '3AR', name: 'Category 3A Rural', multiplier: 1.4 },
  { code: '3BG', name: 'Category 3B General', multiplier: 1.35 },
  { code: '3BK', name: 'Category 3B Kannada', multiplier: 1.65 },
  { code: '3BR', name: 'Category 3B Rural', multiplier: 1.5 },
  { code: 'SCG', name: 'Scheduled Caste General', multiplier: 3.5 },
  { code: 'SCK', name: 'Scheduled Caste Kannada', multiplier: 4.2 },
  { code: 'SCR', name: 'Scheduled Caste Rural', multiplier: 3.9 },
  { code: 'STG', name: 'Scheduled Tribe General', multiplier: 3.1 },
  { code: 'STK', name: 'Scheduled Tribe Kannada', multiplier: 3.8 },
  { code: 'STR', name: 'Scheduled Tribe Rural', multiplier: 3.5 }
];

// Helper to calculate a base cutoff (GM, 2024, Round 1)
// for each college-branch combination based on college ranking and branch popularity
function getBaseRank(collegeCode: string, branchCode: string): number {
  const college = COLLEGES.find(c => c.code === collegeCode);
  const ranking = college ? college.ranking : 150;
  
  // Popularity ranking of branches: CS(1), IS(2), AI(3), DS(4), EC(5), EE(6), BT(7), ME(8), CE(9)
  let branchFactor = 5;
  switch (branchCode) {
    case 'CS': branchFactor = 1.0; break;
    case 'IS': branchFactor = 1.3; break;
    case 'AI': branchFactor = 1.6; break;
    case 'DS': branchFactor = 1.9; break;
    case 'EC': branchFactor = 2.4; break;
    case 'EE': branchFactor = 4.0; break;
    case 'BT': branchFactor = 5.5; break;
    case 'ME': branchFactor = 7.5; break;
    case 'CE': branchFactor = 10.0; break;
  }
  
  // base ranking scaling from 300 (rank 1 CS) to 150,000 (rank 300 CE)
  const rankFactor = Math.pow(ranking, 0.95);
  const base = Math.floor(250 * rankFactor * branchFactor);
  return base;
}

export function generateCutoffs(): Cutoff[] {
  const cutoffs: Cutoff[] = [];
  
  for (const college of COLLEGES) {
    for (const branch of BRANCHES) {
      const baseGM2024R1 = getBaseRank(college.code, branch.code);
      
      // We will generate data for years 2023, 2024, 2025
      for (const year of [2023, 2024, 2025]) {
        // Year scaling:
        // 2023 had slightly easier cutoffs (higher ranks got in) -> multiplier ~1.08
        // 2024 is baseline -> 1.0
        // 2025 has tougher cutoffs (lower ranks got in due to higher competition) -> multiplier ~0.92
        let yearScale = 1.0;
        if (year === 2023) yearScale = 1.08;
        if (year === 2025) yearScale = 0.92;
        
        for (const round of [1, 2]) {
          // Round scaling:
          // Round 2 cutoffs are higher (ranks are more relaxed) -> multiplier ~1.18
          const roundScale = (round === 1) ? 1.0 : 1.18;
          
          for (const category of CATEGORIES) {
            let cutoffRank = Math.floor(baseGM2024R1 * yearScale * roundScale * category.multiplier);
            
            // Add a small pseudo-random but deterministic variance based on inputs to make it realistic
            const hash = (college.code.charCodeAt(3) + branch.code.charCodeAt(0) + year + round + category.code.charCodeAt(0)) % 10;
            const variance = 1.0 + (hash - 5) / 150; // -3.3% to +3.3% variance
            
            cutoffRank = Math.floor(cutoffRank * variance);
            
            // Limit cutoff rank to a reasonable max for low branches/categories (e.g., 180,000 for KCET)
            if (cutoffRank > 180000) cutoffRank = 180000;
            if (cutoffRank < 50) cutoffRank = 50;
            
            cutoffs.push({
              collegeCode: college.code,
              branchCode: branch.code,
              year,
              round,
              category: category.code,
              cutoffRank
            });
          }
        }
      }
    }
  }
  
  return cutoffs;
}
