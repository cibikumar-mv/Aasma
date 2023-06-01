import { createContext, useEffect, useRef, useState } from "react";
import { tableData } from "../pages/Slab/Slab";
import {
  DocumentData,
  collection,
  getDocs,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";

export const FormContext = createContext<null | any>(null);

const obj: tableData = {
  id: 1,
  srno: 1,
  length: "0",
  width: "0",
  sqFeet: 0,
  area: 0,
};

const curr = new Date();
curr.setDate(curr.getDate() + 0);
const curDate = curr.toISOString().substring(0, 10);
export const initialState = {
  data: {
    partyName: "",
    date: curDate,
    quality: "",
    vehicleNo: "",
    addRows: 0,
    startingRow: 1,
    repeatCount: 0,
    totalSqFeet: 0,
    pricePerSqFeet: 0,
    totalCost: 0,
    totalAreaUnit: "Feet",
    measurementUnit: "feet",
    maxSqFeet: 0,
  },
  rows: [{ ...obj }],
  id: null,
  title: null,
};
export const FormContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [formList, setFormList] = useState<DocumentData[]>([]);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const userDocRef = collection(db, `users/${user?.uid}/forms`);
  const isInitialAdd = useRef(true);
  const idCounter = useRef(1);
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      console.log('resUser:', res);
      
      setUser(res);
      if (!res) {
        setFormList([]);
      }
    });
    console.log("context:", formData);
  }, []);
  const fetchData = async () => {
    if (!user) return;
    try {
      const q = query(userDocRef, orderBy("createdTime", "desc"));
      const querySnapshot = await getDocs(q);
      const forms = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFormList(forms);
      console.log("forms:", forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const newForm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    const newState = {
      data: {
        partyName: "",
        date: curDate,
        quality: "",
        vehicleNo: "",
        addRows: 0,
        startingRow: 1,
        repeatCount: 0,
        totalSqFeet: 0,
        pricePerSqFeet: 0,
        totalCost: 0,
        totalAreaUnit: "Feet",
        measurementUnit: "feet",
        maxSqFeet: 0,
      },
      rows: [{ ...obj }],
      id: null,
      title: null,
    };
    console.log("initialState:", newState);
    idCounter.current = 1;
    isInitialAdd.current = true;
    setFormData({ ...newState });
  };

  const clearForms = async () => {
    const querySnapshot = await getDocs(userDocRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    newForm();
    await fetchData();
  };

  const value = {
    formData,
    formList,
    user,
    fetchData,
    setFormData,
    newForm,
    clearForms,
    isInitialAdd,
    idCounter,
    loading,
  };

  return (
    <FormContext.Provider value={value}> {children} </FormContext.Provider>
  );
};
