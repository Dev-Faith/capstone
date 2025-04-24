"use client";
import { DataTable } from "@/components/data-table";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the path to your firebaseConfig file

const Task = () => {
  const [activities, setActivities] = useState<Data[] | null>(null);

  interface Data {
    id: string;
    item: string;
    robotId: string;
    status: string;
    path: { x: number; y: number; z: number }[];
    createdAt: Date | { toDate: () => Date };
    destination: string;
  }

  useEffect(() => {
    let unsubscribe: () => void;
    // console.log("activities", activities);

    const formatCreatedAt = (createdAt: any) => {
      try {
        // Handle Firestore Timestamp or string input
        const date = createdAt?.toDate
          ? createdAt.toDate()
          : new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Formatting options for 24-hour time
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        if (diffHours < 24) {
          // Return time in 24h format (HH:mm)
          return date.toLocaleTimeString("en-GB", timeOptions);
        } else {
          // Return in days (rounded up)
          const diffDays = Math.ceil(diffHours / 24);
          return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
        }
      } catch (error) {
        console.error("Error formatting createdAt:", error);
        return "N/A";
      }
    };

    const fetchAndSubscribe = async () => {
      try {
        const collectionRef = collection(db, "deliveryTasks");

        unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
          const updatedData = querySnapshot.docs.map((doc) => {
            const raw = doc.data();
            // console.log("raw path", raw.path);    

            return {
              id: doc.id, // Using document ID as string
              item: raw.item || "Untitled",
              robotId: raw.robotId || "Unknown",
              status: raw.status || "Pending",
              path: raw.path || "N/A",
              createdAt: formatCreatedAt(raw.createdAt), // Using createdAt field
              destination: raw.destination || "Not assigned",
            };
          });

          setActivities(updatedData);
        });

        const initialSnapshot = await getDocs(collectionRef);
        // console.log("Initial fetch complete");
      } catch (error) {
        console.error("Error setting up real-time listener:", error);
      }
    };

    fetchAndSubscribe();

    return () => {
      unsubscribe?.();
    };
  }, []);
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <DataTable data={activities || []} />
    </div>
  );
};

export default Task;
