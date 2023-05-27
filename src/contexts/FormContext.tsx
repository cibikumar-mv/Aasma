import { createContext, useEffect, useState } from "react";
import { tableData } from "../pages/Slab/Slab";
import {
  DocumentData,
  collection,
  getDocs,
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
const initialState = {
  data: {
    partyName: "",
    date: curDate,
    quality: "",
    vehicleNo: "",
    addRows: null,
    startingRow: "",
    repeatCount: "",
    totalSqFeet: 0,
    pricePerSqFeet: 0,
    totalCost: 0,
    totalAreaUnit: "Feet",
    measurementUnit: "feet",
    maxSqFeet: "",
  },
  rows: [{ ...obj }],
  id: null,
  title: null,
};
export const FormContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [formList, setFormList] = useState<DocumentData[]>([]);
  const [formData, setFormData] = useState(initialState);
  const userDocRef = collection(db, `users/${user?.uid}/forms`);

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
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
    const newState = {
      data: {
        partyName: "",
        date: curDate,
        quality: "",
        vehicleNo: "",
        addRows: null,
        startingRow: "",
        repeatCount: "",
        totalSqFeet: 0,
        pricePerSqFeet: 0,
        totalCost: 0,
        totalAreaUnit: "Feet",
        measurementUnit: "feet",
        maxSqFeet: "",
      },
      rows: [{ ...obj }],
      id: null,
      title: null,
    };
    console.log("initialState:", newState);
    setFormData({ ...newState });
  };

  const value = { formData, formList, user, fetchData, setFormData, newForm };

  return (
    <FormContext.Provider value={value}> {children} </FormContext.Provider>
  );
};
