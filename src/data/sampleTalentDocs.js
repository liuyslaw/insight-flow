// Generic placeholder data modelled on what a job architecture + appraisal
// rollout typically exports. Not real client data — used to demo the
// consistency engine on realistic-looking, generic content.
// 50 records, 10 each across Singapore, Penang (MY), Johor (MY),
// Eindhoven (NL), and Suzhou (CN), with deliberate level/JD, rating/narrative,
// and calibration anomalies mixed in so the engine has something real to catch.
// Also carries GENDER, AGE, and YEARS OF SERVICE for the Workforce Insights module.

export const sampleTalentDocs = `SITE: Singapore HQ
EMPLOYEE: Wei Lin (placeholder name, SG)
ROLE: Production Technician
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs production technician duties under direct supervision, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
GENDER: Female
AGE: 22
YEARS OF SERVICE: 0

---

SITE: Penang, Malaysia
EMPLOYEE: Aisha (placeholder name, MY)
ROLE: Process Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned process engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Marcus (placeholder name, MY)
ROLE: Senior Process Engineer
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior process engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Male
AGE: 49
YEARS OF SERVICE: 7

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Sophie (placeholder name, EU)
ROLE: Quality Engineer
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned quality engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 23
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Hendrik (placeholder name, CN)
ROLE: Senior Quality Engineer
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 47
YEARS OF SERVICE: 11

---

SITE: Singapore HQ
EMPLOYEE: Li Mei (placeholder name, SG)
ROLE: Mechatronics Design Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Kumar (placeholder name, MY)
ROLE: Mechatronics Design Lead
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
GENDER: Male
AGE: 47
YEARS OF SERVICE: 9

---

SITE: Johor, Malaysia
EMPLOYEE: Farah (placeholder name, MY)
ROLE: Supply Chain Planner
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jan (placeholder name, EU)
ROLE: Manufacturing Supervisor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads manufacturing supervisor initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 51
YEARS OF SERVICE: 9

---

SITE: Suzhou, China
EMPLOYEE: Yusuf (placeholder name, CN)
ROLE: HR Business Partner
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
GENDER: Female
AGE: 38
YEARS OF SERVICE: 6

---

SITE: Singapore HQ
EMPLOYEE: Chen (placeholder name, SG)
ROLE: Finance Analyst
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Priya (placeholder name, MY)
ROLE: Program Manager
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for program manager activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
GENDER: Female
AGE: 58
YEARS OF SERVICE: 18

---

SITE: Johor, Malaysia
EMPLOYEE: Tom (placeholder name, MY)
ROLE: Test Engineer
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Male
AGE: 26
YEARS OF SERVICE: 4

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Anneke (placeholder name, EU)
ROLE: Procurement Specialist
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Rui (placeholder name, CN)
ROLE: EHS Officer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Siti (placeholder name, SG)
ROLE: Continuous Improvement Lead
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 40
YEARS OF SERVICE: 8

---

SITE: Penang, Malaysia
EMPLOYEE: David (placeholder name, MY)
ROLE: Senior Manufacturing Manager
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
GENDER: Male
AGE: 60
YEARS OF SERVICE: 18

---

SITE: Johor, Malaysia
EMPLOYEE: Mei Fen (placeholder name, MY)
ROLE: Production Technician
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs production technician duties under direct supervision, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Female
AGE: 36
YEARS OF SERVICE: 4

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Bram (placeholder name, EU)
ROLE: Process Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned process engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Kavya (placeholder name, CN)
ROLE: Senior Process Engineer
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior process engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 43
YEARS OF SERVICE: 6

---

SITE: Singapore HQ
EMPLOYEE: Hui Min (placeholder name, SG)
ROLE: Quality Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned quality engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Arjun (placeholder name, MY)
ROLE: Senior Quality Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Lotte (placeholder name, MY)
ROLE: Mechatronics Design Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Male
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Feng (placeholder name, EU)
ROLE: Mechatronics Design Lead
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 58
YEARS OF SERVICE: 11

---

SITE: Suzhou, China
EMPLOYEE: Zainab (placeholder name, CN)
ROLE: Supply Chain Planner
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
GENDER: Male
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Peter (placeholder name, SG)
ROLE: Manufacturing Supervisor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads manufacturing supervisor initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 45
YEARS OF SERVICE: 8

---

SITE: Penang, Malaysia
EMPLOYEE: Xin Yi (placeholder name, MY)
ROLE: HR Business Partner
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
GENDER: Male
AGE: 47
YEARS OF SERVICE: 5

---

SITE: Johor, Malaysia
EMPLOYEE: Daniel (placeholder name, MY)
ROLE: Finance Analyst
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Noor (placeholder name, EU)
ROLE: Program Manager
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for program manager activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 50
YEARS OF SERVICE: 7

---

SITE: Suzhou, China
EMPLOYEE: Willem (placeholder name, CN)
ROLE: Test Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Grace (placeholder name, SG)
ROLE: Procurement Specialist
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
GENDER: Female
AGE: 22
YEARS OF SERVICE: 0

---

SITE: Penang, Malaysia
EMPLOYEE: Haziq (placeholder name, MY)
ROLE: EHS Officer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Els (placeholder name, MY)
ROLE: Continuous Improvement Lead
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Male
AGE: 49
YEARS OF SERVICE: 7

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jing (placeholder name, EU)
ROLE: Senior Manufacturing Manager
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 55
YEARS OF SERVICE: 20

---

SITE: Suzhou, China
EMPLOYEE: Ravi (placeholder name, CN)
ROLE: Production Technician
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs production technician duties under direct supervision, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 30
YEARS OF SERVICE: 3

---

SITE: Singapore HQ
EMPLOYEE: Sanne (placeholder name, SG)
ROLE: Process Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned process engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Yong (placeholder name, MY)
ROLE: Senior Process Engineer
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior process engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
GENDER: Male
AGE: 37
YEARS OF SERVICE: 5

---

SITE: Johor, Malaysia
EMPLOYEE: Amir (placeholder name, MY)
ROLE: Quality Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned quality engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Ines (placeholder name, EU)
ROLE: Senior Quality Engineer
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 51
YEARS OF SERVICE: 9

---

SITE: Suzhou, China
EMPLOYEE: Kai (placeholder name, CN)
ROLE: Mechatronics Design Engineer
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 25
YEARS OF SERVICE: 3

---

SITE: Singapore HQ
EMPLOYEE: Nurul (placeholder name, SG)
ROLE: Mechatronics Design Lead
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
GENDER: Female
AGE: 53
YEARS OF SERVICE: 13

---

SITE: Penang, Malaysia
EMPLOYEE: Bastiaan (placeholder name, MY)
ROLE: Supply Chain Planner
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Ting (placeholder name, MY)
ROLE: Manufacturing Supervisor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads manufacturing supervisor initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
GENDER: Male
AGE: 39
YEARS OF SERVICE: 7

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Vikram (placeholder name, EU)
ROLE: HR Business Partner
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 41
YEARS OF SERVICE: 4

---

SITE: Suzhou, China
EMPLOYEE: Femke (placeholder name, CN)
ROLE: Finance Analyst
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Bo (placeholder name, SG)
ROLE: Program Manager
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for program manager activities across the department, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
GENDER: Female
AGE: 47
YEARS OF SERVICE: 9

---

SITE: Penang, Malaysia
EMPLOYEE: Aditi (placeholder name, MY)
ROLE: Test Engineer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
GENDER: Male
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Joost (placeholder name, MY)
ROLE: Procurement Specialist
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Female
AGE: 36
YEARS OF SERVICE: 4

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Le (placeholder name, EU)
ROLE: EHS Officer
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer tasks with moderate supervision, documents procedures, and supports troubleshooting within own work area."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
GENDER: Male
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Mariam (placeholder name, CN)
ROLE: Continuous Improvement Lead
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
GENDER: Female
AGE: 43
YEARS OF SERVICE: 6`;
