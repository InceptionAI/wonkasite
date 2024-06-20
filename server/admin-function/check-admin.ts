"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { log } from "console";

export const checkAdmin = async (domain: string, loggedInUserId:string): Promise<boolean> => {
  try {

    console.log('checkAdmin:', domain, loggedInUserId);
    // Check if the logged-in user has an admin role
    const userDocRef = dbAdmin.doc(`domain/${domain}/users/${loggedInUserId}`);
    const userDocSnap = await userDocRef.get();
    const userRole = userDocSnap.data()?.role;
    if (userRole === 'admin') {
      console.log('User has admin role');
      return true;
    }
    return false;
  } catch (error) {
    console.error('An error occurred:', error);
    return false;
  }
};