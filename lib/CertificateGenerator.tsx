import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  Font,
} from "@react-pdf/renderer";

// Type definitions for the certificate data
interface CertificateData {
  eventName: string;
  organizationName: string;
  volunteerName: string;
  organizationLogo?: string;
  platformLogo?: string;
  issueDate: string | Date;
  certificate_id: string;
}

// Register custom fonts if needed
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#C4A484",
    margin: 10,
    padding: 20,
  },
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  title: {
    fontSize: 32,
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 20,
    color: "#34495E",
    textAlign: "center",
    marginBottom: 30,
  },
  nameContainer: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C4A484",
    paddingBottom: 10,
  },
  name: {
    fontSize: 28,
    color: "#2C3E50",
    textAlign: "center",
    textTransform: "uppercase",
  },
  content: {
    fontSize: 16,
    color: "#34495E",
    textAlign: "center",
    marginVertical: 20,
  },
  details: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailBox: {
    border: "1px solid #C4A484",
    padding: 10,
    width: "30%",
    textAlign: "center",
    textOverflow: "ellipsis",
    position: "relative",
    overflow: "hidden",
    "-webkit-line-clamp": 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    color: "#2C3E50",
    textOverflow: "ellipsis",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#7F8C8D",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 100,
    color: "rgba(200, 200, 200, 0.1)",
    zIndex: -1,
  },
});

const CertificateGenerator: React.FC<CertificateData> = ({
  eventName,
  organizationName,
  volunteerName,
  organizationLogo,
  platformLogo,
  issueDate,
  certificate_id,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerLogos}>
            {organizationLogo && (
              <Image src={organizationLogo} style={styles.logo} />
            )}
            {platformLogo && (
              <Image src={"../public/images/logo/logo-icon.svg"} style={styles.logo} />
            )}
          </View>

          <Text style={styles.title}>Certificado de Participación</Text>

          <Text style={styles.content}>La Organización: </Text>

          <Text style={styles.subtitle}>{organizationName}</Text>

          <Text style={styles.content}>
            Por medio de la presente se certifica que
          </Text>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{volunteerName}</Text>
          </View>

          <Text style={styles.content}>
            Participo y opoyo satisfactomente en el evento:
          </Text>

          <Text style={styles.subtitle}>{eventName}</Text>

          <View style={styles.details}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Fecha de Expedición</Text>
              <Text style={styles.detailValue}>
                {new Date(issueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Certificado ID</Text>
              <Text style={styles.detailValue}>{certificate_id}</Text>
            </View>
          </View>

          <Text style={styles.watermark}>CHIBATÁ</Text>

          <Text style={styles.footer}>
            Este certificado es válido y verificable a través de nuestra
            plataforma. ID de Verificación: {certificate_id}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const generateCertificate = async (certificateData: CertificateData) => {
  try {
    const blob = await pdf(
      <CertificateGenerator {...certificateData} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificado_${certificateData.volunteerName}_${certificateData.eventName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

export default CertificateGenerator;
