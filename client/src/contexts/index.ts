import { useContext } from "react";
import {
    FinancialRecordsContext,
    FinancialRecordsContextType,
} from "./financial-record-context";

export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordsContextType | undefined>(
        FinancialRecordsContext
    );

    if (!context) {
        throw new Error(
            "useFinancialRecords must be used within a FinancialRecordsProvider"
        );
    }

    return context;
};
