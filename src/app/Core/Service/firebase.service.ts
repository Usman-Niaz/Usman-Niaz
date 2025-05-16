import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getFirestore,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminLogin } from '../interface/admin-login';
import { LoadingServiceService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app;
  private db;
  private storage;
  private authKey = 'isLoggedIn';

  constructor( private loading:LoadingServiceService) {
    this.app = initializeApp(environment.firebaseConfig);
    this.storage = getStorage(this.app);
    this.db = getFirestore(this.app);
  }
  

  // ✅ Upload Image
  uploadFile(file: File, folder: string): Promise<string> {
    const storageRef = ref(
      this.storage,
      `${folder}/${Date.now()}_${file.name}`
    );
    return uploadBytes(storageRef, file)
      .then(() => getDownloadURL(storageRef))
      .catch((error) => {
        console.error('Upload failed', error);
        throw new Error('Upload failed');
      });
  }

  // ✅ Get Admin Login Data
  getAdminLoginData(): Observable<AdminLogin[]> {
    const adminLoginRef = collection(this.db, 'AdminLogin');
    return from(getDocs(adminLoginRef)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        return querySnapshot.docs.map((doc) => doc.data() as AdminLogin);
      }),
      catchError((error) => {
        console.error('Error getting admin login:', error);
        throw error;
      })
    );
  }

  // ✅ Add Document
  addDocument(collectionName: string, data: any): Observable<any> {
    
    const collectionRef = collection(this.db, collectionName);
    return from(addDoc(collectionRef, data)).pipe(
      map((docRef) => {
        console.log('Document added:', docRef.id);
        return docRef;
        
      }),
      catchError((error) => {
        console.error('Error adding document:', error);
        throw error;
      })
    );
  }

  // ✅ Get Documents
  getDocuments(collectionName: string): Observable<DocumentData[]> {
    const collectionRef = collection(this.db, collectionName);
 
    return from(getDocs(collectionRef)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }),
      catchError((error) => {
        console.error('Error getting documents:', error);
        throw error;
      })
    );
  }
  // ✅ Get Single Document by ID
getSingleDocument(collectionName: string, docId: string): Observable<any> {
  const docRef = doc(this.db, collectionName, docId);
  return from(getDocs(collection(this.db, collectionName))).pipe(
    map((querySnapshot: QuerySnapshot<DocumentData>) => {
      const singleDoc = querySnapshot.docs.find((d) => d.id === docId);
      if (singleDoc) {
        return { id: singleDoc.id, ...singleDoc.data() };
      } else {
        throw new Error('Document not found');
      }
     
    }),
   
    catchError((error) => {
      console.error('Error getting single document:', error);
      throw error;
    })
  );
  
}


  // ✅ Delete Document
  deleteDocument(collectionName: string, docId: string): Observable<any> {
    const docRef = doc(this.db, collectionName, docId);
    return from(deleteDoc(docRef)).pipe(
      map(() => ({
        success: true,
        message: `Document with ID ${docId} deleted.`,
      })),
      catchError((error) => {
        console.error('Error deleting document:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.authKey);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.authKey) === 'true';
  }
}
