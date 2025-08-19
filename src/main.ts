import * as crypto from 'crypto';
import { Prescription } from './prescriptionTypes';


/**
 * Generates a SHA256 hash of a JSON object.
 * @param prescription The JSON object to hash.
 * @returns The SHA256 hash as a base64-encoded string.
 */
function generateSha256Hash(prescription: Prescription): string {
  const canonicalJson = JSON.stringify(prescription);
  const hash = crypto.createHash('sha256');
  hash.update(canonicalJson);
  return hash.digest('base64');
}

/**
 * Signs a given data string with a private key.
 * @param data The data to sign (e.g., the SHA256 hash).
 * @param privateKey The PEM-formatted private key.
 * @returns The signature as a base64-encoded string.
 */
function signData(data: string, privateKey: string): string {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');
  return signature;
}

/**
 * Verifies a signature with a public key.
 * This function would be used by the receiving party (the partner).
 * @param data The original data that was signed.
 * @param signature The signature to verify.
 * @param publicKey The PEM-formatted public key.
 * @returns True if the signature is valid, false otherwise.
 */
function verifySignature(data: string, signature: string, publicKey: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
}


// --- Main Execution ---

async function main() {
  // 1. Generate a public/private key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  console.log('--- Generated Keys (for demonstration) ---');
  console.log('Private Key:\n', privateKey);
  console.log('Public Key:\n', publicKey);
  console.log('------------------------------------------\n');


  const prescriptionPayload: Prescription = {
    "SchemaVersion": 1,
    "Timestamp": "2025-07-15T12:00:05Z",
    "Provider": {
        "Name": "Name",
        "Version": "9.7.1"
    },
    "Script": {
        "Token": "7ACF6601-C955-4624-82E8-DEA2F829C967",
        "OrderID": "4017-29345",
        "FormType": "External",
        "ControlledDrugs": false,
        "Prescribed": "2025-07-15T09:00:00Z",
        "ExpiryDate": "2026-01-15",
        "EarliestDispense": "2025-07-15T09:00:00Z",
        "Urgency": "NextDay",
        "RepeatNumber": 1,
        "RepeatCount": 1
    },
    "Prescriber": {
        "ProviderCode": "0001",
        "SpineCode": "",
        "GMCCode": "ewf",
        "Name": "Omefrrada",
        "Email": "oemailk"
    },
    "Practice": {
        "ProviderCode": "0001",
        "SpineCode": "",
        "Name": "cfffs",
        "Address1": "41fne",
        "Address2": "Marewfartoven",
        "Address3": "Alwevphewingew",
        "Address4": "Evvvr",
        "PostCode": "EvvE3 83U",
        "VoicePhone": "0322",
        "Email": "asomeamil"
    },
    "Patient": {
        "ProviderCode": "0001",
        "NHSNumber": "",
        "CHINumber": "",
        "Title": "Mrs",
        "Suffix": "",
        "Surname": "Jones",
        "Forenames": "Doris",
        "Address1": "5asat",
        "Address2": "asasen",
        "Address3": "Wigassaan",
        "Address4": "",
        "PostCode": "GDN53 2TZ",
        "VoicePhone": "0211942 937839",
        "MobilePhone": "0714292 4748320",
        "Email": "email",
        "DateOfBirth": "1966-06-10",
        "Sex": "Female",
        "Delivery": {
            "Address1": "19 Orchard Gardens",
            "Address2": "Eccleston",
            "Address3": "St Helens",
            "Address4": "Merseyside",
            "PostCode": "WA10 2DR"
        }
    },
    "Medication": [{
        "DrugCode": "323509004",
        "DrugName": "Amoxicillin 250mg capsules",
        "Dosage": "One to be taken three times a day",
        "Cautions": "Complete the course",
        "Quantity": {
            "Value": 21,
            "Unit": "tablet"
        }
    }],
    "PatientInstructions": [
        "Visit our website for all your private medication needs",
        "Ready and waiting 24 hours a day, 365 days a year"
    ]
  };

  console.log('--- Prescription Payload ---');
  console.log(JSON.stringify(prescriptionPayload));
  console.log('----------------------------\n');

  // 3. Generate the SHA256 hash of the payload.
  const payloadHash = generateSha256Hash(prescriptionPayload);
  console.log('--- Payload Hash ---');
  console.log('SHA256 Hash (Base64):', payloadHash);
  console.log('--------------------\n');

  // 4. Encrypt (sign) the hash with the private key to create the digital signature.
  const signature = signData(payloadHash, privateKey);
  console.log('--- Digital Signature ---');
  console.log('Signature (Base64):', signature);
  console.log('-------------------------\n');


  // --- Verification Step ---
  console.log('--- Simulating Partner Verification ---');
  const partnersPayloadHash = generateSha256Hash(prescriptionPayload);
  console.log('Partner\'s generated hash:', partnersPayloadHash);
  const isSignatureValid = verifySignature(partnersPayloadHash, signature, publicKey);
  console.log('Is the signature valid?', isSignatureValid);

  if (isSignatureValid && payloadHash === partnersPayloadHash) {
      console.log('✅ Success: The signature is valid and the hashes match!');
  } else {
      console.log('❌ Failure: The signature is invalid or the hashes do not match.');
  }
  console.log('-------------------------------------\n');
}

main();
