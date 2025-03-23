// src/Components/UserPDF.jsx
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// PDF styles with corrected border properties
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "Helvetica",
  },
  section: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#000000",
    paddingBottom: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
  },
  subtitle: {
    fontSize: 12,
    color: "#4B5563",
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    width: "35%",
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    fontSize: 11,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
    paddingBottom: 2,
  },
});

// Helper function to format skills string
const formatSkills = (skills) => {
  if (!skills) return "";
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).join(", ");
  }
  if (typeof skills === "string") {
    return skills.includes(",")
      ? skills.split(",").map((skill) => skill.trim()).join(", ")
      : skills;
  }
  return String(skills);
};

// PDF Document Component with new fields
const UserPDF = ({ user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.header}>
          {user.image && <Image src={user.image} style={styles.image} />}
          <View>
            <Text style={styles.title}>{user.full_name}</Text>
            <Text style={styles.subtitle}>{user.post_applied_for}</Text>
            <Text style={styles.subtitle}>ID: {user.employee_id}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text
            style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
          >
            Personal Information
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{user.gender}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>CNIC:</Text>
            <Text style={styles.value}>{user.cnic}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {new Date(user.dob).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Permanent Address:</Text>
            <Text style={styles.value}>{user.permanent_address}</Text>
          </View>
          {/* Added: Guardian Phone */}
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Guardian Phone:</Text>
            <Text style={styles.value}>{user.guardian_phone}</Text>
          </View>
          {/* Added: Reference Name */}
          {user.reference_name && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Reference Name:</Text>
              <Text style={styles.value}>{user.reference_name}</Text>
            </View>
          )}
          {/* Added: Reference Contact */}
          {user.reference_contact && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Reference Contact:</Text>
              <Text style={styles.value}>{user.reference_contact}</Text>
            </View>
          )}
          {/* Added: Has Disease */}
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Has Disease:</Text>
            <Text style={styles.value}>{user.has_disease}</Text>
          </View>
          {/* Added: Disease Description */}
          {user.disease_description && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Disease Description:</Text>
              <Text style={styles.value}>{user.disease_description}</Text>
            </View>
          )}
          {/* Added: Exit Date (for ex-employees) */}
          {user.exit_date && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Exit Date:</Text>
              <Text style={styles.value}>
                {new Date(user.exit_date).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text
            style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
          >
            Contact Information
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.value}>{user.contact_number}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text
            style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
          >
            Employment Details
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{user.employee_id}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Post Applied For:</Text>
            <Text style={styles.value}>{user.post_applied_for}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Registration Date:</Text>
            <Text style={styles.value}>
              {new Date(user.registration_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Joining Date:</Text>
            <Text style={styles.value}>
              {new Date(user.joining_date).toLocaleDateString()}
            </Text>
          </View>
          {user.in_time && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>In Time:</Text>
              <Text style={styles.value}>{user.in_time}</Text>
            </View>
          )}
          {user.out_time && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Out Time:</Text>
              <Text style={styles.value}>{user.out_time}</Text>
            </View>
          )}
          {user.Salary_Cap && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Salary Cap:</Text>
              <Text style={styles.value}>{user.Salary_Cap}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text
            style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
          >
            Education
          </Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Degree:</Text>
            <Text style={styles.value}>{user.degree}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Institute:</Text>
            <Text style={styles.value}>{user.institute}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Grade:</Text>
            <Text style={styles.value}>{user.grade}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Year:</Text>
            <Text style={styles.value}>{user.year}</Text>
          </View>
        </View>

        {(user.teaching_subjects ||
          user.teaching_institute ||
          user.teaching_contact) && (
          <View style={styles.fieldGroup}>
            <Text
              style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
            >
              Teaching Experience
            </Text>
            {user.teaching_subjects && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Subjects:</Text>
                <Text style={styles.value}>{user.teaching_subjects}</Text>
              </View>
            )}
            {user.teaching_institute && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Institute:</Text>
                <Text style={styles.value}>{user.teaching_institute}</Text>
              </View>
            )}
            {user.teaching_contact && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Contact:</Text>
                <Text style={styles.value}>{user.teaching_contact}</Text>
              </View>
            )}
          </View>
        )}

        {(user.position || user.organization || user.skills) && (
          <View style={styles.fieldGroup}>
            <Text
              style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
            >
              Other Experience
            </Text>
            {user.position && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>{user.position}</Text>
              </View>
            )}
            {user.organization && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Organization:</Text>
                <Text style={styles.value}>{user.organization}</Text>
              </View>
            )}
            {user.skills && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Skills:</Text>
                <Text style={styles.value}>{formatSkills(user.skills)}</Text>
              </View>
            )}
          </View>
        )}

        {user.description && (
          <View style={styles.fieldGroup}>
            <Text
              style={[styles.subtitle, { marginBottom: 8, fontWeight: "bold" }]}
            >
              Description
            </Text>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Details:</Text>
              <Text style={styles.value}>{user.description}</Text>
            </View>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default UserPDF;