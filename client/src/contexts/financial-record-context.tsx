import { useUser } from "@clerk/clerk-react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface FinancialRecord {
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}

export interface FinancialRecordsContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
    FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecords = async () => {
            console.log(user);
            if (!user) return navigate("/auth");
            const response = await fetch(
                `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
            );

            if (response.ok) {
                const records = await response.json();
                console.log(records);
                setRecords(records);
            }
        };

        fetchRecords();
    }, [user, navigate]);

    const addRecord = async (record: FinancialRecord) => {
        const response = await fetch(
            "http://localhost:3001/financial-records",
            {
                method: "POST",
                body: JSON.stringify(record),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        try {
            if (response.ok) {
                const newRecord = await response.json();
                setRecords((prev) => [...prev, newRecord]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateRecord = async (id: string, newRecord: FinancialRecord) => {
        const response = await fetch(
            `http://localhost:3001/financial-records/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(newRecord),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        try {
            if (response.ok) {
                const newRecord = await response.json();
                setRecords((prev) =>
                    prev.map((record) => {
                        if (record._id === id) {
                            return newRecord;
                        } else {
                            return record;
                        }
                    })
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteRecord = async (id: string) => {
        const response = await fetch(
            `http://localhost:3001/financial-records/${id}`,
            {
                method: "DELETE",
            }
        );

        try {
            if (response.ok) {
                const deletedRecord = await response.json();
                setRecords((prev) =>
                    prev.filter((record) => record._id !== deletedRecord._id)
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <FinancialRecordsContext.Provider
            value={{ records, addRecord, updateRecord, deleteRecord }}
        >
            {children}
        </FinancialRecordsContext.Provider>
    );
};
