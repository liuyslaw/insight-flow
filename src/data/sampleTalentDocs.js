// Generic placeholder data modelled on what a job architecture + appraisal
// rollout typically exports. Not real client data.
// 50 core employees, each with TWO appraisal cycle records (2025, 2026) —
// same person, role, site, level; rating/narrative/age/tenure vary by year —
// so the app can demonstrate year-on-year comparison. Plus 10 additional
// "leaver" records (5 exited in 2025, 5 in 2026, STATUS: Left + EXIT DATE)
// to support attrition rate. 110 records total. Shaped around Frencken.s
// actual segments: Mechatronics and Integrated Manufacturing Services.

export const sampleTalentDocs = `SITE: Singapore HQ
EMPLOYEE: Wei Lin (placeholder name, SG)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Wei Lin (placeholder name, SG)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Aisha (placeholder name, MY)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 46
YEARS OF SERVICE: 10

---

SITE: Penang, Malaysia
EMPLOYEE: Aisha (placeholder name, MY)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 47
YEARS OF SERVICE: 11

---

SITE: Johor, Malaysia
EMPLOYEE: Marcus (placeholder name, MY)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Marcus (placeholder name, MY)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Sophie (placeholder name, EU)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 36
YEARS OF SERVICE: 4

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Sophie (placeholder name, EU)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 37
YEARS OF SERVICE: 5

---

SITE: Suzhou, China
EMPLOYEE: Hendrik (placeholder name, CN)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Male
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Hendrik (placeholder name, CN)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Singapore HQ
EMPLOYEE: Li Mei (placeholder name, SG)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 57
YEARS OF SERVICE: 15

---

SITE: Singapore HQ
EMPLOYEE: Li Mei (placeholder name, SG)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 58
YEARS OF SERVICE: 16

---

SITE: Penang, Malaysia
EMPLOYEE: Kumar (placeholder name, MY)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 24
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Kumar (placeholder name, MY)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
STATUS: Active
GENDER: Male
AGE: 25
YEARS OF SERVICE: 3

---

SITE: Johor, Malaysia
EMPLOYEE: Farah (placeholder name, MY)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Farah (placeholder name, MY)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jan (placeholder name, EU)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jan (placeholder name, EU)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Suzhou, China
EMPLOYEE: Yusuf (placeholder name, CN)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 38
YEARS OF SERVICE: 6

---

SITE: Suzhou, China
EMPLOYEE: Yusuf (placeholder name, CN)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
STATUS: Active
GENDER: Female
AGE: 39
YEARS OF SERVICE: 7

---

SITE: Singapore HQ
EMPLOYEE: Chen (placeholder name, SG)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Female
AGE: 52
YEARS OF SERVICE: 11

---

SITE: Singapore HQ
EMPLOYEE: Chen (placeholder name, SG)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Female
AGE: 53
YEARS OF SERVICE: 12

---

SITE: Penang, Malaysia
EMPLOYEE: Priya (placeholder name, MY)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 51
YEARS OF SERVICE: 10

---

SITE: Penang, Malaysia
EMPLOYEE: Priya (placeholder name, MY)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 52
YEARS OF SERVICE: 11

---

SITE: Johor, Malaysia
EMPLOYEE: Tom (placeholder name, MY)
ROLE: Injection Moulding Production Technician
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs injection moulding production technician duties under direct supervision within Integrated Manufacturing Services — Plastics, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 26
YEARS OF SERVICE: 4

---

SITE: Johor, Malaysia
EMPLOYEE: Tom (placeholder name, MY)
ROLE: Injection Moulding Production Technician
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs injection moulding production technician duties under direct supervision within Integrated Manufacturing Services — Plastics, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 27
YEARS OF SERVICE: 5

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Anneke (placeholder name, EU)
ROLE: Automotive Quality Engineer
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned automotive quality engineer tasks with moderate supervision within Integrated Manufacturing Services — Automotive, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Anneke (placeholder name, EU)
ROLE: Automotive Quality Engineer
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned automotive quality engineer tasks with moderate supervision within Integrated Manufacturing Services — Automotive, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Suzhou, China
EMPLOYEE: Rui (placeholder name, CN)
ROLE: Procurement Specialist, IMS
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist, ims tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Rui (placeholder name, CN)
ROLE: Procurement Specialist, IMS
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist, ims tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Singapore HQ
EMPLOYEE: Siti (placeholder name, SG)
ROLE: EHS Officer, Manufacturing
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer, manufacturing tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Siti (placeholder name, SG)
ROLE: EHS Officer, Manufacturing
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer, manufacturing tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: David (placeholder name, MY)
ROLE: HR Business Partner
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently within Group Corporate, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 42
YEARS OF SERVICE: 5

---

SITE: Penang, Malaysia
EMPLOYEE: David (placeholder name, MY)
ROLE: HR Business Partner
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently within Group Corporate, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Male
AGE: 43
YEARS OF SERVICE: 6

---

SITE: Johor, Malaysia
EMPLOYEE: Mei Fen (placeholder name, MY)
ROLE: Finance Analyst
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision within Group Corporate, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Mei Fen (placeholder name, MY)
ROLE: Finance Analyst
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision within Group Corporate, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Bram (placeholder name, EU)
ROLE: Senior Manufacturing Manager
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple Integrated Manufacturing Services sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 54
YEARS OF SERVICE: 19

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Bram (placeholder name, EU)
ROLE: Senior Manufacturing Manager
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple Integrated Manufacturing Services sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 55
YEARS OF SERVICE: 20

---

SITE: Suzhou, China
EMPLOYEE: Kavya (placeholder name, CN)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Kavya (placeholder name, CN)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Singapore HQ
EMPLOYEE: Hui Min (placeholder name, SG)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Female
AGE: 45
YEARS OF SERVICE: 3

---

SITE: Singapore HQ
EMPLOYEE: Hui Min (placeholder name, SG)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Female
AGE: 46
YEARS OF SERVICE: 4

---

SITE: Penang, Malaysia
EMPLOYEE: Arjun (placeholder name, MY)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Arjun (placeholder name, MY)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Johor, Malaysia
EMPLOYEE: Lotte (placeholder name, MY)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 44
YEARS OF SERVICE: 7

---

SITE: Johor, Malaysia
EMPLOYEE: Lotte (placeholder name, MY)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 45
YEARS OF SERVICE: 8

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Feng (placeholder name, EU)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Feng (placeholder name, EU)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Suzhou, China
EMPLOYEE: Zainab (placeholder name, CN)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Male
AGE: 47
YEARS OF SERVICE: 18

---

SITE: Suzhou, China
EMPLOYEE: Zainab (placeholder name, CN)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
STATUS: Active
GENDER: Male
AGE: 48
YEARS OF SERVICE: 19

---

SITE: Singapore HQ
EMPLOYEE: Peter (placeholder name, SG)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 0

---

SITE: Singapore HQ
EMPLOYEE: Peter (placeholder name, SG)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Xin Yi (placeholder name, MY)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Xin Yi (placeholder name, MY)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Johor, Malaysia
EMPLOYEE: Daniel (placeholder name, MY)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Daniel (placeholder name, MY)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Noor (placeholder name, EU)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 46
YEARS OF SERVICE: 9

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Noor (placeholder name, EU)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 47
YEARS OF SERVICE: 10

---

SITE: Suzhou, China
EMPLOYEE: Willem (placeholder name, CN)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 57
YEARS OF SERVICE: 14

---

SITE: Suzhou, China
EMPLOYEE: Willem (placeholder name, CN)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 58
YEARS OF SERVICE: 15

---

SITE: Singapore HQ
EMPLOYEE: Grace (placeholder name, SG)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Female
AGE: 35
YEARS OF SERVICE: 3

---

SITE: Singapore HQ
EMPLOYEE: Grace (placeholder name, SG)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Female
AGE: 36
YEARS OF SERVICE: 4

---

SITE: Penang, Malaysia
EMPLOYEE: Haziq (placeholder name, MY)
ROLE: Injection Moulding Production Technician
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs injection moulding production technician duties under direct supervision within Integrated Manufacturing Services — Plastics, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 29
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Haziq (placeholder name, MY)
ROLE: Injection Moulding Production Technician
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs injection moulding production technician duties under direct supervision within Integrated Manufacturing Services — Plastics, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 30
YEARS OF SERVICE: 3

---

SITE: Johor, Malaysia
EMPLOYEE: Els (placeholder name, MY)
ROLE: Automotive Quality Engineer
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned automotive quality engineer tasks with moderate supervision within Integrated Manufacturing Services — Automotive, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Els (placeholder name, MY)
ROLE: Automotive Quality Engineer
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned automotive quality engineer tasks with moderate supervision within Integrated Manufacturing Services — Automotive, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jing (placeholder name, EU)
ROLE: Procurement Specialist, IMS
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist, ims tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Jing (placeholder name, EU)
ROLE: Procurement Specialist, IMS
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist, ims tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Suzhou, China
EMPLOYEE: Ravi (placeholder name, CN)
ROLE: EHS Officer, Manufacturing
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer, manufacturing tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Male
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Suzhou, China
EMPLOYEE: Ravi (placeholder name, CN)
ROLE: EHS Officer, Manufacturing
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned ehs officer, manufacturing tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Singapore HQ
EMPLOYEE: Sanne (placeholder name, SG)
ROLE: HR Business Partner
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently within Group Corporate, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 50
YEARS OF SERVICE: 8

---

SITE: Singapore HQ
EMPLOYEE: Sanne (placeholder name, SG)
ROLE: HR Business Partner
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads hr business partner initiatives independently within Group Corporate, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 51
YEARS OF SERVICE: 9

---

SITE: Penang, Malaysia
EMPLOYEE: Yong (placeholder name, MY)
ROLE: Finance Analyst
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision within Group Corporate, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Yong (placeholder name, MY)
ROLE: Finance Analyst
BUSINESS UNIT: Group Corporate
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned finance analyst tasks with moderate supervision within Group Corporate, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Male
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Johor, Malaysia
EMPLOYEE: Amir (placeholder name, MY)
ROLE: Senior Manufacturing Manager
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple Integrated Manufacturing Services sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 59
YEARS OF SERVICE: 22

---

SITE: Johor, Malaysia
EMPLOYEE: Amir (placeholder name, MY)
ROLE: Senior Manufacturing Manager
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L6
JOB DESCRIPTION EXCERPT: "Owns the senior manufacturing manager function across multiple Integrated Manufacturing Services sites, sets multi-year strategy, manages a team of managers, and represents the Group in external and regional forums."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 60
YEARS OF SERVICE: 23

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Ines (placeholder name, EU)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 37
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Ines (placeholder name, EU)
ROLE: Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned semiconductor process engineer tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 38
YEARS OF SERVICE: 2

---

SITE: Suzhou, China
EMPLOYEE: Kai (placeholder name, CN)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 38
YEARS OF SERVICE: 6

---

SITE: Suzhou, China
EMPLOYEE: Kai (placeholder name, CN)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 39
YEARS OF SERVICE: 7

---

SITE: Singapore HQ
EMPLOYEE: Nurul (placeholder name, SG)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Female
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Nurul (placeholder name, SG)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Female
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Bastiaan (placeholder name, MY)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 51
YEARS OF SERVICE: 10

---

SITE: Penang, Malaysia
EMPLOYEE: Bastiaan (placeholder name, MY)
ROLE: Senior Quality Engineer, Life Sciences
BUSINESS UNIT: Mechatronics — Analytical & Life Sciences
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior quality engineer, life sciences initiatives independently within Mechatronics — Analytical & Life Sciences, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 52
YEARS OF SERVICE: 11

---

SITE: Johor, Malaysia
EMPLOYEE: Ting (placeholder name, MY)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Johor, Malaysia
EMPLOYEE: Ting (placeholder name, MY)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Did a good job this year, followed instructions well and completed all tasks on time."
STATUS: Active
GENDER: Male
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Vikram (placeholder name, EU)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 51
YEARS OF SERVICE: 8

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Vikram (placeholder name, EU)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 52
YEARS OF SERVICE: 9

---

SITE: Suzhou, China
EMPLOYEE: Femke (placeholder name, CN)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Active
GENDER: Male
AGE: 35
YEARS OF SERVICE: 3

---

SITE: Suzhou, China
EMPLOYEE: Femke (placeholder name, CN)
ROLE: Cleanroom Production Technician
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L2
JOB DESCRIPTION EXCERPT: "Performs cleanroom production technician duties under direct supervision within Mechatronics — Semiconductor, follows standard work instructions, and escalates deviations to the shift lead."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Male
AGE: 36
YEARS OF SERVICE: 4

---

SITE: Singapore HQ
EMPLOYEE: Bo (placeholder name, SG)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Fell short of expectations on two key deliverables; follow-up coaching plan has been agreed with the manager."
STATUS: Active
GENDER: Female
AGE: 27
YEARS OF SERVICE: 1

---

SITE: Singapore HQ
EMPLOYEE: Bo (placeholder name, SG)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 28
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Aditi (placeholder name, MY)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Male
AGE: 32
YEARS OF SERVICE: 1

---

SITE: Penang, Malaysia
EMPLOYEE: Aditi (placeholder name, MY)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Active
GENDER: Male
AGE: 33
YEARS OF SERVICE: 2

---

SITE: Johor, Malaysia
EMPLOYEE: Joost (placeholder name, MY)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 51
YEARS OF SERVICE: 12

---

SITE: Johor, Malaysia
EMPLOYEE: Joost (placeholder name, MY)
ROLE: Continuous Improvement Lead
BUSINESS UNIT: Mechatronics
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Leads continuous improvement lead initiatives independently within Mechatronics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Female
AGE: 52
YEARS OF SERVICE: 13

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Le (placeholder name, EU)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 47
YEARS OF SERVICE: 17

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Le (placeholder name, EU)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Active
GENDER: Male
AGE: 48
YEARS OF SERVICE: 18

---

SITE: Suzhou, China
EMPLOYEE: Mariam (placeholder name, CN)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Active
GENDER: Female
AGE: 43
YEARS OF SERVICE: 6

---

SITE: Suzhou, China
EMPLOYEE: Mariam (placeholder name, CN)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Active
GENDER: Female
AGE: 44
YEARS OF SERVICE: 7

---

SITE: Singapore HQ
EMPLOYEE: Isabelle (placeholder name, SG)
ROLE: Senior Semiconductor Process Engineer
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads senior semiconductor process engineer initiatives independently within Mechatronics — Semiconductor, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Left
EXIT DATE: February 2025
GENDER: Female
AGE: 35
YEARS OF SERVICE: 3

---

SITE: Penang, Malaysia
EMPLOYEE: Farid (placeholder name, MY)
ROLE: Mechatronics Design Engineer
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned mechatronics design engineer tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Left
EXIT DATE: April 2025
GENDER: Male
AGE: 34
YEARS OF SERVICE: 4

---

SITE: Johor, Malaysia
EMPLOYEE: Chun Hao (placeholder name, MY)
ROLE: Test Engineer, Industrial Automation
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned test engineer, industrial automation tasks with moderate supervision within Mechatronics — Industrial Automation, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Left
EXIT DATE: June 2025
GENDER: Female
AGE: 41
YEARS OF SERVICE: 7

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Katrin (placeholder name, EU)
ROLE: Automotive Program Manager
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for automotive program manager activities across Integrated Manufacturing Services — Automotive, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Left
EXIT DATE: September 2025
GENDER: Male
AGE: 46
YEARS OF SERVICE: 15

---

SITE: Suzhou, China
EMPLOYEE: Suresh (placeholder name, CN)
ROLE: Automotive Quality Engineer
BUSINESS UNIT: Integrated Manufacturing Services — Automotive
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned automotive quality engineer tasks with moderate supervision within Integrated Manufacturing Services — Automotive, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2025
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Independently led a major improvement project this year that delivered measurable results, and stepped up to cover additional responsibilities during a team member's leave."
STATUS: Left
EXIT DATE: November 2025
GENDER: Female
AGE: 36
YEARS OF SERVICE: 6

---

SITE: Singapore HQ
EMPLOYEE: Mei Ling (placeholder name, SG)
ROLE: Medical Device Quality Engineer
BUSINESS UNIT: Mechatronics — Medical
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned medical device quality engineer tasks with moderate supervision within Mechatronics — Medical, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 5 / 5 (Outstanding)
APPRAISAL NARRATIVE: "Exceptional year — took full ownership of a cross-functional initiative, negotiated directly with external stakeholders, and coached two colleagues toward promotion readiness."
STATUS: Left
EXIT DATE: January 2026
GENDER: Male
AGE: 36
YEARS OF SERVICE: 2

---

SITE: Penang, Malaysia
EMPLOYEE: Dirk (placeholder name, MY)
ROLE: Mechatronics Design Lead
BUSINESS UNIT: Mechatronics — Industrial Automation
ASSIGNED LEVEL: L5
JOB DESCRIPTION EXCERPT: "Sets direction for mechatronics design lead activities across Mechatronics — Industrial Automation, approves key technical or process decisions, manages supplier or stakeholder relationships, and owns the annual roadmap."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 2 / 5 (Below Expectations)
APPRAISAL NARRATIVE: "Struggled to keep pace this year and missed several deadlines; needs closer supervision going into the next cycle."
STATUS: Left
EXIT DATE: March 2026
GENDER: Female
AGE: 46
YEARS OF SERVICE: 11

---

SITE: Johor, Malaysia
EMPLOYEE: Nadia (placeholder name, MY)
ROLE: Supply Chain Planner, Semiconductor
BUSINESS UNIT: Mechatronics — Semiconductor
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned supply chain planner, semiconductor tasks with moderate supervision within Mechatronics — Semiconductor, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 4 / 5 (Exceeds Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Left
EXIT DATE: May 2026
GENDER: Male
AGE: 31
YEARS OF SERVICE: 1

---

SITE: Eindhoven, Netherlands
EMPLOYEE: Boon Keng (placeholder name, EU)
ROLE: Plastics Manufacturing Supervisor
BUSINESS UNIT: Integrated Manufacturing Services — Plastics
ASSIGNED LEVEL: L4
JOB DESCRIPTION EXCERPT: "Leads plastics manufacturing supervisor initiatives independently within Integrated Manufacturing Services — Plastics, owns a defined workstream or budget line, mentors junior staff, and represents the function in cross-site reviews."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Solid, dependable year. Delivered what was asked and responded well to feedback."
STATUS: Left
EXIT DATE: June 2026
GENDER: Female
AGE: 47
YEARS OF SERVICE: 7

---

SITE: Suzhou, China
EMPLOYEE: Wouter (placeholder name, CN)
ROLE: Procurement Specialist, IMS
BUSINESS UNIT: Integrated Manufacturing Services
ASSIGNED LEVEL: L3
JOB DESCRIPTION EXCERPT: "Executes assigned procurement specialist, ims tasks with moderate supervision within Integrated Manufacturing Services, documents procedures, and supports troubleshooting within own work area."
APPRAISAL CYCLE: 2026
APPRAISAL RATING: 3 / 5 (Meets Expectations)
APPRAISAL NARRATIVE: "Consistently met expectations, completed all assigned tasks on time, and worked well within the team."
STATUS: Left
EXIT DATE: June 2026
GENDER: Male
AGE: 33
YEARS OF SERVICE: 7`;
