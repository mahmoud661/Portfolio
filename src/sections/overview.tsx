import Particles from "@/components/ui/particles";
import ShinyButton from "@/components/ui/shiny-button";
import HyperText from "@/components/ui/hyper-text";
import CV from "../assets/Mahmoud Zreiqi -CV.pdf"; // Importing the PDF

const handleDownload = async () => {
  // Fetch the PDF from the imported path
  const response = await fetch(CV); // Using the imported path
  const blob = await response.blob(); // Convert to Blob
  
  // Create a URL for the Blob and trigger the download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Mahmoud-Zreiqi-CV.pdf"; // Filename for download
  document.body.appendChild(a); // Append anchor element to body
  a.click(); // Programmatically click the anchor
  document.body.removeChild(a); // Remove the anchor element
  window.URL.revokeObjectURL(url); // Revoke the object URL to release memory
};

export default function Overview() {
  return (
    <div className="flex flex-col mb-60 mt-40 justify-center px-4 md:px-8 lg:px-16">
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        refresh
      />
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/100 bg-clip-text text-center text-4xl md:text-6xl lg:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Mahmoud Zuriqi
      </span>
      <div className="flex justify-center mt-4 md:mt-6 lg:mt-8">
        <HyperText
          className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-500 dark:text-white"
          text={["Full stack Developer", "Data Scientist", "React Developer"]}
        />
      </div>

      <div className="flex justify-center mt-6 md:mt-8 lg:mt-10">
        <ShinyButton className="w-fit" onClick={handleDownload}>
          Download Resume
        </ShinyButton>
      </div>
    </div>
  );
}
