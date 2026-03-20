const coursesData = {
  BTECH_CSE: {
    name: "B.Tech CSE",
    semesters: [
      { sem: 1, subjects: ["Maths-I", "Programming", "Physics"] },
      { sem: 2, subjects: ["DSA", "Digital Logic", "Maths-II"] },
    ],
  },

  BTECH_EC: {
    name: "B.Tech E&C",
    semesters: [
      { sem: 1, subjects: ["Basic Electronics", "Maths", "Physics"] },
    ],
  },

  BTECH_EE: {
    name: "Electrical",
    semesters: [
      { sem: 1, subjects: ["Circuits", "Maths", "Physics"] },
    ],
  },

  BTECH_CIVIL: {
    name: "Civil",
    semesters: [
      { sem: 1, subjects: ["Engineering Drawing", "Mechanics"] },
    ],
  },

  BTECH_MECH: {
    name: "Mechanical",
    semesters: [
      { sem: 1, subjects: ["Thermodynamics", "Mechanics"] },
    ],
  },

  BBA: {
    name: "BBA",
    semesters: [
      { sem: 1, subjects: ["Management Basics", "Economics"] },
    ],
  },

  MBA: {
    name: "MBA",
    semesters: [
      { sem: 1, subjects: ["Marketing", "Finance"] },
    ],
  },

  MTECH_MECH: {
    name: "M.Tech Mechanical",
    semesters: [
      { sem: 1, subjects: ["Advanced Thermodynamics"] },
    ],
  },

  MTECH_EC: {
    name: "M.Tech E&C",
    semesters: [
      { sem: 1, subjects: ["Advanced Communication"] },
    ],
  },
};

export default coursesData;