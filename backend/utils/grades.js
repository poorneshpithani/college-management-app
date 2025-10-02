export function calculateGrade(marks, maxMarks = 100) {
  const percent = (marks / maxMarks) * 100;
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "F";
}

export function gradePoints(grade) {
  switch (grade) {
    case "A+": return 10;
    case "A": return 9;
    case "B": return 8;
    case "C": return 7;
    case "D": return 6;
    default: return 0;
  }
}

export function calculateGPA(results) {
  if (!results || results.length === 0) return 0;
  let totalPoints = 0, subjects = 0;

  results.forEach(r => {
    const grade = calculateGrade(r.marksObtained, r.maxMarks ?? 100);
    totalPoints += gradePoints(grade);
    subjects++;
  });

  return Number((totalPoints / subjects).toFixed(2));
}
