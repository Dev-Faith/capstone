"use client";
import { DataTable } from "@/components/data-table";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the path to your firebaseConfig file

const Task = () => {
  const [activities, setActivities] = useState<data[] | null>(null);

  interface data {
    id: number;
    item: string;
    robotId: string;
    status: string;
    path: { x: number; y: number; z: number }[];
    time: string;
    destination: string;
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "deliveryTasks"));
        const data = querySnapshot.docs.map((doc, index) => {
          const raw = doc.data();

          return {
            id: Number(raw.id) || index, // fallback to index or parse string id
            item: raw.item || "Untitled",
            robotId: raw.robotId || "Unknown",
            status: raw.status || "Pending",
            path: raw.path || "N/A",
            time: raw.time || "0",
            destination: raw.destination || "Not assigned",
          };
        });

        setActivities(data);
        console.log("Fetched activities:", data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <DataTable data={activities || []} />
    </div>
  );
};

export default Task;
