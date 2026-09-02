import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database with enterprise mock data...');
  
  // Clear existing data for a clean slate
  await prisma.employee.deleteMany();
  await prisma.policy.deleteMany();

  // 1. SEED EMPLOYEES (20 Diverse Profiles)
  const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Operations', 'Marketing'];
  const levels = ['Junior', 'Mid', 'Senior', 'Manager', 'Director'];
  
  const mockEmployees = [
    { name: 'Alice Tan', jobLevel: 'Director', department: 'Engineering', age: 45, gender: 'Female', tenureMonths: 84 },
    { name: 'Ben Smith', jobLevel: 'Manager', department: 'Sales', age: 38, gender: 'Male', tenureMonths: 42 },
    { name: 'Chloe Wong', jobLevel: 'Senior', department: 'HR', age: 32, gender: 'Female', tenureMonths: 36 },
    { name: 'David Lee', jobLevel: 'Mid', department: 'Finance', age: 28, gender: 'Male', tenureMonths: 24 },
    { name: 'Eva Chen', jobLevel: 'Junior', department: 'Marketing', age: 23, gender: 'Female', tenureMonths: 12 },
    { name: 'Frank Liu', jobLevel: 'Senior', department: 'Operations', age: 35, gender: 'Male', tenureMonths: 48 },
    { name: 'Grace Kim', jobLevel: 'Manager', department: 'Engineering', age: 40, gender: 'Female', tenureMonths: 60 },
    { name: 'Henry Patel', jobLevel: 'Mid', department: 'Sales', age: 29, gender: 'Male', tenureMonths: 18 },
    { name: 'Isla Garcia', jobLevel: 'Director', department: 'HR', age: 50, gender: 'Female', tenureMonths: 96 },
    { name: 'Jack Brown', jobLevel: 'Junior', department: 'Finance', age: 24, gender: 'Male', tenureMonths: 6 },
    { name: 'Karen Ng', jobLevel: 'Senior', department: 'Marketing', age: 34, gender: 'Female', tenureMonths: 30 },
    { name: 'Liam O\'Connor', jobLevel: 'Manager', department: 'Operations', age: 42, gender: 'Male', tenureMonths: 54 },
    { name: 'Maya Singh', jobLevel: 'Mid', department: 'Engineering', age: 27, gender: 'Female', tenureMonths: 20 },
    { name: 'Noah Davis', jobLevel: 'Junior', department: 'Sales', age: 22, gender: 'Male', tenureMonths: 8 },
    { name: 'Olivia Wilson', jobLevel: 'Senior', department: 'HR', age: 36, gender: 'Female', tenureMonths: 45 },
    { name: 'Paul Zhang', jobLevel: 'Director', department: 'Finance', age: 48, gender: 'Male', tenureMonths: 102 },
    { name: 'Quinn Taylor', jobLevel: 'Manager', department: 'Marketing', age: 39, gender: 'Non-binary', tenureMonths: 38 },
    { name: 'Raj Gupta', jobLevel: 'Mid', department: 'Operations', age: 31, gender: 'Male', tenureMonths: 22 },
    { name: 'Sarah Johnson', jobLevel: 'Senior', department: 'Engineering', age: 33, gender: 'Female', tenureMonths: 28 },
    { name: 'Tom Anderson', jobLevel: 'Junior', department: 'HR', age: 25, gender: 'Male', tenureMonths: 14 }
  ];

  for (const emp of mockEmployees) {
    await prisma.employee.create({ data: emp });
  }

  // 2. SEED POLICIES (8 Core HR Policies)
  const mockPolicies = [
    { title: 'Annual Leave Policy', category: 'Leave', content: 'Employees are entitled to 14-21 days of annual leave based on tenure. Applications must be submitted 2 weeks in advance.' },
    { title: 'Remote Work Guidelines', category: 'Benefits', content: 'Eligible employees may work remotely up to 2 days per week. Core hours of 10 AM to 4 PM SGT must be maintained.' },
    { title: 'Code of Conduct', category: 'Compliance', content: 'All employees must adhere to professional standards, maintain confidentiality, and treat colleagues with respect.' },
    { title: 'Expense Reimbursement', category: 'Finance', content: 'Business expenses must be submitted via the portal within 30 days. Receipts are required for amounts over $50.' },
    { title: 'Parental Leave', category: 'Leave', content: 'Primary caregivers are entitled to 16 weeks of paid parental leave. Secondary caregivers receive 4 weeks.' },
    { title: 'Performance Review Cycle', category: 'Talent', content: 'Formal reviews occur bi-annually in June and December. Continuous feedback is encouraged via monthly 1-on-1s.' },
    { title: 'IT Security Guidelines', category: 'Compliance', content: 'MFA is mandatory for all corporate accounts. Passwords must be rotated every 90 days.' },
    { title: 'Travel Policy', category: 'Finance', content: 'Economy class for flights under 6 hours. Business class permitted for international flights over 6 hours.' }
  ];

  for (const pol of mockPolicies) {
    await prisma.policy.create({ data: pol });
  }

  console.log('✅ Seeding complete! 20 Employees and 8 Policies added.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
