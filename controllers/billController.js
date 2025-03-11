import Bill from "../model/Bill.model.js";

export const generateBill = async (req, res) => {
    const { fromAddress, toAddress, invoiceNumber, invoiceDate, details } = req.body;
    console.log('Received request:', req.body);
    
    try {
        const bill = new Bill({
            fromAddress,
            toAddress,
            invoiceNumber,
            invoiceDate,
            details
        });
        await bill.save();
        res.status(201).json({ message: "Bill generated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};