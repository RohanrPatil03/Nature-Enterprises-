
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp, doc, deleteDoc } from 'firebase/firestore';

export interface ProposalData {
    customerType: string;
    name: string;
    consumerNumber: string;
    connectionType: string;
    address: string;
    load: number;
    systemSize: number;
    monthlyBill: number;
    roofSize: number;
    systemCost: number;
    installationLocation: 'Roof Mounted' | 'Ground Mounted';
    inverterCapacity: string;
    incentives: number;
}

export interface ProposalDocument extends ProposalData {
    id: string;
    createdAt: Timestamp;
}

export async function getProposals(): Promise<ProposalDocument[]> {
    try {
        const proposalsCol = collection(db, "proposals");
        const q = query(proposalsCol, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const proposals: ProposalDocument[] = [];
        querySnapshot.forEach((doc) => {
            proposals.push({ id: doc.id, ...doc.data() } as ProposalDocument);
        });
        return proposals;
    } catch (error) {
        console.error("Error getting documents from Firestore: ", error);
        throw new Error("Could not get proposals from Firestore.");
    }
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

export async function deleteProposal(proposalId: string): Promise<void> {
    try {
        const proposalRef = doc(db, "proposals", proposalId);
        await deleteDoc(proposalRef);
    } catch (error) {
        console.error("Error deleting document from Firestore: ", error);
        throw new Error("Could not delete the proposal from Firestore.");
    }
}
