import { Certificate } from "@/types";

const certificateFiles = import.meta.glob('../assets/certificates/*.(pdf|jpg|jpeg|png)', { eager: true });

const getCertificateUrl = (filename: string): string => {
  const path = `../assets/certificates/${filename}`;
  return (certificateFiles[path] as { default: string }).default;
};

const formatTitle = (filename: string): string => {
  return filename
    .replace(/\.(pdf|jpg|jpeg|png)$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const certificates: Certificate[] = Object.keys(certificateFiles)
  .map(path => {
    const filename = path.split('/').pop() || '';
    return {
      title: formatTitle(filename),
      issuer: "Unknown", // You might want to store this info in the filename or separate mapping
      date: "2023",     // You might want to store this info in the filename or separate mapping
      image: getCertificateUrl(filename),
      link: "#"
    };
  });