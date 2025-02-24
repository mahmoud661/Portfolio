import { Project } from "@/types";
import coding from "../assets/projects/Coding-speed-test.png";
import Devpath from "../assets/projects/Devpath.png";
export const projects: Project[] = [
  {
    title: "Conversa",
    description:
      "A real-time chat application using Socket.io for instant messaging.",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    github: "https://github.com/mahmoud661/Conversa2.0",
    demo: "",
    image:
      "https://images.pexels.com/photos/935949/pexels-photo-935949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "DevPath",
    description:
      "A roadmap platform that provides AI-generated learning paths and real-time job recommendations.",
    technologies: ["React", "AI", "Tailwind CSS"],
    github: "https://github.com/mahmoud661/DevPath",
    demo: "https://dev-path-rho.vercel.app/",
    image: Devpath,
  },
  {
    title: "Coding Speed Test",
    description:
      "A Next.js project that allows users to test and improve their coding speed with real-time challenges and accuracy tracking.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/mahmoud661/Coding-speed-test",
    demo: "",
    image: coding,
  },
  {
    title: "Dream Canvas",
    description:
      "A React + Vite project that generates AI-generated images based on user prompts and customizable options.",
    technologies: ["React", "Tailwind CSS"],
    github: "https://github.com/mahmoud661/Dream-canvas",
    demo: "",
    image:
      "https://private-user-images.githubusercontent.com/63370835/405346650-7f6967cf-3a73-4388-9463-830158abcffc.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDAzNTQyNjIsIm5iZiI6MTc0MDM1Mzk2MiwicGF0aCI6Ii82MzM3MDgzNS80MDUzNDY2NTAtN2Y2OTY3Y2YtM2E3My00Mzg4LTk0NjMtODMwMTU4YWJjZmZjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjIzVDIzMzkyMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWIzNzZhODA3NzdiOGQzNDU4M2Q3MjU0NWEwMTg1MjEyYWUyNzFiNmEzYmI0NGJiNTFjZDAyZWYxNDE1NWQ1ZTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.D5sZbvGhIFGtl-brk699GaLzkao_812MUrk-T-f4YKY",
  },
  {
    title: "InteractSystemUnreal2D",
    description:
      "An Unreal Engine 5 system that allows interaction with objects in a 2D environment.",
    technologies: ["Unreal Engine 5", "C++"],
    github: "https://github.com/yourusername/InteractSystemUnreal2D",
    demo: "",
    image:
      "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/05/Unreal_Engine_5_logo_graphic.jpg",
  },
  {
    title: "Project Eon",
    description: "A 2D hack-and-slash game built in Unreal Engine 5.",
    technologies: ["Unreal Engine 5", "C++"],
    github: "https://github.com/mahmoud661/ProjectEon-5.3",
    demo: "",
    image:
      "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/05/Unreal_Engine_5_logo_graphic.jpg",
  },
  {
    title: "Face Recognition",
    description:
      "A face recognition system using machine learning with PostgreSQL for storing face embeddings. Implements a read model architecture for efficient data retrieval and face matching operations.",
    technologies: ["Python", "OpenCV", "PostgreSQL", "Machine Learning"],
    github: "https://github.com/mahmoud661/FaceRecognition",
    demo: "",
    image:
      "https://media.istockphoto.com/id/1464561797/photo/artificial-intelligence-processor-unit-powerful-quantum-ai-component-on-pcb-motherboard-with.jpg?b=1&s=612x612&w=0&k=20&c=7eiJE_qDSf78_dsedcaUi0sTLN2cExU94Wh3tjoP-3o=",
  },
];
