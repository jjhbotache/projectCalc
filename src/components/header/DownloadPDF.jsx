import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { selectConfig } from '../../slices/configSlice';
import { calculateFunctionalityDuration, calculateTotals } from '../../utils/calculate';
import { calculateFunctionTotalPrices } from '../../utils/calculateTotalPrices';

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
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 24,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    margin: 2, // Further reduced margin
    padding: 2, // Further reduced padding
    fontSize: 8, // Further reduced size
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
    width: "70%", // Adjusted width for additional column
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: '#bdbdbd',
    padding: 1, // Further reduced padding
    fontSize: 8, // Further reduced size
  },
  tableColHeader: {
    width: "15%", // Adjusted width for additional column
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: '#bdbdbd',
    padding: 1, // Further reduced padding
    fontSize: 8, // Further reduced size
  },
  tableColMain: {
    width: "70%", // Adjusted width for additional column
    borderStyle: "solid",
    borderWidth: 1,
    padding: 1, // Further reduced padding
  },
  tableCol: {
    width: "15%", // Adjusted width for additional column
    borderStyle: "solid",
    borderWidth: 1,
    padding: 1, // Further reduced padding
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
});

// Create PDF Document Component
const ProjectPDF = ({ project, config }) => {
  const { hourlyRate, hoursPerDay } = config; // Extraer parámetros necesarios
  const totals = calculateTotals(project, config); // Calcular totales

  console.log('ProjectPDF', project, config, totals);
  
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.h1}>{project.projectInfo.projectName}</Text>
        <Text style={styles.section}>Descripción del Proyecto: {project.projectInfo.projectDescription}</Text>
        <Text style={styles.section}>Tecnologías Utilizadas: {project.projectInfo.technologiesUsed.join(', ')}</Text>
        <Text style={styles.section}>Precio Total: ${totals.projectCost}</Text>
        
        {/* Functionalities */}
        {project.functionalities.map(func => {
          const prices = calculateFunctionTotalPrices(func, hourlyRate);
          const duration = calculateFunctionalityDuration(func.tasks); // Calcular duración
          console.log(prices, duration);
          
          return (
            <View key={func.id} style={{ marginBottom: 40 }}>
              <Text style={styles.h3}>Funcionalidad: {func.name} - Total: ${prices.totalPrice}</Text>
              
              {/* Tasks Table */}
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableColHeaderMain}>Tarea</Text>
                  <Text style={styles.tableColHeader}>Horas</Text>
                  <Text style={styles.tableColHeader}>Precio</Text>
                </View>
                {func.tasks.map((task, index) => {
                  const taskPrice = task.hours * hourlyRate;
                  console.log(task, taskPrice);
                  
                  return (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableColMain}>{task.name}</Text>
                      <Text style={styles.tableCol}>{task.hours}</Text>
                      <Text style={styles.tableCol}>${taskPrice.toFixed(2)}</Text>
                    </View>
                  );
                })}
              </View>

            </View>
          );
        })}
        
        {/* Summary */}
        <Text style={styles.h2}>Costo Total del Proyecto: ${totals.projectCost.toFixed(2)}</Text>
        <Text style={styles.h2}>Costo Mensual: ${totals.monthlyCost.toFixed(2)}</Text>
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
      {({ loading }) => (loading ? 'Cargando documento...' : children)}
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
