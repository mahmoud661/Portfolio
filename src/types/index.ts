export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string;
  image: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  link: string;
}

export interface Skill {
  name: string;
  level: number;
  icon?: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  description: string;
}