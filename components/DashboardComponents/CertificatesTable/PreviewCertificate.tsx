import React from "react";
import { Certificate } from "@/types/certificate";
import CertificateGenerator from "@/lib/CertificateGenerator";
import { PDFViewer } from "@react-pdf/renderer";

interface PreviewCertificateProps {
  certificate: Certificate;
}

const PreviewCertificate: React.FC<PreviewCertificateProps> = ({
  certificate,
}) => {
  const certificateData = {
    eventName: certificate.eventName,
    organizationName: certificate.organizationName,
    volunteerName: certificate.volunteerName || "Nombre", // You might want to add this to your Certificate type
    organizationLogo: certificate.organizationLogo, // Add your logo paths
    platformLogo: "/images/logo/logo-light.svg", // Add your platform logo paths
    issueDate: certificate.issueDate,
    certificate_id: certificate.certificate_id,
  };

  return (
    <div className="lg:h-[400px] md:h-[300px] w-full">
      <PDFViewer width="100%" height="100%">
        <CertificateGenerator {...certificateData} />
      </PDFViewer>
    </div>
  );
};

export default PreviewCertificate;
