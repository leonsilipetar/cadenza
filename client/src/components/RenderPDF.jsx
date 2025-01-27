import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  schoolInfo: {
    width: '50%'
  },
  invoiceInfo: {
    width: '50%',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  table: {
    marginTop: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingTop: 5,
    paddingBottom: 5
  },
  tableHeader: {
    backgroundColor: '#f0f0f0'
  },
  tableCell: {
    width: '33%',
    padding: 5
  },
  total: {
    marginTop: 30,
    alignItems: 'flex-end'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30
  },
  qrCode: {
    width: 100,
    height: 100,
    marginTop: 20
  }
});

const RenderPDF = ({ invoice, school, student, program }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.schoolInfo}>
          <Text style={styles.bold}>{school.naziv}</Text>
          <Text>{school.adresa}</Text>
          <Text>OIB: {school.oib}</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.bold}>RAČUN br. {invoice.invoiceNumber}</Text>
          <Text>Datum: {new Date(invoice.issueDate).toLocaleDateString()}</Text>
          <Text>Dospijeće: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Student Info */}
      <View style={styles.table}>
        <Text style={styles.bold}>PRIMATELJ:</Text>
        <Text>{student.ime} {student.prezime}</Text>
        <Text>{student.adresa.ulica} {student.adresa.kucniBroj}</Text>
        <Text>{student.adresa.mjesto}</Text>
        <Text>OIB: {student.oib}</Text>
      </View>

      {/* Program Details */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Program</Text>
          <Text style={styles.tableCell}>Razdoblje</Text>
          <Text style={styles.tableCell}>Iznos</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{program.naziv}</Text>
          <Text style={styles.tableCell}>{invoice.month}/{invoice.year}</Text>
          <Text style={styles.tableCell}>{invoice.amount.toFixed(2)} EUR</Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.total}>
        <Text style={styles.bold}>Ukupno za platiti: {invoice.amount.toFixed(2)} EUR</Text>
      </View>

      {/* Payment Details */}
      <View style={styles.footer}>
        <Text style={styles.bold}>Podaci za plaćanje:</Text>
        <Text>IBAN: {invoice.paymentDetails.bankAccount}</Text>
        <Text>Model i poziv na broj: {invoice.paymentDetails.reference}</Text>
        <Text>Svrha: Školarina za {invoice.month}/{invoice.year}</Text>
        {invoice.paymentDetails.qrCode && (
          <Image style={styles.qrCode} src={invoice.paymentDetails.qrCode} />
        )}
      </View>
    </Page>
  </Document>
);

export default RenderPDF; 