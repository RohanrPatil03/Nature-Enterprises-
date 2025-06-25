
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ProposalData {
    customerType: string;
    name: string;
    connectionType: string;
    address: string;
    load: number;
    systemSize: number;
    monthlyBill: number;
    roofSize: number;
    panelType: string;
}

export async function saveProposal(proposalData: ProposalData): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, "proposals"), {
            ...proposalData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document to Firestore: ", error);
        // Re-throw the error so the caller can handle it and show UI feedback.
        throw new Error("Could not save the proposal to Firestore.");
    }
}
