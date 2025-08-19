
interface Provider {
  Name: string;
  Version: string;
}

interface Script {
  Token: string;
  OrderID: string;
  FormType: string;
  ControlledDrugs: boolean;
  Prescribed: string;
  ExpiryDate: string;
  EarliestDispense: string;
  Urgency: string;
  RepeatNumber: number;
  RepeatCount: number;
}

interface Prescriber {
  ProviderCode: string;
  SpineCode: string;
  GMCCode: string;
  Name: string;
  Email: string;
}

interface Practice {
  ProviderCode: string;
  SpineCode: string;
  Name: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  PostCode: string;
  VoicePhone: string;
  Email: string;
}

interface Delivery {
    Address1: string;
    Address2: string;
    Address3: string;
    Address4: string;
    PostCode: string;
}

interface Patient {
  ProviderCode: string;
  NHSNumber: string;
  CHINumber: string;
  Title: string;
  Suffix: string;
  Surname: string;
  Forenames: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  PostCode: string;
  VoicePhone: string;
  MobilePhone: string;
  Email: string;
  DateOfBirth: string;
  Sex: string;
  Delivery: Delivery;
}

interface Quantity {
    Value: number;
    Unit: string;
}

interface Medication {
  DrugCode: string;
  DrugName: string;
  Dosage: string;
  Cautions: string;
  Quantity: Quantity;
}

export interface Prescription {
  SchemaVersion: number;
  Timestamp: string;
  Provider: Provider;
  Script: Script;
  Prescriber: Prescriber;
  Practice: Practice;
  Patient: Patient;
  Medication: Medication[];
  PatientInstructions: string[];
}