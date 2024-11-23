export interface Job {
  id: number;
  company: string;
  shortDescription: string;
  jobLink: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    company: "TechCorp",
    shortDescription: "Frontend Developer",
    jobLink: "https://example.com/job1",
  },
  {
    id: 2,
    company: "DataSystems",
    shortDescription: "Data Analyst",
    jobLink: "https://example.com/job2",
  },
  {
    id: 3,
    company: "CloudNet",
    shortDescription: "DevOps Engineer",
    jobLink: "https://example.com/job3",
  },
  {
    id: 4,
    company: "AIInnovate",
    shortDescription: "Machine Learning Engineer",
    jobLink: "https://example.com/job4",
  },
  {
    id: 5,
    company: "SecureIT",
    shortDescription: "Cybersecurity Analyst",
    jobLink: "https://example.com/job5",
  },
  {
    id: 6,
    company: "MobileApps",
    shortDescription: "iOS Developer",
    jobLink: "https://example.com/job6",
  },
  {
    id: 7,
    company: "WebSolutions",
    shortDescription: "Full Stack Developer",
    jobLink: "https://example.com/job7",
  },
  {
    id: 8,
    company: "BigData",
    shortDescription: "Data Scientist",
    jobLink: "https://example.com/job8",
  },
  {
    id: 9,
    company: "CloudServices",
    shortDescription: "Cloud Architect",
    jobLink: "https://example.com/job9",
  },
  {
    id: 10,
    company: "UXDesign",
    shortDescription: "UI/UX Designer",
    jobLink: "https://example.com/job10",
  },
  {
    id: 11,
    company: "AIResearch",
    shortDescription: "AI Research Scientist",
    jobLink: "https://example.com/job11",
  },
  {
    id: 12,
    company: "NetworkSystems",
    shortDescription: "Network Engineer",
    jobLink: "https://example.com/job12",
  },
];

export const getJobs = (): Promise<Job[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockJobs), 500); // Simulate API delay
  });
};

export const semanticSearch = async (
  searchTerm: string,
  jobs: Job[]
): Promise<Job[]> => {
  // This is a mock implementation of semantic search
  // In a real-world scenario, this would involve more complex NLP techniques
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = jobs.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
      resolve(results);
    }, 1000); // Simulate a longer processing time for semantic search
  });
};
