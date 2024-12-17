import { PDFDownloadLink, Document, Page, Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { selectConfig } from '@/slices/configSlice';
import { calculateFunctionalityDuration, calculateTotals, calculateFunctionTotalPrices } from '@/utils/calculate';
import PDFHeader from './PDFHeader';
import PDFFooter from './PDFFooter';

// Define base styles outside StyleSheet.create
const tableColBase = {
  borderStyle: "solid",
  borderWidth: 1,
  padding: 1, // Further reduced padding
};

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  h1: {
    fontSize: 40, // Reduced size
    marginBottom: 15, // Adjusted spacing
    textAlign: 'center',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  containerLeft: {
    textAlign: 'left',
    paddingTop: 5, 
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 5, // Reduced spacing
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeaderMain: {
    ...tableColBase,
    width: "70%", // Adjusted width for additional column
    backgroundColor: '#bdbdbd',
    fontSize: 12, // Further reduced size
  },
  tableColHeader: {
    ...tableColBase,
    width: "15%", // Adjusted width for additional column
    backgroundColor: '#bdbdbd',
    fontSize: 16, // Further reduced size
  },
  tableColMain: {
    ...tableColBase,
    width: "70%", // Adjusted width for additional column
    fontSize: 12, // Further reduced size
  },
  tableCol: {
    ...tableColBase,
    width: "15%", // Adjusted width for additional column
  },
  tableCellHeader: {
    fontSize: 8, // Further reduced size
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 6, // Further reduced size
  },
  summary: {
    marginTop: 2, // Further reduced margin
    padding: 1, // Further reduced padding
    fontSize: 8, // Further reduced size
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10, // Adjusted spacing
    marginBottom: 10, // Adjusted spacing
  },
  opaqueText: {
    opacity: 0.3,
  },
  bodyText: {
    fontSize: 12,
    marginBottom: 5,
  },
  centeredText: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  dividerSpace: {
    marginTop: 10, // Adjusted spacing
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

const ProjectPDF = ({ project, config }) => {
  const { hourlyRate } = config; // Extract necessary parameters
  const totals = calculateTotals(project, config); // Calculate totals
  
  return (
    <Document>
      <Page style={styles.page}>
        <PDFHeader />

        <Text style={styles.h1}>{project.projectInfo.projectName}</Text>
        <Text style={styles.h3}>{project.projectInfo.projectDescription}</Text>

        <View style={styles.dividerSpace} />

        {/* Deliverables */}
        <Text style={styles.h3}>Deliverables:</Text>
        {project.projectInfo.deliverables.map((item, index) => (
          <Text key={index} style={styles.summary}>• {item}</Text>
        ))}

        <View style={styles.dividerSpace} />
        <View style={styles.containerLeft}>
          <Text style={[styles.h3, { textAlign: 'left' }]}>Technologies Used:</Text>
          {project.projectInfo.technologiesUsed.map((tech, index) => (
            <Text key={index} style={[styles.summary, { textAlign: 'left' }]}>• {tech}</Text>
          ))}
        </View>
        <View style={styles.dividerSpace} />
        <View style={styles.dividerSpace} />
        <Text style={styles.h3}>Total Price: ${totals.projectCost}</Text>
        <View style={styles.divider} />

        <PDFFooter />
      </Page>
      
      {/* Functionalities */}
      {project.functionalities.map(func => {
        const prices = calculateFunctionTotalPrices(func, hourlyRate);
        const duration = calculateFunctionalityDuration(func.tasks);
        
        return (
          <Page key={func.id} style={styles.page}>
            <PDFHeader />
            
            <Text style={styles.h3}>{func.id}) {func.name} - Total: ${prices.totalPrice}</Text>
            <Text style={styles.h3}>Duration: {duration} hrs</Text>
            <Text style={styles.h3}>Labor Cost: ${prices.laborCost.toFixed(2)}</Text>
            <Text style={styles.h3}>Technology Cost: ${prices.techCost.toFixed(2)}</Text>
            <Text style={styles.h3}>Monthly Cost: ${prices.monthlyCost.toFixed(2)}</Text>

            {/* Tasks Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeaderMain}>Task</Text>
                <Text style={styles.tableColHeader}>Hours</Text>
                <Text style={styles.tableColHeader}>Price</Text>
              </View>
              {func.tasks.map((task, index) => {
                const taskPrice = task.hours * hourlyRate;
                
                return (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableColMain}>{task.name}</Text>
                    <Text style={styles.tableCol}>{task.hours}</Text>
                    <Text style={[styles.tableCol, !task.billed && styles.opaqueText]}>${taskPrice.toFixed(2)}</Text>
                  </View>
                );
              })}
            </View>

            <PDFFooter />
          </Page>
        );
      })}
      
      {/* Summary */}
      <Page style={styles.page}>
        <PDFHeader />

        {/* Deliverables */}
        <Text style={styles.h2}>Deliverables:</Text>
        {project.projectInfo.deliverables.map((item, index) => (
          <Text key={index} style={styles.centeredText}>{item}</Text>
        ))}

        <View style={styles.divider} />

        <Text style={styles.h2}>Total Project Cost: ${totals.projectCost.toFixed(2)}</Text>
        <Text style={styles.h2}>Monthly Cost: ${totals.monthlyCost.toFixed(2)}</Text>
        <Text style={styles.h2}>Total Duration: {totals.months.toFixed(1)} Months</Text>

        <PDFFooter />
      </Page>
    </Document>
  );
};

// Function to generate PDF download link
const DownloadPDF = ({ project, children }) => {
  const config = useSelector(selectConfig);
  
  return (
    <PDFDownloadLink
      document={<ProjectPDF project={project} config={config} />}
      fileName={`${project.projectInfo.projectName}.pdf`}
    >
      {children}
    
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
