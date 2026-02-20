import type { Athlete, League, Venue } from './types';

export const industries = [
  "D2C", "Apparel", "Fitness", "Fintech", "Education", "FMCG", "Consumer Electronics"
];

export const objectives = [
  "Awareness", "Consideration", "Conversions", "App Installs", "Footfall", "Trials"
];

export const geographies = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Delhi NCR": ["Delhi", "Gurgaon", "Noida"],
  "Karnataka": ["Bengaluru", "Mysuru"],
  "Rajasthan": ["Jaipur", "Udaipur"],
};

export const sports = [
  "Cricket", "Football", "Badminton", "Swimming", "Athletics", "Fitness", "Basketball", "Tennis"
];

export const audiences = [
  "Students", "Working Professionals", "Women", "Kids/Parents", "Gym-goers"
];

export const budgetRanges = [
  "<$25k", "$25k-$100k", "$100k-$300k", "$300k-$1M", ">$1M"
];

export const deliverables = [
  "Instagram Post/Reel/Story", "On-ground Activation", "Product Trial/Review", "Brand Ambassadorship", "Event Appearance"
];

export const athletes: Athlete[] = [
    { type: 'Athlete', id: 'ath_1', name: 'Rahul Verma', sport: 'Badminton', city: 'Mumbai', state: 'Maharashtra', tier: 'MICRO', featured: true, image: '1' },
    { type: 'Athlete', id: 'ath_2', name: 'Priya Sharma', sport: 'Fitness', city: 'Pune', state: 'Maharashtra', tier: 'MID', featured: false, image: '2' },
    { type: 'Athlete', id: 'ath_3', name: 'Amit Kumar', sport: 'Cricket', city: 'Delhi', state: 'Delhi NCR', tier: 'CELEBRITY', featured: true, image: '3' },
    { type: 'Athlete', id: 'ath_4', name: 'Sneha Reddy', sport: 'Athletics', city: 'Bengaluru', state: 'Karnataka', tier: 'NANO', featured: false, image: '4' },
    { type: 'Athlete', id: 'ath_5', name: 'Vikram Singh', sport: 'Football', city: 'Jaipur', state: 'Rajasthan', tier: 'MICRO', featured: false, image: '5' },
    { type: 'Athlete', id: 'ath_6', name: 'Anjali Gupta', sport: 'Swimming', city: 'Mumbai', state: 'Maharashtra', tier: 'MID', featured: true, image: '6' },
    { type: 'Athlete', id: 'ath_7', name: 'Rohan Joshi', sport: 'Tennis', city: 'Gurgaon', state: 'Delhi NCR', tier: 'MICRO', featured: false, image: '7' },
    { type: 'Athlete', id: 'ath_8', name: 'Isha Patel', sport: 'Fitness', city: 'Bengaluru', state: 'Karnataka', tier: 'MID', featured: true, image: '8' }
];

export const leagues: League[] = [
    { type: 'League', id: 'l_1', name: 'Mumbai Badminton League', sport: 'Badminton', city: 'Mumbai', state: 'Maharashtra', season: 'Mar 2026', featured: true, image: '101' },
    { type: 'League', id: 'l_2', name: 'Delhi Corporate Cricket Cup', sport: 'Cricket', city: 'Delhi', state: 'Delhi NCR', season: 'Apr-May 2026', featured: false, image: '102' },
    { type: 'League', id: 'l_3', name: 'Jaipur Football Championship', sport: 'Football', city: 'Jaipur', state: 'Rajasthan', season: 'Q2 2026', featured: true, image: '103' },
    { type: 'League', id: 'l_4', name: 'Pune Fitness Challenge', sport: 'Fitness', city: 'Pune', state: 'Maharashtra', season: 'Mar 2026', featured: false, image: '104' },
    { type: 'League', id: 'l_5', name: 'Bengaluru Tech Football League', sport: 'Football', city: 'Bengaluru', state: 'Karnataka', season: 'All Year', featured: true, image: '105' }
];

export const venues: Venue[] = [
    { type: 'Venue', id: 'v_1', name: 'Ace Indoor Arena', venue_type: 'INDOOR_COURT', sports_supported: ['Badminton', 'Tennis'], city: 'Mumbai', state: 'Maharashtra', featured: true, image: '201' },
    { type: 'Venue', id: 'v_2', name: 'Delhi Sports Complex', venue_type: 'STADIUM', sports_supported: ['Cricket', 'Football', 'Athletics'], city: 'Delhi', state: 'Delhi NCR', featured: true, image: '202' },
    { type: 'Venue', id: 'v_3', name: 'Fitness First Gym', venue_type: 'GYM', sports_supported: ['Fitness'], city: 'Pune', state: 'Maharashtra', featured: false, image: '203' },
    { type: 'Venue', id: 'v_4', name: 'Royal Arena Jaipur', venue_type: 'STADIUM', sports_supported: ['Football'], city: 'Jaipur', state: 'Rajasthan', featured: false, image: '204' },
    { type: 'Venue', id: 'v_5', name: 'The Garden Pitch', venue_type: 'ACADEMY', sports_supported: ['Cricket', 'Football'], city: 'Bengaluru', state: 'Karnataka', featured: false, image: '205' }
];
