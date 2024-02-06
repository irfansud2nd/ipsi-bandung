import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// IS ADMIN
export const isAdmin = async (email: string) => {
  return getDocs(
    query(collection(firestore, "admin"), where("email", "==", email))
  ).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return false;
    } else {
      const data = querySnapshot.docs[0].data();
      if (data.verified) {
        return true;
      }
    }
  });
};

// IS MASTER
export const isMaster = async (email: string) => {
  return getDocs(
    query(collection(firestore, "master"), where("email", "==", email))
  ).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return false;
    } else {
      const data = querySnapshot.docs[0].data();
      if (data.verified) {
        return true;
      }
    }
  });
};
