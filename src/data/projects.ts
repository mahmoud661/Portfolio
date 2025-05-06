import { Project } from "@/types";
import coding from "../assets/projects/Coding-speed-test.png";
import Devpath from "../assets/projects/Devpath.png";
import Dream from "../assets/projects/Dream.png"
export const projects: Project[] = [
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
    image:Dream
    
    
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
