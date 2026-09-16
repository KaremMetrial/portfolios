import type { Education, Certificate } from "../schemas";

export const educationFixture: Education[] = [
  {
    id: "edu-1",
    institution: "Mansoura University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    started_year: 2018,
    ended_year: 2022,
    location: "Mansoura, Egypt",
  },
];

export const certificatesFixture: Certificate[] = [
  {
    id: "cert-1",
    issuer: "DEPI",
    title: "PHP Web Development",
    issued_on: null,
    credential_url: null,
    sort: 1,
  },
  {
    id: "cert-2",
    issuer: "CCIC",
    title: "Back-End Development (PHP, MySQL, Laravel)",
    issued_on: null,
    credential_url: null,
    sort: 2,
  },
  {
    id: "cert-3",
    issuer: "NTI",
    title: "Web Design (HTML, CSS, Bootstrap, JavaScript)",
    issued_on: null,
    credential_url: null,
    sort: 3,
  },
];
