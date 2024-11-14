import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { selectConfig } from '@/slices/configSlice';
import { calculateFunctionalityDuration, calculateTotals, calculateFunctionTotalPrices } from '@/utils/calculate';

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
});

// Create PDF Document Component
const ProjectPDF = ({ project, config }) => {
  const { hourlyRate, hoursPerDay, workingDaysPerWeek} = config; // Extraer parámetros necesarios
  const totals = calculateTotals(project, config); // Calcular totales
  
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.h1}>{project.projectInfo.projectName}</Text>
        <Text style={styles.h3}>{project.projectInfo.projectDescription}</Text>

        <View style={styles.containerLeft}>
          <Text style={[styles.h3, { textAlign: 'left' }]}>Tecnologías Utilizadas:</Text>
          {project.projectInfo.technologiesUsed.map((tech, index) => (
            <Text key={index} style={[styles.h3, { textAlign: 'left' }]}>• {tech}</Text>
          ))}
        </View>
        <Text style={styles.h3}>Precio Total: ${totals.projectCost}</Text>
        <View style={styles.divider} />
      </Page>
      
      {/* Functionalities */}
      {project.functionalities.map(func => {
        const prices = calculateFunctionTotalPrices(func, hourlyRate);
        
        const duration = calculateFunctionalityDuration(func.tasks); // Calcular duración
        
        return (
          <Page key={func.id} style={styles.page}>
            <Text style={styles.h3}>{func.id}){func.name} - Total: ${prices.totalPrice}</Text>
            <Text style={styles.h3}>Duración: {duration} hrs</Text>
            <Text style={styles.h3}>Costo de Mano de Obra: ${prices.laborCost.toFixed(2)}</Text>
            <Text style={styles.h3}>Costo de Tecnología: ${prices.techCost.toFixed(2)}</Text>
            <Text style={styles.h3}>Costo Mensual: ${prices.monthlyCost.toFixed(2)}</Text>


            {/* Tasks Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeaderMain}>Tarea</Text>
                <Text style={styles.tableColHeader}>Horas</Text>
                <Text style={styles.tableColHeader}>Precio</Text>
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
          </Page>
        );
      })}
      
      {/* Summary */}
      <Page style={styles.page}>
        <Text style={styles.h2}>Costo Total del Proyecto: ${totals.projectCost.toFixed(2)}</Text>
        <Text style={styles.h2}>Costo Mensual: ${totals.monthlyCost.toFixed(2)}</Text>
        <Text style={styles.h2}>Duración Total: {totals.months.toFixed(1)} Months</Text>
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
      {/* {({ loading }) => (loading ?  <Loader className='spin'/> : children)} */}
      {children}
    
    </PDFDownloadLink>
  );
};

export default DownloadPDF;
