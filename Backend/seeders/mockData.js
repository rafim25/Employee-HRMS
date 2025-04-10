import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import Skill from '../models/Skill.js';

// Define constants at the top level
const CANDIDATE_STATUSES = ['applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected', 'hold'];
const JOB_STATUSES = ['active', 'archived', 'draft', 'closed', 'expired'];
const SOURCES = ['LinkedIn', 'Referral', 'Direct', 'Indeed', 'Naukri'];
const LOCATIONS = ['Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Delhi', 'Pune'];
const FIRST_NAMES = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram'];
const LAST_NAMES = ['Kumar', 'Singh', 'Sharma', 'Patel', 'Reddy'];

const seedMockData = async () => {
  try {
    // First create a job
    const job = await Job.create({
      uuid: uuidv4(),
      title: 'Senior React Developer',
      type: 'Full-time',
      description: 'Looking for experienced React developer',
      state: 'Karnataka',
      city: 'Bangalore',
      minSalary: 1800000,
      maxSalary: 2500000,
      status: 'active',
      clientName: 'TechCorp',
      clientEmail: 'hr@techcorp.com',
      clientLocation: 'Bangalore',
      skills: ['React', 'Node.js', 'TypeScript'],
      experienceRange: [5, 8],
      interviewRounds: ['Technical', 'System Design', 'HR']
    });

    console.log('✅ Job created successfully');

    // Create one candidate
    const candidate = await Candidate.create({
      uuid: uuidv4(),
      name: 'Test Candidate',
      email: 'test@example.com',
      phone: '+91-9876543210',
      experience: 5,
      current_company: 'Test Company',
      current_ctc: 1000000,
      expected_ctc: 1500000,
      notice_period: 30,
      current_location: 'Bangalore',
      preferred_location: 'Bangalore',
      status: 'applied',
      job_id: job.id, // Use the created job's ID
      source: 'Direct',
      skills: ['JavaScript', 'React'],
      interview_feedback: [{
        round: 1,
        status: 'passed',
        comments: 'Good technical skills'
      }],
      current_round: 1
    });

    console.log('✅ First candidate created successfully');

    // If first candidate is successful, create more
    if (candidate) {
      for (let i = 1; i < 5; i++) {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        
        await Candidate.create({
          uuid: uuidv4(),
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          phone: `+91-9876543${i.toString().padStart(3, '0')}`,
          experience: 5,
          current_company: `Company ${i}`,
          current_ctc: 1000000,
          expected_ctc: 1500000,
          notice_period: 30,
          current_location: 'Bangalore',
          preferred_location: 'Bangalore',
          status: 'applied',
          job_id: job.id,
          source: 'Direct',
          skills: ['JavaScript', 'React'],
          interview_feedback: [{
            round: 1,
            status: 'passed',
            comments: 'Good technical skills'
          }],
          current_round: 1
        });
        
        console.log(`✅ Created candidate ${i + 1}`);
      }
    }

    console.log('✅ All mock data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding mock data:', error);
    console.error('Detailed error:', error.message);
  }
};

// Run the seeder
seedMockData(); 