import Overview from "@/sections/overview";
import FeaturedSkills from "@/sections/featured-skills";
import FeaturedProjects from "@/sections/featured-projects";
import FeaturedCertificates from "@/sections/featured-certificates";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Overview />
      <FeaturedSkills />
      <FeaturedProjects />
      <FeaturedCertificates />
    </div>
  );
}